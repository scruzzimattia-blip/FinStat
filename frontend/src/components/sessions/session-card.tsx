"use client";

import {
  Play,
  Pause,
  Monitor,
  Zap,
  ArrowRightLeft,
  VolumeX,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Session } from "@/types";

interface SessionCardProps {
  session: Session;
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

function formatBitrate(bitrate: number): string {
  if (bitrate >= 1_000_000) {
    return `${(bitrate / 1_000_000).toFixed(1)} Mbps`;
  }
  return `${(bitrate / 1_000).toFixed(0)} kbps`;
}

function getProgress(positionTicks: number, runtimeTicks: number): number {
  if (runtimeTicks <= 0) return 0;
  return Math.round((positionTicks / runtimeTicks) * 100);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function SessionCard({ session }: SessionCardProps) {
  const progress = getProgress(
    session.play_state.position_ticks,
    session.play_state.runtime_ticks
  );

  return (
    <Card className="border-border/50">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 border border-border/50">
            <AvatarFallback className="bg-jellyfin/15 text-jellyfin text-sm font-medium">
              {getInitials(session.user_name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{session.user_name}</p>
            <p className="text-xs text-muted-foreground">
              {session.client} • {session.device_name}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {session.play_state.is_muted && (
              <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                <VolumeX className="mr-1 h-3 w-3" />
                Stumm
              </Badge>
            )}
            <Badge
              variant={session.play_state.is_paused ? "secondary" : "default"}
            >
              {session.play_state.is_paused ? (
                <Pause className="mr-1 h-3 w-3" />
              ) : (
                <Play className="mr-1 h-3 w-3" />
              )}
              {session.play_state.is_paused ? "Pausiert" : "Wiedergabe"}
            </Badge>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">
            {session.now_playing_name}
            {session.now_playing_year > 0 && (
              <span className="text-muted-foreground">
                {" "}
                ({session.now_playing_year})
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {session.now_playing_type}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatTime(session.play_state.position_ticks)}</span>
            <span>{progress}%</span>
            <span>{formatTime(session.play_state.runtime_ticks)}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex flex-wrap gap-2">
          {session.transcode_info.is_transcoding ? (
            <Badge variant="outline" className="text-amber-400 border-amber-400/30">
              <ArrowRightLeft className="mr-1 h-3 w-3" />
              Transcoding
              {session.transcode_info.video_codec && (
                <span className="ml-1 opacity-75">
                  {session.transcode_info.video_codec}
                </span>
              )}
              {session.transcode_info.completion_percentage > 0 && (
                <span className="ml-1 opacity-75">
                  ({session.transcode_info.completion_percentage}%)
                </span>
              )}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">
              <Zap className="mr-1 h-3 w-3" />
              Direct Play
            </Badge>
          )}

          {session.media_info.resolution && (
            <Badge variant="outline">
              <Monitor className="mr-1 h-3 w-3" />
              {session.media_info.resolution}
            </Badge>
          )}

          {session.media_info.bitrate > 0 && (
            <Badge variant="outline">
              {formatBitrate(session.media_info.bitrate)}
            </Badge>
          )}

          {session.media_info.container && (
            <Badge variant="outline">
              {session.media_info.container.toUpperCase()}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
