import { useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Hook to track quiz sessions and answers for analytics
 * Generates a unique session ID and logs all quiz interactions
 */
export const useQuizTracking = () => {
  const { language } = useLanguage();
  const sessionIdRef = useRef<string | null>(null);

  // Generate or get current session ID
  const getSessionId = useCallback(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = crypto.randomUUID();
    }
    return sessionIdRef.current;
  }, []);

  // Create a new quiz session in the database
  const createSession = useCallback(async () => {
    const sessionId = getSessionId();
    
    try {
      const { error } = await supabase
        .from("quiz_sessions")
        .insert({
          session_id: sessionId,
          language: language,
          completed: false
        });

      if (error) {
        console.error("Failed to create quiz session:", error);
      }
    } catch (err) {
      console.error("Error creating quiz session:", err);
    }

    return sessionId;
  }, [getSessionId, language]);

  // Track a single answer
  const trackAnswer = useCallback(async (questionId: string, answerValue: string) => {
    const sessionId = getSessionId();
    
    try {
      const { error } = await supabase
        .from("quiz_answers")
        .insert({
          session_id: sessionId,
          question_id: questionId,
          answer_value: answerValue
        });

      if (error) {
        console.error("Failed to track answer:", error);
      }
    } catch (err) {
      console.error("Error tracking answer:", err);
    }
  }, [getSessionId]);

  // Mark session as completed
  const completeSession = useCallback(async () => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from("quiz_sessions")
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq("session_id", sessionId);

      if (error) {
        console.error("Failed to complete session:", error);
      }
    } catch (err) {
      console.error("Error completing session:", err);
    }
  }, []);

  // Reset session for new quiz
  const resetSession = useCallback(() => {
    sessionIdRef.current = null;
  }, []);

  return {
    getSessionId,
    createSession,
    trackAnswer,
    completeSession,
    resetSession
  };
};
