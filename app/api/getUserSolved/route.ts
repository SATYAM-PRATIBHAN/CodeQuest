import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    { params }: { params: Promise<{ userId: string, problemId: string }> }
) {
    const { userId, problemId } = await params;

    try {
        const res = await db.userProblemStatus.findMany({
            where: {
                userId,
                problemId,
                status: "SOLVED"
            },
            select: {
                userId: true,
                problemId: true,
                status: true,
                solvedAt: true,
            }
        });

        if (!res) {
            console.log("User not found or the user haven't solved any problem");
            return NextResponse.json({ error: "User not found or the user haven't solved any problem" }, { status: 404 });
        }
        
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.error("Error fetching problem:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
      }
}