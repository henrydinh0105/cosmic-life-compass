import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CosmicBackground from "@/components/CosmicBackground";
import MysticButton from "@/components/MysticButton";
import ProgressDots from "@/components/ProgressDots";
import QuizCard from "@/components/QuizCard";
import { useQuiz } from "@/hooks/useQuiz";
import { ArrowLeft, Calendar, Clock, User, Compass, Eye, Sparkles } from "lucide-react";

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

  // Navigate to results immediately when result is set
  useEffect(() => {
    if (result) {
      navigate("/results", { state: { result } });
    }
  }, [result, navigate]);

  const handleNext = () => {
    if (isLastStep) {
      submitQuiz();
    } else {
      goNext();
    }
  };

  const currentAnswer = answers[currentQuestion.id as keyof typeof answers];

  return (
    <div className="relative min-h-screen flex flex-col">
      <CosmicBackground />
      
      <main className="relative z-10 flex-1 flex flex-col px-6 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={currentStep === 0 ? () => navigate("/") : goBack}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <ProgressDots total={totalSteps} current={currentStep} />
          <div className="w-10" /> {/* Spacer for alignment */}
        </header>

        {/* Question content */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          {/* Icon */}
          <div className="flex justify-center mb-6 animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center text-primary">
              {iconMap[currentQuestion.id]}
            </div>
          </div>

          {/* Question */}
          <h2 
            className="text-2xl sm:text-3xl font-serif text-center mb-8 animate-fade-up" 
            style={{ animationDelay: "100ms" }}
          >
            {currentQuestion.question}
          </h2>

          {/* Answer options */}
          <div 
            className="space-y-3 animate-fade-up" 
            style={{ animationDelay: "200ms" }}
          >
            {currentQuestion.type === "date" ? (
              <div className="space-y-4">
                <input
                  type="date"
                  value={currentAnswer || ""}
                  onChange={(e) => updateAnswer(currentQuestion.id, e.target.value)}
                  className="w-full p-4 rounded-2xl bg-card/50 border border-border/40 text-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all text-center text-lg"
                  max={new Date().toISOString().split("T")[0]}
                />
                <p className="text-center text-sm text-muted-foreground">
                  Your birth date helps us map your life patterns
                </p>
              </div>
            ) : (
              currentQuestion.options?.map((option) => (
                <QuizCard
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  selected={currentAnswer === option.value}
                  onClick={() => updateAnswer(currentQuestion.id, option.value)}
                />
              ))
            )}
          </div>

          {/* Skip option for optional questions */}
          {currentQuestion.type === "optional" && !currentAnswer && (
            <button
              onClick={handleNext}
              className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip this question
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
            {isLastStep ? "Reveal My Insights" : "Continue"}
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
