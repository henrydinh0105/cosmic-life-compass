import { useNavigate } from "react-router-dom";
import CosmicBackground from "@/components/CosmicBackground";
import MysticButton from "@/components/MysticButton";
import CircularDiagram from "@/components/CircularDiagram";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles } from "lucide-react";

const Start = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen flex flex-col">
      <CosmicBackground />
      
      {/* Language selector in top right */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>
      
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
            <span className="mystic-text-gradient">{t('start.title')}</span>
          </h1>

          <p className="text-muted-foreground text-lg mb-12 animate-fade-up" style={{ animationDelay: "200ms" }}>
            {t('start.subtitle')}
          </p>

          {/* CTA Button */}
          <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
            <MysticButton
              size="lg"
              onClick={() => navigate("/quiz")}
            >
              {t('start.button')}
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
