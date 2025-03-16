import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { userId, problemId, status } = body;

    if (!userId || !problemId || !status) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    try {
        const existingStatus = await db.userProblemStatus.findFirst({
            where: {
                userId,
                problemId,
            },
        });
        
        if (existingStatus) {
            // Update existing status
            const updatedStatus = await db.userProblemStatus.update({
                where: { id: existingStatus.id },
                data: { status, solvedAt: status === "SOLVED" ? new Date() : null },
            });

            return NextResponse.json({ message: "Status updated successfully.", updatedStatus });
        } else {
            // Create new entry if status doesn't exist
            const newStatus = await db.userProblemStatus.create({
                data: { userId, problemId, status, solvedAt: status === "SOLVED" ? new Date() : null },
            });

            // Increment submissions count for the problem
            await db.problem.update({
                where: { id: problemId },
                data: { submissions: { increment: 1 } },
            });

            return NextResponse.json({ message: "Status created successfully.", newStatus }, { status: 201 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred while updating the submission status." }, { status: 500 });
    }
}
