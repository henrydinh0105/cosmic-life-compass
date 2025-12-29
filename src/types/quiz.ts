export interface QuizQuestion {
  id: string;
  question: string;
  type: "select" | "date" | "time" | "optional";
  options?: {
    value: string;
    label: string;
    description?: string;
  }[];
}

export interface QuizAnswers {
  birthDate?: string;
  birthTime?: string;
  gender?: string;
  lifeFocus?: string;
  currentAttention?: string;
  seekClarity?: string;
}

export interface InsightResult {
  lifePhase: {
    phase: "Discovery" | "Growth" | "Harvest" | "Reflection";
    description: string;
  };
  coreIdentity: {
    dominantEnergy: "Yin" | "Yang" | "Balanced";
    elementalTendency: "Wood" | "Fire" | "Earth" | "Metal" | "Water";
    tendencies: string[];
    strengthInsight: string;
  };
  focusInsight: {
    currentTheme: string;
    supportiveActions: string[];
  };
  careerLifeFlow: {
    timingInsight: string;
    alignmentAdvice: string;
  };
  reflectionQuestion: string;
}
