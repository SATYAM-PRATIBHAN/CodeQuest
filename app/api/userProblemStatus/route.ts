import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import { db } from "@/lib/prisma";


export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { problems: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const solvedProblems = await db.userProblemStatus.findMany({
      where: { userId: user.id, status: "SOLVED" },
      include: { problem: true },
    });

    const allProblems = await db.problem.findMany();
    const solvedProblemIds = new Set(solvedProblems.map((p) => p.problemId));

    const unsolvedProblems = allProblems.filter(
      (p) => !solvedProblemIds.has(p.id)
    );

    return NextResponse.json({
      solved: solvedProblems.map((p) => p.problem),
      unsolved: unsolvedProblems,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
