"use client";

import { useMemo } from "react";
import { Activity, Cpu, MemoryStick, Library } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActiveStreamsPreview } from "@/components/dashboard/active-streams-preview";
import { RecentItems } from "@/components/dashboard/recent-items";

export default function DashboardPage() {
  const fetchSessions = useMemo(() => api.getSessions, []);
  const fetchSystem = useMemo(() => api.getSystemInfo, []);
  const fetchLibrary = useMemo(() => api.getLibraryCounts, []);
  const fetchRecent = useMemo(() => api.getRecentItems, []);

  const { data: sessions, loading: sessionsLoading } = useApi(fetchSessions, 10_000);
  const { data: system, loading: systemLoading } = useApi(fetchSystem, 10_000);
  const { data: library, loading: libraryLoading } = useApi(fetchLibrary, 60_000);
  const { data: recent, loading: recentLoading } = useApi(fetchRecent, 60_000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Übersicht deines Jellyfin-Servers
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sessionsLoading ? (
          <Skeleton className="h-[104px] rounded-xl" />
        ) : (
          <StatCard
            icon={Activity}
            label="Aktive Streams"
            value={sessions?.length ?? 0}
          />
        )}

        {systemLoading ? (
          <Skeleton className="h-[104px] rounded-xl" />
        ) : (
          <StatCard
            icon={Cpu}
            label="CPU-Auslastung"
            value={`${system?.cpu_percent?.toFixed(1) ?? "–"} %`}
          />
        )}

        {systemLoading ? (
          <Skeleton className="h-[104px] rounded-xl" />
        ) : (
          <StatCard
            icon={MemoryStick}
            label="RAM-Auslastung"
            value={`${system?.memory_percent?.toFixed(1) ?? "–"} %`}
            subtext={
              system
                ? `${(system.memory_used / 1_073_741_824).toFixed(1)} / ${(system.memory_total / 1_073_741_824).toFixed(1)} GB`
                : undefined
            }
          />
        )}

        {libraryLoading ? (
          <Skeleton className="h-[104px] rounded-xl" />
        ) : (
          <StatCard
            icon={Library}
            label="Bibliotheks-Elemente"
            value={library?.total_count?.toLocaleString("de-DE") ?? "–"}
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {sessionsLoading ? (
          <Skeleton className="h-[300px] rounded-xl" />
        ) : (
          <ActiveStreamsPreview sessions={sessions ?? []} />
        )}

        {recentLoading ? (
          <Skeleton className="h-[300px] rounded-xl" />
        ) : (
          <RecentItems items={recent ?? []} />
        )}
      </div>
    </div>
  );
}
