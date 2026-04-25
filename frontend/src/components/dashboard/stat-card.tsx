import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-jellyfin/15">
          <Icon className="h-6 w-6 text-jellyfin" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground">{subtext}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
