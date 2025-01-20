import type { LastFmImage } from "./Common.types";
import type { SpotifyImage } from "./Spotify.types";

export interface Artist extends Omit<LastFmArtist, "image"> {
  images: SpotifyImage[];
}

export interface TopsArtistsResponse {
  topartists: TopArtists;
}

export interface TopArtists {
  artist: Artist[];
  "@attr": TopArtistsAttr;
}

export interface TopArtistsAttr {
  user: string;
  totalPages: string;
  page: string;
  perPage: string;
  total: string;
}

export interface LastFmArtist {
  streamable: string;
  image: LastFmImage[];
  mbid: string;
  url: string;
  playcount: string;
  "@attr": ArtistAttr;
  name: string;
}

export interface ArtistAttr {
  rank: string;
}
