import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AnswerChart } from "@/components/admin/AnswerChart";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Question labels for display
const questionLabels: Record<string, string> = {
  birthDate: "Birth Date",
  birthTime: "Birth Time",
  gender: "Gender",
  lifeFocus: "Life Focus",
  currentAttention: "Current Attention",
  seekClarity: "Seek Clarity"
};

const QuizAnalytics = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const { 
    isLoading: dataLoading, 
    answerStats,
    refreshData 
  } = useAnalytics();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate]);

  // Group answers by question
  const groupedAnswers = useMemo(() => {
    const grouped: Record<string, Array<{ answer_value: string; count: number }>> = {};
    
    answerStats.forEach((stat) => {
      if (!grouped[stat.question_id]) {
        grouped[stat.question_id] = [];
      }
      grouped[stat.question_id].push({
        answer_value: stat.answer_value,
        count: stat.count
      });
    });

    // Sort answers within each question by count (descending)
    Object.keys(grouped).forEach((questionId) => {
      grouped[questionId].sort((a, b) => b.count - a.count);
    });

    return grouped;
  }, [answerStats]);

  // Get ordered question IDs (based on quiz order)
  const orderedQuestionIds = useMemo(() => {
    const order = ["birthDate", "birthTime", "gender", "lifeFocus", "currentAttention", "seekClarity"];
    return order.filter((id) => grouped[id] !== undefined);
    
    function grouped(id: string) {
      return groupedAnswers[id];
    }
  }, [groupedAnswers]);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Quiz Analytics</h1>
            <p className="text-muted-foreground">
              Detailed breakdown of quiz responses by question
            </p>
          </div>
          <Button 
            onClick={refreshData} 
            variant="outline" 
            disabled={dataLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${dataLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Charts */}
        {dataLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : orderedQuestionIds.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No quiz data available yet. Data will appear here once users complete quizzes.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {orderedQuestionIds.map((questionId) => (
              <AnswerChart
                key={questionId}
                questionId={questionId}
                questionLabel={questionLabels[questionId] || questionId}
                data={groupedAnswers[questionId]}
                type="bar"
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default QuizAnalytics;
