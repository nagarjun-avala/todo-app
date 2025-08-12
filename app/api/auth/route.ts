import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { db } from "@/lib/db";
import { SessionPayload } from "@/lib/types";

export async function GET() {
    const token = (await cookies()).get("token")?.value;
    const session: SessionPayload | null = token ? await decrypt(token) : null;
    const user = await db.user.findUnique({
        where: { id: session?.id as string },
        omit: {
            password: true
        }
    });

    return Response.json(user);
}
