import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId, problemId } = await req.json();

        if (!userId || !problemId) {
            return NextResponse.json({ error: "Missing userId or problemId." }, { status: 400 });
        }

        const submission = await db.userProblemStatus.findFirst({
            where: {
                userId,
                problemId,
                status: "Solved"
            }
        });

        if (submission) {
            return NextResponse.json({ submitted: true });
        } else {
            return NextResponse.json({ submitted: false });
        }
    } catch (error) {
        console.error("Error checking submission:", error);
        return NextResponse.json({ error: "Failed to check submission." }, { status: 500 });
    }
}
