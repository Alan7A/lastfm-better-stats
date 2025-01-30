export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  images: SpotifyImage[];
  name: string;
}

export interface SpotifySearchResponse {
  artists: {
    items: SpotifyArtist[];
  };
}

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    images: SpotifyImage[];
    name: string;
  };
  artists: {
    id: string;
    name: string;
  }[];
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
}

export interface SpotifyTrackSearchResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}
