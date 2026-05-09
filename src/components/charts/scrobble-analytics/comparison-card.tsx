import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import type { Period } from "@/types/Common.types";
import { Activity } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { chartConfig } from "./chart-config";
import type { ComparisonPoint, DateRange } from "./types";
import { formatNumber, formatRange, getChangeText } from "./utils";

type ComparisonCardProps = {
  data: {
    chartData: ComparisonPoint[];
    currentTotal: number;
    previousTotal: number;
  };
  period: Period;
  range: DateRange;
};

export const ComparisonCard = ({
  data,
  period,
  range
}: ComparisonCardProps) => (
  <Card className="xl:col-span-2">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Period Comparison
      </CardTitle>
      <CardDescription>{formatRange(period, range)}</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="aspect-auto h-[320px]">
        <LineChart
          accessibilityLayer
          data={data.chartData}
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
    </CardContent>
    <CardFooter className="flex justify-between gap-4 text-sm">
      <span className="text-lg font-medium">
        {formatNumber(data.currentTotal)} total
      </span>
      <span className="text-muted-foreground">
        {getChangeText(data.currentTotal, data.previousTotal)}
      </span>
    </CardFooter>
  </Card>
);
