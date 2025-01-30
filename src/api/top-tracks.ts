import { axios } from "@/axios";
import type { LastFmImage, Period } from "@/types/Common.types";
import type { TopTracksResponse, Track } from "@/types/Tracks";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { SpotifyAPI } from "./spotify";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || "";

interface GetTopTracksConfig {
  username: string;
  period: Period;
  limit?: number;
}

export const getTopTracks = async (config: GetTopTracksConfig) => {
  const { username, period, limit = 10 } = config;

  const params = {
    method: "user.getTopTracks",
    user: username,
    period,
    limit: limit
  };

  const { data } = await axios.get<TopTracksResponse>("/", { params });

  const spotifyApi = new SpotifyAPI(clientId, clientSecret);
  const transformedTracks = await transformTopTracks(data, spotifyApi);

  return transformedTracks;
};

export const useGetTopTracks = (
  config: Omit<GetTopTracksConfig, "username">
) => {
  const { username } = useParams<{ username: string }>();
  return useQuery({
    queryKey: ["topSongs", config],
    queryFn: () => getTopTracks({ ...config, username })
  });
};

const transformTopTracks = async (
  lastFmData: TopTracksResponse,
  spotifyApi: SpotifyAPI
): Promise<Track[]> => {
  const transformedTracks = await Promise.all(
    lastFmData.toptracks.track.map(async (track) => {
      const { image, ...rest } = track;
      const spotifyTrack = await spotifyApi.searchTrack(
        track.name,
        track.artist.name
      );

      if (!spotifyTrack) {
        return track;
      }

      const transformedImages: LastFmImage[] = spotifyTrack.album.images.map(
        (image, i) => ({
          size: i < 1 ? "extralarge" : i < 2 ? "large" : "medium",
          "#text": image.url
        })
      );

      return {
        ...rest,
        image: transformedImages
      };
    })
  );

  return transformedTracks;
};
