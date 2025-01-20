import type {
  SpotifyImage,
  SpotifySearchResponse,
  SpotifyTokenResponse
} from "@/types/Spotify.types";

// Spotify API is used to fetch images since Last.fm doesn't provide them
export class SpotifyAPI {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiration = 0;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiration) {
      return this.accessToken;
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`
      },
      body: "grant_type=client_credentials"
    });

    const data: SpotifyTokenResponse = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiration = Date.now() + data.expires_in * 1000;
    return this.accessToken;
  }

  async searchArtist(artistName: string): Promise<SpotifyImage[] | null> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data: SpotifySearchResponse = await response.json();
      const artist = data.artists.items[0];

      if (!artist || !artist.images.length) {
        return null;
      }

      return artist.images;
    } catch (error) {
      console.error("Error fetching Spotify image:", error);
      return null;
    }
  }
}
