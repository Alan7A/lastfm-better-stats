"use client";

import { useAlbumInfo } from "@/api/album-info";
import { useAlbumSearch } from "@/api/album-search";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { AlbumTrack, SearchAlbum } from "@/types/Albums.types";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Music, PlayCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface Props {
  isAuthenticated: boolean;
  username: string;
}

const searchFormSchema = z.object({
  albumQuery: z.string().min(1, { message: "Album name is required" })
});

const timestampFormSchema = z.object({
  timestamp: z.string().optional()
});

type SearchFormData = z.infer<typeof searchFormSchema>;
type TimestampFormData = z.infer<typeof timestampFormSchema>;

const ScrobbleAlbum = (props: Props) => {
  const { isAuthenticated } = props;
  const [selectedAlbum, setSelectedAlbum] = useState<SearchAlbum | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [isScrobbling, setIsScrobbling] = useState(false);
  const [parent] = useAutoAnimate();

  const searchForm = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      albumQuery: ""
    }
  });

  const timestampForm = useForm<TimestampFormData>({
    resolver: zodResolver(timestampFormSchema),
    defaultValues: {
      timestamp: ""
    }
  });

  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: searchResults = [],
    isLoading: isSearching,
    error: searchError
  } = useAlbumSearch({
    album: searchQuery,
    limit: 10
  });

  const {
    data: albumInfo,
    isLoading: isLoadingAlbumInfo,
    error: albumInfoError
  } = useAlbumInfo({
    artist: selectedAlbum?.artist,
    album: selectedAlbum?.name,
    mbid: selectedAlbum?.mbid
  });

  const tracks = albumInfo?.tracks?.track || [];

  const selectedTracksCount = selectedTracks.size;
  const allTracksSelected =
    tracks.length > 0 && selectedTracks.size === tracks.length;

  const scrobbleButtonText = useMemo(() => {
    if (selectedTracksCount === 0) return "Scrobble Album";
    if (selectedTracksCount === tracks.length) return "Scrobble Album";
    return `Scrobble Selected (${selectedTracksCount})`;
  }, [selectedTracksCount, tracks.length]);

  const handleSelectAlbum = (album: SearchAlbum) => {
    setSelectedAlbum(album);
    setSelectedTracks(new Set());
  };

  const handleBackToSearch = () => {
    setSelectedAlbum(null);
    setSelectedTracks(new Set());
  };

  const handleSearch = (data: SearchFormData) => {
    setSearchQuery(data.albumQuery);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const formData = searchForm.getValues();
      handleSearch(formData);
    }
  };

  const toggleTrackSelection = (trackName: string) => {
    const newSelection = new Set(selectedTracks);
    if (newSelection.has(trackName)) {
      newSelection.delete(trackName);
    } else {
      newSelection.add(trackName);
    }
    setSelectedTracks(newSelection);
  };

  const toggleSelectAll = () => {
    if (allTracksSelected) {
      setSelectedTracks(new Set());
    } else {
      setSelectedTracks(new Set(tracks.map((track) => track.name)));
    }
  };

  const formatDuration = (duration: string) => {
    const seconds = Number.parseInt(duration, 10);
    if (Number.isNaN(seconds) || seconds === 0) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getImageUrl = (images: any[]) => {
    if (!images || images.length === 0) return null;
    // Try to get medium or large image, fallback to any available
    const preferredImage =
      images.find((img) => img.size === "medium" || img.size === "large") ||
      images[0];
    return preferredImage?.["#text"] || null;
  };

  const scrobbleTrack = async (track: AlbumTrack, customTimestamp?: number) => {
    const timestampData = timestampForm.getValues();
    const timestamp =
      customTimestamp ||
      (timestampData.timestamp
        ? Math.floor(new Date(timestampData.timestamp).getTime() / 1000)
        : undefined);

    const payload = {
      artist: track.artist.name,
      track: track.name,
      timestamp
    };

    const response = await fetch("/api/manual-scrobble", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to scrobble track");
    }

    return result;
  };

  const handleScrobbleIndividual = async (track: AlbumTrack) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to scrobble tracks");
      return;
    }

    setIsScrobbling(true);

    try {
      await scrobbleTrack(track);
      toast.success(`"${track.name}" scrobbled successfully!`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to scrobble track"
      );
    } finally {
      setIsScrobbling(false);
    }
  };

  const handleScrobbleSelected = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to scrobble tracks");
      return;
    }

    const tracksToScrobble =
      selectedTracksCount === 0
        ? tracks
        : tracks.filter((track) => selectedTracks.has(track.name));

    if (tracksToScrobble.length === 0) {
      toast.error("No tracks to scrobble");
      return;
    }

    setIsScrobbling(true);

    try {
      const timestampData = timestampForm.getValues();
      const baseTimestamp = timestampData.timestamp
        ? Math.floor(new Date(timestampData.timestamp).getTime() / 1000)
        : Math.floor(Date.now() / 1000);

      // Scrobble tracks in reverse order (oldest first) with different timestamps
      const promises = tracksToScrobble.reverse().map((track, index) => {
        const trackTimestamp = baseTimestamp - index * 300; // 5 minutes apart
        return scrobbleTrack(track, trackTimestamp);
      });

      await Promise.all(promises);

      const message =
        selectedTracksCount === 0
          ? `Album "${albumInfo?.name}" scrobbled successfully!`
          : `${tracksToScrobble.length} tracks scrobbled successfully!`;

      toast.success(message);
      setSelectedTracks(new Set());
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to scrobble tracks"
      );
    } finally {
      setIsScrobbling(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Scrobble album
          </CardTitle>
          <CardDescription>
            Search and scrobble entire albums or individual tracks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            You must be logged in with Last.fm to use this feature.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Scrobble album
        </CardTitle>
        <CardDescription>
          Search and scrobble entire albums or individual tracks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6" ref={parent}>
        {!selectedAlbum ? (
          <>
            {/* Search Form */}
            <Form {...searchForm}>
              <form
                onSubmit={searchForm.handleSubmit(handleSearch)}
                className="flex gap-2"
              >
                <FormField
                  control={searchForm.control}
                  name="albumQuery"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Search for an album..."
                          {...field}
                          disabled={isSearching}
                          onKeyDown={handleSearchKeyDown}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="icon"
                  disabled={
                    isSearching || !searchForm.watch("albumQuery").trim()
                  }
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </Form>

            {/* Search Results */}
            {isSearching && (
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }, () => (
                  <div
                    key={crypto.randomUUID()}
                    className="flex items-center space-x-3 p-3 rounded-lg border"
                  >
                    <Skeleton className="h-16 w-16 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchError && (
              <div className="text-sm text-destructive">
                Error searching albums: {searchError.message}
              </div>
            )}

            {searchResults.length > 0 && !isSearching && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Search Results</h3>
                <div className="grid grid-cols-2 gap-3">
                  {searchResults.map((album) => (
                    <div
                      key={`${album.artist}-${album.name}-${album.mbid || album.url}`}
                      className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => handleSelectAlbum(album)}
                    >
                      <div className="h-16 w-16 rounded bg-muted flex items-center justify-center overflow-hidden">
                        {getImageUrl(album.image) ? (
                          <img
                            src={getImageUrl(album.image) || ""}
                            alt={`${album.name} cover`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Music className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{album.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {album.artist}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchQuery.trim() &&
              !isSearching &&
              searchResults.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No albums found for "{searchQuery}"
                </div>
              )}
          </>
        ) : (
          <>
            {/* Selected Album Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 rounded bg-muted flex items-center justify-center overflow-hidden">
                  {getImageUrl(selectedAlbum.image) ? (
                    <img
                      src={getImageUrl(selectedAlbum.image) || ""}
                      alt={`${selectedAlbum.name} cover`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Music className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedAlbum.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedAlbum.artist}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleBackToSearch}>
                Back to Search
              </Button>
            </div>

            {/* Timestamp Form */}
            <Form {...timestampForm}>
              <FormField
                control={timestampForm.control}
                name="timestamp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scrobble Timestamp (empty for current time)</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        placeholder="Leave empty for current time"
                        {...field}
                        disabled={isScrobbling}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>

            {/* Album Tracks */}
            {isLoadingAlbumInfo && (
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                {Array.from({ length: 5 }, () => (
                  <div
                    key={crypto.randomUUID()}
                    className="flex items-center space-x-3 p-3 rounded-lg border"
                  >
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            )}

            {albumInfoError && (
              <div className="text-sm text-destructive">
                Error loading album info: {albumInfoError.message}
              </div>
            )}

            {tracks.length > 0 && !isLoadingAlbumInfo && (
              <div className="space-y-4">
                <Button
                  onClick={handleScrobbleSelected}
                  disabled={isScrobbling}
                  className="w-full"
                >
                  {isScrobbling ? "Scrobbling..." : scrobbleButtonText}
                </Button>

                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Album Tracks</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSelectAll}
                    disabled={isScrobbling}
                  >
                    {allTracksSelected ? "Deselect All" : "Select All"}
                  </Button>
                </div>

                <div className="space-y-2">
                  {tracks.map((track) => (
                    <div
                      key={`${track.name}-${track.url || track["@attr"]?.rank}`}
                      className="flex items-center space-x-3 p-3 rounded-lg border"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTracks.has(track.name)}
                        onChange={() => toggleTrackSelection(track.name)}
                        disabled={isScrobbling}
                        className="rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.name}</p>
                      </div>
                      {track.duration && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDuration(track.duration)}
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleScrobbleIndividual(track)}
                        disabled={isScrobbling}
                      >
                        <PlayCircle className="h-4 w-4 mr-1" />
                        Scrobble
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {albumInfo && tracks.length === 0 && !isLoadingAlbumInfo && (
              <div className="text-sm text-muted-foreground text-center py-4">
                No tracks found for this album
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ScrobbleAlbum;
