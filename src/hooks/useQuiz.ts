import { useState, useCallback, useEffect } from "react";
import { QuizAnswers, InsightResult, BalanceLevel } from "@/types/quiz";
import { quizQuestions } from "@/data/quizQuestions";
import { useQuizTracking } from "@/hooks/useQuizTracking";

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
  
  const coreNatureDescriptions: Record<string, { thinking: string; responding: string; deciding: string; recognition: string }> = {
    Wood: {
      thinking: "Your mind tends toward growth-oriented thinking—seeing potential, pathways, and possibilities where others might see only what currently exists. There is a natural inclination toward planning, envisioning, and strategizing that moves from present reality toward imagined futures.",
      responding: "When facing circumstances, your first response often carries a quality of expansion—seeking to grow through the challenge rather than merely survive it. This can manifest as optimism, but more precisely it is a fundamental orientation toward development and forward movement.",
      deciding: "Decision-making for you often involves considering growth trajectories: which choice leads to more flourishing, more development, more life? This is neither purely logical nor emotional—it is a form of organic intelligence that senses where vitality wants to flow.",
      recognition: "You might recognize this when you find yourself already planning the next project before the current one is complete, or when 'staying still' feels more exhausting than moving forward."
    },
    Fire: {
      thinking: "Your mental patterns tend toward illumination and transformation—you naturally seek to understand the essence of things, to see clearly, and to share that clarity with others. There is an inherent drive toward making the invisible visible, the confused clear.",
      responding: "Your characteristic response to life carries warmth, intensity, and presence. You engage fully rather than partially, bringing energy and attention that can inspire others or occasionally overwhelm more reserved temperaments.",
      deciding: "Decisions often emerge through a form of passionate clarity—a sense of rightness that arrives with conviction. You may experience choice not as weighing options but as recognizing which path carries the most fire, the most aliveness.",
      recognition: "You might recognize this when a conversation that excites you leaves you energized while others look drained, or when you realize you've been 'all in' on something before consciously choosing it."
    },
    Earth: {
      thinking: "Your cognitive style gravitates toward the substantial and enduring—understanding how things work, what makes them stable, what creates lasting value. Abstract ideas often need grounding in practical reality before they feel meaningful.",
      responding: "When life presents situations, your natural response carries steadiness. This isn't slowness but rootedness—a capacity to remain centered while others might react impulsively. You provide ground for others to stand on.",
      deciding: "Decision-making typically involves assessing durability and reliability: what will hold, what can be trusted, what creates security? You build rather than gamble, preferring known foundations to exciting uncertainties.",
      recognition: "You might recognize this when others come to you during crises because your presence feels stabilizing, or when you notice your first question about any new idea is 'but how would that actually work?'"
    },
    Metal: {
      thinking: "Your mind inclines toward precision, discernment, and refinement. You naturally distinguish essential from non-essential, separating signal from noise with an efficiency that can seem almost surgical to others.",
      responding: "Your response to circumstances often carries a quality of assessment and judgment—not coldness, but clarity about what is and isn't acceptable, useful, or aligned with standards you hold (often unconsciously).",
      deciding: "Decisions emerge through a process of elimination—cutting away what doesn't fit until what remains is refined and correct. You tend to know what you don't want before fully articulating what you do.",
      recognition: "You might recognize this when you catch yourself mentally editing someone's work before they've finished explaining it, or when 'good enough' has never quite felt good enough."
    },
    Water: {
      thinking: "Your mental nature moves like water itself—flowing around obstacles, finding the path of least resistance, perceiving depths that surface-focused minds miss. You think in currents and undercurrents, sensing what lies beneath.",
      responding: "When encountering situations, you often respond with adaptation rather than confrontation—not from weakness but from wisdom that recognizes many paths lead to the same sea. Flexibility is your form of strength.",
      deciding: "Decisions may feel less like choices and more like currents you follow. You sense where things are flowing and align with that movement. Intuition often guides more than analysis.",
      recognition: "You might recognize this when you 'just knew' something was wrong before any evidence appeared, or when you find yourself absorbing the emotional atmosphere of a room without trying."
    }
  };

  const naturalStrengthDescriptions: Record<string, string> = {
    Wood: "Your unfair advantage lies in your capacity for initiation and growth. Where others see finished landscapes, you perceive seeds waiting to sprout. You can envision futures that don't yet exist and take the first steps toward them when others are still deliberating. This isn't mere optimism—it's an organic intelligence that knows how to begin things, how to expand, how to find the growing edge in any situation. When aligned, you naturally inspire others to grow simply by demonstrating that growth is possible.",
    Fire: "Your unfair advantage is your capacity to illuminate and transform. You have a natural gift for making things visible—whether that's bringing clarity to confusion, recognition to what's been overlooked, or warmth to what's grown cold. Your presence has a catalytic quality; things change when you engage with them. This isn't performance—it's a genuine radiance that emerges when you're aligned with what matters to you. You connect dots others don't see and communicate with an intensity that makes ideas feel alive.",
    Earth: "Your unfair advantage is your capacity to sustain and nurture. You possess an almost unconscious ability to create conditions where things can grow and flourish over time. Where others burn bright and fade, you persist. Where others build quickly and watch it crumble, you build slowly and watch it last. Your reliability is not boring—it's a superpower in a world that often lacks it. People and projects thrive in your care because you provide the patient, consistent attention that real growth requires.",
    Metal: "Your unfair advantage is your capacity for discernment and refinement. You naturally perceive quality distinctions that others miss, sensing what's essential and what's merely acceptable. This isn't criticism—it's a form of care that manifests as unwillingness to settle. Your standards become a kind of gravity that pulls everything in your sphere toward greater excellence. When you engage with something, it tends to become cleaner, clearer, more precise. Others may not always appreciate this immediately, but they benefit from it eventually.",
    Water: "Your unfair advantage is your capacity for depth and flow. You perceive what moves beneath surfaces—motivations, patterns, undercurrents—that others miss entirely. This grants you a form of wisdom that can't be taught: you know without knowing how you know. Your adaptability isn't weakness but intelligence; you find ways through where others hit walls. Your depth creates trust, as others sense that you see and accept them fully. When aligned, you navigate complexity with a grace that seems almost effortless."
  };

  const blindSpotPatterns: Record<string, string> = {
    Wood: "Your pattern includes a recurring limitation around patience and completion. The same energy that drives you toward the next horizon can make you restless with what's already planted. You may find yourself starting more than you finish, or mentally leaving projects before they've fully matured. Growth orientation can become growth addiction—a subtle belief that 'there' is better than 'here.' This isn't a moral failing but a structural tendency: your system is calibrated for expansion, which can make consolidation feel like stagnation even when it's necessary.",
    Fire: "Your pattern includes a recurring limitation around sustainable engagement. The intensity that makes you magnetic can also lead to cycles of burning bright and burning out. You may give fully when inspired, then find yourself depleted and needing to withdraw. There's a tendency to overextend—offering more light than you can sustain, then feeling resentful when the giving feels one-sided. Visibility, while natural to you, comes with costs: others may see your radiance without recognizing the fuel it requires.",
    Earth: "Your pattern includes a recurring limitation around rigidity and over-accommodation. The stability that makes you reliable can crystallize into resistance to necessary change. You may stay in situations past their expiration because leaving feels like failure or disloyalty. The same nurturing impulse that serves others can neglect yourself—you may know everyone else's needs better than your own. There's a tendency to provide ground for others while forgetting that you also need ground to stand on.",
    Metal: "Your pattern includes a recurring limitation around criticism and isolation. The discernment that allows you to refine can become chronic dissatisfaction when nothing meets your standards—including yourself. You may find perfectionism masquerading as integrity, or notice that your high standards create distance from others who feel judged even when you're not actively judging. The clarity that serves you can become coldness that costs you connection. Precision, when overextended, becomes a lonely refinement.",
    Water: "Your pattern includes a recurring limitation around passivity and dissolution. The adaptability that grants you wisdom can become loss of direction—going with every flow until you've lost your own current. You may merge so fully with others or situations that your own needs become unclear even to yourself. Depth without structure can become stagnation; intuition without action remains mere perception. There's a tendency to wait for clarity that never quite arrives because waiting has become more comfortable than choosing."
  };

  const innerTensionPatterns: Record<string, { primary: string; secondary: string }> = {
    Wood: {
      primary: "The fundamental tension within your pattern lives between vision and patience—between seeing what could be and accepting what is. You experience the pull toward the future as both gift and burden; it drives your growth while making present circumstances feel insufficient. This isn't restlessness to be fixed but a dynamic polarity to be navigated.",
      secondary: "A secondary tension exists between independence and connection. Your growth impulse wants freedom to expand, yet meaningful development often requires interdependence. You may feel torn between needing space to become and wanting belonging in who you already are."
    },
    Fire: {
      primary: "The fundamental tension within your pattern lives between expression and sustainability—between giving fully and preserving yourself. Your natural intensity creates a recurring choice: hold back and feel dimmed, or give completely and risk depletion. Neither extreme serves you; the work is finding the sustainable flame.",
      secondary: "A secondary tension exists between recognition and authenticity. You naturally attract attention, yet not all attention nourishes. You may find yourself performing when you'd rather be genuine, or feeling unseen when you're most truly yourself."
    },
    Earth: {
      primary: "The fundamental tension within your pattern lives between stability and growth—between maintaining what you've built and evolving toward what you're becoming. Change can feel like betrayal of what you've established, yet staying the same can become its own form of stagnation. You hold both needs simultaneously.",
      secondary: "A secondary tension exists between giving and receiving. Your nature provides, nurtures, sustains—yet this same giving can deplete you when not reciprocated. You may struggle to receive with the same grace you extend to others."
    },
    Metal: {
      primary: "The fundamental tension within your pattern lives between standards and acceptance—between refining toward perfection and making peace with imperfection. Your discernment is both strength and burden; you see flaws that others miss, including flaws in yourself that may not require fixing.",
      secondary: "A secondary tension exists between protection and connection. Your clarity creates boundaries that serve you, yet those same boundaries can become walls. You may feel the paradox of wanting closeness while maintaining the space that feels safe."
    },
    Water: {
      primary: "The fundamental tension within your pattern lives between depth and direction—between understanding everything and deciding anything. Your capacity to perceive complexity can become paralysis when action requires simplification. Wisdom without application remains incomplete.",
      secondary: "A secondary tension exists between merging and maintaining self. Your natural empathy and adaptability create connection, yet they can also dissolve the boundaries that define who you are apart from what surrounds you."
    }
  };

  const growthDirectionPatterns: Record<string, { aligned: string; development: string }> = {
    Wood: {
      aligned: "Balance is restored when your growth energy finds appropriate channels—when expansion serves purpose rather than escaping presence. Your development flourishes not by moderating your drive but by directing it wisely. The tree that grows toward light serves its nature; the tree that grows in every direction exhausts itself.",
      development: "Conditions that support your alignment include: clear vision of where growth serves you, patience as strategic wisdom rather than imposed limitation, and completion as a form of maturity rather than an ending. You develop best when you can see how staying connects to going."
    },
    Fire: {
      aligned: "Balance is restored when your intensity becomes sustainable radiance—when you learn to shine without consuming yourself. Your development flourishes not by dimming but by building reserves that fuel consistent warmth. The fire that burns for decades serves more than the one that blazes and exhausts.",
      development: "Conditions that support your alignment include: practices that replenish as well as expend, recognition that being seen isn't always serving, and learning to receive the warmth you so naturally give. You develop best when your light nourishes rather than depletes you."
    },
    Earth: {
      aligned: "Balance is restored when your stability becomes flexible rather than rigid—when you can hold center while allowing movement. Your development flourishes not by becoming less steady but by including change within your steadiness. The mountain that moves with the ages endures; the one that only resists eventually crumbles.",
      development: "Conditions that support your alignment include: permission to prioritize your own needs alongside others', recognition that change can serve stability rather than threaten it, and receiving support as gracefully as you give it. You develop best when the ground you provide for others includes solid ground for yourself."
    },
    Metal: {
      aligned: "Balance is restored when your discernment includes self-compassion—when you can refine without rejecting. Your development flourishes not by lowering standards but by widening the circle of what meets them. The blade that knows when not to cut serves better than one that only knows sharpness.",
      development: "Conditions that support your alignment include: acceptance as a complement to precision rather than its opposite, connection that survives imperfection, and recognition that excellence sometimes means 'enough.' You develop best when your clarity serves without isolating."
    },
    Water: {
      aligned: "Balance is restored when your depth finds direction—when perception becomes navigation rather than only understanding. Your development flourishes not by becoming less deep but by adding current to your stillness. The water that moves reaches the sea; the water that only pools eventually stagnates.",
      development: "Conditions that support your alignment include: containment that gives form to your formlessness, action that follows intuition rather than replacing it, and maintaining self while merging with what matters. You develop best when your depth has somewhere to flow."
    }
  };

  const coreNature = coreNatureDescriptions[yearElement] || coreNatureDescriptions.Earth;
  const naturalStrength = naturalStrengthDescriptions[yearElement] || naturalStrengthDescriptions.Earth;
  const blindSpot = blindSpotPatterns[yearElement] || blindSpotPatterns.Earth;
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
    coreNature: `${coreNature.thinking} ${yinYangModifier}\n\n${coreNature.responding} ${chiInfluence}\n\n${coreNature.deciding}\n\n${coreNature.recognition}`,
    naturalStrength: `${naturalStrength} ${
      isHarmonic 
        ? "Your birth pattern's natural harmony amplifies this advantage, making it more accessible and consistent."
        : "Your birth pattern's dynamic tension means this strength may require more conscious cultivation, but becomes more resilient once developed."
    }`,
    blindSpot: `${blindSpot} ${
      isHarmonic 
        ? "Your pattern's inherent harmony may soften these tendencies, but doesn't eliminate them."
        : "Your pattern's dynamic polarity can intensify this limitation, making awareness even more important."
    }`,
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
  const [sessionCreated, setSessionCreated] = useState(false);

  const { createSession, trackAnswer, completeSession, resetSession } = useQuizTracking();

  const totalSteps = quizQuestions.length;
  const currentQuestion = quizQuestions[currentStep];

  // Create session on first step
  useEffect(() => {
    if (currentStep === 0 && !sessionCreated) {
      createSession();
      setSessionCreated(true);
    }
  }, [currentStep, sessionCreated, createSession]);

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Track answer to database
    trackAnswer(questionId, value);
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
    
    // For datetime type, both birthDate and birthTime must be filled
    if (question.type === "datetime") {
      return !!answers.birthDate && !!answers.birthTime;
    }
    
    return !!answer;
  };

  const isLastStep = currentStep === totalSteps - 1;

  const submitQuiz = useCallback(() => {
    // Generate insight immediately - no loading, no async
    const insight = generateFallbackInsight(answers);
    setResult(insight);
    // Mark session as completed
    completeSession();
  }, [answers, completeSession]);

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setError(null);
    setIsLoading(false);
    setSessionCreated(false);
    resetSession();
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
