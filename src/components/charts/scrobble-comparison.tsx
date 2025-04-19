"use client";

import { useGetScrobbles } from "@/api/scrobbles";
import { useGetUser } from "@/api/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import type { Period } from "@/types/Common.types";
import type { ProcessedScrobble } from "@/types/Scrobbles.types";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  getDay,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subYears
} from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import PeriodSelect from "../period-select";
import { Button } from "../ui/button";

// Define ChartConfig directly here or ensure it's imported correctly
const chartConfig = {
  thisPeriod: {
    label: "This Period",
    color: "hsl(var(--chart-1))"
  },
  lastPeriod: {
    label: "Last Period",
    color: "hsl(var(--chart-2))"
  }
} satisfies ChartConfig;

// Helper type for chart data structure
type ComparisonChartData = {
  label: string;
  thisPeriod: number;
  lastPeriod: number;
};

/**
 * Calculates scrobble data for comparison based on a given period and offset.
 * @param scrobbles - Array of processed scrobble data.
 * @param period - The comparison period ('7day', 'month', '6month', 'year').
 * @param offset - The number of periods to go back (e.g., 0 for current, 1 for previous).
 * @returns An object containing chart data, change text, and period details.
 */
const getComparisonData = (
  scrobbles: ProcessedScrobble[] | null,
  period: Period,
  offset: number
) => {
  if (!scrobbles) {
    return {
      chartData: [],
      changeText: "",
      currentPeriod: { start: new Date(), end: new Date() },
      totalCurrentPeriod: 0
    };
  }

  let currentPeriodStart: Date;
  let currentPeriodEnd: Date;
  let lastPeriodStart: Date;
  let lastPeriodEnd: Date;
  let labels: string[] = [];
  let intervalFn: (itemDate: Date, args: { start: Date; end: Date }) => boolean;
  let groupByFn: (itemDate: Date) => string | number;

  const now = new Date();

  switch (period) {
    case "7day":
      currentPeriodStart = startOfWeek(subDays(now, offset * 7), {
        weekStartsOn: 1
      });
      currentPeriodEnd = endOfWeek(subDays(now, offset * 7), {
        weekStartsOn: 1
      });
      lastPeriodStart = subDays(currentPeriodStart, 7);
      lastPeriodEnd = subDays(currentPeriodEnd, 7);
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      intervalFn = isWithinInterval;
      groupByFn = (itemDate: Date) => getDay(itemDate); // 0 for Sunday, 1 for Monday
      break;
    case "1month":
      currentPeriodStart = startOfMonth(subMonths(now, offset));
      currentPeriodEnd = endOfMonth(subMonths(now, offset));
      lastPeriodStart = subMonths(currentPeriodStart, 1);
      lastPeriodEnd = subMonths(currentPeriodEnd, 1);
      // For month, labels could be days (1-31) or weeks (Week 1, Week 2, etc.)
      // Let's use days for now for simplicity in the first iteration.
      labels = Array.from({ length: currentPeriodEnd.getDate() }, (_, i) =>
        (i + 1).toString()
      );
      intervalFn = isWithinInterval;
      groupByFn = (itemDate: Date) => itemDate.getDate(); // Day of the month
      break;
    case "3month":
      currentPeriodStart = subMonths(now, (offset + 1) * 3 - 1);
      currentPeriodEnd = now;
      lastPeriodStart = subMonths(currentPeriodStart, 3);
      lastPeriodEnd = subMonths(currentPeriodEnd, 3);
      labels = Array.from({ length: 3 }, (_, i) =>
        format(addMonths(currentPeriodStart, i), "MMM")
      );
      intervalFn = isWithinInterval;
      groupByFn = (itemDate: Date) => format(itemDate, "MMM");
      break;
    case "6month":
      // For 6 months, compare to the previous 6 months
      currentPeriodStart = subMonths(now, (offset + 1) * 6 - 1); // Start 6 months ago
      currentPeriodEnd = now; // End now
      lastPeriodStart = subMonths(currentPeriodStart, 6); // Start 12 months ago
      lastPeriodEnd = subMonths(currentPeriodEnd, 6); // End 6 months ago
      // For 6 months, labels could be months (Jan, Feb, etc.)
      labels = Array.from({ length: 6 }, (_, i) =>
        format(addMonths(currentPeriodStart, i), "MMM")
      );
      intervalFn = isWithinInterval;
      groupByFn = (itemDate: Date) => format(itemDate, "MMM"); // Abbreviated month name
      break;
    case "12month":
      currentPeriodStart = startOfYear(subYears(now, offset));
      currentPeriodEnd = endOfYear(subYears(now, offset));
      lastPeriodStart = subYears(currentPeriodStart, 1);
      lastPeriodEnd = subYears(currentPeriodEnd, 1);
      labels = Array.from({ length: 12 }, (_, i) =>
        format(addMonths(currentPeriodStart, i), "MMM")
      );
      intervalFn = isWithinInterval;
      groupByFn = (itemDate: Date) => format(itemDate, "MMM"); // Abbreviated month name
      break;
    default:
      // Default to 7day if period is unrecognized
      currentPeriodStart = startOfWeek(subDays(now, offset * 7), {
        weekStartsOn: 1
      });
      currentPeriodEnd = endOfWeek(subDays(now, offset * 7), {
        weekStartsOn: 1
      });
      lastPeriodStart = subDays(currentPeriodStart, 7);
      lastPeriodEnd = subDays(currentPeriodEnd, 7);
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      intervalFn = isWithinInterval;
      groupByFn = (itemDate: Date) => getDay(itemDate);
  }

  const currentPeriodScrobbles = scrobbles.filter((item) =>
    intervalFn(new Date(item.date), {
      start: currentPeriodStart,
      end: currentPeriodEnd
    })
  );

  const lastPeriodScrobbles = scrobbles.filter((item) =>
    intervalFn(new Date(item.date), {
      start: lastPeriodStart,
      end: lastPeriodEnd
    })
  );

  // Function to count scrobbles by the specified grouping function
  const countScrobblesByGroup = (scrobbles: ProcessedScrobble[]) => {
    const counts: Record<string | number, number> = {};
    for (const item of scrobbles) {
      const groupKey = groupByFn(new Date(item.date));
      counts[groupKey] = (counts[groupKey] || 0) + 1;
    }
    return counts;
  };

  const currentPeriodCounts = countScrobblesByGroup(currentPeriodScrobbles);
  const lastPeriodCounts = countScrobblesByGroup(lastPeriodScrobbles);

  const chartData: ComparisonChartData[] = labels.map((label, index) => {
    let currentCount = 0;
    let lastCount = 0;

    if (period === "7day") {
      // Adjust for getDay returning 0 for Sunday
      const dayIndex = index === 6 ? 0 : index + 1;
      currentCount = currentPeriodCounts[dayIndex] || 0;
      lastCount = lastPeriodCounts[dayIndex] || 0;
    } else if (period === "1month") {
      const dayOfMonth = index + 1;
      currentCount = currentPeriodCounts[dayOfMonth] || 0;
      lastCount = lastPeriodCounts[dayOfMonth] || 0;
    } else if (
      period === "3month" ||
      period === "6month" ||
      period === "12month"
    ) {
      currentCount = currentPeriodCounts[label] || 0;
      lastCount = lastPeriodCounts[label] || 0;
    }

    return {
      label,
      thisPeriod: currentCount,
      lastPeriod: lastCount
    };
  });

  const totalCurrentPeriod = currentPeriodScrobbles.length;
  const totalLastPeriod = lastPeriodScrobbles.length;

  let percentageChange = 0;
  if (totalLastPeriod > 0) {
    percentageChange =
      ((totalCurrentPeriod - totalLastPeriod) / totalLastPeriod) * 100;
  }

  const changeText =
    percentageChange > 0
      ? `⬆️ ${percentageChange.toFixed(1)}% vs. last period`
      : percentageChange < 0
        ? `⬇️ ${Math.abs(percentageChange).toFixed(1)}% vs. last period`
        : "No changes compared to last period";

  return {
    chartData,
    changeText,
    totalCurrentPeriod,
    currentPeriod: { start: currentPeriodStart, end: currentPeriodEnd }
  };
};

const ScrobbleComparison = () => {
  const { username } = useParams<{ username: string }>();
  const { data: user } = useGetUser(username);
  const { data: scrobbles } = useGetScrobbles(user);
  const [period, setPeriod] = useState<Period>("7day");
  const [periodOffset, setPeriodOffset] = useState(0); // 0 for current, 1 for previous, etc.

  // Use useMemo to re-calculate comparison data only when scrobbles, period, or offset changes
  const { chartData, changeText, totalCurrentPeriod, currentPeriod } = useMemo(
    () => getComparisonData(scrobbles, period, periodOffset),
    [scrobbles, period, periodOffset]
  );

  const handlePreviousPeriod = () => {
    setPeriodOffset(periodOffset + 1);
  };

  const handleNextPeriod = () => {
    if (periodOffset > 0) {
      setPeriodOffset(periodOffset - 1);
    }
  };

  // Determine the date range display based on the current period and offset
  let dateRangeText = "";
  if (period === "7day") {
    dateRangeText = `${format(currentPeriod.start, "MMMM dd")} - ${format(currentPeriod.end, "MMMM dd")}`;
  } else if (period === "1month") {
    dateRangeText = format(currentPeriod.start, "MMMM yyyy");
  } else if (period === "3month" || period === "6month") {
    dateRangeText = `${format(currentPeriod.start, "MMMM yyyy")} - ${format(currentPeriod.end, "MMMM yyyy")}`;
  } else if (period === "12month") {
    dateRangeText = format(currentPeriod.start, "yyyy");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scrobble Comparison</CardTitle>
        <CardDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={handlePreviousPeriod}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <p className="min-w-[200px] text-center">{dateRangeText}</p>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleNextPeriod}
              disabled={periodOffset === 0}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <PeriodSelect
            period={period}
            setPeriod={(newPeriod) => {
              setPeriod(newPeriod);
              setPeriodOffset(0); // Reset offset when period changes
            }}
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: -24,
                right: 12
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                dataKey="thisPeriod"
                type="monotone"
                stroke="var(--color-thisPeriod)"
                strokeWidth={3}
                dot={false}
              />
              <Line
                dataKey="lastPeriod"
                type="monotone"
                stroke="var(--color-lastPeriod)"
                strokeWidth={3}
                dot={false}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No scrobbles available for this period.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex flex-1 items-center gap-2 font-medium leading-none justify-between">
          <p className="text-lg">{totalCurrentPeriod} total</p>
          <p>{changeText}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ScrobbleComparison;
