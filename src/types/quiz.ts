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
    phase: string;
    description: string;
  };
  coreIdentity: {
    tendencies: string[];
    inclinations: string;
  };
  careerFinances: {
    timing: string;
    opportunities: string;
  };
  reflectionQuestion: string;
}
