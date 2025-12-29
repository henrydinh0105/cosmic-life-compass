import { useEffect, useState } from "react";

const loadingMessages = [
  "Aligning your life patterns…",
  "Reading the cosmic influences…",
  "Mapping your personal journey…",
  "Gathering insights…",
];

const LoadingAnimation = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-12">
      {/* Animated circular diagram */}
      <div className="relative w-48 h-48">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-rotate-slow" />
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-4 rounded-full border border-accent/30 animate-pulse-slow" />
        
        {/* Inner glowing core */}
        <div className="absolute inset-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 animate-glow" />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_20px_hsl(262_80%_50%_/_0.8)]" />
        </div>
        
        {/* Orbiting dots */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-0 animate-rotate-slow"
            style={{ 
              animationDuration: `${8 + i * 2}s`,
              animationDirection: i % 2 === 0 ? "normal" : "reverse"
            }}
          >
            <div
              className="absolute w-2 h-2 rounded-full bg-primary/60"
              style={{
                left: "50%",
                top: `${10 + i * 5}%`,
                transform: "translateX(-50%)",
              }}
            />
          </div>
        ))}

        {/* Flowing light trails */}
        <svg className="absolute inset-0 w-full h-full animate-rotate-slow" style={{ animationDuration: "15s" }}>
          <defs>
            <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(262 80% 60%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(262 80% 60%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(280 70% 55%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse
            cx="96"
            cy="96"
            rx="70"
            ry="70"
            fill="none"
            stroke="url(#trailGradient)"
            strokeWidth="1"
            strokeDasharray="60 140"
          />
        </svg>
      </div>

      {/* Loading message */}
      <p className="text-lg text-muted-foreground font-serif italic animate-fade-up" key={messageIndex}>
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingAnimation;
