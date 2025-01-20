import type { Artist } from "@/types/Artists.types";
import type { ImageSize, LastFmImage } from "@/types/Common.types";
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
  images: Artist["images"],
  size: ImageSize = "medium"
) => {
  switch (size) {
    case "small":
      return images[2].url;
    case "medium":
      return images[1].url;
    case "large":
      return images[0].url;
    default:
      return images[0].url;
  }
};
