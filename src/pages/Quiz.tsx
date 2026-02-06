import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CosmicBackground from "@/components/CosmicBackground";
import MysticButton from "@/components/MysticButton";
import ProgressDots from "@/components/ProgressDots";
import QuizCard from "@/components/QuizCard";
import { useQuiz } from "@/hooks/useQuiz";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Calendar, Clock, User, Compass, Eye, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const birthTimeOptions = [
  { value: "rat", labelKey: "quiz.time.rat", descKey: "quiz.time.rat.desc" },
  { value: "ox", labelKey: "quiz.time.ox", descKey: "quiz.time.ox.desc" },
  { value: "tiger", labelKey: "quiz.time.tiger", descKey: "quiz.time.tiger.desc" },
  { value: "rabbit", labelKey: "quiz.time.rabbit", descKey: "quiz.time.rabbit.desc" },
  { value: "dragon", labelKey: "quiz.time.dragon", descKey: "quiz.time.dragon.desc" },
  { value: "snake", labelKey: "quiz.time.snake", descKey: "quiz.time.snake.desc" },
  { value: "horse", labelKey: "quiz.time.horse", descKey: "quiz.time.horse.desc" },
  { value: "goat", labelKey: "quiz.time.goat", descKey: "quiz.time.goat.desc" },
  { value: "monkey", labelKey: "quiz.time.monkey", descKey: "quiz.time.monkey.desc" },
  { value: "rooster", labelKey: "quiz.time.rooster", descKey: "quiz.time.rooster.desc" },
  { value: "dog", labelKey: "quiz.time.dog", descKey: "quiz.time.dog.desc" },
  { value: "pig", labelKey: "quiz.time.pig", descKey: "quiz.time.pig.desc" },
  { value: "unknown", labelKey: "quiz.time.unknown", descKey: "quiz.time.unknown.desc" },
];

const iconMap: Record<string, React.ReactNode> = {
  birthDate: <Calendar className="w-5 h-5" />,
  birthTime: <Clock className="w-5 h-5" />,
  gender: <User className="w-5 h-5" />,
  lifeFocus: <Compass className="w-5 h-5" />,
  currentAttention: <Eye className="w-5 h-5" />,
  seekClarity: <Sparkles className="w-5 h-5" />,
};

const Quiz = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    currentStep,
    totalSteps,
    currentQuestion,
    answers,
    updateAnswer,
    goNext,
    goBack,
    canProceed,
    isLastStep,
    submitQuiz,
    isLoading,
    result,
    error,
  } = useQuiz();

  // Animation states
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const prevStepRef = useRef(currentStep);

  // Navigate to loading screen when result is set
  useEffect(() => {
    if (result) {
      navigate("/loading", { state: { result } });
    }
  }, [result, navigate]);

  // Handle step change animations
  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      setSlideDirection(currentStep > prevStepRef.current ? 'left' : 'right');
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
      
      prevStepRef.current = currentStep;
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (isLastStep) {
      submitQuiz();
    } else {
      setSlideDirection('left');
      setIsTransitioning(true);
      setTimeout(() => {
        goNext();
      }, 150);
    }
  };

  const handleBack = () => {
    setSlideDirection('right');
    setIsTransitioning(true);
    setTimeout(() => {
      goBack();
    }, 150);
  };

  const currentAnswer = answers[currentQuestion.id as keyof typeof answers];

  return (
    <div className="relative min-h-screen flex flex-col">
      <CosmicBackground />
      
      <main className="relative z-10 flex-1 flex flex-col px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={currentStep === 0 ? () => navigate("/") : handleBack}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <ProgressDots total={totalSteps} current={currentStep} />
          <div className="w-10" /> {/* Spacer for alignment */}
        </header>

        {/* Question content with transition */}
        <div 
          key={currentStep}
          className={`flex-1 flex flex-col justify-center max-w-md mx-auto w-full transition-all duration-300 ease-out ${
            isTransitioning 
              ? `opacity-0 ${slideDirection === 'left' ? 'translate-x-8' : '-translate-x-8'}` 
              : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Icon */}
          <div className="flex justify-center mb-6 animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center text-primary animate-breathe">
              {iconMap[currentQuestion.id]}
            </div>
          </div>

          {/* Question */}
          <h2 
            className="text-2xl sm:text-3xl font-serif text-center mb-8 animate-fade-up text-glow" 
            style={{ animationDelay: "100ms" }}
          >
            {t(`quiz.${currentQuestion.id}`)}
          </h2>

          {/* Answer options */}
          <div 
            className="space-y-3 animate-fade-up" 
            style={{ animationDelay: "200ms" }}
          >
            {currentQuestion.type === "datetime" ? (
              <div className="space-y-4">
                <input
                  type="date"
                  value={currentAnswer || ""}
                  onChange={(e) => updateAnswer(currentQuestion.id, e.target.value)}
                  className="w-full p-4 rounded-2xl bg-card/50 border border-border/40 text-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-center text-lg"
                  max={new Date().toISOString().split("T")[0]}
                />
                
                {/* Birth Time Selection */}
                <div className="pt-4 border-t border-border/30">
                  <p className="text-center text-sm text-foreground/80 mb-3 text-readable">
                    {t('quiz.time.question')}
                  </p>
                  <Select
                    value={answers.birthTime || ""}
                    onValueChange={(value) => updateAnswer("birthTime", value)}
                  >
                    <SelectTrigger className="w-full p-4 h-auto rounded-2xl bg-card/50 border border-border/40 text-foreground">
                      <SelectValue placeholder={t('quiz.time.selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {birthTimeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="py-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{t(option.labelKey)}</span>
                            <span className="text-xs text-foreground/70">{t(option.descKey)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <p className="text-center text-xs text-foreground/60 pt-2 text-readable">
                  {t('quiz.time.helper')}
                </p>
              </div>
            ) : currentQuestion.type === "date" ? (
              <div className="space-y-4">
                <input
                  type="date"
                  value={currentAnswer || ""}
                  onChange={(e) => updateAnswer(currentQuestion.id, e.target.value)}
                  className="w-full p-4 rounded-2xl bg-card/50 border border-border/40 text-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-center text-lg"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            ) : (
              currentQuestion.options?.map((option) => {
                // Use translation keys for options based on question id and option value
                const labelKey = `quiz.${option.value}`;
                const descKey = `quiz.${option.value}.desc`;
                return (
                  <QuizCard
                    key={option.value}
                    label={t(labelKey)}
                    description={t(descKey)}
                    selected={currentAnswer === option.value}
                    onClick={() => updateAnswer(currentQuestion.id, option.value)}
                  />
                );
              })
            )}
          </div>

          {/* Skip option for optional questions */}
          {currentQuestion.type === "optional" && !currentAnswer && (
            <button
              onClick={handleNext}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('quiz.skip')}
            </button>
          )}
        </div>

        {/* Footer with next button */}
        <footer className="mt-auto pt-8 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <MysticButton
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full"
          >
            {isLastStep ? t('quiz.submit') : t('quiz.next')}
          </MysticButton>
          
          {error && (
            <p className="mt-4 text-center text-sm text-destructive">{error}</p>
          )}
        </footer>
      </main>
    </div>
  );
};

export default Quiz;
