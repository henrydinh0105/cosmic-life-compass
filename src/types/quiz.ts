export interface QuizQuestion {
  id: string;
  question: string;
  type: "select" | "date" | "time" | "optional" | "calendar-type";
  options?: {
    value: string;
    label: string;
    description?: string;
  }[];
}

export interface QuizAnswers {
  birthDate?: string;
  birthHour?: string; // 12 Chi: ty, suu, dan, mao, thin, ti, ngo, mui, than, dau, tuat, hoi
  gender?: "male" | "female";
  calendarType?: "solar" | "lunar";
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

export interface LifeEnergyMap {
  achievementResources: EnergyDimension;
  relationshipsConnection: EnergyDimension;
  emotionalBalance: EnergyDimension;
  supportFlow: EnergyDimension;
  directionVision: EnergyDimension;
}

export interface InsightResult {
  lifeEnergyMap: LifeEnergyMap;
  overallInsight: string;
  reflectionQuestion: string;
  tuViChart?: unknown; // TuViChart data for display
}
