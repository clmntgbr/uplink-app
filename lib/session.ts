import { NextRequest, NextResponse } from "next/server";
import { decodeToken, JWTPayload } from "@/lib/jwt";

const SESSION_COOKIE_NAME = "session";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export interface SessionData {
  token: string;
  user: JWTPayload;
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export function getSessionToken(request: NextRequest): string | null {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value || null;
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export function getSessionData(request: NextRequest): SessionData | null {
  const token = getSessionToken(request);

  if (!token) {
    return null;
  }

  const user = decodeToken(token);

  if (!user) {
    return null;
  }

  return { token, user };
}
