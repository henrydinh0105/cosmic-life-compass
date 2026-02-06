import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OverviewStats {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  totalSubscribers: number;
}

interface QuizAnswerStats {
  question_id: string;
  answer_value: string;
  count: number;
}

interface EmailSubscriber {
  id: string;
  email: string;
  language: string;
  created_at: string;
}

interface SessionTrend {
  date: string;
  sessions: number;
  completed: number;
}

/**
 * Hook to fetch analytics data for admin dashboard
 */
export const useAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [answerStats, setAnswerStats] = useState<QuizAnswerStats[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [sessionTrends, setSessionTrends] = useState<SessionTrend[]>([]);

  // Fetch overview statistics
  const fetchOverviewStats = useCallback(async () => {
    try {
      // Get total sessions
      const { count: totalSessions, error: sessionsError } = await supabase
        .from("quiz_sessions")
        .select("*", { count: "exact", head: true });

      if (sessionsError) throw sessionsError;

      // Get completed sessions
      const { count: completedSessions, error: completedError } = await supabase
        .from("quiz_sessions")
        .select("*", { count: "exact", head: true })
        .eq("completed", true);

      if (completedError) throw completedError;

      // Get total subscribers
      const { count: totalSubscribers, error: subscribersError } = await supabase
        .from("email_subscribers")
        .select("*", { count: "exact", head: true });

      if (subscribersError) throw subscribersError;

      const total = totalSessions || 0;
      const completed = completedSessions || 0;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

      setOverviewStats({
        totalSessions: total,
        completedSessions: completed,
        completionRate: rate,
        totalSubscribers: totalSubscribers || 0
      });
    } catch (err) {
      console.error("Error fetching overview stats:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    }
  }, []);

  // Fetch answer statistics grouped by question and answer
  const fetchAnswerStats = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("quiz_answers")
        .select("question_id, answer_value");

      if (fetchError) throw fetchError;

      // Group by question_id and answer_value, count occurrences
      const grouped: Record<string, Record<string, number>> = {};
      
      (data || []).forEach((row) => {
        if (!grouped[row.question_id]) {
          grouped[row.question_id] = {};
        }
        if (!grouped[row.question_id][row.answer_value]) {
          grouped[row.question_id][row.answer_value] = 0;
        }
        grouped[row.question_id][row.answer_value]++;
      });

      // Convert to flat array
      const stats: QuizAnswerStats[] = [];
      Object.entries(grouped).forEach(([questionId, answers]) => {
        Object.entries(answers).forEach(([answerValue, count]) => {
          stats.push({
            question_id: questionId,
            answer_value: answerValue,
            count
          });
        });
      });

      setAnswerStats(stats);
    } catch (err) {
      console.error("Error fetching answer stats:", err);
    }
  }, []);

  // Fetch email subscribers
  const fetchSubscribers = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from("email_subscribers")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      setSubscribers(data || []);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
    }
  }, []);

  // Fetch session trends (last 30 days)
  const fetchSessionTrends = useCallback(async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error: fetchError } = await supabase
        .from("quiz_sessions")
        .select("created_at, completed")
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (fetchError) throw fetchError;

      // Group by date
      const grouped: Record<string, { sessions: number; completed: number }> = {};
      
      (data || []).forEach((row) => {
        const date = new Date(row.created_at).toISOString().split("T")[0];
        if (!grouped[date]) {
          grouped[date] = { sessions: 0, completed: 0 };
        }
        grouped[date].sessions++;
        if (row.completed) {
          grouped[date].completed++;
        }
      });

      // Convert to array and sort by date
      const trends = Object.entries(grouped)
        .map(([date, stats]) => ({
          date,
          sessions: stats.sessions,
          completed: stats.completed
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setSessionTrends(trends);
    } catch (err) {
      console.error("Error fetching session trends:", err);
    }
  }, []);

  // Fetch all data
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    await Promise.all([
      fetchOverviewStats(),
      fetchAnswerStats(),
      fetchSubscribers(),
      fetchSessionTrends()
    ]);

    setIsLoading(false);
  }, [fetchOverviewStats, fetchAnswerStats, fetchSubscribers, fetchSessionTrends]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Export subscribers to CSV
  const exportSubscribersCSV = useCallback(() => {
    const headers = ["Email", "Language", "Subscribed At"];
    const rows = subscribers.map((sub) => [
      sub.email,
      sub.language,
      new Date(sub.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `email-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }, [subscribers]);

  return {
    isLoading,
    error,
    overviewStats,
    answerStats,
    subscribers,
    sessionTrends,
    refreshData,
    exportSubscribersCSV
  };
};
