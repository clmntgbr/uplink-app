import { createAuthHeaders } from "@/lib/create-auth-headers";
import { requireAuth } from "@/lib/require-auth";
import { pick } from "lodash";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const response = await fetch(`${BACKEND_API_URL}/endpoints`, {
      method: "GET",
      headers: createAuthHeaders(auth.token),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const data = await response.json();
    const endpoints = pick(data, ["members", "page", "limit", "totalPages", "total"]);

    return NextResponse.json(endpoints);
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const payload = await request.json();

    const response = await fetch(`${BACKEND_API_URL}/endpoints`, {
      method: "POST",
      headers: createAuthHeaders(auth.token),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const data = await response.json();
    const endpoint = pick(data, ["id", "name", "baseUri", "path", "method", "timeoutSeconds"]);
    return NextResponse.json(endpoint);
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
