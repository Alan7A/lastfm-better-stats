import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Artist } from "@/types/Artists.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const transformTopArtists = (artists: Artist[]) => {
  return artists.map((artist) => ({
    name: artist.name,
    playcount: artist.playcount,
  }));
};
