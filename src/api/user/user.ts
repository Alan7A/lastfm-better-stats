import { axios } from "@/axios";
import type { UserResponse } from "@/types/User.types";
import { type QueryClient, useQuery } from "@tanstack/react-query";

export const getUser = async (username: string) => {
  const params = {
    method: "user.getInfo",
    user: username,
  };
  const { data } = await axios.get<UserResponse>("/", { params });

  return data.user;
};

export const useGetUser = (username: string) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(username),
  });
};

// TODO: Change to another file because this is not a hook
export const prefetchUser = async (
  username: string,
  queryClient: QueryClient
) => {
  await queryClient.prefetchQuery({
    queryKey: ["user", username],
    queryFn: () => getUser(username),
  });
};
