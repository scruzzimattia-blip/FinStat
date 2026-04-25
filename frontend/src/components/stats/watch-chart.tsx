"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MostWatchedItem } from "@/types";

interface WatchChartProps {
  data: MostWatchedItem[];
}

interface TooltipPayloadEntry {
  value: number;
  payload: MostWatchedItem;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0]!;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl">
      <p className="text-sm font-medium text-popover-foreground">
        {item.payload.name}
      </p>
      <p className="text-xs text-muted-foreground">
        {item.payload.type} • {item.value} Wiedergaben
      </p>
    </div>
  );
}

export function WatchChart({ data }: WatchChartProps) {
  const chartData = data.slice(0, 10).map((item) => ({
    ...item,
    shortName:
      item.name.length > 20 ? item.name.slice(0, 18) + "…" : item.name,
  }));

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Meistgesehen</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Keine Daten verfügbar
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(170, 92, 195, 0.1)"
                vertical={false}
              />
              <XAxis
                dataKey="shortName"
                tick={{ fill: "#8b85a6", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                angle={-30}
                textAnchor="end"
                height={80}
              />
              <YAxis
                tick={{ fill: "#8b85a6", fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(170, 92, 195, 0.08)" }}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C78CDB" stopOpacity={1} />
                  <stop offset="100%" stopColor="#AA5CC3" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <Bar
                dataKey="play_count"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
