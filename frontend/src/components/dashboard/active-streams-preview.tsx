"use client";

import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Session } from "@/types";

interface ActiveStreamsPreviewProps {
  sessions: Session[];
}

function formatProgress(positionTicks: number, runtimeTicks: number): number {
  if (runtimeTicks <= 0) return 0;
  return Math.round((positionTicks / runtimeTicks) * 100);
}

function formatTime(ticks: number): string {
  const totalSeconds = Math.floor(ticks / 10_000_000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function ActiveStreamsPreview({ sessions }: ActiveStreamsPreviewProps) {
  const previewSessions = sessions.slice(0, 3);

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">Aktive Sessions</CardTitle>
        {sessions.length > 0 && (
          <Link
            href="/sessions"
            className="text-sm text-jellyfin hover:text-jellyfin-light transition-colors"
          >
            Alle anzeigen →
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {previewSessions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Keine aktiven Sessions
          </p>
        ) : (
          previewSessions.map((session) => {
            const progress = formatProgress(
              session.play_state.position_ticks,
              session.play_state.runtime_ticks
            );

            return (
              <div
                key={session.id}
                className="flex flex-col gap-2 rounded-lg border border-border/50 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {session.now_playing_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.user_name} • {session.client}
                    </p>
                  </div>
                  <Badge
                    variant={session.play_state.is_paused ? "secondary" : "default"}
                    className="shrink-0"
                  >
                    {session.play_state.is_paused ? (
                      <Pause className="mr-1 h-3 w-3" />
                    ) : (
                      <Play className="mr-1 h-3 w-3" />
                    )}
                    {session.play_state.is_paused ? "Pausiert" : "Läuft"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {formatTime(session.play_state.position_ticks)} /{" "}
                    {formatTime(session.play_state.runtime_ticks)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
