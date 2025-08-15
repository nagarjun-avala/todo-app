import { getServerSession } from "@/lib/session";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession()
    if (!session) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    const user = await db.user.findUnique({
        where: { id: session?.id as string },
        omit: {
            password: true
        }
    });

    return Response.json(user);
}
