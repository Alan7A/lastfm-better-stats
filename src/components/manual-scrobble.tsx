"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface Props {
  isAuthenticated: boolean;
  username: string;
}

const formSchema = z.object({
  artist: z.string().min(1, { message: "Artist name is required" }),
  track: z.string().min(1, { message: "Track name is required" }),
  timestamp: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

const ManualScrobble = (props: Props) => {
  const { isAuthenticated } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artist: "",
      track: "",
      timestamp: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to scrobble tracks");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        artist: data.artist,
        track: data.track,
        timestamp: data.timestamp
          ? Math.floor(new Date(data.timestamp).getTime() / 1000)
          : undefined
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

      toast.success("Track scrobbled successfully!");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to scrobble track"
      );
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between gap-2">
            <p>Scrobble manually</p>
          </CardTitle>
          <CardDescription>Scrobble a track manually</CardDescription>
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
        <CardTitle className="flex justify-between gap-2">
          <p>Scrobble manually</p>
        </CardTitle>
        <CardDescription>Scrobble a track manually</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="artist"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter artist name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="track"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Track Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter track name"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timestamp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timestamp (empty for current time)</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      placeholder="Leave empty for current time"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Scrobbling..." : "Scrobble Track"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ManualScrobble;
