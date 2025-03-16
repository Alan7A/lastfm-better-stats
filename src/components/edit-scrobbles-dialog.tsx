"use client";

import { ExternalLink, LoaderCircle, Pencil } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "./ui/textarea";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  isPending: boolean;
}

export function EditScrobblesDialog(props: Props) {
  const { open, setOpen, isPending } = props;
  const { control } = useFormContext<any>();

  // Open YouTube video in new tab
  const openCsrfVideo = () => {
    window.open("https://www.youtube.com/watch?v=vRBihr41JTo", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="self-end min-w-[144px]">
          <Pencil />
          Edit scrobbles
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Scrobbles</DialogTitle>
          <DialogDescription>
            You need to manually delete a scrobble from your Last.fm account,
            then copy the cookies from the browser and paste them here.
          </DialogDescription>
        </DialogHeader>
        <FormField
          control={control}
          name="cookies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cookies</FormLabel>
              <FormControl>
                <Textarea placeholder="Paste cookies here" {...field} />
              </FormControl>
              <FormDescription className="flex items-center gap-1">
                <span>How to get cookies to edit scrobbles?</span>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0"
                  onClick={openCsrfVideo}
                >
                  Learn more <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </FormDescription>
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
          <Button form="edit-scrobbles-form" type="submit">
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
