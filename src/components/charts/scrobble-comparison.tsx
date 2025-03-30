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
import type { ProcessedScrobble } from "@/types/Scrobbles.types";
import {
  endOfWeek,
  format,
  getDay,
  isWithinInterval,
  startOfWeek,
  subDays
} from "date-fns";
import { useParams } from "next/navigation";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  thisWeek: {
    label: "This week",
    color: "hsl(var(--chart-1))"
  },
  lastWeek: {
    label: "Last week",
    color: "hsl(var(--chart-2))"
  }
} satisfies ChartConfig;

const now = new Date();

/**
 * TODO:
 * - Agregar flechar para cambiar de periodos
 * - Agregar select para cambiar de periodos (semana, mes, 6 meses,  año)
 * - Mejorar diseño del chart
 */
const transformScrobbles = (scrobbles: ProcessedScrobble[] | null) => {
  const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 }); // Semana actual (Lunes a Domingo)
  const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });
  const startOfLastWeek = subDays(startOfThisWeek, 7); // Semana pasada
  const endOfLastWeek = subDays(endOfThisWeek, 7);
  if (!scrobbles) {
    return { chartData: [], changeText: "", startOfThisWeek, endOfThisWeek };
  }

  // Filtrar scrobbles de esta semana y la semana pasada
  const thisWeekScrobbles = scrobbles.filter((item) =>
    isWithinInterval(new Date(item.date), {
      start: startOfThisWeek,
      end: endOfThisWeek
    })
  );

  const lastWeekScrobbles = scrobbles.filter((item) =>
    isWithinInterval(new Date(item.date), {
      start: startOfLastWeek,
      end: endOfLastWeek
    })
  );

  // Inicializar días de la semana
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  // Función para contar scrobbles por día
  const countScrobblesByDay = (scrobbles: any[]) => {
    return weekDays.map((day, index) => {
      const count = scrobbles.filter(
        (item) => getDay(new Date(item.date)) === index // Ajustar para que el índice coincida con el día de la semana
      ).length;
      return { day, count };
    });
  };

  // Contar scrobbles por día para ambas semanas
  const thisWeekCounts = countScrobblesByDay(thisWeekScrobbles);
  const lastWeekCounts = countScrobblesByDay(lastWeekScrobbles);

  const chartData = weekDays.map((day, index) => {
    return {
      day,
      thisWeek: thisWeekCounts[index]?.count || 0,
      lastWeek: lastWeekCounts[index]?.count || 0
    };
  });

  // Sumar scrobbles de esta semana
  const totalThisWeek = thisWeekScrobbles.length;

  // Sumar scrobbles de la semana pasada
  const totalLastWeek = lastWeekScrobbles.length;

  // Calcular porcentaje de cambio
  let percentageChange = 0;

  if (totalLastWeek > 0) {
    percentageChange = ((totalThisWeek - totalLastWeek) / totalLastWeek) * 100;
  }

  // Formatear resultado para mostrar
  const changeText =
    percentageChange > 0
      ? `⬆️ ${percentageChange.toFixed(1)}% vs. last week`
      : percentageChange < 0
        ? `⬇️ ${Math.abs(percentageChange).toFixed(1)}% vs. last week`
        : "No changes compared to last week";

  return {
    chartData,
    changeText,
    totalThisWeek,
    totalLastWeek,
    startOfThisWeek,
    endOfThisWeek
  };
};

const ScrobbleComparison = () => {
  const { username } = useParams<{ username: string }>();
  const { data: user } = useGetUser(username);
  const { data } = useGetScrobbles(user);
  const {
    chartData,
    changeText,
    startOfThisWeek,
    endOfThisWeek,
    totalThisWeek
  } = transformScrobbles(data);
  console.log({ chartData });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scrobbles</CardTitle>
        <CardDescription>
          {format(startOfThisWeek, "MMMM dd")} -{" "}
          {format(endOfThisWeek, "MMMM dd")}
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="thisWeek"
              type="monotone"
              stroke="var(--color-thisWeek)"
              strokeWidth={3}
              dot={false}
            />
            <Line
              dataKey="lastWeek"
              type="monotone"
              stroke="var(--color-lastWeek)"
              strokeWidth={3}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex flex-1 items-center gap-2 font-medium leading-none justify-between">
          <p className="text-lg">{totalThisWeek} scrobbles</p>
          <p>{changeText}</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ScrobbleComparison;
