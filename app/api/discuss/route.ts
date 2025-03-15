import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Fetch all messages
export async function GET() {
  try {
    const messages = await db.message.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.log(error)
    return new NextResponse("Error fetching messages", { status: 500 });
  }
}

// Post a new message
export async function POST(req: NextRequest) {
  try {
    const { username, text } = await req.json();

    if (!username || !text) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const newMessage = await db.message.create({
      data: { username, text },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Error posting message", { status: 500 });
  }
}
