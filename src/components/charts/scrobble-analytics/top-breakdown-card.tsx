import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Disc3, Music2, Trophy, Users } from "lucide-react";
import { TopList } from "./top-list";
import type { RankedItem } from "./types";

type TopBreakdownCardProps = {
  artists: RankedItem[];
  tracks: RankedItem[];
  albums: RankedItem[];
};

export const TopBreakdownCard = ({
  artists,
  tracks,
  albums
}: TopBreakdownCardProps) => (
  <Card className="xl:col-span-2">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Trophy className="h-5 w-5" />
        Top Breakdown
      </CardTitle>
      <CardDescription>Most repeated music in this period.</CardDescription>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="artists">
        <TabsList className="mb-4">
          <TabsTrigger value="artists" className="gap-2">
            <Users className="h-4 w-4" />
            Artists
          </TabsTrigger>
          <TabsTrigger value="tracks" className="gap-2">
            <Music2 className="h-4 w-4" />
            Tracks
          </TabsTrigger>
          <TabsTrigger value="albums" className="gap-2">
            <Disc3 className="h-4 w-4" />
            Albums
          </TabsTrigger>
        </TabsList>
        <TabsContent value="artists">
          <TopList items={artists} emptyLabel="No artists in this period." />
        </TabsContent>
        <TabsContent value="tracks">
          <TopList items={tracks} emptyLabel="No tracks in this period." />
        </TabsContent>
        <TabsContent value="albums">
          <TopList items={albums} emptyLabel="No albums in this period." />
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);
