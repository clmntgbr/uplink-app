import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "./session";

export function requireAuth(request: NextRequest): { token: string } | { error: NextResponse } {
  const token = getSessionToken(request);

  if (!token) {
    return {
      error: NextResponse.json({ success: false }, { status: 401 }),
    };
  }

  return { token };
}
