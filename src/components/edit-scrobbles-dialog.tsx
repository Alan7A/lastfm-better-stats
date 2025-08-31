"use client";

import { ExternalLink, LoaderCircle, Pencil } from "lucide-react";
import { useFormContext } from "react-hook-form";
import redaxios from "redaxios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import Link from "next/link";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  editAllRecent: boolean;
  setEditAllRecent: (editAllRecent: boolean) => void;
  isPending: boolean;
  username: string;
}

type status = "idle" | "creating" | "success" | "error";

export function EditScrobblesDialog(props: Props) {
  const {
    open,
    setOpen,
    isPending,
    username,
    editAllRecent,
    setEditAllRecent
  } = props;
  const { control } = useFormContext<any>();
  const [status, setStatus] = useState<status>("idle");

  // Open YouTube video in new tab
  const openCsrfVideo = () => {
    window.open("https://www.youtube.com/watch?v=vRBihr41JTo", "_blank");
  };

  const createScrobble = async () => {
    const dummyScrobble = {
      artist: "BLACKPINK",
      track: "Shut Down",
      album: "BORN PINK",
      timestamp: Math.floor(Date.now() / 1000)
    };

    try {
      setStatus("creating");
      await redaxios.post("/api/batch-scrobble", {
        tracks: [dummyScrobble]
      });
      setStatus("success");
    } catch (error) {
      console.error("Error creating scrobble:", error);
      setStatus("error");
    }
  };

  const handleTriggerClick = () => {
    if (editAllRecent) {
      setEditAllRecent(false);
    }
    setOpen(true);
  };

  const ScrobbleButton = () => {
    if (status === "creating") {
      return (
        <Button type="button" variant="link" className="p-0 pl-1" disabled>
          <LoaderCircle className="h-4 w-4 animate-spin" />
        </Button>
      );
    }

    if (status === "success") {
      return (
        <Link href={`https://www.last.fm/user/${username}`} target="_blank">
          <Button type="button" variant="link" className="p-0 pl-1">
            Go to Last.fm
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      );
    }

    if (status === "error") {
      return (
        <Button
          type="button"
          variant="link"
          className="p-0 pl-1"
          onClick={createScrobble}
        >
          Error. Try again
        </Button>
      );
    }

    return (
      <Button
        type="button"
        variant="link"
        className="p-0 pl-1"
        onClick={createScrobble}
      >
        Create mock scrobble
      </Button>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="self-end min-w-[144px]"
          onClick={handleTriggerClick}
        >
          <Pencil />
          Edit scrobbles
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-description="Edit scrobbles">
        <DialogHeader>
          <DialogTitle>
            Edit Scrobbles {editAllRecent ? "(all recent)" : ""}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            <p>
              You need to manually delete a scrobble from your Last.fm account,
              then copy the cookies from the browser and paste them here.
            </p>
            <div className="flex items-center gap-1">
              <span>How to get cookies to edit scrobbles?</span>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0"
                onClick={openCsrfVideo}
              >
                Learn more <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
            {ScrobbleButton()}
          </div>
        </DialogHeader>
        <FormField
          control={control}
          name="cookies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cookies</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste cookies here"
                  {...field}
                  rows={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            form="edit-scrobbles-form"
            type="submit"
            className="min-w-[82px]"
          >
            {isPending ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Pencil />
                Edit
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
