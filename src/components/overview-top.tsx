"use client";
import type { useGetTopAlbums } from "@/api/top-albums";
import type { useGetTopArtists } from "@/api/top-artists";
import type { useGetTopTracks } from "@/api/top-tracks";
import { cn, getImageUrl } from "@/lib/utils";
import type { Period } from "@/types/Common.types";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { FC } from "react";
import { useState } from "react";
import PeriodSelect from "./period-select";
import ThreeImages from "./three-images";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

interface OverviewTopProps {
  className?: string;
  title: string;
  useGetData:
    | typeof useGetTopArtists
    | typeof useGetTopAlbums
    | typeof useGetTopTracks;
  imageShape: "circle" | "square";
  seeAllPath: string;
}

const OverviewTop: FC<OverviewTopProps> = ({
  className,
  title,
  useGetData,
  imageShape,
  seeAllPath
}) => {
  const [period, setPeriod] = useState<Period>("7day");
  const { data: items = [], isLoading } = useGetData({ period });
  const { username } = useParams<{ username: string }>();

  const getBackgroundPercentage = (playcount: number, maxPlaycount: number) => {
    return (playcount / maxPlaycount) * 100;
  };

  if (isLoading) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <h2 className="text-2xl font-bold">{title}</h2>
        <Card className="p-8">
          <CardContent className="flex items-center justify-center h-64 min-h-[920px]">
            <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const emptyNode = (
    <div className={cn("flex flex-col gap-4", className)}>
      <h2 className="text-2xl font-bold">{title}</h2>
      <Card className="p-8">
        <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p>No items found</p>
          <p className="text-sm">
            Listen to some music to see your top {title.toLowerCase()}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const maxPlaycount = Math.max(...items.map((item) => +item.playcount));

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex">
        <h2 className="text-2xl font-bold flex-1">{title}</h2>
        <PeriodSelect period={period} setPeriod={setPeriod} />
      </div>
      <Card className="p-8">
        {items.length === 0 ? (
          emptyNode
        ) : (
          <>
            <CardContent className="flex flex-col gap-4">
              <ThreeImages items={items} shape={imageShape} />
              <div className="flex flex-col gap-2">
                {items.map((item, i) => {
                  const { name, image, playcount, url } = item;
                  return (
                    <div
                      key={url}
                      className="flex rounded-md px-4 pt-2 items-center font-bold"
                      style={{
                        background: `linear-gradient(to right, hsl(var(--accent)) ${getBackgroundPercentage(
                          +playcount,
                          maxPlaycount
                        )}%, transparent ${getBackgroundPercentage(
                          +playcount,
                          maxPlaycount
                        )}%)`
                      }}
                    >
                      <div className="flex gap-3 items-center flex-1">
                        <span className="min-w-[18px] text-right text-muted-foreground">
                          {i + 1}
                        </span>
                        <Link href={url} target="_blank">
                          <Button
                            variant="link"
                            className="text-foreground gap-4"
                          >
                            <Image
                              src={getImageUrl(image)}
                              alt={name}
                              width={40}
                              height={40}
                              unoptimized
                              className={cn("rounded", {
                                "rounded-full": imageShape === "circle"
                              })}
                            />
                            <span className="font-bold text-accent-foreground">
                              {name}
                            </span>
                          </Button>
                        </Link>
                      </div>
                      <span className={i === 0 ? "text-[#bb9af7] text-lg" : ""}>
                        {playcount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="justify-center p-0">
              <Link href={`/${username}/${seeAllPath}`}>
                <Button variant="link" className="font-bold">
                  See all {title.toLowerCase()}
                </Button>
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default OverviewTop;
