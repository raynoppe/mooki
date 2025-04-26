// This file should contain your Login Page UI component

import React from "react";
// You might need components for the form, e.g., from Shadcn/ui or similar
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// Example server action to trigger the magic link sign-in
async function signInWithEmail(formData: FormData) {
  "use server"; // Mark this function as a Server Action
  const email = formData.get("email") as string;
  if (!email) {
    // Handle error: email is required
    console.error("Email is required for sign in.");
    return; // Or throw an error / return error state
  }

  try {
    // Import signIn function only within the server action
    const { signIn } = await import("@/auth");
    // Call signIn with 'credentials' provider and email
    // Set redirect to false as authorize returns null initially
    await signIn("credentials", { email, redirect: false });
    // Optionally, redirect to a page indicating email has been sent
    // Or handle UI update on the client side to show "Check your email"
    console.log("Magic link sign-in initiated for:", email); // Server-side log
    // redirect('/mooki/access/verify-request'); // Example redirect
  } catch (error) {
    // Handle errors, e.g., log them or display a message to the user
    // Errors from the authorize function (like invalid email or Resend failure) might be caught here
    console.error("Sign in initiation error:", error);
    // You might want to return an error state to the client
    // For now, NextAuth might redirect to the error page specified in pages config
    // throw error; // Re-throw if you want NextAuth default error handling/redirect
  }
}

export default function LoginPage() {
  // Consider adding state to show a message after submission
  // const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <h1>Sign In / Register</h1>
      <p>Enter your email to receive a magic link.</p>
      {/* Add onSubmit handler if you want client-side feedback */}
      <form action={signInWithEmail}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <button type="submit">Send Magic Link</button>
      </form>
      {/* Example feedback message:
      {submitted && <p>Check your email for the magic link!</p>}
      */}
    </div>
  );
}

// Remove the old code related to handlers
// import { handlers } from "@/auth"; // Assuming auth.ts is in the src root
//
// // Basic check to ensure handlers are exported correctly
// if (
//   !handlers ||
//   typeof handlers.GET !== "function" ||
//   typeof handlers.POST !== "function"
// ) {
//   throw new Error(
//     "Failed to import NextAuth handlers from @/auth. Check the export."
//   );
// }
//
// export const { GET, POST } = handlers;
//
// // Optional: Add Edge runtime support if needed, though not typically required for Supabase adapter
// // export const runtime = "edge";
