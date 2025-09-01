import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const album = searchParams.get("album");
    const limit = searchParams.get("limit") || "10";

    if (!album) {
      return NextResponse.json(
        { error: "Album parameter is required" },
        { status: 400 }
      );
    }

    const LASTFM_API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY as string;
    const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";

    const params = new URLSearchParams({
      method: "album.search",
      album,
      api_key: LASTFM_API_KEY,
      format: "json",
      limit
    });

    const response = await fetch(`${LASTFM_API_URL}?${params}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Error searching albums: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in album search:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
