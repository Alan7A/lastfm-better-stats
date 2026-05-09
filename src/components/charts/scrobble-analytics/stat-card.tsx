import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
};

export const StatCard = ({
  icon: Icon,
  label,
  value,
  detail
}: StatCardProps) => (
  <Card>
    <CardContent className="flex items-start gap-3 p-4">
      <div className="rounded-md border bg-muted/40 p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="truncate text-2xl font-semibold leading-tight">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{detail}</p>
      </div>
    </CardContent>
  </Card>
);
