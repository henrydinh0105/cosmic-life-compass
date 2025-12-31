import { useState, useCallback } from "react";
import { QuizAnswers, InsightResult } from "@/types/quiz";
import { quizQuestions } from "@/data/quizQuestions";

// Fallback Eastern-style insight based on user answers
const generateFallbackInsight = (answers: QuizAnswers): InsightResult => {
  // Determine element from birth year
  const birthYear = answers.birthDate ? new Date(answers.birthDate).getFullYear() : 2000;
  const lastDigit = birthYear % 10;
  const elements: Record<number, "Wood" | "Fire" | "Earth" | "Metal" | "Water"> = {
    0: "Metal", 1: "Metal", 2: "Water", 3: "Water", 4: "Wood",
    5: "Wood", 6: "Fire", 7: "Fire", 8: "Earth", 9: "Earth"
  };
  const element = elements[lastDigit] || "Wood";

  // Determine Yin/Yang from birth time
  const timeMap: Record<string, "Yin" | "Yang" | "Balanced"> = {
    morning: "Yang", afternoon: "Yang", evening: "Yin", night: "Yin"
  };
  const energy = timeMap[answers.birthTime || "morning"] || "Balanced";

  // Determine life phase from focus answers
  const focusThemes = [answers.lifeFocus, answers.currentAttention, answers.seekClarity].filter(Boolean);
  const phaseMap: Record<string, string> = {
    career: "Growth", relationships: "Harvest", health: "Reflection",
    creativity: "Discovery", finances: "Harvest", spirituality: "Reflection"
  };
  const dominantPhase = focusThemes.length > 0 
    ? (phaseMap[focusThemes[0] as string] || "Growth")
    : "Growth";

  const phaseDescriptions: Record<string, string> = {
    Discovery: "You are in a season of exploration and new beginnings. Like seeds breaking through spring soil, your energy seeks new forms of expression. This is a time for curiosity, experimentation, and planting seeds for future growth.",
    Growth: "You are in a season of expansion and unfolding. Like spring bamboo pushing through soft earth, your energy seeks expression and new form. This is a time of learning, stretching beyond comfort, and discovering latent strengths.",
    Harvest: "You are in a season of gathering and consolidation. Like autumn's abundance, your efforts are coming to fruition. This is a time to collect the rewards of past work and share your gifts with others.",
    Reflection: "You are in a season of introspection and renewal. Like winter's quiet depths, your energy turns inward for restoration. This is a time for contemplation, releasing what no longer serves, and preparing for new cycles."
  };

  return {
    lifePhase: {
      phase: dominantPhase as "Discovery" | "Growth" | "Harvest" | "Reflection",
      description: phaseDescriptions[dominantPhase]
    },
    coreIdentity: {
      dominantEnergy: energy,
      elementalTendency: element,
      tendencies: [
        "Drawn to new beginnings and fresh starts",
        "Natural inclination toward thoughtful reflection",
        "Seeking balance between action and stillness",
        "Intuitive sense of timing and flow"
      ],
      strengthInsight: `Your ${element} nature combined with ${energy} energy creates a unique pattern. You possess the ability to adapt while maintaining your core essence. Your strength lies in your capacity for both action and reflection.`
    },
    focusInsight: {
      currentTheme: "Finding harmony between effort and ease is your present work.",
      supportiveActions: [
        "Begin each day with a moment of intentional stillness",
        "Channel your energy into what truly matters to you",
        "Trust the natural rhythm of progress and pause"
      ]
    },
    careerLifeFlow: {
      timingInsight: "The current rhythm supports thoughtful action. Trust your instincts while remaining open to unexpected opportunities.",
      alignmentAdvice: "Move with your natural current rather than against it. Your choices create your path."
    },
    reflectionQuestion: "What would you pursue if you trusted that your timing is already perfect?"
  };
};

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
    
    if (question.type === "optional") return true;
    return !!answer;
  };

  const isLastStep = currentStep === totalSteps - 1;

  const submitQuiz = useCallback(() => {
    // Generate insight immediately - no loading, no async
    const insight = generateFallbackInsight(answers);
    setResult(insight);
  }, [answers]);

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
