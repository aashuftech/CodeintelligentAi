import { NextResponse } from "next/server";
import { removeSessionCookie } from "@/lib/auth/session";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logged out successfully" });
  return removeSessionCookie(res);
}
