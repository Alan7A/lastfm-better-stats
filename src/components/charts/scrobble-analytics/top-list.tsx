import type { RankedItem } from "./types";
import { formatNumber } from "./utils";

type TopListProps = {
  items: RankedItem[];
  emptyLabel: string;
};

export const TopList = ({ items, emptyLabel }: TopListProps) => {
  const max = Math.max(...items.map((item) => item.count), 0);

  if (!items.length) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item.name}-${index}`} className="space-y-1.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-medium">{item.name}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {formatNumber(item.count)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${max > 0 ? (item.count / max) * 100 : 0}%`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
