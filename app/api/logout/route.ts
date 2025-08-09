import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ success: true }).cookies.set({
        name: "token",
        value: "",
        path: "/",
        maxAge: 0, // expires immediately
        httpOnly: true, // match your original cookie settings
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
}
