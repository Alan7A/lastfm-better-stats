"use client";

import type { Period } from "@/types/Common.types";
import { ComparisonCard } from "./comparison-card";
import { HeatmapCard } from "./heatmap-card";
import { LoadingCard } from "./loading-card";
import { useScrobbleAnalytics } from "./use-scrobble-analytics";
import { WeekdayCard } from "./weekday-card";

export const OverviewScrobbleHighlights = () => {
  const period: Period = "3month";
  const { scrobbles, progress, range, analytics } =
    useScrobbleAnalytics(period);

  if (!scrobbles || !analytics) {
    return (
      <LoadingCard
        title="Loading scrobble charts"
        pagesLoaded={progress.currentPage || 0}
        totalPages={progress.totalPages || 0}
        className="xl:col-span-2"
        minHeightClassName="min-h-[220px]"
      />
    );
  }

  return (
    <>
      <ComparisonCard
        data={analytics.comparison}
        period={period}
        range={range}
      />
      <WeekdayCard data={analytics.weekdayData} />
      <HeatmapCard data={analytics.hourlyGrid} />
    </>
  );
};
