"use client";

import { useGetScrobbles } from "@/api/scrobbles";
import { useGetUser } from "@/api/user";
import type { Period } from "@/types/Common.types";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { buildAnalytics, getPeriodRange } from "./utils";

export const useScrobbleAnalytics = (period: Period) => {
  const { username } = useParams<{ username: string }>();
  const { data: user } = useGetUser(username);
  const scrobblesQuery = useGetScrobbles(user);
  const range = useMemo(() => getPeriodRange(period, 0), [period]);

  const analytics = useMemo(() => {
    if (!scrobblesQuery.data) return null;
    return buildAnalytics(scrobblesQuery.data, period, range);
  }, [scrobblesQuery.data, period, range]);

  return {
    user,
    scrobbles: scrobblesQuery.data,
    progress: scrobblesQuery.progress,
    calculateTimeRemaining: scrobblesQuery.calculateTimeRemaining,
    range,
    analytics
  };
};
