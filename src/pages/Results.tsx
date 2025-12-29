import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CosmicBackground from "@/components/CosmicBackground";
import MysticButton from "@/components/MysticButton";
import CircularDiagram from "@/components/CircularDiagram";
import ResultSection from "@/components/ResultSection";
import { InsightResult } from "@/types/quiz";
import { Compass, Heart, Briefcase, MessageCircle, RotateCcw, Sparkles, Target } from "lucide-react";

const energyLabels = {
  Yin: "Yin — receptive, reflective, inward",
  Yang: "Yang — active, expressive, outward",
  Balanced: "Balanced — harmonized flow"
};

const elementColors = {
  Wood: "text-green-400",
  Fire: "text-orange-400",
  Earth: "text-amber-500",
  Metal: "text-slate-300",
  Water: "text-blue-400"
};

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
            <span className="mystic-text-gradient">Your Life Insight</span>
          </h1>
          <p className="text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms" }}>
            A reflection of your current patterns
          </p>
        </header>

        {/* Life Phase Diagram */}
        <div className="flex justify-center mb-10 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <CircularDiagram 
            phase={result.lifePhase.phase} 
            size="lg" 
            animated={false}
          />
        </div>

        {/* Result sections */}
        <div className="space-y-6">
          {/* Life Phase Overview */}
          <ResultSection 
            title="Life Phase Overview" 
            icon={<Compass className="w-5 h-5" />}
            delay={300}
          >
            <p>{result.lifePhase.description}</p>
          </ResultSection>

          {/* Core Identity */}
          <ResultSection 
            title="Core Identity" 
            icon={<Heart className="w-5 h-5" />}
            delay={450}
          >
            <div className="space-y-4">
              {/* Energy & Element */}
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-foreground">
                  {energyLabels[result.coreIdentity.dominantEnergy]}
                </span>
                <span className={`px-3 py-1.5 rounded-full bg-secondary/50 border border-border/30 text-sm ${elementColors[result.coreIdentity.elementalTendency]}`}>
                  {result.coreIdentity.elementalTendency} Element
                </span>
              </div>
              
              {/* Tendencies */}
              <div className="flex flex-wrap gap-2">
                {result.coreIdentity.tendencies.map((tendency, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 rounded-full bg-secondary/30 border border-border/20 text-sm text-muted-foreground"
                  >
                    {tendency}
                  </span>
                ))}
              </div>
              
              {/* Strength Insight */}
              <p className="text-foreground/90">{result.coreIdentity.strengthInsight}</p>
            </div>
          </ResultSection>

          {/* Focus Insight */}
          <ResultSection 
            title="Current Focus" 
            icon={<Target className="w-5 h-5" />}
            delay={600}
          >
            <div className="space-y-4">
              <p className="font-medium text-foreground">{result.focusInsight.currentTheme}</p>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">Supportive Actions</p>
                <ul className="space-y-2">
                  {result.focusInsight.supportiveActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/90">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ResultSection>

          {/* Career & Life Flow */}
          <ResultSection 
            title="Career & Life Flow" 
            icon={<Briefcase className="w-5 h-5" />}
            delay={750}
          >
            <div className="space-y-3">
              <p><strong className="text-foreground">Timing:</strong> {result.careerLifeFlow.timingInsight}</p>
              <p><strong className="text-foreground">Alignment:</strong> {result.careerLifeFlow.alignmentAdvice}</p>
            </div>
          </ResultSection>

          {/* Reflection Question */}
          <ResultSection 
            title="Reflection Question" 
            icon={<MessageCircle className="w-5 h-5" />}
            delay={900}
          >
            <p className="text-lg font-serif italic text-foreground">
              "{result.reflectionQuestion}"
            </p>
          </ResultSection>
        </div>

        {/* Actions */}
        <footer className="mt-12 space-y-4 animate-fade-up" style={{ animationDelay: "1050ms" }}>
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/30 text-center">
            <p className="text-sm text-muted-foreground">
              This insight reflects patterns and tendencies, not fixed outcomes. 
              Your choices shape your journey.
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
