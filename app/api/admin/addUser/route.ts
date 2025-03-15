import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { username, email, password, image } = await req.json();

    const newUser = await db.user.create({
      data: {
        username,
        email,
        password,
        image,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Error adding user" }, { status: 500 });
  }
}
