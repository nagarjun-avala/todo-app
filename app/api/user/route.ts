// app/api/user/route.ts (fetching server-side)
// import { cookies } from "next/headers";
import api from "@/utils/api";

export async function GET() {
  // const cookieStore = await cookies();
  // const refreshToken = cookieStore.get("refreshToken"); // if needed

  try {
    const res = await api.get("/auth/profile");
    return Response.json(res.data);
  } catch {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }
}
