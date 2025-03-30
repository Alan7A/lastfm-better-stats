export interface ScrobblesResponse {
  recenttracks: Recenttracks;
}

export interface Recenttracks {
  track: Scrobble[];
  "@attr": RecenttracksAttr;
}

export interface RecenttracksAttr {
  user: string;
  totalPages: string;
  page: string;
  perPage: string;
  total: string;
}

export interface Scrobble {
  artist: Album;
  streamable: string;
  image: Image[];
  mbid: string;
  album: Album;
  name: string;
  "@attr"?: TrackAttr;
  url: string;
  date?: DateClass;
}

export interface TrackAttr {
  nowplaying: string;
}

export interface Album {
  mbid: string;
  "#text": string;
}

export interface DateClass {
  uts: string;
  "#text": string;
}

export interface Image {
  size: string;
  "#text": string;
}

export interface Progress {
  currentPage: number;
  totalPages: number;
  isComplete: boolean;
  isError: boolean;
  isLoading: boolean;
}

export interface ProcessedScrobble {
  track: string;
  artist: string;
  album: string;
  albumId: string;
  date: number;
}
