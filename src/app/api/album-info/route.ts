import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const artist = searchParams.get("artist");
    const album = searchParams.get("album");
    const mbid = searchParams.get("mbid");

    if ((!artist || !album) && !mbid) {
      return NextResponse.json(
        { error: "Either (artist and album) or mbid parameter is required" },
        { status: 400 }
      );
    }

    const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY as string;
    const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";

    const params = new URLSearchParams({
      method: "album.getinfo",
      api_key: LASTFM_API_KEY,
      format: "json"
    });

    if (mbid) {
      params.append("mbid", mbid);
    } else if (artist && album) {
      params.append("artist", artist);
      params.append("album", album);
    }

    const response = await fetch(`${LASTFM_API_URL}?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error getting album info: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in album info:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
