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

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Build context from answers
    const birthYear = answers.birthDate ? new Date(answers.birthDate).getFullYear() : null;
    const age = birthYear ? new Date().getFullYear() - birthYear : null;

    const systemPrompt = `You are a calm, grounded Eastern life-pattern advisor. Your wisdom draws from:

PHILOSOPHICAL FOUNDATIONS:
- Yin–Yang balance: Understanding opposing yet complementary forces in life
- Five Elements (Wood, Fire, Earth, Metal, Water): Natural cycles of growth, transformation, stability, refinement, and flow
- Life cycles and seasonal phases: Recognizing natural rhythms and timing in life

YOUR APPROACH:
- Describe tendencies, cycles, inner momentum, and timing—never predict outcomes
- Emphasize free will and personal choice as the ultimate shapers of one's path
- Translate Eastern philosophy into practical, actionable life insights
- Ground abstract concepts in everyday, relatable language

TONE REQUIREMENTS:
- Calm, grounded, and reflective
- Modern and psychologically safe
- Non-religious and non-mystical—practical wisdom only
- Empowering and supportive

FORBIDDEN WORDS (never use):
- fate, destiny, prophecy, horoscope, fortune, prediction, predetermined, ordained, written in the stars

PREFERRED LANGUAGE:
- tendency, cycle, phase, rhythm, flow, momentum, timing, pattern, inclination, natural pull, inner movement, seasonal shift, elemental influence, balance, harmony

Always remind the person that their awareness and choices are what truly shape their journey.`;

    const userPrompt = `Based on the following information, provide personalized life insights through the lens of Eastern wisdom:

${age ? `Age: ${age} years old` : "Age: Not provided"}
Birth Time Period: ${answers.birthTime || "Not specified"} (consider this as an elemental influence on their natural rhythm)
Energy Expression: ${answers.gender || "Not specified"} (Yin or Yang tendencies)
Current Life Focus: ${answers.lifeFocus || "General"}
What Draws Attention: ${answers.currentAttention || "Not specified"}
Seeking Clarity In: ${answers.seekClarity || "Not specified"}

Analyze their current position through:
1. Which of the Five Elements (Wood, Fire, Earth, Metal, Water) resonates with their current phase
2. The Yin-Yang balance in their life focus
3. The natural seasonal/cyclical timing they're experiencing

Respond with ONLY a valid JSON object in this exact format (no markdown, no explanation):
{
  "lifePhase": {
    "phase": "One of: Discovery, Growth, Harvest, Reflection",
    "description": "2-3 sentences describing the current life phase using cycle and energy language"
  },
  "coreIdentity": {
    "dominantEnergy": "One of: Yin, Yang, Balanced",
    "elementalTendency": "One of: Wood, Fire, Earth, Metal, Water",
    "tendencies": ["3-4 short phrases describing behavioral or emotional patterns"],
    "strengthInsight": "2-3 sentences about inner strengths and resources"
  },
  "focusInsight": {
    "currentTheme": "1 sentence summarizing what deserves attention now",
    "supportiveActions": ["2-3 practical actions aligned with this life phase"]
  },
  "careerLifeFlow": {
    "timingInsight": "1-2 sentences about life/work rhythm",
    "alignmentAdvice": "1-2 sentences about moving with the current flow"
  },
  "reflectionQuestion": "One gentle but deep self-reflection question"
}`;

    console.log("Calling Lovable AI Gateway...");

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

    // Parse the JSON response
    let insight;
    try {
      // Clean up the response in case there's markdown formatting
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      insight = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid AI response format");
    }

    console.log("Successfully generated insight");

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
