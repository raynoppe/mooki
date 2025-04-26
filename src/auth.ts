import NextAuth from "next-auth";
import { type Adapter } from "@auth/core/adapters";
// Remove Email provider import
// import Email from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials"; // Add Credentials provider import
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { Resend } from "resend"; // Import Resend
import crypto from "crypto"; // Import crypto for token generation

// Ensure environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const authSecret = process.env.AUTH_SECRET;
const resendApiKey = process.env.RESEND_API_KEY; // Get Resend API Key
const emailFrom = process.env.EMAIL_FROM; // Get optional From address
const appBaseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"; // Base URL for constructing links

// Basic validation for environment variables
if (
  !supabaseUrl ||
  !supabaseServiceRoleKey ||
  !authSecret ||
  !resendApiKey ||
  !emailFrom
) {
  console.error(
    "Missing required environment variables. Check NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, AUTH_SECRET, RESEND_API_KEY, EMAIL_FROM, NEXTAUTH_URL (optional, defaults to localhost)."
  );
  // Throw error in production to prevent starting with bad config
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Missing required environment variables for authentication."
    );
  }
}

// Initialize Resend client
const resend = new Resend(resendApiKey!);

// Helper function to generate token expiry date (e.g., 24 hours from now)
const expires = (hours = 24) => {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  return date;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: SupabaseAdapter({
    url: supabaseUrl!,
    secret: supabaseServiceRoleKey!,
  }),
  providers: [
    Credentials({
      // The name to display on the sign in form (optional)
      name: "Magic Link",
      // `credentials` is used to generate a form on the sign in page.
      // We don't need fields here as we have a custom login page.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        if (!email) {
          throw new Error("Email is required.");
        }

        // Initialize Adapter *inside* authorize function scope
        const adapter = SupabaseAdapter({
          url: supabaseUrl!,
          secret: supabaseServiceRoleKey!,
        }) as Adapter;

        // Check for methods on the locally initialized adapter
        if (!adapter.createVerificationToken || !adapter.getUserByEmail) {
          // If this error still occurs, there's an issue with SupabaseAdapter itself
          console.error("SupabaseAdapter instance methods missing.");
          throw new Error(
            "Adapter methods not available. Check SupabaseAdapter initialization."
          );
        }

        // Generate a secure token
        const token = crypto.randomBytes(32).toString("hex");
        const verificationExpires = expires(); // Get expiry date

        try {
          // Store the token using the adapter
          await adapter.createVerificationToken({
            identifier: email,
            token: token,
            expires: verificationExpires,
          });

          // Construct the verification URL
          const verificationUrl = `${appBaseUrl}/api/auth/callback/magiclink?token=${token}&email=${encodeURIComponent(email)}`;

          // Send the email via Resend
          const { data, error } = await resend.emails.send({
            from: emailFrom!, // Use configured sender
            to: [email],
            subject: "Sign in to Your Account - Magic Link",
            html: `<p>Click the magic link below to sign in:</p><p><a href="${verificationUrl}">Sign In</a></p><p>This link expires in 24 hours.</p>`,
            // text: `Click this link to sign in: ${verificationUrl}\nThis link expires in 24 hours.`, // Optional text version
          });

          if (error) {
            console.error("Resend error sending verification email:", error);
            // Delete the token if email sending failed? Maybe not, user might retry.
            // await adapter.deleteVerificationToken?.({ identifier: email, token });
            throw new Error("Could not send verification email.");
          }

          console.log(
            `Verification email sent via Resend to ${email}. Message ID: ${data?.id || "N/A"}, URL: ${verificationUrl}`
          );

          // Important: Authorize should return null for magic link flow
          // The user is not authenticated until they click the link
          return null;
        } catch (error: unknown) {
          console.error("Magic link authorize error:", error);
          // Rethrow or handle specific errors
          const message =
            error instanceof Error
              ? error.message
              : "Failed to process magic link request.";
          throw new Error(message);
        }
      },
    }),
    // Removed Email provider section entirely
  ],
  secret: authSecret,
  session: {
    strategy: "jwt", // SWITCH TO JWT STRATEGY
  },
  pages: {
    signIn: "/mooki/access/login",
    signOut: "/",
    error: "/mooki/access/error", // Error codes: https://next-auth.js.org/configuration/pages#error-page
    verifyRequest: "/mooki/access/verify-request", // Page shown after email send attempt
    // newUser: '/auth/new-user' // Redirect new users on first sign in
  },
  callbacks: {
    // JWT callback: Called whenever a JWT is created or updated.
    async jwt({ token, user }) {
      // On initial sign-in (user object is present), add user ID to the token.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Session callback: Called whenever a session is checked.
    async session({ session, token }) {
      // Add user ID from the JWT token (specifically from token.id we added in jwt callback)
      // token.sub is typically the default field for user ID in JWT strategy
      if (session.user) {
        session.user.id = token.id as string; // Use the id field from jwt callback
        // session.user.id = token.sub as string; // Alternative if using token.sub
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development", // Enable debug logs in dev
});
