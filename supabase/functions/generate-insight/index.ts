import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuizAnswers {
  birthDate?: string;
  birthTime?: string;
  gender?: string;
  lifeFocus?: string;
  currentAttention?: string;
  seekClarity?: string;
}

// LOCKED ANALYSIS LOGIC
// Birth Year → Long-term Elemental Tendency (symbolic, not astrology)
function getElementalTendency(birthYear: number | null): string {
  if (!birthYear) return "Balanced across elements";
  
  // Symbolic cycle based on last digit (not astrological)
  const lastDigit = birthYear % 10;
  const elementMap: Record<number, string> = {
    0: "Metal", 1: "Metal",
    2: "Water", 3: "Water",
    4: "Wood", 5: "Wood",
    6: "Fire", 7: "Fire",
    8: "Earth", 9: "Earth",
  };
  return elementMap[lastDigit] || "Earth";
}

// Birth Time → Yin/Yang Orientation
function getYinYangOrientation(birthTime: string | undefined): string {
  if (!birthTime) return "Balanced";
  
  const timeMap: Record<string, string> = {
    "morning": "Yang rising", // Active, expansive energy
    "afternoon": "Yang full", // Peak outward energy
    "evening": "Yin rising", // Transitioning inward
    "night": "Yin full", // Reflective, receptive energy
    "unknown": "Balanced",
  };
  return timeMap[birthTime] || "Balanced";
}

// Repeated choices → Life Phase Weighting
function analyzeLifePhase(answers: QuizAnswers): { phase: string; focus: string } {
  const choices = [answers.lifeFocus, answers.currentAttention, answers.seekClarity].filter(Boolean);
  
  // Count themes
  const themes: Record<string, number> = {
    exploration: 0,
    growth: 0,
    stability: 0,
    reflection: 0,
  };
  
  const themeMapping: Record<string, string> = {
    // lifeFocus
    "career": "growth",
    "relationships": "stability",
    "personal": "reflection",
    "balance": "stability",
    // currentAttention
    "stability": "stability",
    "change": "exploration",
    "growth": "growth",
    "rest": "reflection",
    // seekClarity
    "work": "growth",
    "love": "stability",
    "health": "reflection",
    "purpose": "exploration",
  };
  
  for (const choice of choices) {
    if (choice && themeMapping[choice]) {
      themes[themeMapping[choice]]++;
    }
  }
  
  // Find dominant theme
  let dominant = "exploration";
  let maxCount = 0;
  for (const [theme, count] of Object.entries(themes)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = theme;
    }
  }
  
  const phaseMap: Record<string, string> = {
    exploration: "Discovery",
    growth: "Growth",
    stability: "Harvest",
    reflection: "Reflection",
  };
  
  return { phase: phaseMap[dominant], focus: dominant };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { answers } = await req.json() as { answers: QuizAnswers };
    console.log("Received answers:", answers);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // LOCKED ANALYSIS: Extract patterns from inputs
    const birthYear = answers.birthDate ? new Date(answers.birthDate).getFullYear() : null;
    const age = birthYear ? new Date().getFullYear() - birthYear : null;
    
    // Apply locked interpretation rules
    const elementalTendency = getElementalTendency(birthYear);
    const yinYangOrientation = getYinYangOrientation(answers.birthTime);
    const lifePhaseAnalysis = analyzeLifePhase(answers);

    const systemPrompt = `You are a calm, grounded Eastern life-pattern advisor.

LOCKED INTERPRETATION FRAMEWORK:
You MUST use these pre-analyzed patterns as the foundation of your insight:

1. ELEMENTAL TENDENCY: "${elementalTendency}" (derived symbolically from birth year cycle)
2. YIN-YANG ORIENTATION: "${yinYangOrientation}" (derived from birth time period)
3. CURRENT LIFE PHASE: "${lifePhaseAnalysis.phase}" (derived from repeated choice patterns)
4. PHASE FOCUS: "${lifePhaseAnalysis.focus}" (the dominant theme in their selections)

PHILOSOPHICAL FOUNDATIONS (use metaphorically, not literally):
- Yin–Yang: Complementary forces—not opposites, but partners in flow
- Five Elements: Natural patterns of energy movement, not destiny markers
- Life cycles: Seasons of inner experience, not predetermined paths

CRITICAL RULES:
- NEVER claim prediction or certainty about outcomes
- NEVER use: fate, destiny, prophecy, horoscope, fortune, prediction, predetermined, ordained
- ALWAYS emphasize: The patterns show tendencies, not destinations. Your awareness and choices shape your path.
- Frame ALL insights as possibilities and invitations, not declarations

TONE:
- Calm, grounded, reflective
- Modern, psychologically safe
- Practical wisdom, not mysticism
- Empowering personal agency

PREFERRED LANGUAGE:
- tendency, inclination, natural pull, inner rhythm
- cycle, phase, seasonal shift, timing
- flow, momentum, movement, pattern
- awareness, choice, intention, possibility`;

    const userPrompt = `Generate personalized life insights using the LOCKED FRAMEWORK provided.

USER CONTEXT:
- Age: ${age ? `${age} years` : "Not provided"}
- Elemental Tendency: ${elementalTendency}
- Yin-Yang Orientation: ${yinYangOrientation}
- Current Life Phase: ${lifePhaseAnalysis.phase}
- Life Focus: ${answers.lifeFocus || "General"}
- Current Attention: ${answers.currentAttention || "Open"}
- Seeking Clarity: ${answers.seekClarity || "General direction"}

Based on the locked framework, weave these patterns into coherent, practical insight.

Respond with ONLY valid JSON (no markdown):
{
  "lifePhase": {
    "phase": "${lifePhaseAnalysis.phase}",
    "description": "2-3 sentences describing this phase using the elemental tendency and yin-yang orientation. Emphasize this is a current tendency, not a fixed state."
  },
  "coreIdentity": {
    "dominantEnergy": "${yinYangOrientation.includes('Yang') ? 'Yang' : yinYangOrientation.includes('Yin') ? 'Yin' : 'Balanced'}",
    "elementalTendency": "${elementalTendency}",
    "tendencies": ["3-4 short phrases describing natural inclinations based on the element"],
    "strengthInsight": "2-3 sentences about inner resources, emphasizing these are available potentials, not guarantees"
  },
  "focusInsight": {
    "currentTheme": "1 sentence about what the patterns suggest deserves attention",
    "supportiveActions": ["2-3 practical actions that align with the current phase"]
  },
  "careerLifeFlow": {
    "timingInsight": "1-2 sentences about rhythm and timing tendencies",
    "alignmentAdvice": "1-2 sentences about working with current patterns, emphasizing choice"
  },
  "reflectionQuestion": "One question that invites self-awareness, not seeking answers but opening inquiry"
}`;

    console.log("Calling Lovable AI with locked analysis framework...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI response received");

    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    let insight;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      insight = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid AI response format");
    }

    console.log("Successfully generated insight with locked framework");

    return new Response(JSON.stringify(insight), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-insight function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to generate insights" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
