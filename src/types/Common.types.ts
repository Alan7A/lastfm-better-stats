export type Period =
  | "overall"
  | "7day"
  | "1month"
  | "3month"
  | "6month"
  | "12month";

export type Limit = "10" | "25" | "50" | "100" | "250" | "500" | "1000";

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
