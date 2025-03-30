"use client";

import type { useGetTopAlbums } from "@/api/top-albums";
import type { useGetTopArtists } from "@/api/top-artists";
import type { useGetTopTracks } from "@/api/top-tracks";
import { cn, getImageUrl } from "@/lib/utils";
import type { Limit, Period } from "@/types/Common.types";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import LimitSelect from "./limit-select";
import PeriodSelect from "./period-select";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface Props {
  useGetData:
    | typeof useGetTopArtists
    | typeof useGetTopAlbums
    | typeof useGetTopTracks;
}

const TopList = (props: Props) => {
  const { useGetData } = props;
  const [period, setPeriod] = useState<Period>("12month");
  const [limit, setLimit] = useState<Limit>("100");
  const { data: items = [], isLoading } = useGetData({ period, limit: +limit });
  const [parent] = useAutoAnimate();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <PeriodSelect period={period} setPeriod={setPeriod} enableAllTime />
        <LimitSelect limit={limit} setLimit={setLimit} />
      </div>
      <Card>
        <CardContent
          className="divide-y border-muted-foreground py-4"
          ref={parent}
        >
          {isLoading ? (
            <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          ) : items.length === 0 ? (
            <p className="text-center">No results found</p>
          ) : (
            items.map((item, i) => {
              const { name, image, playcount, url } = item;
              return (
                <div
                  key={url}
                  className={cn(
                    "flex px-4 py-4 items-center font-bold",
                    i === 0 && "py-6"
                  )}
                >
                  <div className="flex gap-5 items-center flex-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-bold text-muted-foreground text-sm",
                        i === 0 && "text-[#e0af68]"
                      )}
                    >
                      {i + 1}
                    </Badge>
                    <Link
                      href={url}
                      target="_blank"
                      className="flex items-center"
                    >
                      <Button variant="link" className="text-foreground gap-4">
                        <Image
                          src={getImageUrl(image)}
                          alt={name}
                          width={i === 0 ? 55 : 40}
                          height={i === 0 ? 55 : 40}
                          unoptimized
                          className="rounded-full"
                        />
                        <span
                          className={cn(
                            "font-bold text-accent-foreground",
                            i === 0 && "text-xl"
                          )}
                        >
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
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TopList;
