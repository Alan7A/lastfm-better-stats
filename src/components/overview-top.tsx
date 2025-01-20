"use client";
import { useGetTopArtists } from "@/api/top-artists";
import { cn, getImageUrl } from "@/lib/utils";
import type { Period } from "@/types/Common.types";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import ThreeImages from "./three-images";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";

interface Props {
  title: string;
  className?: string;
}

const OverviewTop = (props: Props) => {
  const { className } = props;
  const [period, setPeriod] = useState<Period>("7day");
  const { data: artists, isLoading } = useGetTopArtists({ period });

  const { username } = useParams<{ username: string }>();

  const getBackgroundPercentage = (playcount: number, maxPlaycount: number) => {
    // Calculate percentage of max playcount
    return (playcount / maxPlaycount) * 100;
  };

  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <h2 className="text-2xl font-bold">{props.title}</h2>
        <Card className="p-8">
          <CardContent className="flex items-center justify-center h-64">
            <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!artists || artists.length === 0) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <h2 className="text-2xl font-bold">{props.title}</h2>
        <Card className="p-8">
          <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <p>No artists found</p>
            <p className="text-sm">
              Listen to some music to see your top artists
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Find max playcount for relative scaling
  const maxPlaycount = Math.max(...artists.map((artist) => +artist.playcount));

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex">
        <h2 className="text-2xl font-bold flex-1">Top Artists</h2>
        <Select
          value={period}
          onValueChange={(value) => setPeriod(value as Period)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder=" Select a period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7day">7 day</SelectItem>
            <SelectItem value="1month">1 month</SelectItem>
            <SelectItem value="3month">3 month</SelectItem>
            <SelectItem value="6month">6 month</SelectItem>
            <SelectItem value="12month">12 month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="p-8">
        <CardContent className="flex flex-col gap-4">
          <ThreeImages artists={artists} shape="circle" />
          <div className="flex flex-col gap-2 first:">
            {artists?.map((artist, i) => {
              const { name, images, playcount, url } = artist;
              return (
                <div
                  key={url}
                  className="flex rounded-md px-4 pt-2 items-center font-bold"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--accent)) ${getBackgroundPercentage(+playcount, maxPlaycount)}%, transparent ${getBackgroundPercentage(+playcount, maxPlaycount)}%)`
                  }}
                >
                  <div className="flex gap-3 items-center flex-1">
                    <span className="min-w-[18px] text-right text-muted-foreground">
                      {i + 1}
                    </span>
                    <Link href={url} target="_blank">
                      <Button variant="link" className="text-foreground gap-4">
                        <Image
                          src={getImageUrl(images)}
                          alt={name}
                          width={40}
                          height={40}
                          unoptimized
                          className="rounded-full"
                        />
                        <span className="font-bold text-accent-foreground">
                          {name}
                        </span>
                      </Button>
                    </Link>
                  </div>
                  <span className={i === 0 ? "text-primary text-lg" : ""}>
                    {playcount}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="justify-center p-0">
          <Link href={`/${username}/artists`}>
            <Button variant="link" className="font-bold">
              See all artists
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OverviewTop;
