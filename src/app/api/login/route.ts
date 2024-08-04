// api/login/route.ts

import { NextResponse } from "next/server";
import { signIn } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result) {
      return NextResponse.json(
        { error: "Invalid response from authentication service" },
        { status: 500 }
      );
    }

    if (result.error) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
