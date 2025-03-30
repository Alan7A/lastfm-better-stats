"use client";

import { useGetTopAlbums } from "@/api/top-albums";
import TopList from "@/components/top-list";

const AlbumsPage = () => {
  return (
    <div className="max-w-screen-lg mx-auto">
      <h2 className="text-3xl font-bold mb-4">Albums</h2>
      <TopList useGetData={useGetTopAlbums} />
    </div>
  );
};

export default AlbumsPage;
