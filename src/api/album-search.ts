import type { AlbumSearchResponse, SearchAlbum } from "@/types/Albums.types";
import { useQuery } from "@tanstack/react-query";

interface AlbumSearchConfig {
  album: string;
  limit?: number;
}

export const searchAlbums = async (
  config: AlbumSearchConfig
): Promise<SearchAlbum[]> => {
  const { album, limit = 10 } = config;

  if (!album.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    album: album.trim(),
    limit: limit.toString()
  });

  const response = await fetch(`/api/album-search?${params}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to search albums");
  }

  const data: AlbumSearchResponse = await response.json();
  return data.results?.albummatches?.album || [];
};

export const useAlbumSearch = (config: AlbumSearchConfig) => {
  return useQuery({
    queryKey: ["albumSearch", config.album, config.limit],
    queryFn: () => searchAlbums(config),
    enabled: !!config.album.trim(),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};
