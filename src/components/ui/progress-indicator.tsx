import { Progress } from "@/components/ui/progress";
import type { Progress as ProgressType } from "@/types/Scrobbles.types";

interface ProgressIndicatorProps {
  progress: ProgressType;
  totalScrobbles: number;
  timeRemaining: string;
}

export function ProgressIndicator(props: ProgressIndicatorProps) {
  const { progress, totalScrobbles, timeRemaining } = props;
  const { currentPage, totalPages, isComplete } = progress;
  const progressValue = (currentPage / totalPages) * 100;

  return (
    <div className="space-y-4 w-full max-w-xl">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>Progress</div>
        <div>{Math.round(progressValue)}%</div>
      </div>
      <div className="space-y-2">
        <Progress value={progressValue} className="h-2" />
        <div className="flex justify-between text-sm">
          <span>
            {!isComplete ? (
              <p>
                Loading: {currentPage}/{totalPages} pages ({timeRemaining})
              </p>
            ) : (
              <p>Finished</p>
            )}
          </span>
          <span>Retrieved {totalScrobbles.toLocaleString()} scrobbles</span>
        </div>
      </div>
    </div>
  );
}
