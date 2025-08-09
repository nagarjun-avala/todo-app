// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "./lib/session";

const PUBLIC_PATHS = [
    "/login",
    "/register",
    "/_next",
    "/api",
    "/favicon.ico",
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Allow public and static routes
    const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
    if (isPublic) return NextResponse.next();

    const token = req.cookies.get("token")?.value;

    if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    try {
        const session = await decrypt(token); // ✅ token is a string

        if (!session?.id) {
            const loginUrl = new URL("/login", req.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // You could also attach session info to headers if needed
        const response = NextResponse.next();
        if (session?.id) {
            response.headers.set("x-user-id", session?.id);
        }
        return response;
    } catch (err) {
        console.error("Verification failed:", err);
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }
}

// Only match pages, exclude static assets and API
export const config = {
    matcher: ["/((?!login|register|api|_next|favicon.ico).*)"],
};
