import type { LastFmImageSize } from "./Common.types";

export interface TopAlbumsResponse {
  topalbums: Topalbums;
}

export interface Topalbums {
  album: Album[];
  "@attr": TopalbumsAttr;
}

export interface TopalbumsAttr {
  user: string;
  totalPages: string;
  page: string;
  perPage: string;
  total: string;
}

export interface Album {
  artist: Artist;
  image: Image[];
  mbid: string;
  url: string;
  playcount: string;
  "@attr": AlbumAttr;
  name: string;
}

export interface AlbumAttr {
  rank: string;
}

export interface Artist {
  url: string;
  name: string;
  mbid: string;
}

export interface Image {
  size: LastFmImageSize;
  "#text": string;
}
