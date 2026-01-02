import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CosmicBackground from "@/components/CosmicBackground";
import MysticButton from "@/components/MysticButton";
import ResultSection from "@/components/ResultSection";
import { InsightResult, BalanceLevel } from "@/types/quiz";
import { 
  Coins, 
  Heart, 
  Brain, 
  Shield, 
  Compass, 
  MessageCircle, 
  RotateCcw,
  Sparkles
} from "lucide-react";

const balanceLevelStyles: Record<BalanceLevel, { bg: string; text: string; label: string }> = {
  Low: { 
    bg: "bg-amber-500/20 border-amber-500/30", 
    text: "text-amber-400",
    label: "Seeking Balance"
  },
  Moderate: { 
    bg: "bg-blue-500/20 border-blue-500/30", 
    text: "text-blue-400",
    label: "Flowing"
  },
  Strong: { 
    bg: "bg-emerald-500/20 border-emerald-500/30", 
    text: "text-emerald-400",
    label: "Aligned"
  }
};

const dimensionConfig = [
  {
    key: "achievementResources" as const,
    title: "Achievement & Resources",
    subtitle: "Success, career momentum, access to resources",
    icon: Coins
  },
  {
    key: "relationshipsConnection" as const,
    title: "Relationships & Connection",
    subtitle: "Love, friendship, emotional bonds, social harmony",
    icon: Heart
  },
  {
    key: "emotionalBalance" as const,
    title: "Emotional Balance",
    subtitle: "Inner stability, calm, emotional regulation",
    icon: Brain
  },
  {
    key: "supportFlow" as const,
    title: "Support & Flow",
    subtitle: "Protection, ease, supportive circumstances",
    icon: Shield
  },
  {
    key: "directionVision" as const,
    title: "Direction & Vision",
    subtitle: "Purpose, long-term direction, sense of meaning",
    icon: Compass
  }
];

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result as InsightResult | undefined;

  // Redirect if no result
  useEffect(() => {
    if (!result) {
      navigate("/");
    }
  }, [result, navigate]);

  if (!result) return null;

  return (
    <div className="relative min-h-screen">
      <CosmicBackground />
      
      <main className="relative z-10 px-6 py-12 max-w-lg mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-serif font-medium mb-2 animate-fade-up">
            <span className="mystic-text-gradient">Your Life Energy Map</span>
          </h1>
          <p className="text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms" }}>
            Five dimensions of your current energetic flow
          </p>
        </header>

        {/* Life Energy Dimensions */}
        <div className="space-y-6">
          {dimensionConfig.map((dimension, index) => {
            const data = result.lifeEnergyMap[dimension.key];
            const Icon = dimension.icon;
            const levelStyle = balanceLevelStyles[data.balanceLevel];

            return (
              <ResultSection
                key={dimension.key}
                title={dimension.title}
                icon={<Icon className="w-5 h-5" />}
                delay={200 + index * 150}
              >
                <div className="space-y-4">
                  {/* Subtitle */}
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {dimension.subtitle}
                  </p>

                  {/* Balance Level Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-full border text-sm font-medium ${levelStyle.bg} ${levelStyle.text}`}>
                      {levelStyle.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({data.balanceLevel})
                    </span>
                  </div>

                  {/* Current State */}
                  <p className="text-foreground/90 leading-relaxed">
                    {data.currentState}
                  </p>

                  {/* Guidance */}
                  <div className="pt-2 border-t border-border/30">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <p className="text-sm text-foreground/80 italic">
                        {data.guidance}
                      </p>
                    </div>
                  </div>
                </div>
              </ResultSection>
            );
          })}

          {/* Overall Insight */}
          <ResultSection
            title="Overall Pattern"
            icon={<Sparkles className="w-5 h-5" />}
            delay={950}
          >
            <p className="text-foreground/90 leading-relaxed">
              {result.overallInsight}
            </p>
          </ResultSection>

          {/* Reflection Question */}
          <ResultSection
            title="Reflection"
            icon={<MessageCircle className="w-5 h-5" />}
            delay={1100}
          >
            <p className="text-lg font-serif italic text-foreground">
              "{result.reflectionQuestion}"
            </p>
          </ResultSection>
        </div>

        {/* Actions */}
        <footer className="mt-12 space-y-4 animate-fade-up" style={{ animationDelay: "1250ms" }}>
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/30 text-center">
            <p className="text-sm text-muted-foreground">
              This map reflects tendencies and patterns, not fixed outcomes. 
              Your awareness and choices continuously shape your energy.
            </p>
          </div>

          <MysticButton
            variant="secondary"
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Explore Again
          </MysticButton>
        </footer>
      </main>
    </div>
  );
};

export default Results;
