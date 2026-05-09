import type { ProcessedScrobble } from "@/types/Scrobbles.types";

export type DateRange = {
  start: Date;
  end: Date;
};

export type ComparisonPoint = {
  label: string;
  thisPeriod: number;
  lastPeriod: number;
};

export type TrendPoint = {
  label: string;
  scrobbles: number;
  artists: number;
  tracks: number;
};

export type RankedItem = {
  name: string;
  count: number;
};

export type HourlyGrid = {
  max: number;
  rows: {
    label: string;
    hours: {
      hour: number;
      count: number;
    }[];
  }[];
};

export type ScrobbleAnalyticsData = {
  filtered: ProcessedScrobble[];
  comparison: {
    chartData: ComparisonPoint[];
    currentTotal: number;
    previousTotal: number;
  };
  trend: TrendPoint[];
  weekdayData: {
    label: string;
    scrobbles: number;
  }[];
  hourlyGrid: HourlyGrid;
  topArtists: RankedItem[];
  topTracks: RankedItem[];
  topAlbums: RankedItem[];
  uniqueArtists: number;
  uniqueTracks: number;
  uniqueAlbums: number;
  dailyAverage: number;
  busiestWeekday: {
    label: string;
    scrobbles: number;
    fullLabel: string;
  };
  peakDay: string;
};
