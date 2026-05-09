import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LoaderCircle } from "lucide-react";

type LoadingCardProps = {
  title: string;
  pagesLoaded: number;
  totalPages: number;
  className?: string;
  minHeightClassName?: string;
  timeRemaining?: string;
};

export const LoadingCard = ({
  title,
  pagesLoaded,
  totalPages,
  className,
  minHeightClassName = "min-h-[280px]",
  timeRemaining
}: LoadingCardProps) => {
  const progressValue =
    totalPages > 0 ? Math.round((pagesLoaded / totalPages) * 100) : 0;

  return (
    <Card className={className}>
      <CardContent
        className={`flex ${minHeightClassName} flex-col items-center justify-center gap-4 text-center`}
      >
        <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
        <div className="space-y-2">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">
            {pagesLoaded} of {totalPages} pages loaded
          </p>
        </div>
        <Progress value={progressValue} className="max-w-sm" />
        {timeRemaining && pagesLoaded > 0 && (
          <p className="text-xs text-muted-foreground">
            About {timeRemaining} remaining
          </p>
        )}
      </CardContent>
    </Card>
  );
};
