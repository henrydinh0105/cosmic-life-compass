import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import CosmicBackground from "@/components/CosmicBackground";
import MysticButton from "@/components/MysticButton";
import ResultSection from "@/components/ResultSection";
import { InsightResult, BalanceLevel } from "@/types/quiz";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
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
  Mail,
  Eye,
  Scale,
  Star
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

const dimensionConfigKeys = [
  {
    key: "achievementResources" as const,
    titleKey: "results.achievement",
    subtitleKey: "results.achievement.subtitle",
    descriptionKey: "results.achievement.context",
    icon: Coins
  },
  {
    key: "relationshipsConnection" as const,
    titleKey: "results.connection",
    subtitleKey: "results.connection.subtitle",
    descriptionKey: "results.connection.context",
    icon: Heart
  },
  {
    key: "emotionalBalance" as const,
    titleKey: "results.emotional",
    subtitleKey: "results.emotional.subtitle",
    descriptionKey: "results.emotional.context",
    icon: Brain
  },
  {
    key: "supportFlow" as const,
    titleKey: "results.support",
    subtitleKey: "results.support.subtitle",
    descriptionKey: "results.support.context",
    icon: Shield
  },
  {
    key: "directionVision" as const,
    titleKey: "results.direction",
    subtitleKey: "results.direction.subtitle",
    descriptionKey: "results.direction.context",
    icon: Compass
  }
];

const personalityConfigKeys = [
  {
    key: "coreNature" as const,
    titleKey: "results.coreNature",
    subtitleKey: "results.coreNature.subtitle",
    icon: User
  },
  {
    key: "naturalStrength" as const,
    titleKey: "results.naturalStrength",
    subtitleKey: "results.naturalStrength.subtitle",
    icon: Star
  },
  {
    key: "blindSpot" as const,
    titleKey: "results.blindSpot",
    subtitleKey: "results.blindSpot.subtitle",
    icon: Eye
  },
  {
    key: "innerTension" as const,
    titleKey: "results.innerTension",
    subtitleKey: "results.innerTension.subtitle",
    icon: Scale
  },
  {
    key: "growthDirection" as const,
    titleKey: "results.growthDirection",
    subtitleKey: "results.growthDirection.subtitle",
    icon: TrendingUp
  }
];

const getRecognitionScoreOptions = (t: (key: string) => string) => [
  { value: 20, label: "20%", description: t('results.recognition.20') },
  { value: 40, label: "40%", description: t('results.recognition.40') },
  { value: 60, label: "60%", description: t('results.recognition.60') },
  { value: 80, label: "80%", description: t('results.recognition.80') },
  { value: 100, label: "100%", description: t('results.recognition.100') }
];

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useLanguage();
  const result = location.state?.result as InsightResult | undefined;
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recognitionScore, setRecognitionScore] = useState<number | null>(null);
  const [isEntering, setIsEntering] = useState(true);
  const emailSubmittedRef = useRef(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && !emailSubmittedRef.current) {
      setIsSubmitting(true);
      emailSubmittedRef.current = true;
      
      try {
        const { error } = await supabase
          .from("email_subscribers")
          .insert({
            email: email.trim(),
            language: language
          });

        if (error) {
          // If duplicate email, still show success
          if (error.code !== "23505") {
            console.error("Error saving email:", error);
          }
        }
        
        setIsSubmitted(true);
      } catch (err) {
        console.error("Failed to save email:", err);
        setIsSubmitted(true); // Still show success to user
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Redirect if no result
  useEffect(() => {
    if (!result) {
      navigate("/");
    }
  }, [result, navigate]);

  // Entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsEntering(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!result) return null;

  return (
    <div className={`relative min-h-screen transition-all duration-1000 ${isEntering ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <CosmicBackground />
      
      {/* Entrance sparkle overlay */}
      <div className={`fixed inset-0 z-20 pointer-events-none transition-opacity duration-1000 ${isEntering ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent animate-pulse" />
      </div>
      
      <main className="relative z-10 px-6 py-12 max-w-lg mx-auto">
        {/* Header with dramatic entrance */}
        <header className="text-center mb-10">
          <div className="animate-scale-fade-in">
            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4 animate-breathe" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium mb-2 animate-slide-up-fade">
            <span className="mystic-text-gradient">{t('results.title')}</span>
          </h1>
          <p className="text-muted-foreground animate-slide-up-fade" style={{ animationDelay: "200ms" }}>
            {t('results.subtitle')}
          </p>
        </header>

        {/* Personality Snapshot Section */}
        <section className="mb-10">
          <div className="text-center mb-6 animate-fade-up" style={{ animationDelay: "150ms" }}>
            <h2 className="text-xl font-serif font-medium text-foreground mb-1">
              {t('results.personality')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('results.personality.subtitle')}
            </p>
          </div>

          <div className="space-y-5">
            {personalityConfigKeys.map((item, index) => {
              const Icon = item.icon;
              const content = result.personalitySnapshot[item.key];

              return (
                <ResultSection
                  key={item.key}
                  title={t(item.titleKey)}
                  icon={<Icon className="w-5 h-5" />}
                  delay={200 + index * 100}
                >
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-primary/80">
                      {t(item.subtitleKey)}
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

        {/* Self-Recognition Score */}
        <section className="mb-10 animate-fade-up" style={{ animationDelay: "700ms" }}>
          <div className="mystic-card rounded-2xl p-6 space-y-5">
            <div className="text-center">
              <h3 className="text-lg font-serif font-medium text-foreground mb-1">
                {t('results.recognition')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('results.recognition.subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {getRecognitionScoreOptions(t).map((option) => (
                <button
                  key={option.value}
                  onClick={() => setRecognitionScore(option.value)}
                  className={`
                    flex flex-col items-center px-4 py-3 rounded-xl border transition-all duration-200
                    ${recognitionScore === option.value 
                      ? "bg-primary/20 border-primary/50 text-primary" 
                      : "bg-secondary/30 border-border/30 hover:border-primary/30 text-foreground/80 hover:text-foreground"
                    }
                  `}
                >
                  <span className="text-lg font-semibold">{option.label}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{option.description}</span>
                </button>
              ))}
            </div>

            {recognitionScore !== null && (
              <div className="pt-4 border-t border-border/20 text-center animate-fade-up">
                <p className="text-sm text-foreground/70 italic leading-relaxed">
                  {t('results.recognition.message')}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 my-10 animate-fade-up" style={{ animationDelay: "750ms" }}>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <Sparkles className="w-5 h-5 text-primary/60" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Life Energy Map Header */}
        <div className="text-center mb-6 animate-fade-up" style={{ animationDelay: "800ms" }}>
          <h2 className="text-xl font-serif font-medium text-foreground mb-1">
            {t('results.lifeEnergy')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('results.lifeEnergy.subtitle')}
          </p>
        </div>

        {/* Life Energy Dimensions */}
        <div className="space-y-6" style={{ animationDelay: "850ms" }}>
          {dimensionConfigKeys.map((dimension, index) => {
            const data = result.lifeEnergyMap[dimension.key];
            const Icon = dimension.icon;
            const levelStyle = balanceLevelStyles[data.balanceLevel];

            return (
              <ResultSection
                key={dimension.key}
                title={t(dimension.titleKey)}
                icon={<Icon className="w-5 h-5" />}
                delay={900 + index * 100}
              >
                <div className="space-y-4">
                  {/* Subtitle & Eastern Context */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground/80">
                      {t(dimension.subtitleKey)}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      {t(dimension.descriptionKey)}
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
                      {t('results.currentState')}
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
                          {t('results.guidance')}
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
            title={t('results.overall')}
            icon={<Sparkles className="w-5 h-5" />}
            delay={1450}
          >
            <p className="text-foreground/90 leading-relaxed">
              {result.overallInsight}
            </p>
          </ResultSection>

          {/* Reflection Question */}
          <ResultSection
            title={t('results.reflection')}
            icon={<MessageCircle className="w-5 h-5" />}
            delay={1550}
          >
            <p className="text-lg font-serif italic text-foreground">
              "{result.reflectionQuestion}"
            </p>
          </ResultSection>
        </div>

        {/* 2026 Development Guidance */}
        <section className="mt-12 animate-fade-up" style={{ animationDelay: "1650ms" }}>
          <ResultSection
            title={t('results.development2026')}
            icon={<TrendingUp className="w-5 h-5" />}
            delay={1700}
          >
            <div className="space-y-5">
              {/* Introduction */}
              <p className="text-foreground/90 leading-relaxed text-sm">
                {t('results.development2026.intro')}
              </p>

              {/* Quarterly Guidance */}
              <div className="space-y-4 pt-2">
                {/* Q1 */}
                <div className="p-4 rounded-xl bg-secondary/40 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {t('results.development2026.q1.title')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {t('results.development2026.q1.guidance')}
                  </p>
                </div>

                {/* Q2 */}
                <div className="p-4 rounded-xl bg-secondary/40 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {t('results.development2026.q2.title')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {t('results.development2026.q2.guidance')}
                  </p>
                </div>

                {/* Q3 */}
                <div className="p-4 rounded-xl bg-secondary/40 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {t('results.development2026.q3.title')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {t('results.development2026.q3.guidance')}
                  </p>
                </div>

                {/* Q4 */}
                <div className="p-4 rounded-xl bg-secondary/40 border border-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {t('results.development2026.q4.title')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {t('results.development2026.q4.guidance')}
                  </p>
                </div>
              </div>

              {/* Summary advice */}
              <div className="pt-4 border-t border-border/20">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                      {t('results.development2026.keyAdvice.title')}
                    </h4>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {t('results.development2026.keyAdvice.content')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ResultSection>
        </section>

        {/* 2026 Monthly Guidance Email Signup */}
        <section className="mt-8 animate-fade-up" style={{ animationDelay: "1800ms" }}>
          <ResultSection
            title={t('results.guidance2026')}
            icon={<Calendar className="w-5 h-5" />}
            delay={1850}
          >
            <div className="space-y-5">
              {/* Why timing matters */}
              <div className="space-y-3">
                <p className="text-foreground/90 leading-relaxed text-sm">
                  {t('results.guidance2026.intro1')}
                </p>
                <p className="text-foreground/80 leading-relaxed text-sm">
                  {t('results.guidance2026.intro2')}
                </p>
              </div>

              {/* The invitation */}
              <div className="pt-4 border-t border-border/20">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t('results.guidance2026.invitation')}
                </p>
                <p className="text-xs text-muted-foreground/70 italic mb-5">
                  {t('results.guidance2026.optional')}
                </p>

                {/* Email form */}
                {!isSubmitted ? (
                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder={t('results.email.placeholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background/50 border-border/40 focus:border-primary/50"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <MysticButton
                      type="submit"
                      variant="primary"
                      size="default"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('common.loading') : t('results.email.button')}
                    </MysticButton>
                    <p className="text-xs text-center text-muted-foreground/60">
                      {t('results.email.privacy')}
                    </p>
                  </form>
                ) : (
                  <div className="text-center py-4 px-3 rounded-xl bg-primary/10 border border-primary/20">
                    <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-sm text-primary font-medium">
                      {t('results.email.success.title')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('results.email.success.message')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ResultSection>
        </section>

        {/* Actions */}
        <footer className="mt-10 space-y-4 animate-fade-up" style={{ animationDelay: "1800ms" }}>
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border/30 text-center">
            <p className="text-sm text-muted-foreground">
              {t('results.disclaimer')}
            </p>
          </div>

          <MysticButton
            variant="secondary"
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {t('results.startOver')}
          </MysticButton>
        </footer>
      </main>
    </div>
  );
};

export default Results;
