import { createAuthHeaders } from "@/lib/create-auth-headers";
import { requireAuth } from "@/lib/require-auth";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function PATCH(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const payload = await request.json();

    const headers = createAuthHeaders(auth.token);
    headers["Content-Type"] = "application/merge-patch+json";

    const response = await fetch(`${BACKEND_API_URL}/projects/${payload.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    await response.json();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
