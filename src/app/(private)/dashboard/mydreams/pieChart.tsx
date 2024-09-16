"use client";
import { EmotionColor } from "@/app/(model)/emotioncolorEnum";
import { EmotionFrequencyProp } from "@/app/interface/EmotionFrequencyProp";
import { ChartDataDictionary } from "@/app/types/chartData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { Label, Pie, PieChart } from "recharts";

export default function EmotionChart({
  emotionFrequency,
}: EmotionFrequencyProp) {
  const totalDreams = Object.values(emotionFrequency).reduce(
    (total, currentValue) => {
      return total + currentValue;
    },
    0
  );
  const chartData = fillChartData(emotionFrequency);
  const chartConfig = {
    count: {
      label: "Count",
    },
    ...Object.fromEntries(
      chartData.map((item) => [
        item.emotion.toLowerCase(),
        {
          label: item.emotion,
          color: item.fill,
        },
      ])
    ),
  } satisfies ChartConfig;

  return (
    <div>
      <Card className="flex flex-col">
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[350px]"
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="emotion"
                innerRadius={60}
                outerRadius={100}
                strokeWidth={2}
                stroke="hsl(var(--background))"
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalDreams}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            Total Dreams
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="emotion" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center "
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

const fillChartData = (
  emotionFrequency: ChartDataDictionary
): Array<chartDataType> => {
  const chartData: Array<chartDataType> = [];
  Object.keys(emotionFrequency).map((emotion) => {
    const currentChartData: chartDataType = {
      emotion: emotion,
      count: emotionFrequency[emotion],
      fill: EmotionColor[emotion as keyof typeof EmotionColor],
    };
    chartData.push(currentChartData);
  });
  return chartData;
};

type chartDataType = {
  emotion: string;
  count: number;
  fill: string;
};
