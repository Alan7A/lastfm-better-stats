"use client";

import { useGetTopTracks } from "@/api/top-tracks";
import TopList from "@/components/top-list";

const TracksPage = () => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold mb-4">Tracks</h2>
      <TopList useGetData={useGetTopTracks} />
    </div>
  );
};

export default TracksPage;
