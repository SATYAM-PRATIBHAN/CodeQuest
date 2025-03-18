// /api/delete-submission/route.ts
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const { userId, problemId } = await req.json();

  if (!userId || !problemId) {
    return NextResponse.json({ error: "User ID and Problem ID are required." }, { status: 400 });
  }

  try {
    await db.userProblemStatus.deleteMany({
      where: {
        userId,
        problemId,
      },
    });

    return NextResponse.json({ message: "Previous submission deleted successfully." });
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json({ error: "Failed to delete submission." }, { status: 500 });
  }
}
