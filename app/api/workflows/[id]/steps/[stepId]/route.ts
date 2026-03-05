import { createAuthHeaders } from "@/lib/create-auth-headers";
import { requireAuth } from "@/lib/require-auth";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; stepId: string }> }) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id: workflowId, stepId } = await params;
    const body = await request.json();

    const response = await fetch(`${BACKEND_API_URL}/workflows/${workflowId}/steps/${stepId}`, {
      method: "PUT",
      headers: createAuthHeaders(auth.token),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; stepId: string }> }) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id: workflowId, stepId } = await params;

    const response = await fetch(`${BACKEND_API_URL}/workflows/${workflowId}/steps/${stepId}`, {
      method: "DELETE",
      headers: createAuthHeaders(auth.token),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
