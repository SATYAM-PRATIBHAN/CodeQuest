import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const solvedCount = await db.userProblemStatus.count({
      where: {
        userId: String(userId),
        status: { equals: "SOLVED", mode: "insensitive" }, // Case-insensitive match
    }    
    });
    console.log(solvedCount)
    return NextResponse.json({ solvedCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching solved problems:", error);
    return NextResponse.json({ error: "Failed to fetch solved problems" }, { status: 500 });
  }
}