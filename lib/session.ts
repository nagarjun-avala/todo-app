// lib/session.ts (edge-compatible)

import { jwtVerify, SignJWT } from "jose";
import { SessionPayload } from "./types";
import { cookies } from "next/headers";


const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dukjhesufgresgyird");

export async function encrypt(payload: SessionPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

export async function decrypt(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ["HS256"],
        });

        return payload as SessionPayload;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}

export async function getServerSession() {
    const token = (await cookies()).get("todo-token")?.value;
    return token ? decrypt(token) : null;
}