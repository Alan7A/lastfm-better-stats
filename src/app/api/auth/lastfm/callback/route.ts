import crypto from "node:crypto";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

interface LastFMSessionResponse {
  session: {
    name: string;
    key: string;
    subscriber: number;
  };
}

const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY as string;
const LASTFM_API_SECRET = process.env.LASTFM_API_SECRET as string;
const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/error?message=Failed to get Last.fm token`
    );
  }

  try {
    // Obtener sesión de Last.fm
    const session = await getLastFMSession(token);

    // Guardar la sesión en una cookie
    const cookieStore = await cookies();
    cookieStore.set("lastfm_session", JSON.stringify(session), {
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 días
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${session.name}/tools`
    );
  } catch (error) {
    console.error("Error durante la autenticación de Last.fm:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/error?message=Error during authentication`
    );
  }
}

async function getLastFMSession(
  token: string
): Promise<LastFMSessionResponse["session"]> {
  // Crear firma MD5 para la API de Last.fm
  const apiSig = createApiSignature({
    api_key: LASTFM_API_KEY,
    method: "auth.getSession",
    token
  });

  const params = new URLSearchParams({
    method: "auth.getSession",
    token,
    api_key: LASTFM_API_KEY,
    api_sig: apiSig,
    format: "json"
  });

  const response = await fetch(`${LASTFM_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Error getting session: ${response.statusText}`);
  }

  const data = (await response.json()) as LastFMSessionResponse;
  return data.session;
}

export function createApiSignature(params: Record<string, string>): string {
  // Ordenar parámetros alfabéticamente
  const sortedParams = Object.keys(params)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = params[key];
        return acc;
      },
      {} as Record<string, string>
    );

  // Crear cadena para firmar
  let signatureString = "";
  for (const key in sortedParams) {
    signatureString += key + sortedParams[key];
  }
  signatureString += LASTFM_API_SECRET;

  // Generar firma MD5
  return crypto.createHash("md5").update(signatureString).digest("hex");
}
