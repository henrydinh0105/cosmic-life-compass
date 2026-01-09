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

export type BalanceLevel = "Low" | "Moderate" | "Strong";

export interface EnergyDimension {
  currentState: string;
  balanceLevel: BalanceLevel;
  guidance: string;
}

export interface PersonalitySnapshot {
  coreNature: string;
  innerTension: string;
  growthDirection: string;
}

export interface LifeEnergyMap {
  achievementResources: EnergyDimension;
  relationshipsConnection: EnergyDimension;
  emotionalBalance: EnergyDimension;
  supportFlow: EnergyDimension;
  directionVision: EnergyDimension;
}

export interface InsightResult {
  personalitySnapshot: PersonalitySnapshot;
  lifeEnergyMap: LifeEnergyMap;
  overallInsight: string;
  reflectionQuestion: string;
}
