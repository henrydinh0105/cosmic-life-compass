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

    const systemPrompt = `You are a wise, calm life advisor who provides thoughtful insights based on life patterns. Your tone is:
- Reflective and empowering, never deterministic
- Modern and accessible, avoiding superstitious language
- Focused on tendencies and patterns, not predictions
- Warm and supportive, encouraging self-reflection

NEVER use words like: fate, destiny, fortune telling, prediction, horoscope
INSTEAD use: life pattern, tendency, influence, phase, timing, flow, rhythm

Provide insights that feel personal and meaningful, but always emphasize that the person's choices shape their path.`;

    const userPrompt = `Based on the following information, provide personalized life insights:

${age ? `Age: ${age} years old` : "Age: Not provided"}
Birth Time Period: ${answers.birthTime || "Not specified"}
Energy Type: ${answers.gender || "Not specified"}
Current Life Focus: ${answers.lifeFocus || "General"}
What Draws Attention: ${answers.currentAttention || "Not specified"}
Seeking Clarity In: ${answers.seekClarity || "Not specified"}

Respond with ONLY a valid JSON object in this exact format (no markdown, no explanation):
{
  "lifePhase": {
    "phase": "One of: Discovery, Growth, Harvest, Reflection",
    "description": "2-3 sentences about their current life phase and what it means"
  },
  "coreIdentity": {
    "tendencies": ["3-4 short tendency words or phrases"],
    "inclinations": "2-3 sentences about their natural inclinations and strengths"
  },
  "careerFinances": {
    "timing": "1-2 sentences about current timing influences for career/finances",
    "opportunities": "1-2 sentences about types of opportunities that may resonate"
  },
  "reflectionQuestion": "A single, thought-provoking question for self-reflection tailored to their answers"
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
