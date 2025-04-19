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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Scrobble } from "@/types/Scrobbles.types";
import { format, formatDistanceToNow, isYesterday } from "date-fns";
import { Clock, LoaderCircle, TextSearch, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

// Types and constants
interface Props {
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
  handleTrackSelect: (track: Scrobble | EditedScrobble) => void;
}

export interface EditedScrobble {
  originalTrack: string;
  originalAlbum: string;
  originalArtist: string;
  correctedTrack: string;
  correctedAlbum: string;
  correctedArtist: string;
  timestamp: number;
}

const STORAGE_KEY = "betterlastfmstats_edited_scrobbles";

// Helper functions
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

  if (diffHours < 24) {
    return `${formatDistanceToNow(date, { addSuffix: true }).replace("about ", "")}, ${format(date, "h:mm a")}`;
  }
  if (isYesterday(date)) {
    return `Yesterday, ${format(date, "h:mm a")}`;
  }
  return format(date, "MMM d, h:mm a");
};

const getRecentEdits = (): EditedScrobble[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored
      ? JSON.parse(stored).sort(
          (a: EditedScrobble, b: EditedScrobble) => b.timestamp - a.timestamp
        )
      : [];
  } catch (error) {
    console.error("Error reading edited scrobbles:", error);
    return [];
  }
};

const deleteEdit = (edit: EditedScrobble) => {
  try {
    const edits = getRecentEdits();
    const filteredEdits = edits.filter(
      (e) =>
        e.originalTrack !== edit.originalTrack ||
        e.originalAlbum !== edit.originalAlbum ||
        e.originalArtist !== edit.originalArtist
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEdits));
    return filteredEdits;
  } catch (error) {
    console.error("Error deleting edit:", error);
    return [];
  }
};

const RecentTracksDialog = (props: Props) => {
  const { handleTrackSelect, isDialogOpen, setIsDialogOpen } = props;
  const { data: recentTracks, isLoading } = useGetRecentTracks({});
  const [recentEdits, setRecentEdits] = useState<EditedScrobble[]>([]);

  useEffect(() => {
    if (isDialogOpen) {
      setRecentEdits(getRecentEdits());
    }
  }, [isDialogOpen]);

  const handleDeleteEdit = (edit: EditedScrobble) => {
    const updatedEdits = deleteEdit(edit);
    setRecentEdits(updatedEdits);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary" className="self-start">
          <TextSearch />
          Select from recent tracks
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px] max-h-[80vh]"
        aria-description="Select from recent tracks"
      >
        <DialogHeader>
          <DialogTitle>Recent scrobbles</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="recent">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tracks">Recent Tracks</TabsTrigger>
            <TabsTrigger value="edits">Recent Edits</TabsTrigger>
          </TabsList>
          <TabsContent value="tracks">
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
                        {track.date
                          ? formatDate(Number.parseInt(track.date.uts) * 1000)
                          : "Scrobbling now..."}
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
          </TabsContent>
          <TabsContent value="edits">
            <ScrollArea className="h-[500px] w-full rounded border p-2">
              {recentEdits.length > 0 ? (
                <>
                  {recentEdits.map((edit, index) => (
                    <div
                      key={`${edit.originalTrack}-${index}`}
                      className="flex items-center justify-between gap-4 p-2 rounded hover:bg-primary/10 duration-300"
                    >
                      <div
                        className="flex items-center flex-1 space-x-4 cursor-pointer"
                        onClick={() => handleTrackSelect(edit)}
                      >
                        <div>
                          <h3 className="font-semibold">
                            {edit.originalTrack}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {edit.originalArtist}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ➜ {edit.correctedTrack} - {edit.correctedArtist}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {formatDate(edit.timestamp)}
                          <Clock className="h-4 w-4" />
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEdit(edit)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <p>No edited tracks found</p>
                  <p className="text-sm">
                    Edit some tracks to see them appear here
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RecentTracksDialog;
