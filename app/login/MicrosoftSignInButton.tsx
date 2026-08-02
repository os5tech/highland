"use client";

import { signIn } from "next-auth/react";

export function MicrosoftSignInButton() {
  return (
    <button className="primary-login" type="button" onClick={() => void signIn("azure-ad", { callbackUrl: "/" })}>
      Continue with Microsoft
    </button>
  );
}
