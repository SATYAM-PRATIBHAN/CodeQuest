import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, problemId, status } = body;

        // Validate incoming data
        if (!userId || !problemId || !status) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        if (typeof userId !== "string" || typeof problemId !== "string") {
            return NextResponse.json({ error: "Invalid data type for userId or problemId." }, { status: 400 });
        }

        // Check if the status already exists
        const existingStatus = await db.userProblemStatus.findUnique({
            where: { userId_problemId: { userId, problemId } },
        });

        // Update existing status or create a new one
        const statusData = {
            status,
            solvedAt: status === "SOLVED" ? new Date() : null,
        };

        if (existingStatus) {
            const updatedStatus = await db.userProblemStatus.update({
                where: { userId_problemId: { userId, problemId } },
                data: statusData,
            });
            return NextResponse.json({ message: "Status updated successfully.", updatedStatus });
        } 

        const newStatus = await db.userProblemStatus.create({
            data: { userId, problemId, ...statusData },
        });

        // Increment submissions count for the problem
        await db.problem.update({
            where: { id: problemId },
            data: { submissions: { increment: 1 } },
        });

        return NextResponse.json({ message: "Status created successfully.", newStatus }, { status: 201 });

    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: "An error occurred while updating the submission status." }, { status: 500 });
    }
}
