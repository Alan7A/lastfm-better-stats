import { axios } from "@/axios";
import type { Artist, TopsArtistsResponse } from "@/types/Artists.types";
import type { LastFmImage, Period } from "@/types/Common.types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { SpotifyAPI } from "./spotify";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || "";

interface GetTopArtistsConfig {
  username: string;
  period: Period;
  limit?: number;
}

export const getTopArtists = async (config: GetTopArtistsConfig) => {
  const { username, period, limit = 10 } = config;

  const params = {
    method: "user.getTopArtists",
    user: username,
    period,
    limit: limit
  };

  const { data } = await axios.get<TopsArtistsResponse>("/", { params });

  const spotifyApi = new SpotifyAPI(clientId, clientSecret);
  const transformedArtists = await transformLastFmArtists(data, spotifyApi);

  return transformedArtists;
};

export const useGetTopArtists = (
  config: Omit<GetTopArtistsConfig, "username">
) => {
  const { username } = useParams<{ username: string }>();
  return useQuery({
    queryKey: ["topArtists", config],
    queryFn: () => getTopArtists({ ...config, username })
  });
};

async function transformLastFmArtists(
  lastFmData: TopsArtistsResponse,
  spotifyApi: SpotifyAPI
): Promise<Artist[]> {
  const transformedArtists = await Promise.all(
    lastFmData.topartists.artist.map(async (artist) => {
      const images = await spotifyApi.searchArtist(artist.name);

      if (!images) {
        return artist;
      }

      return {
        ...artist,
        images
      };
    })
  );

  return transformedArtists;
}
