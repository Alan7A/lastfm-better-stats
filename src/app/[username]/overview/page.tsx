"use client";
import { useGetTopAlbums } from "@/api/top-albums";
import { useGetTopArtists } from "@/api/top-artists";
import { useGetTopTracks } from "@/api/top-tracks";
import ScrobbleComparison from "@/components/charts/scrobble-comparison";
import UserStats from "@/components/charts/user-stats";
import OverviewTop from "@/components/overview-top";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

const Loading = (
  <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
);

const OverviewPage = () => {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Suspense fallback={Loading}>
        <UserStats className="mt-14" />
      </Suspense>
      <Suspense fallback={Loading}>
        <OverviewTop
          title="Top Artists"
          useGetData={useGetTopArtists}
          imageShape="circle"
          seeAllPath="artists"
        />
      </Suspense>
      <Suspense fallback={Loading}>
        <OverviewTop
          title="Top Albums"
          useGetData={useGetTopAlbums}
          imageShape="square"
          seeAllPath="albums"
        />
      </Suspense>
      <Suspense fallback={Loading}>
        <OverviewTop
          title="Top Tracks"
          useGetData={useGetTopTracks}
          imageShape="square"
          seeAllPath="albums"
        />
      </Suspense>
      <Suspense fallback={Loading}>
        <ScrobbleComparison />
      </Suspense>
    </div>
  );
};

export default OverviewPage;
