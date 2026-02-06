import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const LoadingAnimation = () => {
  const { t } = useLanguage();
  
  const loadingMessages = [
    t('loading.message.1'),
    t('loading.message.2'),
    t('loading.message.3'),
    t('loading.message.4'),
    t('loading.message.5'),
  ];
  const [messageIndex, setMessageIndex] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      {/* Animated cosmic diagram */}
      <div className="relative w-56 h-56">
        {/* Outer mystical ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-rotate-slow" 
          style={{ animationDuration: "12s" }} 
        />
        
        {/* Secondary ring with glow */}
        <div className="absolute inset-3 rounded-full border border-accent/40 animate-rotate-slow shadow-[0_0_30px_hsl(280_70%_55%_/_0.3)]"
          style={{ animationDuration: "8s", animationDirection: "reverse" }}
        />
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-6 rounded-full border border-mystic-violet/30 animate-pulse-slow" />
        
        {/* Inner glowing core with breathing effect */}
        <div className="absolute inset-14 rounded-full bg-gradient-to-br from-primary/40 via-accent/30 to-mystic-violet/40 animate-glow shadow-[0_0_50px_hsl(262_80%_50%_/_0.5)]" />
        
        {/* Center pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_30px_hsl(262_80%_50%_/_0.9)] animate-breathe" />
        </div>
        
        {/* Multiple orbiting elements */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute inset-0 animate-rotate-slow"
            style={{ 
              animationDuration: `${6 + i * 1.5}s`,
              animationDirection: i % 2 === 0 ? "normal" : "reverse"
            }}
          >
            <div
              className="absolute w-2 h-2 rounded-full animate-pulse-slow"
              style={{
                left: "50%",
                top: `${8 + i * 4}%`,
                transform: "translateX(-50%)",
                background: `linear-gradient(135deg, hsl(${262 + i * 10} 80% 60%), hsl(${280 + i * 8} 70% 55%))`,
                boxShadow: `0 0 10px hsl(${262 + i * 10} 80% 50% / 0.6)`,
              }}
            />
          </div>
        ))}

        {/* Rising particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full bg-primary/60 animate-float-particle"
            style={{
              left: `${particle.x}%`,
              bottom: "0%",
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        {/* Multiple flowing light trails */}
        <svg className="absolute inset-0 w-full h-full animate-rotate-slow" style={{ animationDuration: "10s" }}>
          <defs>
            <linearGradient id="trailGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(262 80% 60%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(262 80% 60%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(280 70% 55%)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="trailGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(280 70% 55%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(300 60% 50%)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(262 80% 60%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse
            cx="112"
            cy="112"
            rx="80"
            ry="80"
            fill="none"
            stroke="url(#trailGradient1)"
            strokeWidth="2"
            strokeDasharray="40 120"
          />
        </svg>
        
        <svg className="absolute inset-0 w-full h-full animate-rotate-slow" style={{ animationDuration: "15s", animationDirection: "reverse" }}>
          <ellipse
            cx="112"
            cy="112"
            rx="65"
            ry="65"
            fill="none"
            stroke="url(#trailGradient2)"
            strokeWidth="1.5"
            strokeDasharray="30 100"
          />
        </svg>
      </div>

      {/* Loading message with fade transition */}
      <div className="text-center space-y-2 min-h-[60px]">
        <p 
          className="text-lg text-foreground/90 font-serif animate-fade-up text-glow" 
          key={messageIndex}
        >
          {loadingMessages[messageIndex]}
        </p>
        <div className="flex justify-center gap-1.5 pt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
