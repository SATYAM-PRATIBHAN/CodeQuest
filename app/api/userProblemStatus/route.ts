import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { userId, problemId, status, solvedAt } = await req.json();

    if (!userId || !problemId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedStatus = await db.userProblemStatus.upsert({
      where: {
        userId: userId,
        problemId : problemId
      },
      update: { status, solvedAt },
      create: { userId, problemId, status, solvedAt },
    });

    return NextResponse.json(updatedStatus, { status: 200 });
  } catch (error) {
    console.error("Error updating problem status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
