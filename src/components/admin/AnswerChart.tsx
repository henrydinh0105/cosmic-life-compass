import { useMemo } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AnswerChartProps {
  questionId: string;
  questionLabel: string;
  data: Array<{ answer_value: string; count: number }>;
  type?: "bar" | "pie";
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
];

export const AnswerChart = ({ 
  questionId, 
  questionLabel, 
  data, 
  type = "bar" 
}: AnswerChartProps) => {
  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    data.forEach((item, index) => {
      config[item.answer_value] = {
        label: item.answer_value,
        color: COLORS[index % COLORS.length]
      };
    });
    return config;
  }, [data]);

  const totalResponses = useMemo(() => 
    data.reduce((sum, item) => sum + item.count, 0), 
    [data]
  );

  const chartData = useMemo(() => 
    data.map((item, index) => ({
      name: item.answer_value,
      value: item.count,
      percentage: totalResponses > 0 ? Math.round((item.count / totalResponses) * 100) : 0,
      fill: COLORS[index % COLORS.length]
    })),
    [data, totalResponses]
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{questionLabel}</CardTitle>
        <CardDescription>
          {totalResponses} total responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {type === "bar" ? (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100}
                tick={{ fontSize: 12 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        )}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5 text-xs">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-muted-foreground">
                {item.name}: {item.value} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
