import type { Artist } from "@/types/Artists.types";
import type { LastFmImage, LastFmImageSize } from "@/types/Common.types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const transformTopArtists = (artists: Artist[]) => {
  return artists.map((artist) => ({
    name: artist.name,
    playcount: artist.playcount
  }));
};

export const getImageUrl = (
  images: LastFmImage[],
  size: LastFmImageSize = "extralarge"
) => {
  const image = images.find((image) => image.size === size);
  return image ? image["#text"] : "";
};

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
