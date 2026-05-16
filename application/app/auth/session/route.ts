import { NextResponse } from "next/server";

import { clearAuthCookies, setAuthCookies } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { accessToken?: string; refreshToken?: string }
    | null;

  if (!body?.accessToken || !body.refreshToken) {
    return NextResponse.json(
      { error: "Missing access or refresh token." },
      { status: 400 },
    );
  }

  await setAuthCookies({
    access_token: body.accessToken,
    refresh_token: body.refreshToken,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAuthCookies();
  return NextResponse.json({ ok: true });
}
