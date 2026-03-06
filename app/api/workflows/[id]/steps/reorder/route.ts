import { createAuthHeaders } from "@/lib/create-auth-headers";
import { requireAuth } from "@/lib/require-auth";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function PUT(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const payload = await request.json();

    const headers = createAuthHeaders(auth.token);
    headers["Content-Type"] = "application/ld+json";

    const backendUrl = new URL(`${BACKEND_API_URL}/workflows/${payload.workflowId}/steps/reorder`);

    const response = await fetch(backendUrl.toString(), {
      method: "PUT",
      headers,
      body: JSON.stringify({ steps: payload.steps }),
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
