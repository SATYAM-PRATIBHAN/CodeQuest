import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signJwt } from "@/utils/jwt"; // Create a JWT utility
import { db } from "@/lib/prisma";


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check if user exists
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "User not found. Please register." }, { status: 404 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password ?? "");
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // Generate JWT token
    const token = signJwt({ id: user.id, email: user.email });

    return NextResponse.json({ message: "Login successful", token }, { status: 200 });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
