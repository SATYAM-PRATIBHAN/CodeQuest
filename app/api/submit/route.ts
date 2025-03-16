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
        // Check if the status entry already exists
        const existingStatus = await db.userProblemStatus.findUnique({
            where: { userId_problemId: { userId, problemId } },
        });

        const isNewSubmission = !existingStatus || existingStatus.status !== "SOLVED";

        await db.$transaction([
            db.userProblemStatus.upsert({
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
            }),
            // Increment submission count only when a new status is created or transitioning from UNSOLVED ➔ SOLVED
            ...(isNewSubmission && status === "SOLVED"
                ? [
                    db.problem.update({
                        where: { id: problemId },
                        data: { submissions: { increment: 1 } },
                    }),
                ]
                : []),
        ]);

        return NextResponse.json({ message: "Status updated successfully." }, { status: 200 });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "An error occurred while updating the submission status." }, { status: 500 });
    }
}
