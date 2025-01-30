import type { LastFmImage } from "./Common.types";

export interface TopArtistsResponse {
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

export interface Artist {
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
