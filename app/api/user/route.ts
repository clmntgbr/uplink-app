import { createAuthHeaders } from "@/lib/create-auth-headers";
import { requireAuth } from "@/lib/require-auth";
import { pick } from "lodash";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const response = await fetch(`${BACKEND_API_URL}/user`, {
      method: "GET",
      headers: createAuthHeaders(auth.token),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const data = await response.json();
    const user = pick(data, ["id", "email", "firstname", "lastname", "picture", "roles"]);

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
