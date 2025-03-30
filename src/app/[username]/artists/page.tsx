"use client";

import { useGetTopArtists } from "@/api/top-artists";
import TopList from "@/components/top-list";

const ArtistsPage = () => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold mb-4">Artists</h2>
      <TopList useGetData={useGetTopArtists} />
    </div>
  );
};

export default ArtistsPage;
