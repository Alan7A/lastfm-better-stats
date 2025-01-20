import TopArtists from "@/components/charts/top-artists";
import UserStats from "@/components/charts/user-stats";
import OverviewTop from "@/components/overview-top";
import React from "react";

const OverviewPage = () => {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <UserStats />
      <TopArtists className="" />
      <OverviewTop title="Top Artists" />
    </div>
  );
};

export default OverviewPage;
