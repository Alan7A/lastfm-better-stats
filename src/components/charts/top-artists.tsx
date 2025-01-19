"use client";
import { useGetTopArtists } from "@/api/top-artists";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { transformTopArtists } from "@/lib/utils";
import type { Period } from "@/types/Common.types";
import { LoaderCircle, X } from "lucide-react";
import React, { useState } from "react";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "../ui/chart";

interface Props {
  className?: string;
}

const chartConfig = {
  name: {
    label: "Name"
  },
  playcount: {
    label: "Play count"
  }
} satisfies ChartConfig;

const TopArtists = (props: Props) => {
  const { className } = props;
  const [period, setPeriod] = useState<Period>("7day");
  const { data: topArtists, isLoading } = useGetTopArtists({
    preiod: period,
    limit: 10
  });
  console.log(">>>", transformTopArtists(topArtists ?? []));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top 10 Artists</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          {isLoading ? (
            <LoaderCircle className="h-12 w-12 animate-spin" />
          ) : (
            <BarChart
              accessibilityLayer
              data={transformTopArtists(topArtists ?? [])}
              layout="vertical"
            >
              <XAxis type="number" dataKey="playcount" hide />
              <YAxis hide dataKey="name" type="category" />
              <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
              <Bar dataKey="playcount" radius={8} className="fill-chart-1">
                <LabelList
                  dataKey="name"
                  position="insideLeft"
                  offset={12}
                  className="fill-primary-foreground"
                  fontSize={16}
                />
                <LabelList
                  dataKey="playcount"
                  position="right"
                  offset={12}
                  className="fill-foreground"
                  fontSize={16}
                />
              </Bar>
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default TopArtists;
