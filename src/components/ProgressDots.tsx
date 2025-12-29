import { cn } from "@/lib/utils";

interface ProgressDotsProps {
  total: number;
  current: number;
  className?: string;
}

const ProgressDots = ({ total, current, className }: ProgressDotsProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-2 rounded-full transition-all duration-500",
            index === current
              ? "w-8 bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_hsl(262_80%_50%_/_0.5)]"
              : index < current
              ? "w-2 bg-primary/60"
              : "w-2 bg-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
};

export default ProgressDots;
