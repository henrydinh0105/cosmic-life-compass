import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Users, CheckCircle, Percent, Mail, RefreshCw } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const { 
    isLoading: dataLoading, 
    overviewStats, 
    sessionTrends,
    refreshData 
  } = useAnalytics();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, authLoading, navigate]);

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const chartConfig = {
    sessions: {
      label: "Total Sessions",
      color: "hsl(var(--primary))"
    },
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-2))"
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of quiz performance and user engagement
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Sessions"
            value={overviewStats?.totalSessions || 0}
            description="Quiz attempts started"
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            title="Completed"
            value={overviewStats?.completedSessions || 0}
            description="Quizzes finished"
            icon={<CheckCircle className="w-5 h-5" />}
          />
          <StatsCard
            title="Completion Rate"
            value={`${overviewStats?.completionRate || 0}%`}
            description="Of users complete the quiz"
            icon={<Percent className="w-5 h-5" />}
          />
          <StatsCard
            title="Email Subscribers"
            value={overviewStats?.totalSubscribers || 0}
            description="Signed up for guidance"
            icon={<Mail className="w-5 h-5" />}
          />
        </div>

        {/* Session Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Session Trends</CardTitle>
            <CardDescription>
              Quiz sessions over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sessionTrends.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <LineChart data={sessionTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    name="Total Sessions"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-2))" }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                {dataLoading ? "Loading..." : "No data available yet"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate("/admin/subscribers")}
          >
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Manage Subscribers
              </CardTitle>
              <CardDescription>
                View and export email subscriber list
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate("/admin/analytics")}
          >
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Quiz Analytics
              </CardTitle>
              <CardDescription>
                Detailed breakdown of quiz responses
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
