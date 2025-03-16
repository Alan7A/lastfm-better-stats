import { type NextRequest, NextResponse } from "next/server";
import redaxios from "redaxios";

const LASTFM_URL = "https://www.last.fm/user/";

export async function POST(req: NextRequest) {
  try {
    const { scrobble, username, cookies } = await req.json();

    if (!scrobble || !username) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // TODO: Validar que el token sea válido

    // Construir la URL y los encabezados
    const urlUser = `${LASTFM_URL}${username}`;
    const url = `${urlUser}/library/delete`;

    const headers = {
      Referer: urlUser,
      Cookie: cookies
    };

    const csrfToken = getCookieValueFromText(cookies, "csrftoken") ?? "";

    // Construir el formulario con los datos del scrobble
    const formData = new FormData();
    formData.append("artist_name", scrobble.artist["#text"]);
    formData.append("track_name", scrobble.name);
    formData.append("timestamp", scrobble.date?.uts ?? "0");
    formData.append("csrfmiddlewaretoken", csrfToken);

    // Hacer la solicitud a Last.fm
    const { data } = await redaxios.post(url, formData, { headers });

    return NextResponse.json({ success: true, response: data });
  } catch (error) {
    console.error("Error deleting scrobble:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getCookieValueFromText(cookieText: string, cookieName: string) {
  const cookies = cookieText.split("; ");

  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return value;
    }
  }

  return undefined;
}
