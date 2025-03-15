import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const problems = await db.problem.findMany();
    return NextResponse.json(problems, { status: 200 });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, difficulty, platform, tags, url, description, testCases } = await req.json();

    if (!title || !difficulty || !platform || !url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProblem = await db.problem.create({
      data: { title, difficulty, platform, tags, url, description, testCases },
    });

    return NextResponse.json(newProblem, { status: 201 });
  } catch (error) {
    console.error("Error adding problem:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

