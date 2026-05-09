import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { CalendarDays } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { chartConfig } from "./chart-config";

type WeekdayCardProps = {
  data: {
    label: string;
    scrobbles: number;
  }[];
};

export const WeekdayCard = ({ data }: WeekdayCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5" />
        Weekday Rhythm
      </CardTitle>
      <CardDescription>Which days get the most plays.</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="aspect-auto h-[260px]">
        <BarChart
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
          <Bar
            dataKey="scrobbles"
            fill="var(--color-scrobbles)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);
