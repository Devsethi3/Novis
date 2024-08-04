import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import bcrypt from "bcrypt";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await convex.query(api.user.getUserByEmail, {
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await convex.mutation(api.user.createUser, {
      name,
      email,
      hashedPassword,
      provider: "credentials",
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
