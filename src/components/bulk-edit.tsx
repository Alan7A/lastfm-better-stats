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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { EditScrobblesDialog } from "./edit-scrobbles-dialog";
import RecentTracksDialog from "./tools/recent-tracks-dialog";
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

// TODO:
// - Guardar cookies en local storage y usar como default value
// - Mejorar explicación sobre cómo obtener cookies
// - Agregar botón para crear un scrobble de prueba para borrar y obtener cookies
// - Implementar una lista de historial de edits con local storage
// - Tal vez mejorar el diseño general

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
  const form = useForm<z.infer<typeof EditScrobblesSchema>>({
    resolver: zodResolver(EditScrobblesSchema)
  });
  const { handleSubmit, control, reset } = form;

  const handleTrackSelect = (track: Scrobble) => {
    setTracksDialogOpen(false);
    reset({
      originalTrack: track.name,
      originalAlbum: track.album["#text"],
      originalArtist: track.artist["#text"],
      correctedTrack: track.name,
      correctedAlbum: track.album["#text"],
      correctedArtist: track.artist["#text"]
    });
  };

  const onSubmit = async (data: z.infer<typeof EditScrobblesSchema>) => {
    await editScrobbles({ scrobbleInfo: data, username });
    reset();
    setEditDialogOpen(false);
    toast.success("Scrobbles edited successfully", {});
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
            <div className="flex gap-2 text-sm text-muted-foreground font-normal">
              <p>
                Logged in as <b>{username}</b>
              </p>
              <span>-</span>
              <Link className="hover:underline" href="#">
                Logout
              </Link>
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
