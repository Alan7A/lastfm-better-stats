import type { Period } from "@/types/Common.types";
import type { ProcessedScrobble } from "@/types/Scrobbles.types";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  getDay,
  getHours,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths
} from "date-fns";
import type { DateRange, HourlyGrid, ScrobbleAnalyticsData } from "./types";

export const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const longDayLabels = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export const hourLabels = Array.from(
  { length: 24 },
  (_, hour) => `hour-${hour}`
);

export const formatNumber = (value: number) => value.toLocaleString();

export const periodMonthCount = (period: Period) => {
  if (period === "3month") return 3;
  if (period === "6month") return 6;
  return 12;
};

export const getPeriodRange = (period: Period, offset: number): DateRange => {
  const now = new Date();

  if (period === "7day") {
    const end = endOfDay(subDays(now, offset * 7));

    return {
      start: startOfDay(subDays(end, 6)),
      end
    };
  }

  if (period === "1month") {
    const end = endOfDay(subMonths(now, offset));

    return {
      start: startOfDay(addDays(subMonths(end, 1), 1)),
      end
    };
  }

  const months = periodMonthCount(period);
  const endMonth = subMonths(now, offset * months);
  const startMonth = subMonths(endMonth, months - 1);

  return {
    start: startOfMonth(startMonth),
    end: offset === 0 ? endOfDay(now) : endOfMonth(endMonth)
  };
};

export const getPreviousRange = (
  period: Period,
  range: DateRange
): DateRange => {
  if (period === "7day" || period === "1month") {
    const days = eachDayOfInterval({
      start: range.start,
      end: range.end
    }).length;
    const end = endOfDay(subDays(range.start, 1));

    return {
      start: startOfDay(subDays(end, days - 1)),
      end
    };
  }

  const months = periodMonthCount(period);

  return {
    start: subMonths(range.start, months),
    end: endOfDay(subDays(range.start, 1))
  };
};

export const formatRange = (period: Period, range: DateRange) => {
  if (period === "7day") {
    return `${format(range.start, "MMM d")} - ${format(range.end, "MMM d")}`;
  }

  if (period === "1month") {
    return format(range.start, "MMMM yyyy");
  }

  return `${format(range.start, "MMM yyyy")} - ${format(
    range.end,
    "MMM yyyy"
  )}`;
};

const filterByRange = (scrobbles: ProcessedScrobble[], range: DateRange) =>
  scrobbles.filter((scrobble) =>
    isWithinInterval(new Date(scrobble.date), {
      start: range.start,
      end: range.end
    })
  );

const countBy = <T extends string | number>(
  scrobbles: ProcessedScrobble[],
  getKey: (scrobble: ProcessedScrobble) => T
) => {
  const counts = new Map<T, number>();

  for (const scrobble of scrobbles) {
    const key = getKey(scrobble);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return counts;
};

const rankBy = (
  scrobbles: ProcessedScrobble[],
  getKey: (scrobble: ProcessedScrobble) => string,
  limit = 10
) => {
  const counts = countBy(
    scrobbles.filter((scrobble) => getKey(scrobble)),
    getKey
  );

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

const getDayIndex = (date: Date) => {
  const day = getDay(date);
  return day === 0 ? 6 : day - 1;
};

const buildComparisonData = (
  scrobbles: ProcessedScrobble[],
  period: Period,
  range: DateRange
) => {
  const previousRange = getPreviousRange(period, range);
  const current = filterByRange(scrobbles, range);
  const previous = filterByRange(scrobbles, previousRange);

  let currentCounts: Map<string | number, number>;
  let previousCounts: Map<string | number, number>;

  if (period === "7day" || period === "1month") {
    const currentDays = eachDayOfInterval({
      start: range.start,
      end: range.end
    });
    const previousDays = eachDayOfInterval({
      start: previousRange.start,
      end: previousRange.end
    });
    currentCounts = countBy(current, (scrobble) =>
      format(new Date(scrobble.date), "yyyy-MM-dd")
    );
    previousCounts = countBy(previous, (scrobble) =>
      format(new Date(scrobble.date), "yyyy-MM-dd")
    );

    return {
      chartData: currentDays.map((date, index) => ({
        label: period === "7day" ? format(date, "EEE") : format(date, "d MMM"),
        thisPeriod: currentCounts.get(format(date, "yyyy-MM-dd")) || 0,
        lastPeriod:
          previousCounts.get(format(previousDays[index], "yyyy-MM-dd")) || 0
      })),
      currentTotal: current.length,
      previousTotal: previous.length
    };
  }

  const months = periodMonthCount(period);
  const currentMonthKeys = Array.from({ length: months }, (_, index) =>
    format(addMonths(range.start, index), "yyyy-MM")
  );
  const previousMonthKeys = Array.from({ length: months }, (_, index) =>
    format(addMonths(previousRange.start, index), "yyyy-MM")
  );

  currentCounts = countBy(current, (scrobble) =>
    format(new Date(scrobble.date), "yyyy-MM")
  );
  previousCounts = countBy(previous, (scrobble) =>
    format(new Date(scrobble.date), "yyyy-MM")
  );

  return {
    chartData: currentMonthKeys.map((key, index) => ({
      label: format(addMonths(range.start, index), "MMM"),
      thisPeriod: currentCounts.get(key) || 0,
      lastPeriod: previousCounts.get(previousMonthKeys[index]) || 0
    })),
    currentTotal: current.length,
    previousTotal: previous.length
  };
};

const buildTrendData = (
  scrobbles: ProcessedScrobble[],
  period: Period,
  range: DateRange
) => {
  if (period === "7day" || period === "1month") {
    return eachDayOfInterval({ start: range.start, end: range.end }).map(
      (date) => {
        const key = format(date, "yyyy-MM-dd");
        const dayScrobbles = scrobbles.filter(
          (scrobble) => format(new Date(scrobble.date), "yyyy-MM-dd") === key
        );

        return {
          label:
            period === "7day" ? format(date, "EEE") : format(date, "d MMM"),
          scrobbles: dayScrobbles.length,
          artists: new Set(dayScrobbles.map((scrobble) => scrobble.artist))
            .size,
          tracks: new Set(dayScrobbles.map((scrobble) => scrobble.track)).size
        };
      }
    );
  }

  const months = periodMonthCount(period);

  return Array.from({ length: months }, (_, index) => {
    const date = addMonths(range.start, index);
    const key = format(date, "yyyy-MM");
    const monthScrobbles = scrobbles.filter(
      (scrobble) => format(new Date(scrobble.date), "yyyy-MM") === key
    );

    return {
      label: format(date, "MMM"),
      scrobbles: monthScrobbles.length,
      artists: new Set(monthScrobbles.map((scrobble) => scrobble.artist)).size,
      tracks: new Set(monthScrobbles.map((scrobble) => scrobble.track)).size
    };
  });
};

const buildWeekdayData = (scrobbles: ProcessedScrobble[]) => {
  const counts = countBy(scrobbles, (scrobble) =>
    getDayIndex(new Date(scrobble.date))
  );

  return dayLabels.map((label, index) => ({
    label,
    scrobbles: counts.get(index) || 0
  }));
};

const buildHourlyGrid = (scrobbles: ProcessedScrobble[]): HourlyGrid => {
  const counts = new Map<string, number>();

  for (const scrobble of scrobbles) {
    const date = new Date(scrobble.date);
    const key = `${getDayIndex(date)}-${getHours(date)}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const max = Math.max(...counts.values(), 0);

  return {
    max,
    rows: dayLabels.map((label, dayIndex) => ({
      label,
      hours: Array.from({ length: 24 }, (_, hour) => {
        const count = counts.get(`${dayIndex}-${hour}`) || 0;
        return { hour, count };
      })
    }))
  };
};

const getDailyAverage = (total: number, range: DateRange) => {
  const today = new Date();
  const effectiveEnd = range.end > today ? today : range.end;
  const days = eachDayOfInterval({
    start: range.start,
    end: effectiveEnd
  }).length;

  return days > 0 ? total / days : 0;
};

const getPeakDay = (scrobbles: ProcessedScrobble[]) => {
  const counts = countBy(scrobbles, (scrobble) =>
    format(new Date(scrobble.date), "yyyy-MM-dd")
  );
  const peak = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];

  if (!peak) return "No scrobbles";

  return `${format(new Date(`${peak[0]}T00:00:00`), "MMM d")} (${peak[1]})`;
};

export const getChangeText = (current: number, previous: number) => {
  if (previous === 0 && current > 0) return "New activity vs. last period";
  if (previous === 0) return "No activity in either period";

  const change = ((current - previous) / previous) * 100;
  const direction = change >= 0 ? "up" : "down";

  return `${Math.abs(change).toFixed(1)}% ${direction} vs. last period`;
};

export const buildAnalytics = (
  scrobbles: ProcessedScrobble[],
  period: Period,
  range: DateRange
): ScrobbleAnalyticsData => {
  const filtered = filterByRange(scrobbles, range);
  const uniqueArtists = new Set(filtered.map((scrobble) => scrobble.artist));
  const uniqueTracks = new Set(filtered.map((scrobble) => scrobble.track));
  const uniqueAlbums = new Set(
    filtered
      .map((scrobble) => scrobble.album)
      .filter((album) => album.length > 0)
  );
  const weekdayData = buildWeekdayData(filtered);
  const busiestWeekday = weekdayData
    .map((item, index) => ({
      ...item,
      fullLabel: longDayLabels[index]
    }))
    .sort((a, b) => b.scrobbles - a.scrobbles)[0];

  return {
    filtered,
    comparison: buildComparisonData(scrobbles, period, range),
    trend: buildTrendData(scrobbles, period, range),
    weekdayData,
    hourlyGrid: buildHourlyGrid(filtered),
    topArtists: rankBy(filtered, (scrobble) => scrobble.artist),
    topTracks: rankBy(
      filtered,
      (scrobble) => `${scrobble.artist} - ${scrobble.track}`
    ),
    topAlbums: rankBy(filtered, (scrobble) =>
      scrobble.album ? `${scrobble.artist} - ${scrobble.album}` : ""
    ),
    uniqueArtists: uniqueArtists.size,
    uniqueTracks: uniqueTracks.size,
    uniqueAlbums: uniqueAlbums.size,
    dailyAverage: getDailyAverage(filtered.length, range),
    busiestWeekday,
    peakDay: getPeakDay(filtered)
  };
};
