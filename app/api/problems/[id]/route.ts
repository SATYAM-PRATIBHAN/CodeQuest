import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log("Fetching problem with ID:", id); // Debugging log
  
  try {
    const problem = await db.problem.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        platform: true,
        tags: true,
        url: true,
        submissions: true,
        accuracy: true,
        upvotes: true,
        createdAt: true,
        userStatus: true,
        testCases: true,
      },
    });

    if (!problem) {
      console.log("Problem not found");
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(problem, { status: 200 });
  } catch (error) {
    console.error("Error fetching problem:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
