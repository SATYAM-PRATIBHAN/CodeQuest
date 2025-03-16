import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { userId, problemId, status } = body;

    // Basic validation
    if (!userId || !problemId || !status) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (typeof userId !== "string" || typeof problemId !== "string") {
        return NextResponse.json({ error: "Invalid data type for userId or problemId." }, { status: 400 });
    }

    try {
        // Upsert logic: Create if doesn't exist, update if exists
        const updatedStatus = await db.userProblemStatus.upsert({
            where: { 
                userId_problemId: { userId, problemId }
            },
            create: {
                userId,
                problemId,
                status,
                solvedAt: status === "SOLVED" ? new Date() : null,
            },
            update: {
                status,
                solvedAt: status === "SOLVED" ? new Date() : null,
            },
        });

        // Increment submission count only when a new status is created
        if (updatedStatus) {
            await db.problem.update({
                where: { id: problemId },
                data: { submissions: { increment: 1 } },
            });
        }

        return NextResponse.json({ message: "Status updated successfully.", updatedStatus }, { status: 200 });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "An error occurred while updating the submission status." }, { status: 500 });
    }
}
