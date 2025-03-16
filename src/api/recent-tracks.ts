import { axios } from "@/axios";
import type { ScrobblesResponse } from "@/types/Scrobbles.types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface GetRecentTracksConfig {
  username: string;
  limit?: number;
}

export const getRecentTracks = async (config: GetRecentTracksConfig) => {
  const { username, limit = 100 } = config;

  const params = {
    method: "user.getRecentTracks",
    user: username,
    limit
  };

  const { data } = await axios.get<ScrobblesResponse>("/", { params });

  return data.recenttracks.track;
};

export const useGetRecentTracks = (
  config: Omit<GetRecentTracksConfig, "username">
) => {
  const { username } = useParams<{ username: string }>();
  return useQuery({
    queryKey: ["recentTracks", config],
    queryFn: () => getRecentTracks({ ...config, username })
  });
};
