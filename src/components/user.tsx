"use client";

import { getUser } from "@/api/user/user";
import { useQuery } from "@tanstack/react-query";
import UserPage from "./test";

interface Props {
  user: string;
}

const User = (props: Props) => {
  const { user: username } = props;
  const { data: user } = useQuery({
    queryKey: ["user", username],
    queryFn: () => getUser(username)
  });

  console.log(user);

  return (
    <div>
      <UserPage />
    </div>
  );
};

export default User;
