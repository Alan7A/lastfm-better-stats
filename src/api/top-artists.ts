import { axios } from "@/axios";
import type { Artist, TopArtistsResponse } from "@/types/Artists.types";
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

  const { data } = await axios.get<TopArtistsResponse>("/", { params });

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
  lastFmData: TopArtistsResponse,
  spotifyApi: SpotifyAPI
): Promise<Artist[]> {
  const transformedArtists = await Promise.all(
    lastFmData.topartists.artist.map(async (artist) => {
      const { image, ...rest } = artist;
      const spotifyArtist = await spotifyApi.searchArtist(artist.name);

      if (!spotifyArtist) {
        return artist;
      }

      const transformedImages: LastFmImage[] = spotifyArtist.images.map(
        (image, i) => ({
          size: i < 1 ? "medium" : i < 2 ? "large" : "extralarge",
          "#text": image.url
        })
      );

      return {
        ...rest,
        image: transformedImages
      };
    })
  );

  return transformedArtists;
}
