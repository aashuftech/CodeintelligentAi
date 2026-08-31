import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { User, IUser } from "@/lib/db/models/user.model";
import connectToDatabase from "@/lib/db/mongodb";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "development-jwt-secret-key-32-chars-at-least-secure";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = "ai_interview_token";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "candidate" | "admin";
}

/**
 * Checks whether the given email is in the configured admin emails list (via ADMIN_EMAILS or ADMIN_EMAIL environment variables)
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const adminConfig = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "admin@example.com";
  const list = adminConfig
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.trim().toLowerCase());
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  // If email is in admin emails, force role to admin
  const effectiveRole = payload.role === "admin" || isAdminEmail(payload.email) ? "admin" : payload.role;

  return new SignJWT({ ...payload, role: effectiveRole })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const session = payload as unknown as SessionPayload;
    if (session && isAdminEmail(session.email)) {
      session.role = "admin";
    }
    return session;
  } catch (error) {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  // Try Cookie
  const tokenCookie = req.cookies.get(COOKIE_NAME)?.value;
  if (tokenCookie) {
    const session = await verifySessionToken(tokenCookie);
    if (session) return session;
  }

  // Try Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return verifySessionToken(token);
  }

  return null;
}

export async function getAuthenticatedUser(req?: NextRequest): Promise<IUser | null> {
  const session = req ? await getSessionFromRequest(req) : await getSessionFromCookies();
  if (!session?.userId) return null;

  try {
    await connectToDatabase();
    const user = await User.findById(session.userId);
    if (user) {
      if (isAdminEmail(user.email) && user.role !== "admin") {
        user.role = "admin";
        await user.save();
      }
    }
    return user;
  } catch (error) {
    console.error("Error retrieving authenticated user:", error);
    return null;
  }
}

export function setSessionCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

export function removeSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
