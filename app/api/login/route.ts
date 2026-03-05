import { setSessionCookie } from "@/lib/session";
import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: Request) {
  console.log(BACKEND_API_URL);
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false }, { status: response.status });
    }

    const { user, token } = await response.json();

    if (!token || !user) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const { id, email, firstname, lastname, picture, roles } = user;
    const nextResponse = NextResponse.json({
      user: { id, email, firstname, lastname, picture, roles },
      token,
    });

    setSessionCookie(nextResponse, token);
    return nextResponse;
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
