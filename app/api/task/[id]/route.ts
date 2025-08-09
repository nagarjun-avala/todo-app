// app/api/transaction/[id]/route.ts

import { NextResponse } from "next/server";
import { insertTransactionSchema } from "@/lib/schemas";
import { db } from "@/lib/db";
import { getServerSession } from "@/lib/getSession";

export async function PATCH(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split("/").pop();
        if (!id) {
            return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
        }

        // ⛏️ parse the incoming JSON
        const body = await request.json();

        // 🧪 Validate only the fields being sent (partial)
        const { description, note, amount, type, categoryId } = insertTransactionSchema.partial().parse(body);

        const session = await getServerSession()
        if (!session) {
            return new Response("Unauthorized", { status: 401 });
        }

        // 🔄 Update the transaction
        const updated = await db.transaction.update({
            where: { id, userId: session?.id },
            data: { description, note, amount, type, categoryId },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update transaction:", error);
        return new NextResponse("Failed to update transaction", { status: 500 });
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
        const existing = await db.transaction.findUnique({
            where: { id, userId: session?.id },
        });

        if (!existing) {
            return new Response("Transaction not found", { status: 404 });
        }
        // ✅ Step 2: Delete it safely
        await db.transaction.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        console.error("❌ Failed to delete transaction:", error);
        return new NextResponse("Failed to delete transaction", { status: 500 });
    }
}