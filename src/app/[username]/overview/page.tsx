import TopArtists from "@/components/charts/top-artists";
import UserStats from "@/components/charts/user-stats";
import React from "react";

const OverviewPage = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <UserStats />
      <div className="lg:col-span-3">
        <p className="text-2xl">Scrobbles (pending)</p>
      </div>
      <TopArtists className="lg:col-span-2" />
    </div>
  );
};

export default OverviewPage;
