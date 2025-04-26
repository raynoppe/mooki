import { type NextRequest, NextResponse } from "next/server";
import { type Adapter } from "@auth/core/adapters";
import { SupabaseAdapter } from "@auth/supabase-adapter";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const adapter = SupabaseAdapter({
  url: supabaseUrl,
  secret: supabaseServiceRoleKey,
}) as Adapter;

const LOGIN_URL = "/mooki/access/login";
const DASHBOARD_URL = "/mooki/dashboard";
const ERROR_URL = "/mooki/access/error";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    console.error("Magic link callback: Missing token or email");
    return NextResponse.redirect(
      new URL(LOGIN_URL + "?error=MissingTokenOrEmail", request.url)
    );
  }

  try {
    if (!adapter.useVerificationToken) {
      throw new Error("Adapter method useVerificationToken is not available.");
    }
    const verificationToken = await adapter.useVerificationToken({
      identifier: email,
      token: token,
    });

    if (!verificationToken) {
      console.error(
        `Magic link callback: Invalid or expired token for email: ${email}`
      );
      return NextResponse.redirect(
        new URL(LOGIN_URL + "?error=InvalidOrExpiredToken", request.url)
      );
    }

    console.log(`Magic link callback: Token verified for email: ${email}`);

    if (!adapter.getUserByEmail) {
      throw new Error("Adapter method getUserByEmail is not available.");
    }
    let user = await adapter.getUserByEmail(email);

    if (!user) {
      console.log(`Magic link callback: Creating new user for email: ${email}`);
      const newUserInput = {
        email: email,
        emailVerified: new Date(),
      };
      if (!adapter.createUser) {
        throw new Error("Adapter method createUser is not available.");
      }
      user = await adapter.createUser(newUserInput as any);
      if (!user) {
        throw new Error("Failed to create user after token verification.");
      }
      console.log(`Magic link callback: New user created with ID: ${user.id}`);
    } else {
      if (!user.emailVerified) {
        console.log(
          `Magic link callback: Marking existing user as verified: ${email}`
        );
        if (!adapter.updateUser) {
          console.warn(
            "Adapter method updateUser is not available. Cannot mark user as verified."
          );
        } else {
          await adapter.updateUser({ id: user.id, emailVerified: new Date() });
        }
      }
      console.log(
        `Magic link callback: Existing user found with ID: ${user.id}`
      );
    }

    console.log(`Magic link callback: Redirecting user ${email} to dashboard.`);
    return NextResponse.redirect(new URL(DASHBOARD_URL, request.url));
  } catch (error: unknown) {
    console.error("Magic link callback error:", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.redirect(
      new URL(ERROR_URL + `?error=${encodeURIComponent(message)}`, request.url)
    );
  }
}
