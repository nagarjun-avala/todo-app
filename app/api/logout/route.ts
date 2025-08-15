import { NextResponse } from "next/server";

export async function GET() {
    const res = NextResponse.json({ success: true });

    res.cookies.set({
        name: "todo-token",
        value: "",
        path: "/",
        maxAge: 0, // expires immediately
        httpOnly: true, // match your original cookie settings
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return res;
}
