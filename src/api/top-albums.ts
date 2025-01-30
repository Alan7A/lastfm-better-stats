import { axios } from "@/axios";
import type { TopAlbumsResponse } from "@/types/Albums.types";
import type { Period } from "@/types/Common.types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface GetTopAlbumsConfig {
  username: string;
  period: Period;
  limit?: number;
}

export const getTopAlbums = async (config: GetTopAlbumsConfig) => {
  const { username, period, limit = 10 } = config;

  const params = {
    method: "user.getTopAlbums",
    user: username,
    period,
    limit: limit
  };

  const { data } = await axios.get<TopAlbumsResponse>("/", { params });

  return data.topalbums.album;
};

export const useGetTopAlbums = (
  config: Omit<GetTopAlbumsConfig, "username">
) => {
  const { username } = useParams<{ username: string }>();
  return useQuery({
    queryKey: ["topAlbums", config],
    queryFn: () => getTopAlbums({ ...config, username })
  });
};
