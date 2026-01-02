import { useState, useCallback } from "react";
import { QuizAnswers, InsightResult, BalanceLevel } from "@/types/quiz";
import { quizQuestions } from "@/data/quizQuestions";

// Determine element from birth year (Five Elements)
const getElement = (birthYear: number): "Wood" | "Fire" | "Earth" | "Metal" | "Water" => {
  const lastDigit = birthYear % 10;
  const elements: Record<number, "Wood" | "Fire" | "Earth" | "Metal" | "Water"> = {
    0: "Metal", 1: "Metal", 2: "Water", 3: "Water", 4: "Wood",
    5: "Wood", 6: "Fire", 7: "Fire", 8: "Earth", 9: "Earth"
  };
  return elements[lastDigit] || "Wood";
};

// Determine Yin/Yang from birth time
const getEnergy = (birthTime: string | undefined): "Yin" | "Yang" => {
  const timeMap: Record<string, "Yin" | "Yang"> = {
    morning: "Yang", afternoon: "Yang", evening: "Yin", night: "Yin"
  };
  return timeMap[birthTime || "morning"] || "Yang";
};

// Determine balance level based on element and focus alignment
const getBalanceLevel = (element: string, focus: string | undefined, dimension: string): BalanceLevel => {
  // Element affinities for each dimension
  const affinities: Record<string, Record<string, string[]>> = {
    achievementResources: { strong: ["Metal", "Fire"], moderate: ["Earth", "Wood"], low: ["Water"] },
    relationshipsConnection: { strong: ["Water", "Wood"], moderate: ["Earth", "Fire"], low: ["Metal"] },
    emotionalBalance: { strong: ["Earth", "Water"], moderate: ["Metal", "Wood"], low: ["Fire"] },
    supportFlow: { strong: ["Wood", "Earth"], moderate: ["Water", "Metal"], low: ["Fire"] },
    directionVision: { strong: ["Fire", "Wood"], moderate: ["Metal", "Water"], low: ["Earth"] }
  };

  const dimAffinity = affinities[dimension];
  if (dimAffinity?.strong.includes(element)) return "Strong";
  if (dimAffinity?.low.includes(element)) return "Low";
  return "Moderate";
};

// Generate Life Energy Map insight based on user answers
const generateFallbackInsight = (answers: QuizAnswers): InsightResult => {
  const birthYear = answers.birthDate ? new Date(answers.birthDate).getFullYear() : 2000;
  const element = getElement(birthYear);
  const energy = getEnergy(answers.birthTime);
  const focus = answers.lifeFocus || answers.currentAttention || "career";

  // Element descriptions for context
  const elementQualities: Record<string, string> = {
    Wood: "growth-oriented and adaptable",
    Fire: "passionate and transformative",
    Earth: "stable and nurturing",
    Metal: "precise and determined",
    Water: "intuitive and flowing"
  };

  const elementQuality = elementQualities[element];

  return {
    lifeEnergyMap: {
      achievementResources: {
        currentState: energy === "Yang" 
          ? `Your ${element} nature combined with active Yang energy creates momentum in material pursuits. You have a natural drive toward building and acquiring, though the current flow suggests measured action over aggressive pursuit.`
          : `Your ${element} nature paired with receptive Yin energy favors a quieter approach to achievement. Resources may come through patience and strategic positioning rather than direct pursuit.`,
        balanceLevel: getBalanceLevel(element, focus, "achievementResources"),
        guidance: focus === "career" || focus === "finances"
          ? "Your current attention aligns with this dimension. Channel your energy into sustainable growth rather than quick gains. Small consistent actions compound over time."
          : "Consider whether your current focus leaves room for material foundations. Balance spiritual or relational pursuits with practical stability."
      },
      relationshipsConnection: {
        currentState: energy === "Yin"
          ? `Being ${elementQuality} with Yin energy, you naturally attune to others' emotional currents. Your connections tend toward depth over breadth, quality over quantity.`
          : `Your ${element} element with Yang energy brings vitality to relationships but may sometimes prioritize action over listening. The current balance suggests openness to receiving as well as giving.`,
        balanceLevel: getBalanceLevel(element, focus, "relationshipsConnection"),
        guidance: focus === "relationships"
          ? "You're already attuned to this dimension. Deepen existing bonds through presence rather than grand gestures. Silence shared can be as connecting as words."
          : "Relationships thrive on attention. Even brief moments of genuine presence nourish connection. Consider where you might offer more stillness and less doing."
      },
      emotionalBalance: {
        currentState: element === "Water" || element === "Earth"
          ? `Your ${element} nature provides an inherent anchor for emotional regulation. There is a steadiness available to you, even when external circumstances create turbulence.`
          : `The ${element} element can bring intensity to your emotional landscape. This is neither good nor bad—simply energy seeking expression. Awareness of these currents helps you navigate rather than be carried.`,
        balanceLevel: getBalanceLevel(element, focus, "emotionalBalance"),
        guidance: energy === "Yin"
          ? "Your receptive energy allows for processing emotions deeply. Honor this by creating space for reflection, but avoid getting lost in introspection. Movement—physical or creative—helps energy flow."
          : "Active Yang energy may manifest as restlessness when emotions arise. Physical activity, breath work, or nature time can help ground excess energy without suppressing feeling."
      },
      supportFlow: {
        currentState: element === "Wood" || element === "Earth"
          ? `Your ${element} nature tends to attract supportive circumstances when aligned with its natural rhythm. Like ${element === "Wood" ? "a tree drawing nutrients from soil" : "fertile ground receiving seeds"}, you have capacity to receive what you need.`
          : `The ${element} element may sometimes create a sense of pushing against resistance. This isn't fate—it's an invitation to examine where flow might be blocked and where effort might be redirected.`,
        balanceLevel: getBalanceLevel(element, focus, "supportFlow"),
        guidance: "Notice where life feels effortless versus forced. Ease is often a signal of alignment. When resistance appears, pause before pushing harder—sometimes the path of least resistance leads somewhere better."
      },
      directionVision: {
        currentState: answers.seekClarity
          ? `Your seeking clarity around ${answers.seekClarity} reflects a natural pull toward understanding your direction. The ${element} element influences how you envision possibility—${element === "Fire" ? "with bold strokes" : element === "Water" ? "with fluid adaptability" : element === "Wood" ? "with organic unfolding" : element === "Metal" ? "with clear precision" : "with grounded practicality"}.`
          : `Your ${element} nature shapes how vision emerges for you. Rather than forcing clarity, you may find direction reveals itself through ${energy === "Yin" ? "quiet reflection and allowing" : "engaged exploration and testing"}.`,
        balanceLevel: getBalanceLevel(element, focus, "directionVision"),
        guidance: "Purpose often clarifies through action rather than thought alone. Take small steps in directions that intrigue you. The path becomes visible by walking, not by standing still and planning."
      }
    },
    overallInsight: `Your ${element} element with ${energy} energy creates a distinct pattern across these five dimensions. ${
      energy === "Yang" 
        ? "There is an active, outward-moving quality to your current state—a readiness to engage and create." 
        : "There is a receptive, inward-turning quality to your current state—a capacity for depth and integration."
    } No dimension exists in isolation; they influence each other continuously. Where you place attention shapes the whole. These patterns are tendencies, not destinations—awareness allows choice, and choice shapes change.`,
    reflectionQuestion: focus === "spirituality"
      ? "What would change if you trusted that you are already exactly where you need to be?"
      : focus === "relationships"
      ? "What would you offer to others if you weren't waiting to feel ready?"
      : focus === "health"
      ? "What is your body trying to tell you that you haven't been ready to hear?"
      : focus === "creativity"
      ? "What would you create if you knew no one would ever see it?"
      : "What would you pursue if the outcome didn't matter—only the journey?"
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
