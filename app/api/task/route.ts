// app/api/task/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { taskSchema } from "@/lib/zodSchems";
import { Task } from "@prisma/client";

export async function GET() {
    try {
        const session = await getServerSession()
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }


        const tasks = await db.task.findMany({
            where: {
                userId: session?.id,
                deleted: false,
            },
            orderBy: { createdAt: "desc" },
        });

        const res = NextResponse.json({
            success: true,
            message: "Tasks fetch successful",
            tasks
        }, { status: 201 })

        return res
    } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("❌ Tasks Fetch Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// ✅ POST: Add a new task
export async function POST(req: NextRequest) {
    try {
        const { dueDate, ...body } = await req.json();

        console.log("Passed body initialization")
        const parsed = taskSchema.safeParse(body);

        console.log("Passed schema validation")

        if (!parsed.success) {
            return NextResponse.json(
                {
                    success: false,
                    errors: parsed.error.issues.map(err => ({
                        path: err.path.join("."),
                        message: err.message,
                    })),
                },
                { status: 400 }
            );
        }

        const {
            title,
            description,
            status,
            priority,
            category,
            recurrence,
        }: Task = body;


        const session = await getServerSession()
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
        }

        const newTask = await db.task.create({
            data: {
                title,
                description,
                status,
                priority,
                category,
                dueDate,
                recurrence,
                userId: session?.id,
            },
        });

        const res = NextResponse.json(newTask, { status: 201 })

        return res
    } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("❌ Task creation Error:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
