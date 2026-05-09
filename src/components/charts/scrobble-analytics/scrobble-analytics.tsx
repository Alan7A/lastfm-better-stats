"use client";

import PeriodSelect from "@/components/period-select";
import type { Period } from "@/types/Common.types";
import { Activity, CalendarDays, Disc3, Users } from "lucide-react";
import { useState } from "react";
import { ComparisonCard } from "./comparison-card";
import { HeatmapCard } from "./heatmap-card";
import { LoadingCard } from "./loading-card";
import { StatCard } from "./stat-card";
import { TopBreakdownCard } from "./top-breakdown-card";
import { TrendCard } from "./trend-card";
import { useScrobbleAnalytics } from "./use-scrobble-analytics";
import { formatNumber, formatRange } from "./utils";
import { WeekdayCard } from "./weekday-card";

const ScrobbleAnalytics = () => {
  const [period, setPeriod] = useState<Period>("6month");
  const {
    user,
    scrobbles,
    progress,
    calculateTimeRemaining,
    range,
    analytics
  } = useScrobbleAnalytics(period);

  if (!user || !scrobbles || !analytics) {
    return (
      <LoadingCard
        title="Loading scrobbles"
        pagesLoaded={progress.currentPage || 0}
        totalPages={progress.totalPages || 0}
        timeRemaining={calculateTimeRemaining()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Scrobbles</h2>
          <p className="text-sm text-muted-foreground">
            {formatRange(period, range)}
          </p>
        </div>
        <PeriodSelect period={period} setPeriod={setPeriod} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Activity}
          label="Total scrobbles"
          value={formatNumber(analytics.filtered.length)}
          detail={`${analytics.dailyAverage.toFixed(1)} per day`}
        />
        <StatCard
          icon={Users}
          label="Artists"
          value={formatNumber(analytics.uniqueArtists)}
          detail={`${formatNumber(analytics.uniqueTracks)} unique tracks`}
        />
        <StatCard
          icon={Disc3}
          label="Albums"
          value={formatNumber(analytics.uniqueAlbums)}
          detail="Albums with at least one play"
        />
        <StatCard
          icon={CalendarDays}
          label="Peak day"
          value={analytics.peakDay}
          detail={`${analytics.busiestWeekday.fullLabel} is busiest`}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ComparisonCard
          data={analytics.comparison}
          period={period}
          range={range}
        />
        <TrendCard data={analytics.trend} />
        <WeekdayCard data={analytics.weekdayData} />
        <HeatmapCard data={analytics.hourlyGrid} />
        <TopBreakdownCard
          artists={analytics.topArtists}
          tracks={analytics.topTracks}
          albums={analytics.topAlbums}
        />
      </div>
    </div>
  );
};

export default ScrobbleAnalytics;
