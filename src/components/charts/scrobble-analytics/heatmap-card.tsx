import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Clock3 } from "lucide-react";
import type { HourlyGrid } from "./types";
import { hourLabels } from "./utils";

export const HeatmapCard = ({ data }: { data: HourlyGrid }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock3 className="h-5 w-5" />
        Listening Clock
      </CardTitle>
      <CardDescription>Scrobbles by weekday and hour.</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[720px] space-y-2">
          <div className="grid grid-cols-[44px_repeat(24,minmax(0,1fr))] gap-1 text-[10px] text-muted-foreground">
            <span />
            {hourLabels.map((hourLabel) => (
              <span key={hourLabel} className="text-center">
                {hourLabel.replace("hour-", "")}
              </span>
            ))}
          </div>
          {data.rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[44px_repeat(24,minmax(0,1fr))] gap-1"
            >
              <span className="self-center text-xs text-muted-foreground">
                {row.label}
              </span>
              {row.hours.map((cell) => {
                const intensity =
                  data.max > 0 ? 0.12 + (cell.count / data.max) * 0.78 : 0.06;

                return (
                  <div
                    key={`${row.label}-${cell.hour}`}
                    title={`${row.label} ${cell.hour}:00 - ${cell.count} scrobbles`}
                    className="h-6 rounded-[4px] border border-border/60"
                    style={{
                      backgroundColor:
                        cell.count > 0
                          ? `hsl(var(--chart-1) / ${intensity})`
                          : "hsl(var(--muted) / 0.45)"
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);
