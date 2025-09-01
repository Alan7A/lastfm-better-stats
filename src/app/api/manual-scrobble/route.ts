import crypto from "node:crypto";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get user session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("lastfm_session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionData = JSON.parse(sessionCookie.value);

    // Get request body data
    const body = await request.json();
    const { artist, track, timestamp } = body;

    // Validate required fields
    if (!artist || !track) {
      return NextResponse.json(
        { error: "Artist and track are required" },
        { status: 400 }
      );
    }

    // Use current timestamp if not provided
    const scrobbleTimestamp = timestamp || Math.floor(Date.now() / 1000);

    // Send single scrobble
    const result = await scrobbleTrack({
      artist,
      track,
      timestamp: scrobbleTimestamp,
      sessionKey: sessionData.key
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in manual scrobble:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

interface ScrobbleTrackParams {
  artist: string;
  track: string;
  timestamp: number;
  sessionKey: string;
}

async function scrobbleTrack(params: ScrobbleTrackParams): Promise<any> {
  const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY as string;
  const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";

  // Request parameters
  const requestParams: Record<string, string> = {
    method: "track.scrobble",
    api_key: LASTFM_API_KEY,
    sk: params.sessionKey,
    artist: params.artist,
    track: params.track,
    timestamp: params.timestamp.toString()
  };

  // Generate API signature
  const signature = createApiSignature(requestParams);
  requestParams.api_sig = signature;
  requestParams.format = "json";

  // Make POST request
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
      `Error in track scrobble: ${errorData.message || response.statusText}`
    );
  }

  return response.json();
}

function createApiSignature(params: Record<string, string>): string {
  const LASTFM_API_SECRET = process.env.LASTFM_API_SECRET as string;

  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = params[key];
        return acc;
      },
      {} as Record<string, string>
    );

  // Create signature string
  let signatureString = "";
  for (const key in sortedParams) {
    signatureString += key + sortedParams[key];
  }
  signatureString += LASTFM_API_SECRET;

  // Generate MD5 signature
  return crypto.createHash("md5").update(signatureString).digest("hex");
}
