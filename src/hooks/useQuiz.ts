import { useState, useCallback } from "react";
import { QuizAnswers, InsightResult, BalanceLevel } from "@/types/quiz";
import { quizQuestions } from "@/data/quizQuestions";

// ===== TU VI NAM PHAI INTERPRETATION SYSTEM =====
// Based on classical Vietnamese astrology principles from authoritative sources

// Celestial Stems (Thiên Can) - 10 elements
const thienCan = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const thienCanElements: Record<string, string> = {
  "Giáp": "Wood", "Ất": "Wood", "Bính": "Fire", "Đinh": "Fire",
  "Mậu": "Earth", "Kỷ": "Earth", "Canh": "Metal", "Tân": "Metal",
  "Nhâm": "Water", "Quý": "Water"
};
const thienCanYinYang: Record<string, "Yin" | "Yang"> = {
  "Giáp": "Yang", "Ất": "Yin", "Bính": "Yang", "Đinh": "Yin",
  "Mậu": "Yang", "Kỷ": "Yin", "Canh": "Yang", "Tân": "Yin",
  "Nhâm": "Yang", "Quý": "Yin"
};

// Earthly Branches (Địa Chi) - 12 positions
const diaChi = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tị", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const diaChiElements: Record<string, string> = {
  "Tý": "Water", "Sửu": "Earth", "Dần": "Wood", "Mão": "Wood",
  "Thìn": "Earth", "Tị": "Fire", "Ngọ": "Fire", "Mùi": "Earth",
  "Thân": "Metal", "Dậu": "Metal", "Tuất": "Earth", "Hợi": "Water"
};
const diaChiYinYang: Record<string, "Yin" | "Yang"> = {
  "Tý": "Yang", "Sửu": "Yin", "Dần": "Yang", "Mão": "Yin",
  "Thìn": "Yang", "Tị": "Yin", "Ngọ": "Yang", "Mùi": "Yin",
  "Thân": "Yang", "Dậu": "Yin", "Tuất": "Yang", "Hợi": "Yin"
};

// Five Elements relationships (Ngũ Hành Sinh Khắc)
const elementGenerates: Record<string, string> = {
  Wood: "Fire", Fire: "Earth", Earth: "Metal", Metal: "Water", Water: "Wood"
};
const elementOvercomes: Record<string, string> = {
  Wood: "Earth", Fire: "Metal", Earth: "Water", Metal: "Wood", Water: "Fire"
};

// Get Can Chi of birth year
const getCanChiYear = (year: number): { can: string; chi: string } => {
  const canIndex = (year - 4) % 10;
  const chiIndex = (year - 4) % 12;
  return { can: thienCan[canIndex], chi: diaChi[chiIndex] };
};

// Get element from Nap Am (納音) - classical element assignment
const getNapAmElement = (year: number): string => {
  const { can, chi } = getCanChiYear(year);
  // Simplified Nap Am calculation based on 60-year cycle position
  const cyclePosition = (year - 4) % 60;
  const napAmGroup = Math.floor(cyclePosition / 2) % 5;
  const elements = ["Metal", "Fire", "Wood", "Water", "Earth"];
  return elements[napAmGroup];
};

// Calculate Menh-Cuc relationship (Mệnh Cục tương sinh/khắc)
const getMenhCucRelation = (menhElement: string, cucElement: string): "generate" | "generated" | "overcome" | "overcome_by" | "same" => {
  if (menhElement === cucElement) return "same";
  if (elementGenerates[menhElement] === cucElement) return "generate"; // Mệnh sinh Cục - very good
  if (elementGenerates[cucElement] === menhElement) return "generated"; // Cục sinh Mệnh - good
  if (elementOvercomes[menhElement] === cucElement) return "overcome"; // Mệnh khắc Cục - less favorable
  return "overcome_by"; // Cục khắc Mệnh - unfavorable
};

// Birth time to Chi position
const birthTimeToChiIndex = (birthTime: string): number => {
  const timeMap: Record<string, number> = {
    "rat": 0, "ox": 1, "tiger": 2, "rabbit": 3, "dragon": 4, "snake": 5,
    "horse": 6, "goat": 7, "monkey": 8, "rooster": 9, "dog": 10, "pig": 11,
    "morning": 3, "afternoon": 6, "evening": 9, "night": 0, "unknown": 6
  };
  return timeMap[birthTime] || 6;
};

// Determine balance level based on Tu Vi principles
const getBalanceLevel = (
  yearElement: string, 
  birthChi: string,
  focus: string, 
  dimension: string,
  gender: string
): BalanceLevel => {
  const chiElement = diaChiElements[birthChi] || "Earth";
  const chiYinYang = diaChiYinYang[birthChi] || "Yang";
  
  // Element compatibility matrix based on Tu Vi principles
  const dimensionElements: Record<string, string[]> = {
    achievementResources: ["Metal", "Fire"], // Tài Lộc, Quan Lộc
    relationshipsConnection: ["Water", "Wood"], // Phu Thê, Huynh Đệ
    emotionalBalance: ["Earth", "Water"], // Phúc Đức, Tật Ách
    supportFlow: ["Wood", "Earth"], // Thiên Di, Nô Bộc
    directionVision: ["Fire", "Wood"] // Mệnh, Quan Lộc
  };
  
  const favoredElements = dimensionElements[dimension] || ["Earth"];
  
  // Check if year element is favored
  const elementScore = favoredElements.includes(yearElement) ? 2 : 
                       favoredElements.includes(chiElement) ? 1 : 0;
  
  // Yin-Yang harmony bonus (Dương cư Dương vị, Âm cư Âm vị)
  const genderYinYang = gender === "male" ? "Yang" : "Yin";
  const harmonyBonus = genderYinYang === chiYinYang ? 1 : 0;
  
  const totalScore = elementScore + harmonyBonus;
  
  if (totalScore >= 3) return "Strong";
  if (totalScore >= 1) return "Moderate";
  return "Low";
};

// Generate detailed insight content
const generateFallbackInsight = (answers: QuizAnswers): InsightResult => {
  const birthYear = answers.birthDate ? new Date(answers.birthDate).getFullYear() : 2000;
  const { can, chi } = getCanChiYear(birthYear);
  const napAmElement = getNapAmElement(birthYear);
  const yearElement = thienCanElements[can];
  const yearYinYang = thienCanYinYang[can];
  const chiElement = diaChiElements[chi];
  const chiYinYang = diaChiYinYang[chi];
  
  const birthTimeIndex = birthTimeToChiIndex(answers.birthTime || "morning");
  const birthChi = diaChi[birthTimeIndex];
  const gender = answers.gender || "male";
  const focus = answers.lifeFocus || answers.currentAttention || "career";
  const seekClarity = answers.seekClarity || "purpose";
  
  // Determine Yin-Yang harmony
  const genderYinYang = gender === "male" ? "Yang" : "Yin";
  const isHarmonic = genderYinYang === chiYinYang;
  
  // Element relationship descriptions
  const elementQualities: Record<string, { nature: string; strength: string; tendency: string }> = {
    Wood: { 
      nature: "growth and expansion", 
      strength: "adaptability and creativity",
      tendency: "seek development and new beginnings"
    },
    Fire: { 
      nature: "transformation and illumination", 
      strength: "passion and decisive action",
      tendency: "pursue recognition and achievement"
    },
    Earth: { 
      nature: "stability and nurturing", 
      strength: "reliability and patience",
      tendency: "build foundations and foster security"
    },
    Metal: { 
      nature: "precision and refinement", 
      strength: "determination and clarity",
      tendency: "seek excellence and order"
    },
    Water: { 
      nature: "wisdom and flow", 
      strength: "intuition and adaptability",
      tendency: "navigate complexity with grace"
    }
  };

  const yearQuality = elementQualities[yearElement] || elementQualities.Earth;
  const napAmQuality = elementQualities[napAmElement] || elementQualities.Earth;

  return {
    lifeEnergyMap: {
      achievementResources: {
        currentState: `Your birth pattern carries ${yearElement} energy from the Celestial Stem (${can}), which governs ${yearQuality.nature}. Combined with your ${napAmElement} life essence (Nạp Âm), your approach to material achievement reflects ${napAmQuality.strength}. ${
          isHarmonic 
            ? "The harmony between your gender energy and birth position (Dương cư Dương vị / Âm cư Âm vị) creates supportive conditions for pursuing material goals."
            : "Your energy pattern suggests that achievement may require more deliberate effort, but this builds deeper capability over time."
        } The ${chi} branch in your birth year connects to ${chiElement} energy, which ${
          elementGenerates[chiElement] === yearElement 
            ? "naturally supports and generates your year element—indicating potential for resource accumulation."
            : elementOvercomes[yearElement] === chiElement
            ? "receives direction from your year element—suggesting you shape circumstances through active effort."
            : "interacts with your year element in a balanced way—neither strongly supporting nor challenging material pursuits."
        }`,
        balanceLevel: getBalanceLevel(yearElement, birthChi, focus, "achievementResources", gender),
        guidance: focus === "career" || focus === "finances"
          ? `Your current focus aligns with this dimension. The ${yearElement} element suggests pursuing achievement through ${yearQuality.tendency.toLowerCase()}. Consider how your natural ${yearQuality.strength.toLowerCase()} can be applied strategically rather than scattered across too many pursuits.`
          : `While your attention is elsewhere, the ${yearElement} energy still influences your material circumstances. Small, consistent actions aligned with ${yearQuality.nature} will maintain momentum without demanding primary focus.`
      },
      relationshipsConnection: {
        currentState: `In the realm of connection, your ${yearYinYang} year energy interacts with others according to classical principles of attraction and resonance. ${
          yearYinYang === "Yin"
            ? "Yin energy draws connection through receptivity, depth, and emotional attunement. Your relationships tend toward quality over quantity, with capacity for profound understanding."
            : "Yang energy engages relationships through initiative, warmth, and active presence. You may naturally take the lead in social situations, drawing others through your vitality."
        } The ${napAmElement} essence of your life pattern adds ${napAmQuality.nature} to your relational style. ${
          yearElement === "Water" || yearElement === "Wood"
            ? "Water and Wood elements naturally nourish connection—Water through emotional depth, Wood through growth and flexibility."
            : yearElement === "Fire"
            ? "Fire brings warmth and magnetism to relationships, though it requires balance to avoid consuming intensity."
            : yearElement === "Earth"
            ? "Earth provides stable ground for relationships, fostering trust and long-term bonds."
            : "Metal brings clarity and loyalty to relationships, with capacity for deep commitment once trust is established."
        }`,
        balanceLevel: getBalanceLevel(yearElement, birthChi, focus, "relationshipsConnection", gender),
        guidance: focus === "relationships"
          ? `With relationships as your current focus, leverage your ${yearElement} nature consciously. ${yearElement === "Water" ? "Create space for emotional depth without losing yourself in others' currents." : yearElement === "Fire" ? "Let your warmth draw others in while ensuring you also receive nurturing." : yearElement === "Wood" ? "Allow relationships to grow organically without forcing development." : yearElement === "Earth" ? "Offer your stability while remaining open to change and surprise." : "Balance your standards with acceptance; not everyone needs to meet your clarity."}`
          : `Even when not your primary focus, relationships benefit from attention. Your ${yearQuality.strength.toLowerCase()} can be shared with others through small gestures of presence and understanding.`
      },
      emotionalBalance: {
        currentState: `Your emotional landscape is shaped by the interplay of ${yearElement} (from ${can}) and ${napAmElement} (your life essence). ${
          yearElement === "Earth" || yearElement === "Water"
            ? `These elements naturally support emotional equilibrium. ${yearElement === "Earth" ? "Earth provides grounding, helping you remain centered even in turbulent circumstances." : "Water flows around obstacles rather than confronting them directly, offering resilience through adaptability."}`
            : yearElement === "Fire"
            ? "Fire element can bring intensity to emotional experience—both passionate joy and sharp frustration. This is neither flaw nor fate, simply energy seeking expression."
            : yearElement === "Wood"
            ? "Wood element brings vitality to emotional life, with capacity for both frustration (when growth is blocked) and enthusiasm (when expanding). Understanding this pattern helps navigation."
            : "Metal element tends toward clarity in emotions, sometimes experienced as precision or as distance. Both are expressions of the same energy—refinement."
        } Your ${yearYinYang} orientation ${
          yearYinYang === "Yin" 
            ? "inclines toward processing emotions internally, requiring space for reflection and integration."
            : "inclines toward expressing emotions outwardly, benefiting from appropriate outlets and understanding listeners."
        }`,
        balanceLevel: getBalanceLevel(yearElement, birthChi, focus, "emotionalBalance", gender),
        guidance: `The ${yearElement} element suggests specific paths to emotional balance. ${
          yearElement === "Wood" ? "Physical movement and time in nature help Wood energy flow rather than stagnate as frustration." 
          : yearElement === "Fire" ? "Creative expression and social connection give Fire energy positive outlets rather than building internal pressure."
          : yearElement === "Earth" ? "Routine and grounding practices (mindful eating, gardening, physical touch) reinforce Earth's natural stability."
          : yearElement === "Metal" ? "Structured reflection (journaling, meditation, organizing) helps Metal energy process and release what no longer serves."
          : "Water benefits from flow—allowing emotions to move through rather than pooling. Gentle movement, music, and water itself (swimming, baths) support this."
        }`
      },
      supportFlow: {
        currentState: `The concept of support and flow in Eastern philosophy relates to how easily circumstances align with intention. Your ${can} ${chi} birth year creates a pattern of ${
          isHarmonic 
            ? "natural harmony (Âm Dương đắc vị), which traditionally indicates that circumstances tend to support rather than obstruct. This doesn't guarantee ease, but suggests less friction with the flow of events."
            : "creative tension between your core energy and position. This pattern often produces individuals who develop strength through navigating challenge—not obstacles as punishment, but as development."
        } The ${napAmElement} life essence influences the quality of support you attract: ${
          napAmElement === "Wood" ? "organic growth, mentorship, opportunities for development"
          : napAmElement === "Fire" ? "recognition, visibility, connections to influential networks"  
          : napAmElement === "Earth" ? "stability, reliable foundations, practical resources"
          : napAmElement === "Metal" ? "structure, clear guidance, refined opportunities"
          : "intuitive leads, flow states, synchronistic connections"
        }.`,
        balanceLevel: getBalanceLevel(yearElement, birthChi, focus, "supportFlow", gender),
        guidance: `To enhance supportive flow, work with rather than against your ${yearElement} nature. ${
          yearElement === "Wood" ? "Initiate rather than wait—Wood energy creates opportunity through movement and expression of growth."
          : yearElement === "Fire" ? "Visibility attracts support for Fire—sharing your light draws resources and connection toward you."
          : yearElement === "Earth" ? "Patience and reliability build the trust that brings support to Earth—rushed demands may push help away."
          : yearElement === "Metal" ? "Clarity of intention attracts aligned support for Metal—vague requests receive vague responses."
          : "Receptivity opens channels for Water—creating space allows what's meant for you to find its way."
        }`
      },
      directionVision: {
        currentState: `Your sense of purpose and direction emerges from the ${yearElement} element's natural ${yearQuality.tendency.toLowerCase()}. The ${can} stem carries ${yearYinYang} orientation, which shapes how vision manifests: ${
          yearYinYang === "Yang"
            ? "Yang energy tends toward outward expression—visible goals, public contribution, impact on the world beyond yourself."
            : "Yin energy tends toward inward depth—personal development, intimate impact, cultivation of inner richness."
        } Neither is superior; both serve authentic purpose. ${
          seekClarity === "purpose" 
            ? `Your current search for clarity around purpose is itself meaningful. The ${yearElement} element suggests that for you, purpose may be discovered through ${yearElement === "Wood" ? "exploration and growth" : yearElement === "Fire" ? "passionate engagement" : yearElement === "Earth" ? "patient cultivation" : yearElement === "Metal" ? "refinement and discernment" : "intuitive following"} rather than rational analysis alone.`
            : seekClarity === "work"
            ? `Your attention to work and career direction connects naturally to ${yearElement} energy. Consider whether your current path allows expression of ${yearQuality.nature}.`
            : `Your focus on ${seekClarity} is itself a direction. The ${yearElement} element's ${yearQuality.strength.toLowerCase()} supports this exploration.`
        }`,
        balanceLevel: getBalanceLevel(yearElement, birthChi, focus, "directionVision", gender),
        guidance: `Direction often becomes clear through movement rather than contemplation alone. Your ${yearElement} nature suggests: ${
          yearElement === "Wood" ? "Plant seeds in multiple directions and tend what grows. Purpose reveals itself through what thrives."
          : yearElement === "Fire" ? "Follow what ignites you. Passion is not a distraction from purpose—it's a signal pointing toward it."
          : yearElement === "Earth" ? "Build where you stand. Often purpose is found not in grand visions but in faithful attention to what's immediately before you."
          : yearElement === "Metal" ? "Refine through elimination. Clarity comes from releasing what doesn't resonate, revealing what does."
          : "Trust the current. Your direction may not be visible far ahead, but each next step becomes clear when needed."
        }`
      }
    },
    overallInsight: `Your birth pattern of ${can} ${chi} (${yearElement} ${yearYinYang}) with ${napAmElement} life essence creates a distinctive energy signature across all five dimensions. ${
      isHarmonic
        ? "The harmony between your intrinsic energy and birth position provides a foundation of natural flow."
        : "The dynamic tension in your pattern builds capability through navigation—your strengths are earned rather than given."
    } ${
      yearElement === napAmElement 
        ? `The alignment of your year element and life essence (both ${yearElement}) creates concentrated energy in this direction—powerful when focused, potentially excessive when unchecked.`
        : `The interplay between your year element (${yearElement}) and life essence (${napAmElement}) creates richness: ${
            elementGenerates[yearElement] === napAmElement 
              ? `${yearElement} generates ${napAmElement}, suggesting your conscious energy naturally supports your deeper life pattern.`
              : elementGenerates[napAmElement] === yearElement
              ? `${napAmElement} generates ${yearElement}, suggesting your life essence continuously replenishes your active energy.`
              : `these elements create a dynamic balance requiring conscious integration.`
          }`
    } Remember: these patterns describe tendencies, not destiny. Awareness of your natural flows allows you to work with them skillfully rather than unconsciously.`,
    reflectionQuestion: seekClarity === "purpose"
      ? "If you already knew your purpose but had forgotten, what small action would remind you?"
      : seekClarity === "love"
      ? "What would you offer in love if you trusted that you are already worthy of receiving it?"
      : seekClarity === "work"
      ? "If work were play, what game would you choose?"
      : seekClarity === "health"
      ? "What is your body asking for that your mind has been too busy to hear?"
      : focus === "spirituality"
      ? "What would change if you trusted that you are exactly where you need to be?"
      : focus === "creativity"
      ? "What would you create if the only audience were yourself?"
      : "What becomes possible when you stop waiting to feel ready?"
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
