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

export interface Artist {
  streamable: string;
  image: Image[];
  mbid: string;
  url: string;
  playcount: string;
  "@attr": ArtistAttr;
  name: string;
}

export interface ArtistAttr {
  rank: string;
}

export interface Image {
  size: Size;
  "#text": string;
}

export type Size = "extralarge" | "large" | "medium" | "mega" | "small";
