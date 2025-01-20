export type Period =
  | "overall"
  | "7day"
  | "1month"
  | "3month"
  | "6month"
  | "12month";

export interface LastFmImage {
  size: LastFmImageSize;
  "#text": string;
}

export type LastFmImageSize =
  | "extralarge"
  | "large"
  | "medium"
  | "mega"
  | "small";

export type ImageSize = "small" | "medium" | "large";
