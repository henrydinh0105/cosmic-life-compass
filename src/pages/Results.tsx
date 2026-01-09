import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CosmicBackground from "@/components/CosmicBackground";
import MysticButton from "@/components/MysticButton";
import ResultSection from "@/components/ResultSection";
import { InsightResult, BalanceLevel } from "@/types/quiz";
import { Input } from "@/components/ui/input";
import { 
  Coins, 
  Heart, 
  Brain, 
  Shield, 
  Compass, 
  MessageCircle, 
  RotateCcw,
  Sparkles,
  User,
  Zap,
  TrendingUp,
  Calendar,
  Mail
} from "lucide-react";

const balanceLevelStyles: Record<BalanceLevel, { bg: string; text: string; label: string; description: string }> = {
  Low: { 
    bg: "bg-amber-500/20 border-amber-500/30", 
    text: "text-amber-400",
    label: "Seeking Balance",
    description: "This dimension invites attention and conscious cultivation"
  },
  Moderate: { 
    bg: "bg-blue-500/20 border-blue-500/30", 
    text: "text-blue-400",
    label: "Flowing",
    description: "Natural movement with room for deepening"
  },
  Strong: { 
    bg: "bg-emerald-500/20 border-emerald-500/30", 
    text: "text-emerald-400",
    label: "Aligned",
    description: "Natural harmony supporting this life area"
  }
};

const dimensionConfig = [
  {
    key: "achievementResources" as const,
    title: "Achievement & Resources",
    subtitle: "Wealth, Career Momentum, Material Security",
    description: "Corresponding to Tài Bạch (Finance) and Quan Lộc (Career) sectors in Eastern mapping",
    icon: Coins
  },
  {
    key: "relationshipsConnection" as const,
    title: "Relationships & Connection",
    subtitle: "Love, Friendship, Emotional Bonds, Social Harmony",
    description: "Corresponding to Phu Thê (Spouse), Huynh Đệ (Siblings), and Nô Bộc (Allies) sectors",
    icon: Heart
  },
  {
    key: "emotionalBalance" as const,
    title: "Emotional Balance",
    subtitle: "Inner Stability, Calm, Emotional Regulation",
    description: "Corresponding to Phúc Đức (Ancestral Fortune) and Tật Ách (Health/Karma) sectors",
    icon: Brain
  },
  {
    key: "supportFlow" as const,
    title: "Support & Flow",
    subtitle: "Protection, Ease, Supportive Circumstances",
    description: "Corresponding to Thiên Di (Travel/External Relations) and the concept of Lộc Tồn (Natural Fortune)",
    icon: Shield
  },
  {
    key: "directionVision" as const,
    title: "Direction & Vision",
    subtitle: "Purpose, Long-term Direction, Sense of Meaning",
    description: "Corresponding to Mệnh (Self/Destiny) and the Tràng Sinh cycle (Life Phases)",
    icon: Compass
  }
];

const personalityConfig = [
  {
    key: "coreNature" as const,
    title: "Core Nature",
    subtitle: "How you tend to think, respond, and make decisions",
    icon: User
  },
  {
    key: "innerTension" as const,
    title: "Inner Tension",
    subtitle: "Common internal conflicts or imbalance patterns",
    icon: Zap
  },
  {
    key: "growthDirection" as const,
    title: "Growth Direction",
    subtitle: "How you develop best when aligned",
    icon: TrendingUp
  }
];

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result as InsightResult | undefined;
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      console.log("Email submitted for 2026 guidance:", email);
    }
  };

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
            <span className="mystic-text-gradient">Your Complete Reading</span>
          </h1>
          <p className="text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms" }}>
            Personality snapshot and life energy dimensions
          </p>
        </header>

        {/* Personality Snapshot Section */}
        <section className="mb-10">
          <div className="text-center mb-6 animate-fade-up" style={{ animationDelay: "150ms" }}>
            <h2 className="text-xl font-serif font-medium text-foreground mb-1">
              Personality Snapshot
            </h2>
            <p className="text-sm text-muted-foreground">
              Your inner nature and energy operation patterns
            </p>
          </div>

          <div className="space-y-5">
            {personalityConfig.map((item, index) => {
              const Icon = item.icon;
              const content = result.personalitySnapshot[item.key];

              return (
                <ResultSection
                  key={item.key}
                  title={item.title}
                  icon={<Icon className="w-5 h-5" />}
                  delay={200 + index * 100}
                >
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-primary/80">
                      {item.subtitle}
                    </p>
                    <div className="text-foreground/90 leading-relaxed text-sm whitespace-pre-line">
                      {content}
                    </div>
                  </div>
                </ResultSection>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 my-10 animate-fade-up" style={{ animationDelay: "500ms" }}>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <Sparkles className="w-5 h-5 text-primary/60" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Life Energy Map Header */}
        <div className="text-center mb-6 animate-fade-up" style={{ animationDelay: "550ms" }}>
          <h2 className="text-xl font-serif font-medium text-foreground mb-1">
            Life Energy Map
          </h2>
          <p className="text-sm text-muted-foreground">
            Five dimensions of your current energetic flow
          </p>
        </div>

        {/* Life Energy Dimensions */}
        <div className="space-y-6" style={{ animationDelay: "600ms" }}>
          {dimensionConfig.map((dimension, index) => {
            const data = result.lifeEnergyMap[dimension.key];
            const Icon = dimension.icon;
            const levelStyle = balanceLevelStyles[data.balanceLevel];

            return (
              <ResultSection
                key={dimension.key}
                title={dimension.title}
                icon={<Icon className="w-5 h-5" />}
                delay={650 + index * 100}
              >
                <div className="space-y-4">
                  {/* Subtitle & Eastern Context */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground/80">
                      {dimension.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      {dimension.description}
                    </p>
                  </div>

                  {/* Balance Level Badge */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1.5 rounded-full border text-sm font-medium ${levelStyle.bg} ${levelStyle.text}`}>
                        {levelStyle.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({data.balanceLevel})
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {levelStyle.description}
                    </p>
                  </div>

                  {/* Current State - Main Analysis */}
                  <div className="pt-3 border-t border-border/20">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Current Pattern
                    </h4>
                    <p className="text-foreground/90 leading-relaxed text-sm">
                      {data.currentState}
                    </p>
                  </div>

                  {/* Guidance */}
                  <div className="pt-3 border-t border-border/20">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                          Guidance
                        </h4>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {data.guidance}
                        </p>
                      </div>
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
            delay={1200}
          >
            <p className="text-foreground/90 leading-relaxed">
              {result.overallInsight}
            </p>
          </ResultSection>

          {/* Reflection Question */}
          <ResultSection
            title="Reflection"
            icon={<MessageCircle className="w-5 h-5" />}
            delay={1350}
          >
            <p className="text-lg font-serif italic text-foreground">
              "{result.reflectionQuestion}"
            </p>
          </ResultSection>
        </div>

        {/* 2026 Monthly Guidance Email Signup */}
        <section className="mt-12 animate-fade-up" style={{ animationDelay: "1400ms" }}>
          <ResultSection
            title="Understanding Your Rhythm"
            icon={<Calendar className="w-5 h-5" />}
            delay={1450}
          >
            <div className="space-y-5">
              {/* Why timing matters */}
              <div className="space-y-3">
                <p className="text-foreground/90 leading-relaxed text-sm">
                  Self-knowledge is one half of wisdom. The other half is timing — understanding 
                  when to act, when to wait, when to push forward, and when to restore.
                </p>
                <p className="text-foreground/80 leading-relaxed text-sm">
                  In Eastern thought, each month carries its own quality of energy — not as fate, 
                  but as a rhythm you can learn to move with. Like knowing when the tide rises, 
                  you can choose when to set sail.
                </p>
              </div>

              {/* The invitation */}
              <div className="pt-4 border-t border-border/20">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  If you found this reading useful, you may continue with monthly life-cycle 
                  guidance for 2026 — brief insights on each month's energy patterns, delivered 
                  at the start of each cycle.
                </p>
                <p className="text-xs text-muted-foreground/70 italic mb-5">
                  This is entirely optional. No predictions. No obligations. Just a gentle 
                  continuation of awareness.
                </p>

                {/* Email form */}
                {!isSubmitted ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background/50 border-border/40 focus:border-primary/50"
                        required
                      />
                    </div>
                    <MysticButton
                      type="submit"
                      variant="primary"
                      size="default"
                      className="w-full"
                    >
                      Receive 2026 Monthly Guidance
                    </MysticButton>
                    <p className="text-xs text-center text-muted-foreground/60">
                      Your privacy is respected. Unsubscribe anytime.
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-4 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Sparkles className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm text-emerald-400 font-medium">
                      You're all set
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your first monthly guidance will arrive at the start of the cycle.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ResultSection>
        </section>

        {/* Actions */}
        <footer className="mt-10 space-y-4 animate-fade-up" style={{ animationDelay: "1550ms" }}>
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
