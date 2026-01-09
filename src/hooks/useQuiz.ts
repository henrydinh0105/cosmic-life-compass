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
  const chiQuality = elementQualities[chiElement] || elementQualities.Earth;

  // ===== PERSONALITY SNAPSHOT =====
  // Based on Tu Vi / Bat Tu principles - describing tendencies, not fixed traits
  
  const coreNatureDescriptions: Record<string, { thinking: string; responding: string; deciding: string }> = {
    Wood: {
      thinking: "Your mind tends toward growth-oriented thinking—seeing potential, pathways, and possibilities where others might see only what currently exists. There is a natural inclination toward planning, envisioning, and strategizing that moves from present reality toward imagined futures.",
      responding: "When facing circumstances, your first response often carries a quality of expansion—seeking to grow through the challenge rather than merely survive it. This can manifest as optimism, but more precisely it is a fundamental orientation toward development and forward movement.",
      deciding: "Decision-making for you often involves considering growth trajectories: which choice leads to more flourishing, more development, more life? This is neither purely logical nor emotional—it is a form of organic intelligence that senses where vitality wants to flow."
    },
    Fire: {
      thinking: "Your mental patterns tend toward illumination and transformation—you naturally seek to understand the essence of things, to see clearly, and to share that clarity with others. There is an inherent drive toward making the invisible visible, the confused clear.",
      responding: "Your characteristic response to life carries warmth, intensity, and presence. You engage fully rather than partially, bringing energy and attention that can inspire others or occasionally overwhelm more reserved temperaments.",
      deciding: "Decisions often emerge through a form of passionate clarity—a sense of rightness that arrives with conviction. You may experience choice not as weighing options but as recognizing which path carries the most fire, the most aliveness."
    },
    Earth: {
      thinking: "Your cognitive style gravitates toward the substantial and enduring—understanding how things work, what makes them stable, what creates lasting value. Abstract ideas often need grounding in practical reality before they feel meaningful.",
      responding: "When life presents situations, your natural response carries steadiness. This isn't slowness but rootedness—a capacity to remain centered while others might react impulsively. You provide ground for others to stand on.",
      deciding: "Decision-making typically involves assessing durability and reliability: what will hold, what can be trusted, what creates security? You build rather than gamble, preferring known foundations to exciting uncertainties."
    },
    Metal: {
      thinking: "Your mind inclines toward precision, discernment, and refinement. You naturally distinguish essential from non-essential, separating signal from noise with an efficiency that can seem almost surgical to others.",
      responding: "Your response to circumstances often carries a quality of assessment and judgment—not coldness, but clarity about what is and isn't acceptable, useful, or aligned with standards you hold (often unconsciously).",
      deciding: "Decisions emerge through a process of elimination—cutting away what doesn't fit until what remains is refined and correct. You tend to know what you don't want before fully articulating what you do."
    },
    Water: {
      thinking: "Your mental nature moves like water itself—flowing around obstacles, finding the path of least resistance, perceiving depths that surface-focused minds miss. You think in currents and undercurrents, sensing what lies beneath.",
      responding: "When encountering situations, you often respond with adaptation rather than confrontation—not from weakness but from wisdom that recognizes many paths lead to the same sea. Flexibility is your form of strength.",
      deciding: "Decisions may feel less like choices and more like currents you follow. You sense where things are flowing and align with that movement. Intuition often guides more than analysis."
    }
  };

  const innerTensionPatterns: Record<string, { primary: string; secondary: string }> = {
    Wood: {
      primary: "The fundamental tension within Wood energy is between growth and restraint—the endless drive to expand, develop, and become more can create frustration when circumstances impose limits. This isn't a flaw but a feature of your energetic makeup: the same force that drives ambition can manifest as impatience or frustration when progress feels blocked.",
      secondary: "A secondary pattern involves the relationship between vision and reality. Your capacity to see potential can create dissatisfaction with what currently exists. Learning to appreciate present conditions while maintaining future orientation is an ongoing balancing act."
    },
    Fire: {
      primary: "The core tension of Fire energy lives between expression and consumption—the same intensity that illuminates can also exhaust. You may find yourself cycling between periods of brilliant engagement and necessary withdrawal, between giving fully and needing to recover what you've given.",
      secondary: "There can also be tension between visibility and vulnerability. Fire naturally attracts attention, but sustained exposure can feel depleting. Learning when to shine publicly and when to tend your inner flame privately is part of your ongoing development."
    },
    Earth: {
      primary: "Earth's essential tension emerges between stability and stagnation—the same qualities that create security and reliability can, when out of balance, become rigidity or resistance to necessary change. Your strength can become your limitation when circumstances require adaptation.",
      secondary: "A related pattern involves giving and receiving. Earth naturally nurtures and provides, but excessive giving without receiving creates depletion. The challenge is maintaining generosity while also accepting support from others."
    },
    Metal: {
      primary: "The fundamental tension in Metal energy exists between standards and acceptance—your natural capacity for discernment and refinement can create perpetual dissatisfaction when nothing quite meets your criteria. Perfectionism is the shadow of your precision.",
      secondary: "There may also be tension between connection and protection. Metal's clear boundaries serve important functions, but excessive boundary-keeping can create isolation. Finding the balance between healthy discrimination and unnecessary distance is ongoing work."
    },
    Water: {
      primary: "Water's core tension arises between depth and direction—your natural capacity for going deep can sometimes lack corresponding capacity for forward momentum. You may know profound truths but struggle to translate them into consistent action.",
      secondary: "A related pattern involves boundaries and merging. Water naturally flows into whatever contains it, which can make it difficult to maintain clear sense of self when deeply connected with others. Learning to flow without losing yourself is part of your path."
    }
  };

  const growthDirectionPatterns: Record<string, { aligned: string; development: string }> = {
    Wood: {
      aligned: "When aligned with your nature, you develop through continuous learning, expanding competence, and growing into larger roles and responsibilities. Your path is one of becoming—always evolving toward more complete expression of your potential.",
      development: "Optimal development for Wood involves channeling expansive energy into focused growth rather than scattered ambition. The tree that grows straight and strong serves better than the one that branches in every direction. Choose your directions consciously, then grow fully in those chosen areas."
    },
    Fire: {
      aligned: "Your authentic development path involves bringing warmth, clarity, and inspiration to whatever you touch. When aligned, you illuminate situations, transform understanding, and catalyze positive change in others through your engaged presence.",
      development: "Sustainable Fire development requires learning to burn steadily rather than in consuming bursts. This means building practices that replenish rather than only expend—creating rather than just performing, connecting deeply rather than spreading thin."
    },
    Earth: {
      aligned: "When aligned with your essential nature, you develop through building lasting structures—relationships, resources, capabilities—that provide foundation for yourself and others. Your growth is measured not in heights reached but in depths established.",
      development: "Earth development benefits from conscious attention to flexibility within stability. The most enduring foundations include capacity for adjustment. Your growth edge often involves welcoming appropriate change while maintaining core stability."
    },
    Metal: {
      aligned: "Your authentic path involves refinement toward excellence—in skills, understanding, and quality of output. When aligned, you naturally move toward mastery, shedding what's unnecessary and honing what's essential.",
      development: "Optimal Metal development includes softening alongside sharpening. The sword that only knows how to cut eventually cuts its wielder. Learning when precision serves and when acceptance serves better is part of your evolution."
    },
    Water: {
      aligned: "When flowing in harmony with your nature, you develop through deepening wisdom, strengthening intuition, and expanding capacity to navigate complexity with grace. Your growth is measured in depth of understanding and fluidity of response.",
      development: "Water development benefits from creating channels for your depth—without direction, water stagnates or floods. Finding appropriate containers (projects, relationships, practices) that give form to your formlessness supports your fullest expression."
    }
  };

  const coreNature = coreNatureDescriptions[yearElement] || coreNatureDescriptions.Earth;
  const innerTension = innerTensionPatterns[yearElement] || innerTensionPatterns.Earth;
  const growthDirection = growthDirectionPatterns[yearElement] || growthDirectionPatterns.Earth;

  // Modify based on Yin/Yang and birth Chi for personalization
  const yinYangModifier = yearYinYang === "Yin" 
    ? "This operates with Yin quality—more internal, receptive, and reflective in expression."
    : "This operates with Yang quality—more external, active, and expressive in manifestation.";

  const chiInfluence = `The ${chi} position in your chart adds ${chiElement} undertones, which ${
    elementGenerates[chiElement] === yearElement 
      ? `support and nourish your core ${yearElement} nature—strengthening these tendencies`
      : elementOvercomes[chiElement] === yearElement
      ? `challenge and refine your ${yearElement} patterns—creating complexity but also resilience`
      : `complement your ${yearElement} energy—adding dimensionality to your expression`
  }.`;

  const personalitySnapshot = {
    coreNature: `${coreNature.thinking} ${yinYangModifier}\n\n${coreNature.responding} ${chiInfluence}\n\n${coreNature.deciding}`,
    innerTension: `${innerTension.primary}\n\n${innerTension.secondary} ${
      isHarmonic 
        ? "Your birth pattern's Yin-Yang harmony provides some natural buffer against these tensions."
        : "Your birth pattern's dynamic polarity may intensify these tensions, but also provides energy for resolution."
    }`,
    growthDirection: `${growthDirection.aligned}\n\n${growthDirection.development} ${
      focus === "spirituality" ? "Your current focus on inner growth aligns naturally with this path."
      : focus === "career" ? "Your career focus can be a vehicle for this development when approached consciously."
      : focus === "relationships" ? "Relationships offer a mirror for observing and refining these patterns."
      : focus === "creativity" ? "Creative expression provides natural channels for this growth."
      : "Whatever area of life receives your attention becomes an arena for this development."
    }`
  };

  return {
    personalitySnapshot,
    lifeEnergyMap: {
      achievementResources: {
        currentState: `Your birth pattern carries ${yearElement} energy from the Celestial Stem (${can}), which governs ${yearQuality.nature}. Combined with your ${napAmElement} life essence (Nạp Âm), your approach to material achievement reflects ${napAmQuality.strength}. ${
          isHarmonic 
            ? "The harmony between your gender energy and birth position creates supportive conditions for pursuing material goals."
            : "Your energy pattern suggests that achievement may require more deliberate effort, but this builds deeper capability over time."
        } The ${chi} branch connects to ${chiElement} energy, which ${
          elementGenerates[chiElement] === yearElement 
            ? "naturally supports your year element—indicating potential for resource accumulation."
            : elementOvercomes[yearElement] === chiElement
            ? "receives direction from your year element—suggesting you shape circumstances through active effort."
            : "interacts with your year element in a balanced way."
        }`,
        balanceLevel: getBalanceLevel(yearElement, birthChi, focus, "achievementResources", gender),
        guidance: focus === "career" || focus === "finances"
          ? `Your current focus aligns with this dimension. The ${yearElement} element suggests pursuing achievement through ${yearQuality.tendency.toLowerCase()}. Consider how your natural ${yearQuality.strength.toLowerCase()} can be applied strategically.`
          : `While your attention is elsewhere, the ${yearElement} energy still influences your material circumstances. Small, consistent actions aligned with ${yearQuality.nature} will maintain momentum.`
      },
      relationshipsConnection: {
        currentState: `In connection, your ${yearYinYang} year energy interacts with others according to classical principles of resonance. ${
          yearYinYang === "Yin"
            ? "Yin energy draws connection through receptivity, depth, and emotional attunement."
            : "Yang energy engages relationships through initiative, warmth, and active presence."
        } The ${napAmElement} essence adds ${napAmQuality.nature} to your relational style. ${
          yearElement === "Water" || yearElement === "Wood"
            ? "Water and Wood elements naturally nourish connection."
            : yearElement === "Fire"
            ? "Fire brings warmth and magnetism to relationships."
            : yearElement === "Earth"
            ? "Earth provides stable ground for relationships, fostering trust."
            : "Metal brings clarity and loyalty to relationships."
        }`,
        balanceLevel: getBalanceLevel(yearElement, birthChi, focus, "relationshipsConnection", gender),
        guidance: focus === "relationships"
          ? `With relationships as your focus, leverage your ${yearElement} nature consciously. ${yearElement === "Water" ? "Create space for depth without losing yourself." : yearElement === "Fire" ? "Let your warmth draw others in while ensuring you also receive nurturing." : yearElement === "Wood" ? "Allow relationships to grow organically." : yearElement === "Earth" ? "Offer stability while remaining open to change." : "Balance your standards with acceptance."}`
          : `Even when not primary focus, relationships benefit from attention. Your ${yearQuality.strength.toLowerCase()} can be shared through small gestures of presence.`
      },
      emotionalBalance: {
        currentState: `Your emotional landscape is shaped by the interplay of ${yearElement} (from ${can}) and ${napAmElement} (your life essence). ${
          yearElement === "Earth" || yearElement === "Water"
            ? `These elements naturally support emotional equilibrium.`
            : yearElement === "Fire"
            ? "Fire element can bring intensity to emotional experience—both passionate joy and sharp frustration."
            : yearElement === "Wood"
            ? "Wood element brings vitality to emotional life, with capacity for both frustration and enthusiasm."
            : "Metal element tends toward clarity in emotions, sometimes experienced as precision or as distance."
        } Your ${yearYinYang} orientation ${
          yearYinYang === "Yin" 
            ? "inclines toward processing emotions internally."
            : "inclines toward expressing emotions outwardly."
        }`,
        balanceLevel: getBalanceLevel(yearElement, birthChi, focus, "emotionalBalance", gender),
        guidance: `The ${yearElement} element suggests specific paths to emotional balance. ${
          yearElement === "Wood" ? "Physical movement and time in nature help Wood energy flow." 
          : yearElement === "Fire" ? "Creative expression and social connection give Fire energy positive outlets."
          : yearElement === "Earth" ? "Routine and grounding practices reinforce Earth's natural stability."
          : yearElement === "Metal" ? "Structured reflection helps Metal energy process and release."
          : "Water benefits from flow—allowing emotions to move through rather than pooling."
        }`
      },
      supportFlow: {
        currentState: `Support and flow relates to how easily circumstances align with intention. Your ${can} ${chi} birth year creates a pattern of ${
          isHarmonic 
            ? "natural harmony, which indicates circumstances tend to support rather than obstruct."
            : "creative tension. This pattern often produces individuals who develop strength through navigating challenge."
        } The ${napAmElement} life essence influences the quality of support you attract: ${
          napAmElement === "Wood" ? "organic growth, mentorship, opportunities for development"
          : napAmElement === "Fire" ? "recognition, visibility, connections to influential networks"  
          : napAmElement === "Earth" ? "stability, reliable foundations, practical resources"
          : napAmElement === "Metal" ? "structure, clear guidance, refined opportunities"
          : "intuitive leads, flow states, synchronistic connections"
        }.`,
        balanceLevel: getBalanceLevel(yearElement, birthChi, focus, "supportFlow", gender),
        guidance: `To enhance supportive flow, work with your ${yearElement} nature. ${
          yearElement === "Wood" ? "Initiate rather than wait—Wood energy creates opportunity through movement."
          : yearElement === "Fire" ? "Visibility attracts support for Fire—sharing your light draws resources."
          : yearElement === "Earth" ? "Patience and reliability build the trust that brings support to Earth."
          : yearElement === "Metal" ? "Clarity of intention attracts aligned support for Metal."
          : "Receptivity opens channels for Water—creating space allows what's meant for you to find its way."
        }`
      },
      directionVision: {
        currentState: `Your sense of purpose emerges from the ${yearElement} element's natural ${yearQuality.tendency.toLowerCase()}. The ${can} stem carries ${yearYinYang} orientation: ${
          yearYinYang === "Yang"
            ? "Yang energy tends toward outward expression—visible goals, public contribution."
            : "Yin energy tends toward inward depth—personal development, intimate impact."
        } ${
          seekClarity === "purpose" 
            ? `Your current search for purpose is meaningful. The ${yearElement} element suggests discovery through ${yearElement === "Wood" ? "exploration and growth" : yearElement === "Fire" ? "passionate engagement" : yearElement === "Earth" ? "patient cultivation" : yearElement === "Metal" ? "refinement and discernment" : "intuitive following"}.`
            : seekClarity === "work"
            ? `Your attention to work direction connects to ${yearElement} energy.`
            : `Your focus on ${seekClarity} is itself a direction.`
        }`,
        balanceLevel: getBalanceLevel(yearElement, birthChi, focus, "directionVision", gender),
        guidance: `Direction often becomes clear through movement. Your ${yearElement} nature suggests: ${
          yearElement === "Wood" ? "Plant seeds in multiple directions and tend what grows."
          : yearElement === "Fire" ? "Follow what ignites you. Passion is a signal pointing toward purpose."
          : yearElement === "Earth" ? "Build where you stand. Purpose is often found in faithful attention to what's before you."
          : yearElement === "Metal" ? "Refine through elimination. Clarity comes from releasing what doesn't resonate."
          : "Trust the current. Your direction may not be visible far ahead, but each step becomes clear when needed."
        }`
      }
    },
    overallInsight: `Your birth pattern of ${can} ${chi} (${yearElement} ${yearYinYang}) with ${napAmElement} life essence creates a distinctive energy signature. ${
      isHarmonic
        ? "The harmony between your intrinsic energy and birth position provides natural flow."
        : "The dynamic tension in your pattern builds capability through navigation—strengths are earned."
    } ${
      yearElement === napAmElement 
        ? `The alignment of year element and life essence (both ${yearElement}) creates concentrated energy—powerful when focused.`
        : `The interplay between year element (${yearElement}) and life essence (${napAmElement}) creates richness through dynamic balance.`
    } These patterns describe tendencies, not destiny. Awareness allows you to work with them skillfully.`,
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
