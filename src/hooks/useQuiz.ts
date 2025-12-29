import { useState } from "react";
import { QuizAnswers, InsightResult } from "@/types/quiz";
import { quizQuestions } from "@/data/quizQuestions";
import { supabase } from "@/integrations/supabase/client";

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
    
    // Optional questions always allow proceeding
    if (question.type === "optional") return true;
    
    // Other questions need an answer
    return !!answer;
  };

  const isLastStep = currentStep === totalSteps - 1;

  const submitQuiz = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-insight", {
        body: { answers },
      });

      if (fnError) throw fnError;
      
      setResult(data as InsightResult);
    } catch (err) {
      console.error("Error generating insights:", err);
      setError("Unable to generate your insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
