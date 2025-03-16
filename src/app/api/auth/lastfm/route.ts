import { NextResponse } from "next/server";

const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY as string;
const REDIRECT_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/lastfm/callback`;

export async function GET(): Promise<NextResponse> {
  // Generar una URL para la autenticación de Last.fm
  const authUrl = `https://www.last.fm/api/auth/?api_key=${LASTFM_API_KEY}&cb=${REDIRECT_URL}`;

  return NextResponse.redirect(authUrl);
}
