import crypto from "node:crypto";
import { cookies } from "next/headers";
// app/api/lastfm/scrobble/batch/route.ts
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Obtener la sesión del usuario
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("lastfm_session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);

    // Obtener datos del cuerpo de la petición
    const body = await request.json();
    const { tracks } = body;

    // Validar que tracks sea un array
    if (!Array.isArray(tracks) || tracks.length === 0) {
      return NextResponse.json(
        { error: "El formato de tracks no es válido" },
        { status: 400 }
      );
    }

    // Validar cada track
    for (const track of tracks) {
      if (!track.artist || !track.track) {
        return NextResponse.json(
          { error: "Cada track debe tener artist y track" },
          { status: 400 }
        );
      }

      // Si no hay timestamp, asignar uno automáticamente
      if (!track.timestamp) {
        track.timestamp = Math.floor(Date.now() / 1000);
      }
    }

    // Enviar batch scrobble
    const result = await scrobbleBatch({
      tracks,
      sessionKey: sessionData.key
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en batch scrobble:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}

interface BatchScrobbleParams {
  tracks: {
    artist: string;
    track: string;
    timestamp: number;
    album?: string;
  }[];
  sessionKey: string;
}

async function scrobbleBatch(params: BatchScrobbleParams): Promise<any> {
  const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY as string;
  const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";

  // Parámetros iniciales
  const requestParams: Record<string, string> = {
    method: "track.scrobble",
    api_key: LASTFM_API_KEY,
    sk: params.sessionKey
  };

  // Agregar datos de múltiples tracks con índices
  params.tracks.forEach((track, index) => {
    requestParams[`artist[${index}]`] = track.artist;
    requestParams[`track[${index}]`] = track.track;
    requestParams[`timestamp[${index}]`] = track.timestamp.toString();

    if (track.album) {
      requestParams[`album[${index}]`] = track.album;
    }
  });

  // Generar la firma API
  const signature = createApiSignature(requestParams);
  requestParams.api_sig = signature;
  requestParams.format = "json";

  // Realizar la petición POST
  const response = await fetch(LASTFM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(requestParams).toString()
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `Error en batch scrobble: ${errorData.message || response.statusText}`
    );
  }

  return response.json();
}

function createApiSignature(params: Record<string, string>): string {
  const LASTFM_API_SECRET = process.env.LASTFM_API_SECRET as string;
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
