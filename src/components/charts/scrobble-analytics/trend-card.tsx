import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart3 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
import { chartConfig } from "./chart-config";
import type { TrendPoint } from "./types";

export const TrendCard = ({ data }: { data: TrendPoint[] }) => (
  <Card className="xl:col-span-2">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Listening Trend
      </CardTitle>
      <CardDescription>Volume with artist and track variety.</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="aspect-auto h-[300px]">
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ left: -20, right: 12 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area
            dataKey="scrobbles"
            type="monotone"
            fill="var(--color-scrobbles)"
            fillOpacity={0.2}
            stroke="var(--color-scrobbles)"
            strokeWidth={3}
          />
          <Line
            dataKey="artists"
            type="monotone"
            stroke="var(--color-artists)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="tracks"
            type="monotone"
            stroke="var(--color-tracks)"
            strokeWidth={2}
            dot={false}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
