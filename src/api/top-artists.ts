import { axios } from "@/axios";
import type { TopsArtistsResponse } from "@/types/Artists.types";
import type { Period } from "@/types/Common.types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface GetTopArtistsConfig {
  username: string;
  preiod: Period;
  limit?: number;
}

export const getTopArtists = async (config: GetTopArtistsConfig) => {
  const { username, preiod, limit = 10 } = config;

  const params = {
    method: "user.getTopArtists",
    user: username,
    period: preiod,
    limit: limit,
  };
  const { data } = await axios.get<TopsArtistsResponse>("/", { params });

  return data.topartists.artist;
};

export const useGetTopArtists = (
  config: Omit<GetTopArtistsConfig, "username">
) => {
  const { username } = useParams<{ username: string }>();
  return useQuery({
    queryKey: ["topArtists", config],
    queryFn: () => getTopArtists({ ...config, username }),
  });
};
