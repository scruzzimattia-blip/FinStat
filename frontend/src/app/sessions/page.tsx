"use client";

import { useMemo } from "react";
import { MonitorPlay } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { SessionCard } from "@/components/sessions/session-card";

export default function SessionsPage() {
  const fetchSessions = useMemo(() => api.getSessions, []);
  const { data: sessions, loading, error } = useApi(fetchSessions, 5_000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Aktive Sessions</h1>
        <p className="text-muted-foreground">
          Echtzeit-Übersicht aller aktiven Wiedergaben
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Fehler beim Laden: {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[260px] rounded-xl" />
          ))}
        </div>
      ) : sessions && sessions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card py-16">
          <MonitorPlay className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Keine aktiven Sessions
          </p>
          <p className="text-sm text-muted-foreground/70">
            Sobald jemand etwas abspielt, erscheint es hier.
          </p>
        </div>
      )}
    </div>
  );
}
