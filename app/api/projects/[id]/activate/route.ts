import { createAuthHeaders } from "@/lib/create-auth-headers";
import { requireAuth } from "@/lib/require-auth";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const headers = createAuthHeaders(auth.token);
    headers["Content-Type"] = "application/ld+json";

    const response = await fetch(`${BACKEND_API_URL}/projects/${id}/activate`, {
      method: "POST",
      headers,
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
