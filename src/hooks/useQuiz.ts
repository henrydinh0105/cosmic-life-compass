import { useState, useCallback } from "react";
import { QuizAnswers, InsightResult, BalanceLevel } from "@/types/quiz";
import { quizQuestions } from "@/data/quizQuestions";
import { lapLaSo } from "@/lib/tuvi/calculations";
import { TuViInput, TuViChart } from "@/lib/tuvi/types";
import { gioChiMap } from "@/lib/tuvi/data/canChi";
import { luanGiaiDimension, generateOverallInsight, generateReflectionQuestion } from "@/lib/tuvi/luanGiai";

// Convert quiz answers to TuVi input
function quizAnswersToTuViInput(answers: QuizAnswers): TuViInput | null {
  if (!answers.birthDate || !answers.birthHour || !answers.gender) {
    return null;
  }

  const date = new Date(answers.birthDate);
  const gioSinh = gioChiMap[answers.birthHour] || 1;

  return {
    ngay: date.getDate(),
    thang: date.getMonth() + 1,
    nam: date.getFullYear(),
    gioSinh,
    gioiTinh: answers.gender === "male" ? 1 : -1,
    duongLich: answers.calendarType !== "lunar",
    timeZone: 7,
  };
}

// Generate Life Energy Map insight based on Tử Vi chart
const generateTuViInsight = (chart: TuViChart, answers: QuizAnswers): InsightResult => {
  return {
    lifeEnergyMap: {
      achievementResources: luanGiaiDimension(chart, "achievementResources"),
      relationshipsConnection: luanGiaiDimension(chart, "relationshipsConnection"),
      emotionalBalance: luanGiaiDimension(chart, "emotionalBalance"),
      supportFlow: luanGiaiDimension(chart, "supportFlow"),
      directionVision: luanGiaiDimension(chart, "directionVision"),
    },
    overallInsight: generateOverallInsight(chart),
    reflectionQuestion: generateReflectionQuestion(chart),
    tuViChart: chart, // Include chart data for display
  };
};

// Fallback insight when Tử Vi calculation fails
const generateFallbackInsight = (answers: QuizAnswers): InsightResult => {
  const focus = answers.lifeFocus || "balance";
  
  return {
    lifeEnergyMap: {
      achievementResources: {
        currentState: "Năng lượng về tài lộc và sự nghiệp đang ở trạng thái cân bằng, chờ đợi sự khởi động từ hành động của bạn.",
        balanceLevel: "Moderate" as BalanceLevel,
        guidance: "Hãy tập trung vào việc xây dựng nền tảng vững chắc. Thành công bền vững đến từ sự kiên trì."
      },
      relationshipsConnection: {
        currentState: "Các mối quan hệ cần được nuôi dưỡng bằng sự quan tâm và lắng nghe chân thành.",
        balanceLevel: "Moderate" as BalanceLevel,
        guidance: "Dành thời gian cho những người quan trọng. Sự hiện diện đôi khi có giá trị hơn lời nói."
      },
      emotionalBalance: {
        currentState: "Cảm xúc là năng lượng cần được điều hòa, không phải kiểm soát hay kìm nén.",
        balanceLevel: "Moderate" as BalanceLevel,
        guidance: "Tập thở sâu và quan sát cảm xúc mà không phán xét. Đây là bước đầu của tự nhận thức."
      },
      supportFlow: {
        currentState: "Sự hỗ trợ thường đến khi ta sẵn sàng đón nhận, không chỉ khi ta cần.",
        balanceLevel: "Moderate" as BalanceLevel,
        guidance: "Mở lòng với những cơ hội bất ngờ. Đôi khi giúp đỡ người khác là cách nhận lại nhiều nhất."
      },
      directionVision: {
        currentState: "Hướng đi rõ ràng khi ta biết mình là ai và trân trọng điều gì.",
        balanceLevel: "Moderate" as BalanceLevel,
        guidance: "Đừng vội vã tìm câu trả lời. Hãy để câu hỏi dẫn dắt bạn khám phá."
      }
    },
    overallInsight: "Để có kết quả chính xác hơn, vui lòng cung cấp đầy đủ thông tin ngày sinh, giờ sinh và giới tính. Những xu hướng năng lượng trong Tử Vi Đẩu Số được tính toán dựa trên các yếu tố này.",
    reflectionQuestion: focus === "career" 
      ? "Điều gì thực sự quan trọng với bạn trong công việc - thành công hay ý nghĩa?"
      : focus === "relationships"
      ? "Bạn đang cho đi hay đang chờ đợi nhận lại trong các mối quan hệ?"
      : "Nếu không có gì cản trở, bạn sẽ sống khác đi như thế nào?"
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
    const tuViInput = quizAnswersToTuViInput(answers);
    if (tuViInput) {
      try {
        const chart = lapLaSo(tuViInput);
        const insight = generateTuViInsight(chart, answers);
        setResult(insight);
      } catch {
        const fallback = generateFallbackInsight(answers);
        setResult(fallback);
      }
    } else {
      const fallback = generateFallbackInsight(answers);
      setResult(fallback);
    }
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
