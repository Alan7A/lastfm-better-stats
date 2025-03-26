import type { EditScrobblesSchema } from "@/components/bulk-edit";
import { wait } from "@/lib/utils";
import type { Scrobble } from "@/types/Scrobbles.types";
import { useMutation } from "@tanstack/react-query";
import { getUnixTime, sub } from "date-fns";
import redaxios from "redaxios";
import type { z } from "zod";
import { deleteScrobble, fetchScrobblePage } from "./scrobbles";

type ScrobblesInfo = z.infer<typeof EditScrobblesSchema>;

interface EditScrobblesParams {
  scrobbleInfo: ScrobblesInfo;
  username: string;
}
interface DeleteScrobblesParams {
  username: string;
  scrobbles: Scrobble[];
  cookies: string;
}

// Buscar scrobbles que coincidan con el track
const findScrobbles = async (params: EditScrobblesParams) => {
  const { scrobbleInfo, username } = params;
  // Fetch all scrobles from the last 14 days
  const scrobbles: Scrobble[] = [];
  const from = getUnixTime(sub(new Date(), { days: 14 }));
  const scrobblesRes = await fetchScrobblePage(username, 1, from);
  scrobbles.push(...scrobblesRes.recenttracks.track);
  if (+scrobblesRes.recenttracks["@attr"].totalPages > 1) {
    // Handle pagination
    for (let i = 2; i <= +scrobblesRes.recenttracks["@attr"].totalPages; i++) {
      const res = await fetchScrobblePage(username, i, from);
      scrobbles.push(...res.recenttracks.track);
    }
  }
  // Filter by artist, album, and track name
  const { originalTrack, originalAlbum, originalArtist } = scrobbleInfo;
  const filteredScrobbles = scrobbles.filter(
    (scrobble) =>
      scrobble.artist["#text"] === originalArtist &&
      scrobble.album["#text"] === originalAlbum &&
      scrobble.name === originalTrack
  );

  // Return the scrobles
  return filteredScrobbles;
};

// Eliminar scrobbles originales
const deleteScrobbles = async (params: DeleteScrobblesParams) => {
  const { scrobbles, username, cookies } = params;

  try {
    for (const scrobble of scrobbles) {
      await deleteScrobble(scrobble, username, cookies);
      await wait(1000); // Rate limiting delay
    }
  } catch (e) {
    console.error("Error deleting scrobbles:", e);
    throw e;
  }
};

interface TransformedScrobble {
  artist: string;
  track: string;
  timestamp: number;
  album: string;
}

// Crear srobbles nuevos con el mismo timestamp que el original
export const createScrobbles = async (scrobbles: TransformedScrobble[]) => {
  try {
    await redaxios.post("/api/batch-scrobble", {
      tracks: scrobbles
    });
  } catch (error) {
    console.error("Error creating scrobbles:", error);
  }
};

export const editScrobbles = async (params: EditScrobblesParams) => {
  const { username, scrobbleInfo } = params;
  const { cookies, correctedArtist, correctedAlbum, correctedTrack } =
    scrobbleInfo;
  const scrobbles = await findScrobbles(params);

  try {
    await deleteScrobbles({ scrobbles, username, cookies });
    const updatedScrobbles = scrobbles.map((scrobble) => ({
      artist: correctedArtist,
      track: correctedTrack,
      album: correctedAlbum,
      timestamp: Number.parseInt(
        scrobble.date?.uts ?? String(Date.now() / 1000)
      )
    }));
    await createScrobbles(updatedScrobbles);
    console.log(`Edited ${scrobbles.length} scrobbles`);
  } catch (error) {
    console.error("Failed to delete scrobbles:", error);
    throw error;
  }
};

export const useEditScrobbles = () => {
  return useMutation({
    mutationFn: editScrobbles
  });
};
