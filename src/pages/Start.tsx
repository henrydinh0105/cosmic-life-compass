import { useNavigate } from "react-router-dom";
import CosmicBackground from "@/components/CosmicBackground";
import MysticButton from "@/components/MysticButton";
import CircularDiagram from "@/components/CircularDiagram";
import { Sparkles } from "lucide-react";

const Start = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col">
      <CosmicBackground />
      
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Decorative top element */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2">
          <Sparkles className="w-6 h-6 text-primary/60 animate-pulse-slow" />
        </div>

        {/* Central content */}
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          {/* Circular diagram as decorative element */}
          <div className="mb-12 animate-float">
            <CircularDiagram size="lg" phase="Discovery" />
          </div>

          {/* Hero text */}
          <h1 className="text-3xl sm:text-4xl font-serif font-medium mb-4 leading-tight animate-fade-up">
            <span className="mystic-text-gradient">What phase of life</span>
            <br />
            <span className="text-foreground">are you in right now?</span>
          </h1>

          <p className="text-muted-foreground text-lg mb-12 animate-fade-up" style={{ animationDelay: "200ms" }}>
            Discover the patterns that shape your journey
          </p>

          {/* CTA Button */}
          <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
            <MysticButton
              size="lg"
              onClick={() => navigate("/quiz")}
            >
              Begin My Life Insight
            </MysticButton>
          </div>
        </div>

        {/* Decorative bottom elements */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-muted-foreground/50 text-sm">
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <span>3 minutes to clarity</span>
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </main>
    </div>
  );
};

export default Start;
