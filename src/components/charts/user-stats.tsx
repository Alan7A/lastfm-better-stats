"use client";
import { useGetScrobbles } from "@/api/scrobbles";
import { useGetUser } from "@/api/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { format, fromUnixTime } from "date-fns";
import { BarChart2, Disc, Music, User, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { ProgressIndicator } from "../ui/progress-indicator";

interface Props {
  className?: string;
}

const UserStats = (props: Props) => {
  const { className } = props;
  const { username } = useParams<{ username: string }>();
  const { data: user } = useGetUser(username);
  const { calculateTimeRemaining, progress } = useGetScrobbles(user);

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
          Member since {format(fromUnixTime(+registered.unixtime), "P")}
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

        <div className="space-y-6">
          <ProgressIndicator
            progress={progress}
            totalScrobbles={+user.playcount || progress.currentPage * 1000}
            timeRemaining={calculateTimeRemaining()}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default UserStats;
