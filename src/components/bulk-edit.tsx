"use client";
import { useEditScrobbles } from "@/api/edit-scrobbles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { Scrobble } from "@/types/Scrobbles.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { EditScrobblesDialog } from "./edit-scrobbles-dialog";
import RecentTracksDialog, {
  type EditedScrobble
} from "./tools/recent-tracks-dialog";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "./ui/form";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip";

interface Props {
  isAuthenticated: boolean;
  username: string;
}

const STORAGE_KEY = "betterlastfmstats_edited_scrobbles";
const COOKIES_KEY = "betterlastfmstats_cookies";

// TODO:
// - El reset parece que no funciona
// - Usar barra de progreso en vez de spinner o mostrar progreso (ej. 1/7 edits)
// - Mejorar explicación sobre cómo obtener cookies
// - Tal vez mejorar el diseño general

const getEditedScrobbles = (): EditedScrobble[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading edited scrobbles:", error);
    return [];
  }
};

const saveEditedScrobble = (scrobble: Omit<EditedScrobble, "timestamp">) => {
  try {
    const editedScrobbles = getEditedScrobbles();
    const existingIndex = editedScrobbles.findIndex(
      (item) =>
        item.originalTrack === scrobble.originalTrack &&
        item.originalAlbum === scrobble.originalAlbum &&
        item.originalArtist === scrobble.originalArtist
    );

    const newScrobble = {
      ...scrobble,
      timestamp: Date.now()
    };

    if (existingIndex !== -1) {
      editedScrobbles[existingIndex] = newScrobble;
    } else {
      editedScrobbles.push(newScrobble);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(editedScrobbles));
  } catch (error) {
    console.error("Error saving edited scrobble:", error);
  }
};

export const EditScrobblesSchema = z.object({
  originalTrack: z.string().min(1),
  originalAlbum: z.string().min(1),
  originalArtist: z.string().min(1),
  correctedTrack: z.string().min(1),
  correctedAlbum: z.string().min(1),
  correctedArtist: z.string().min(1),
  cookies: z.string().min(1, "Last.fm cookies are required")
});

const BulkEdit = (props: Props) => {
  const { isAuthenticated, username } = props;
  const { push } = useRouter();
  const [tracksDialogOpen, setTracksDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { mutateAsync: editScrobbles, isPending } = useEditScrobbles();

  // State to hold the cookies value, initialized to an empty string
  const [storedCookies, setStoredCookies] = useState("");

  // Use useEffect to get the cookies after the component has mounted
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure we are in the browser environment
      const cookies = localStorage.getItem(COOKIES_KEY) || "";
      setStoredCookies(cookies);
    }
  }, []);

  const form = useForm<z.infer<typeof EditScrobblesSchema>>({
    resolver: zodResolver(EditScrobblesSchema),
    defaultValues: {
      cookies: storedCookies // Use the state variable here
    }
  });
  const { handleSubmit, control, reset, setValue } = form;

  // Update the form's cookies value when the storedCookies state changes
  useEffect(() => {
    setValue("cookies", storedCookies);
  }, [storedCookies, setValue]);

  const handleTrackSelect = (track: Scrobble | EditedScrobble) => {
    setTracksDialogOpen(false);
    if ("timestamp" in track) {
      // Recent edit
      reset({
        originalTrack: track.originalTrack,
        originalAlbum: track.originalAlbum,
        originalArtist: track.originalArtist,
        correctedTrack: track.correctedTrack,
        correctedAlbum: track.correctedAlbum,
        correctedArtist: track.correctedArtist,
        cookies: storedCookies
      });
    } else {
      // Recent track
      reset({
        originalTrack: track.name,
        originalAlbum: track.album["#text"],
        originalArtist: track.artist["#text"],
        correctedTrack: track.name,
        correctedAlbum: track.album["#text"],
        correctedArtist: track.artist["#text"],
        cookies: storedCookies
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof EditScrobblesSchema>) => {
    const { cookies } = data;
    try {
      localStorage.setItem(COOKIES_KEY, cookies);
      const scrobbled = await editScrobbles({ scrobbleInfo: data, username });
      saveEditedScrobble(data);

      // Reset form with explicit empty values but preserve cookies
      reset({
        originalTrack: "",
        originalAlbum: "",
        originalArtist: "",
        correctedTrack: "",
        correctedAlbum: "",
        correctedArtist: "",
        cookies: cookies // Preserve cookies value
      });

      toast.success(`${scrobbled} scrobbles edited successfully`, {});
    } catch (error) {
      console.error("Error editing scrobbles:", error);
      toast.error("Error editing scrobbles", {});
    } finally {
      setEditDialogOpen(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST"
      });
      window.location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const unauthenticatedNode = (
    <div className="flex flex-col gap-4 items-center">
      <Separator />
      <h2 className="text-xl font-semibold  mt-2">Unauthenticated</h2>
      <p>You need to be authenticated to use this feature.</p>
      <Button
        onClick={() => {
          push("/api/auth/lastfm");
        }}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
      >
        Login with Last.fm
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <p>Bulk edit scrobbles</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-5 h-5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Only scrobbles from the last 14 days can be edited</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {isAuthenticated && (
            <div className="flex gap-2 text-sm text-muted-foreground font-normal items-center">
              <p>
                Logged in as <b>{username}</b>
              </p>
              <span>-</span>
              <Button
                className="text-foreground p-0"
                variant="link"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          Fix wrong scrobbles with the bulk edit tool
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAuthenticated ? (
          <Form {...form}>
            <form
              id="edit-scrobbles-form"
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-2 gap-8"
            >
              <div className="flex flex-col gap-2 ">
                <p className="text-xl font-semibold">Original track</p>
                <FormField
                  control={control}
                  name="originalTrack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="originalAlbum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Album</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="originalArtist"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel>Artist</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <RecentTracksDialog
                  handleTrackSelect={handleTrackSelect}
                  isDialogOpen={tracksDialogOpen}
                  setIsDialogOpen={setTracksDialogOpen}
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xl font-semibold">Corrected track</p>
                <FormField
                  control={control}
                  name="correctedTrack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="correctedAlbum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Album</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="correctedArtist"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <FormLabel>Artist</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <EditScrobblesDialog
                  open={editDialogOpen}
                  setOpen={setEditDialogOpen}
                  isPending={isPending}
                  username={username}
                />
              </div>
            </form>
          </Form>
        ) : (
          unauthenticatedNode
        )}
      </CardContent>
    </Card>
  );
};

export default BulkEdit;
