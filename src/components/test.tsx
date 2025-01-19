import {
  BarChart,
  LineChart,
  Line,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Clock, Disc, Heart, History, Music2, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

// Esta sería la data real que obtendrías de la API de Last.fm
const mockUserData = {
  name: "example_user",
  playcount: 45872,
  artist_count: 1234,
  track_count: 8765,
  album_count: 2341,
  register_date: "2019-03-15",
};

const topArtists = [
  { name: "The Beatles", plays: 1234 },
  { name: "Pink Floyd", plays: 1123 },
  { name: "Radiohead", plays: 987 },
  { name: "David Bowie", plays: 876 },
  { name: "Queen", plays: 765 },
  { name: "Led Zeppelin", plays: 654 },
  { name: "The Rolling Stones", plays: 543 },
  { name: "Bob Dylan", plays: 432 },
  { name: "The Who", plays: 321 },
  { name: "The Doors", plays: 210 },
];

const topTracks = [
  { name: "Bohemian Rhapsody", artist: "Queen", plays: 145 },
  { name: "Stairway to Heaven", artist: "Led Zeppelin", plays: 134 },
  { name: "Hey Jude", artist: "The Beatles", plays: 123 },
  { name: "Like a Rolling Stone", artist: "Bob Dylan", plays: 112 },
  { name: "Light My Fire", artist: "The Doors", plays: 101 },
];

const listeningHistory = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(2023, i).toLocaleString("default", { month: "short" }),
  scrobbles: Math.floor(Math.random() * 1000) + 500,
}));

export default function UserPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 lg:p-8 space-y-6">
        {/* User Stats Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full lg:col-span-1 bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {mockUserData.name}
              </CardTitle>
              <CardDescription>
                Miembro desde{" "}
                {new Date(mockUserData.register_date).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Music2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Scrobbles</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {mockUserData.playcount.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Artistas</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {mockUserData.artist_count.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Disc className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Álbumes</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {mockUserData.album_count.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Canciones</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {mockUserData.track_count.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Listening History Chart */}
          <Card className="col-span-full lg:col-span-2 bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historial de Escucha
              </CardTitle>
              <CardDescription>Scrobbles por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <LineChart data={listeningHistory}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="scrobbles"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Artists */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle>Top 10 Artistas</CardTitle>
              <CardDescription>Artistas más escuchados</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topArtists} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="plays"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Top Tracks */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle>Top Canciones</CardTitle>
              <CardDescription>Canciones más escuchadas</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full">
                {topTracks.map((track, i) => (
                  <div
                    key={track.name}
                    className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{track.name}</p>
                      <p className="text-sm text-gray-400">{track.artist}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {track.plays}
                      </span>
                      <Music2 className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
