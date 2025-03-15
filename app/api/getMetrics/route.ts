import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { register, collectDefaultMetrics, Counter, Gauge } from "prom-client";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// Enable default metrics (e.g., memory usage, CPU, etc.)
collectDefaultMetrics();

// Custom metrics
const totalUsersGauge = new Gauge({
    name: "total_users",
    help: "Total number of registered users"
});

const totalProblemsGauge = new Gauge({
    name: "total_problems",
    help: "Total number of coding problems available"
});

const totalSubmissionsGauge = new Gauge({
    name: "total_submissions",
    help: "Total number of problem submissions"
});

const averageAccuracyGauge = new Gauge({
    name: "average_accuracy",
    help: "Average accuracy across all problems"
});

const totalMessagesGauge = new Gauge({
    name: "total_messages",
    help: "Total number of messages sent in discussions"
});

const totalSiteVisits = new Counter({
    name: "total_site_visits",
    help: "Total number of site visits"
});

const totalPageVisits = new Counter({
    name: "total_page_visits",
    help: "Total number of individual page visits"
});

export async function GET(req: Request) {
    try {
        const cookieStore = cookies();
        if (!(await cookieStore).get("site_visit_id")) {
            (await cookieStore).set("site_visit_id", uuidv4());
            totalSiteVisits.inc();
        }

        const pathname = new URL(req.url).pathname;
        if (pathname) totalPageVisits.inc();

        const totalUsers = await db.user.count();
        totalUsersGauge.set(totalUsers);

        const totalProblems = await db.problem.count();
        totalProblemsGauge.set(totalProblems);

        const totalSubmissions = await db.problem.aggregate({
            _sum: {
                submissions: true
            }
        });
        totalSubmissionsGauge.set(totalSubmissions._sum.submissions || 0);

        const averageAccuracy = await db.problem.aggregate({
            _avg: {
                accuracy: true
            }
        });
        averageAccuracyGauge.set(averageAccuracy._avg.accuracy || 0);

        const totalMessages = await db.message.count();
        totalMessagesGauge.set(totalMessages);

        const metrics = await register.metrics();
        return new Response(metrics, {
            headers: { "Content-Type": register.contentType }
        });
    } catch (error) {
        console.error("Error fetching metrics:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    } finally {
        await db.$disconnect();
    }
}
