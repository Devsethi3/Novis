"use server";

import { signIn } from "next-auth/react";

export async function signInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}
