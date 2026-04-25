"use client";

import { useMemo } from "react";
import { History } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";

const typeBadgeStyles: Record<string, string> = {
  Movie: "bg-blue-500/15 text-blue-400 border-blue-400/30",
  Episode: "bg-emerald-500/15 text-emerald-400 border-emerald-400/30",
  Audio: "bg-amber-500/15 text-amber-400 border-amber-400/30",
};

const typeLabels: Record<string, string> = {
  Movie: "Film",
  Episode: "Episode",
  Audio: "Musik",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const fetchHistory = useMemo(() => api.getHistory, []);
  const { data: history, loading, error } = useApi(fetchHistory);

  const sortedHistory = useMemo(() => {
    if (!history) return [];
    return [...history].sort(
      (a, b) =>
        new Date(b.date_played).getTime() - new Date(a.date_played).getTime()
    );
  }, [history]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Wiedergabe-Verlauf
        </h1>
        <p className="text-muted-foreground">
          Alle bisherigen Wiedergaben auf deinem Server
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Fehler beim Laden: {error}
        </div>
      )}

      {loading ? (
        <Skeleton className="h-[500px] rounded-xl" />
      ) : sortedHistory.length > 0 ? (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {sortedHistory.length} Einträge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Benutzer</TableHead>
                  <TableHead>Titel</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead className="text-right">Dauer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.user_name}
                    </TableCell>
                    <TableCell>{entry.item_name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={typeBadgeStyles[entry.item_type] ?? ""}
                      >
                        {typeLabels[entry.item_type] ?? entry.item_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(entry.date_played)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {entry.play_duration}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card py-16">
          <History className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Kein Verlauf vorhanden
          </p>
          <p className="text-sm text-muted-foreground/70">
            Wiedergaben werden hier automatisch protokolliert.
          </p>
        </div>
      )}
    </div>
  );
}
