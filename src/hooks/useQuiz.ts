import { useState } from "react";
import { QuizAnswers, InsightResult } from "@/types/quiz";
import { quizQuestions } from "@/data/quizQuestions";
import { supabase } from "@/integrations/supabase/client";

export const useQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InsightResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = quizQuestions.length;
  const currentQuestion = quizQuestions[currentStep];

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    const question = currentQuestion;
    const answer = answers[question.id as keyof QuizAnswers];
    
    // Optional questions always allow proceeding
    if (question.type === "optional") return true;
    
    // Other questions need an answer
    return !!answer;
  };

  const isLastStep = currentStep === totalSteps - 1;

  const submitQuiz = async () => {
    setIsLoading(true);
    setError(null);

    // Mock data for preview mode - Eastern-style insight
    const mockResult: InsightResult = {
      lifePhase: {
        phase: "Growth",
        description: "You are in a season of expansion and unfolding. Like spring bamboo pushing through soft earth, your energy seeks expression and new form. This is a time of learning, stretching beyond comfort, and discovering latent strengths."
      },
      coreIdentity: {
        dominantEnergy: "Yang",
        elementalTendency: "Wood",
        tendencies: [
          "Drawn to new beginnings and fresh starts",
          "Natural inclination toward leadership and initiative",
          "Restless when stagnant, thriving in motion",
          "Visionary thinking with long-term perspective"
        ],
        strengthInsight: "Your inner vitality runs deep like roots seeking water. You possess the resilience to bend without breaking and the vision to see beyond present circumstances. Your strength lies in your ability to initiate and inspire."
      },
      focusInsight: {
        currentTheme: "Cultivating patience while maintaining momentum is your present work.",
        supportiveActions: [
          "Begin each day with a moment of stillness before action",
          "Channel your energy into one primary focus rather than scattering across many",
          "Seek mentors or wisdom sources that balance your forward drive"
        ]
      },
      careerLifeFlow: {
        timingInsight: "The current rhythm favors bold moves tempered with strategic pauses. Your professional energy is ascending, making this a fertile period for planting seeds.",
        alignmentAdvice: "Move with your natural current rather than against it. Trust the timing of your instincts while remaining open to unexpected detours that may reveal hidden paths."
      },
      reflectionQuestion: "What would you pursue if you trusted that the timing was already perfect?"
    };

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResult(mockResult);
    setIsLoading(false);
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    currentStep,
    totalSteps,
    currentQuestion,
    answers,
    isLoading,
    result,
    error,
    updateAnswer,
    goNext,
    goBack,
    canProceed,
    isLastStep,
    submitQuiz,
    reset,
  };
};
