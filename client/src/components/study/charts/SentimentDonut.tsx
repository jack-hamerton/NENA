"use client";

import { SentimentBreakdown } from "@/types";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SentimentDonutProps {
  data: SentimentBreakdown;
}

export function SentimentDonut({ data }: SentimentDonutProps) {
  const chartData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [data.positive, data.negative, data.neutral],
        backgroundColor: [
          "oklch(0.72 0.17 145)",
          "oklch(0.65 0.22 25)",
          "oklch(0.68 0.10 230)",
        ],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "hsl(0 0% 65%)",
          font: { size: 12 },
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: number }) => ` ${ctx.parsed}%`,
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Sentiment
      </h4>
      <div className="w-[220px] h-[220px]">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
}
