"use client";

import { Film, Tv, Music } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RecentItem } from "@/types";

interface RecentItemsProps {
  items: RecentItem[];
}

const typeConfig: Record<string, { label: string; icon: typeof Film; className: string }> = {
  Movie: { label: "Film", icon: Film, className: "bg-blue-500/15 text-blue-400" },
  Series: { label: "Serie", icon: Tv, className: "bg-emerald-500/15 text-emerald-400" },
  Episode: { label: "Episode", icon: Tv, className: "bg-emerald-500/15 text-emerald-400" },
  Audio: { label: "Musik", icon: Music, className: "bg-amber-500/15 text-amber-400" },
  MusicAlbum: { label: "Album", icon: Music, className: "bg-amber-500/15 text-amber-400" },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function RecentItems({ items }: RecentItemsProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Kürzlich hinzugefügt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Keine neuen Elemente
          </p>
        ) : (
          items.slice(0, 8).map((item) => {
            const config = typeConfig[item.type] ?? typeConfig.Movie!;
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.year > 0 && `${item.year} • `}
                    {formatDate(item.date_added)}
                  </p>
                </div>
                <Badge variant="outline" className={config.className}>
                  {config.label}
                </Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
