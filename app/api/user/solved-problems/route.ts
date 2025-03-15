import {  NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import { db } from "@/lib/prisma";


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  if (!userId) {
    return NextResponse.json({ error: "User ID not found" }, { status: 400 });
  }

  try {
    const solvedProblems = await db.userProblemStatus.findMany({
      where: { userId, status: "SOLVED" },
      select: { problemId: true },
    });

    return NextResponse.json({ solvedProblemIds: solvedProblems.map((p) => p.problemId) });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to fetch solved problems" }, { status: 500 });
  }
}
