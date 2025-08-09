// app/api/transaction/[id]/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "@/lib/session";
import { taskSchema } from "@/lib/zodSchems";

export async function PATCH(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split("/").pop();
        if (!id) {
            return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
        }

        // ⛏️ parse the incoming JSON
        const body = await request.json();

        // 🧪 Validate only the fields being sent

        const parsed = taskSchema.safeParse(body);

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

        const { title,
            description,
            status,
            priority,
            category,
            dueDate,
            recurrence, } = body;

        const session = await getServerSession()
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        // 🔄 Update the transaction
        const updated = await db.task.update({
            where: { id, userId: session?.id },
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

        const res = NextResponse.json({
            success: true,
            message: "Task updated successfully",
            task: updated
        }, { status: 200 })

        return res
    } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("❌ Task update Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.pathname.split("/").pop();
        if (!id) {
            return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
        }

        const session = await getServerSession()
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        // 👀 Step 1: Confirm it exists
        const existing = await db.task.findUnique({
            where: { id, userId: session?.id },
        });

        if (!existing) {
            return new Response("Task not found", { status: 404 });
        }
        // ✅ Step 2: Delete it safely(set deleted:true)
        await db.task.update({
            where: { id, userId: session?.id },
            data: {
                deleted: true
            }
        });

        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        console.error("❌ Failed to delete transaction:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}