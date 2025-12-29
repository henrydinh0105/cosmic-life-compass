import { cn } from "@/lib/utils";

interface CircularDiagramProps {
  phase?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const CircularDiagram = ({ phase = "Growth", size = "md", className, animated = true }: CircularDiagramProps) => {
  const phases = ["Discovery", "Growth", "Harvest", "Reflection"];
  const activeIndex = phases.indexOf(phase);
  
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

  const innerSizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-44 h-44",
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* Outer rotating ring */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full border-2 border-primary/30",
          animated && "animate-rotate-slow"
        )}
      >
        {/* Phase markers */}
        {phases.map((p, i) => {
          const angle = (i * 90) - 90; // Start from top
          const isActive = i === activeIndex;
          return (
            <div
              key={p}
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                transform: `rotate(${angle}deg) translateY(-50%)`,
                transformOrigin: "0 0",
              }}
            >
              <div
                className={cn(
                  "absolute w-3 h-3 -ml-1.5 rounded-full transition-all duration-500",
                  isActive 
                    ? "bg-primary shadow-[0_0_15px_hsl(262_80%_50%_/_0.8)]" 
                    : "bg-muted-foreground/50"
                )}
                style={{
                  transform: `rotate(${-angle}deg)`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Middle glowing ring */}
      <div className={cn(
        "absolute rounded-full border border-accent/40",
        size === "sm" ? "w-24 h-24" : size === "md" ? "w-36 h-36" : "w-52 h-52",
        animated && "animate-glow"
      )} />

      {/* Inner circle with phase name */}
      <div className={cn(
        "relative flex flex-col items-center justify-center rounded-full bg-gradient-to-br from-secondary/80 to-card/80 border border-border/50 backdrop-blur-sm",
        innerSizeClasses[size]
      )}>
        <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Phase</span>
        <span className={cn(
          "font-serif font-medium mystic-text-gradient",
          size === "sm" ? "text-sm" : size === "md" ? "text-lg" : "text-xl"
        )}>
          {phase}
        </span>
      </div>

      {/* Decorative dots around */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{
              left: "50%",
              top: "50%",
              transform: `rotate(${i * 45}deg) translateY(-${size === "sm" ? 60 : size === "md" ? 90 : 120}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CircularDiagram;
