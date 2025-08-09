import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from '@/lib/db';
import { encrypt } from "@/lib/session";
import { registerSchema } from "@/lib/zodSchems";

export async function POST(req: Request) {
    try {

        const body = await req.json();

        // ✅ Validate request body
        const parsed = registerSchema.safeParse(body);

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

        const { fullName, email, password } = body;

        const existing = await db.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 })
        }

        const hashed = await bcrypt.hash(password, 10)

        const user = await db.user.create({
            data: { email, password: hashed, fullName, lastLogin: new Date() },
            select: {
                id: true,
                fullName: true,
                email: true,
                createdAt: true,
            },
        })

        const token = await encrypt({ id: user.id, email: user.email });

        const res = NextResponse.json({
            success: true,
            message: "User registered successfully",
        }, { status: 201 })

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        })
        return res

    } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("❌ Registration Error:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
