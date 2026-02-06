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
            "relative h-2 rounded-full transition-all duration-500",
            index === current
              ? "w-10 bg-gradient-to-r from-primary to-accent shadow-[0_0_15px_hsl(262_80%_50%_/_0.6)]"
              : index < current
              ? "w-2 bg-primary/70 shadow-[0_0_8px_hsl(262_80%_50%_/_0.3)]"
              : "w-2 bg-muted-foreground/30"
          )}
        >
          {/* Animated glow for current step */}
          {index === current && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-sm animate-pulse-slow" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressDots;
