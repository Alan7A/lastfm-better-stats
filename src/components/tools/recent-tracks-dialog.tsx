import { useGetRecentTracks } from "@/api/recent-tracks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Scrobble } from "@/types/Scrobbles.types";
import { format, formatDistanceToNow, isYesterday } from "date-fns";
import { Clock, LoaderCircle, TextSearch } from "lucide-react";
import Image from "next/image";

interface Props {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  handleTrackSelect: (track: Scrobble) => void;
}

// Función auxiliar para formatear la fecha
const formatDate = (uts: string) => {
  const date = new Date(Number.parseInt(uts) * 1000); // Convertir UTS a milisegundos
  const now = new Date();
  const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5; // Diferencia en horas

  if (diffHours < 24) {
    return `${formatDistanceToNow(date, { addSuffix: true }).replace("about ", "")}, ${format(date, "h:mm a")}`;
  }
  if (isYesterday(date)) {
    return `Ayer, ${format(date, "h:mm a")}`;
  }
  return format(date, "MMM d, h:mm a");
};

const RecentTracksDialog = (props: Props) => {
  const { handleTrackSelect, isDialogOpen, setIsDialogOpen } = props;
  const { data: recentTracks, isLoading } = useGetRecentTracks({});

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary" className="self-start">
          <TextSearch />
          Select from recent tracks
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Recent scrobbles</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] w-full rounded border p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 min-h-[920px]">
              <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : recentTracks && recentTracks.length > 0 ? (
            <>
              {recentTracks.map((track) => (
                <div
                  key={track.date?.uts ?? track.name}
                  className="flex items-center justify-between gap-4 cursor-pointer p-2 rounded hover:bg-primary/10 duration-300"
                  onClick={() => handleTrackSelect(track)}
                >
                  <div className="flex items-center flex-1 space-x-4">
                    <Image
                      unoptimized
                      src={track.image[2]["#text"] || "/placeholder.svg"}
                      alt={track.name}
                      width={44}
                      height={44}
                      className="rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{track.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {track.artist["#text"]}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {track.date ? formatDate(track.date.uts) : "Unknown date"}
                    <Clock className="h-4 w-4" />
                  </p>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p>No tracks found</p>
              <p className="text-sm">
                Listen to some music to see your recent tracks
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecentTracksDialog;
