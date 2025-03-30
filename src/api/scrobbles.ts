import { axios } from "@/axios";
import type { ProcessedScrobble, Scrobble, ScrobblesResponse } from "@/types/Scrobbles.types";
import type { User } from "@/types/User.types";
import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export async function fetchScrobblePage(
  username: string,
  page: number,
  from = 946681200
) {
  // from 946681200 = Year 2000
  const to = Math.floor(Date.now() / 1000);
  const params = {
    method: "user.getrecenttracks",
    user: username,
    from,
    to,
    limit: 1000,
    page
  };

  const { data } = await axios.get<ScrobblesResponse>("/", { params });

  return data;
}

export function useGetScrobbles(user: User | undefined) {
  if (!user)
    return {
      data: null,
      progress: {
        isComplete: true,
        isError: false,
        isLoading: false,
        currentPage: 0,
        totalPages: 0,
        isSuccess: false
      },
      calculateTimeRemaining: () => ""
    };
  const { name: username, playcount } = user;
  const [startTime] = useState(Date.now());

  // Calcular el número total de páginas
  const totalPages = Math.ceil(Number.parseInt(playcount) / 1000);

  // Queries paralelas para cada página de scrobbles
  const scrobblesQueries = useQueries({
    queries: Array.from({ length: totalPages }, (_, i) => ({
      queryKey: ["scrobbles", username, i + 1],
      queryFn: () => fetchScrobblePage(username, i + 1),
      enabled: !!user, 
      staleTime: Number.POSITIVE_INFINITY, 
      cacheTime: 1000 * 60 * 60 // Caché por 1 hora
    }))
  });

  // Calcular el progreso
  const progress = {
    currentPage: scrobblesQueries.filter((q) => q.isSuccess).length,
    totalPages,
    isComplete: scrobblesQueries.every((q) => q.isSuccess),
    isError: scrobblesQueries.some((q) => q.isError),
    isLoading: scrobblesQueries.some((q) => q.isLoading)
  };

  // Procesar datos cuando todas las queries se completen
  const processedData = useMemo(() => {
    if (!progress.isComplete) return null;

    // Combinar todos los tracks de todas las páginas
    const allTracks = scrobblesQueries.flatMap(
      (query) => query.data?.recenttracks?.track || []
    );

    return processScrobbles(allTracks);
  }, [scrobblesQueries, progress.isComplete]);

  const calculateTimeRemaining = () => {
    const elapsed = Date.now() - startTime;
    const timePerPage = elapsed / progress.currentPage;
    const remainingPages = progress.totalPages - progress.currentPage;
    const remainingTime = remainingPages * timePerPage;

    if (remainingTime < 60000) {
      return "< 1 minute";
    }
    return `~${Math.ceil(remainingTime / 60000)} minutes`;
  };

  return {
    data: processedData,
    progress,
    calculateTimeRemaining
  };
}

// {
//   track: "Stressed Out",
//   artist: "twenty one pilots",
//   album: "Blurryface",
//   albumId: "136434d5-9ddf-4c62-8dcc-021ead11fe0c",
//   date: 1743215535000,
// }
export const processScrobbles = (
  tracks: ScrobblesResponse["recenttracks"]["track"]
) => {
  return tracks.map(track => {
    if (!track.date?.uts) return null; // Skip currently playing track
    return {
      track: track.name,
      artist: track.artist["#text"],
      album: track.album["#text"],
      albumId: track.album.mbid,
      date: Number(track.date.uts) * 1000
    }
  }).filter(Boolean) as ProcessedScrobble[];
}

// export function processScrobbles(
//   tracks: ScrobblesResponse["recenttracks"]["track"]
// ) {
//   return tracks.reduce(
//     (acc, track) => {
//       if (!track.date?.uts) return acc; // Skip currently playing track

//       const artist = track.artist["#text"];
//       const album = track.album["#text"];

//       // Update artist counts
//       acc.artists[artist] = (acc.artists[artist] || 0) + 1;

//       // Update album counts
//       if (album) {
//         acc.albums[`${artist} - ${album}`] =
//           (acc.albums[`${artist} - ${album}`] || 0) + 1;
//       }

//       // Update timeline data
//       const date = new Date(Number.parseInt(track.date.uts) * 1000);
//       const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
//       acc.timeline[yearMonth] = (acc.timeline[yearMonth] || 0) + 1;

//       return acc;
//     },
//     {
//       artists: {} as Record<string, number>,
//       albums: {} as Record<string, number>,
//       timeline: {} as Record<string, number>
//     }
//   );
// }
// // const exampleResponse = {
// //   artists: {
// //     "Artist A": 5,
// //     "Artist B": 3,
// //     "Artist C": 2,
// //   },
// //   albums: {
// //     "Artist A - Album 1": 3,
// //     "Artist A - Album 2": 2,
// //     "Artist B - Album 1": 1,
// //   },
// //   timeline: {
// //     "2023-1": 4, // 4 pistas reproducidas en enero de 2023
// //     "2023-2": 3, // 3 pistas reproducidas en febrero de 2023
// //     "2023-3": 1, // 1 pista reproducida en marzo de 2023
// //   },
// // };

export const deleteScrobble = async (
  scrobble: Scrobble,
  username: string,
  cookies: string
) => {
  const res = await fetch("/api/delete-scrobble", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scrobble, username, cookies })
  });

  const data = await res.json();
  if (data.success) {
    console.log("Scrobble deleted successfully:", data.response);
  } else {
    console.error("Error deleting scrobble:", data.error);
  }
};
