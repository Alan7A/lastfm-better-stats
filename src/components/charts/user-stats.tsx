"use client";
import { useGetUser } from "@/api/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { BarChart2, Disc, Music, User, Users } from "lucide-react";
import { useParams } from "next/navigation";

interface Props {
  className?: string;
}

const UserStats = (props: Props) => {
  const { className } = props;
  dayjs.extend(localizedFormat);
  const { username } = useParams<{ username: string }>();
  const { data: user } = useGetUser(username);

  if (!user) return <p>Loading...</p>;

  const {
    name,
    playcount,
    artist_count,
    track_count,
    album_count,
    registered
  } = user;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {name}
        </CardTitle>
        <CardDescription>
          Member since {dayjs(registered.unixtime).format("L")}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Scrobbles</span>
            </div>
            <p className="text-2xl font-bold">{playcount.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Artists</span>
            </div>
            <p className="text-2xl font-bold">
              {artist_count.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Disc className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Albums</span>
            </div>
            <p className="text-2xl font-bold">{album_count.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tracks</span>
            </div>
            <p className="text-2xl font-bold">{track_count.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;
