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

// Album Search Types
export interface AlbumSearchResponse {
  results: {
    albummatches: {
      album: SearchAlbum[];
    };
    "@attr": {
      for: string;
    };
  };
}

export interface SearchAlbum {
  name: string;
  artist: string;
  url: string;
  image: Image[];
  streamable: string;
  mbid: string;
}

// Album Info Types
export interface AlbumInfoResponse {
  album: AlbumInfo;
}

export interface AlbumInfo {
  name: string;
  artist: string;
  url: string;
  image: Image[];
  listeners: string;
  playcount: string;
  tracks: {
    track: AlbumTrack[];
  };
  tags: {
    tag: Tag[];
  };
  wiki?: {
    published: string;
    summary: string;
    content: string;
  };
  mbid: string;
}

export interface AlbumTrack {
  name: string;
  url: string;
  duration: string;
  "@attr": {
    rank: string;
  };
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  streamable: {
    "#text": string;
    fulltrack: string;
  };
}

export interface Tag {
  name: string;
  url: string;
}
