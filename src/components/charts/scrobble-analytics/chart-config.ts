import type { ChartConfig } from "@/components/ui/chart";

export const chartConfig = {
  scrobbles: {
    label: "Scrobbles",
    color: "hsl(var(--chart-1))"
  },
  thisPeriod: {
    label: "This Period",
    color: "hsl(var(--chart-1))"
  },
  lastPeriod: {
    label: "Last Period",
    color: "hsl(var(--chart-2))"
  },
  artists: {
    label: "Artists",
    color: "hsl(var(--chart-3))"
  },
  tracks: {
    label: "Tracks",
    color: "hsl(var(--chart-4))"
  },
  albums: {
    label: "Albums",
    color: "hsl(var(--chart-5))"
  }
} satisfies ChartConfig;
