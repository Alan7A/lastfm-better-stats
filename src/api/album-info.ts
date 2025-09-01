import type { AlbumInfo, AlbumInfoResponse } from "@/types/Albums.types";
import { useQuery } from "@tanstack/react-query";

interface AlbumInfoConfig {
  artist?: string;
  album?: string;
  mbid?: string;
}

export const getAlbumInfo = async (
  config: AlbumInfoConfig
): Promise<AlbumInfo> => {
  const { artist, album, mbid } = config;

  if ((!artist || !album) && !mbid) {
    throw new Error("Either (artist and album) or mbid is required");
  }

  const params = new URLSearchParams();

  if (mbid) {
    params.append("mbid", mbid);
  } else if (artist && album) {
    params.append("artist", artist);
    params.append("album", album);
  }

  const response = await fetch(`/api/album-info?${params}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get album info");
  }

  const data: AlbumInfoResponse = await response.json();
  return data.album;
};

export const useAlbumInfo = (config: AlbumInfoConfig) => {
  const isEnabled = !!(config.mbid || (config.artist && config.album));

  return useQuery({
    queryKey: ["albumInfo", config.artist, config.album, config.mbid],
    queryFn: () => getAlbumInfo(config),
    enabled: isEnabled,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
};
