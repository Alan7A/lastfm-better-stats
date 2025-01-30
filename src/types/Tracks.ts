import type { LastFmImage } from "./Common.types";

export interface TopTracksResponse {
  toptracks: Toptracks;
}

export interface Toptracks {
  track: Track[];
  "@attr": ToptracksAttr;
}

export interface ToptracksAttr {
  user: string;
  totalPages: string;
  page: string;
  perPage: string;
  total: string;
}

export interface Track {
  streamable: Streamable;
  mbid: string;
  name: string;
  image: LastFmImage[];
  artist: Artist;
  url: string;
  duration: string;
  "@attr": TrackAttr;
  playcount: string;
}

export interface TrackAttr {
  rank: string;
}

export interface Artist {
  url: string;
  name: string;
  mbid: string;
}

export interface Streamable {
  fulltrack: string;
  "#text": string;
}
