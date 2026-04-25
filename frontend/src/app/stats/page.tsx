"use client";

import { useMemo } from "react";
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
import { WatchChart } from "@/components/stats/watch-chart";

export default function StatsPage() {
  const fetchMostWatched = useMemo(() => api.getMostWatched, []);
  const { data: mostWatched, loading, error } = useApi(fetchMostWatched);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistiken</h1>
        <p className="text-muted-foreground">Letzte 30 Tage</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Fehler beim Laden: {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-[420px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      ) : (
        <>
          <WatchChart data={mostWatched ?? []} />

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Detaillierte Wiedergaben
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mostWatched && mostWatched.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Titel</TableHead>
                      <TableHead>Typ</TableHead>
                      <TableHead className="text-right">Wiedergaben</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mostWatched.map((item, index) => (
                      <TableRow key={item.name}>
                        <TableCell className="font-medium text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {item.play_count}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Keine Daten verfügbar
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
