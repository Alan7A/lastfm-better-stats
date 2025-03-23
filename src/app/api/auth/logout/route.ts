import { cookies } from "next/headers";
// app/api/auth/lastfm/logout/route.ts
import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();

  // Eliminar la cookie de sesión
  cookieStore.delete("lastfm_session");

  return NextResponse.json({ success: true });
}
