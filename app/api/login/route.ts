import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { encrypt } from "@/lib/session";
import { loginSchema } from "@/lib/zodSchems";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const parsed = loginSchema.safeParse(body);

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

        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await db.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const token = await encrypt({ id: user.id, email: user.email });

        const res = NextResponse.json({
            success: true,
            message: "Login successful",
        });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        await db.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });

        return res;
    } catch (error) {
        if (process.env.NODE_ENV === "development") console.error("❌ Login Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to process login at the moment"
            },
            { status: 500 }
        );
    }
}
