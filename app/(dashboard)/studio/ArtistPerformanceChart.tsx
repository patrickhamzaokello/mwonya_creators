"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

const chartData = [
  { date: "2024-04-01", Downloads: 222, Streams: 150 },
  { date: "2024-04-02", Downloads: 97, Streams: 180 },
  { date: "2024-04-03", Downloads: 167, Streams: 120 },
  { date: "2024-04-04", Downloads: 242, Streams: 260 },
  { date: "2024-04-05", Downloads: 373, Streams: 290 },
  { date: "2024-04-06", Downloads: 301, Streams: 340 },
  { date: "2024-04-07", Downloads: 245, Streams: 180 },
  { date: "2024-04-08", Downloads: 409, Streams: 320 },
  { date: "2024-04-09", Downloads: 59, Streams: 110 },
  { date: "2024-04-10", Downloads: 261, Streams: 190 },
  { date: "2024-04-11", Downloads: 327, Streams: 350 },
  { date: "2024-04-12", Downloads: 292, Streams: 210 },
  { date: "2024-04-13", Downloads: 342, Streams: 380 },
  { date: "2024-04-14", Downloads: 137, Streams: 220 },
  { date: "2024-04-15", Downloads: 120, Streams: 170 },
  { date: "2024-04-16", Downloads: 138, Streams: 190 },
  { date: "2024-04-17", Downloads: 446, Streams: 360 },
  { date: "2024-04-18", Downloads: 364, Streams: 410 },
  { date: "2024-04-19", Downloads: 243, Streams: 180 },
  { date: "2024-04-20", Downloads: 89, Streams: 150 },
  { date: "2024-04-21", Downloads: 137, Streams: 200 },
  { date: "2024-04-22", Downloads: 224, Streams: 170 },
  { date: "2024-04-23", Downloads: 138, Streams: 230 },
  { date: "2024-04-24", Downloads: 387, Streams: 290 },
  { date: "2024-04-25", Downloads: 215, Streams: 250 },
  { date: "2024-04-26", Downloads: 75, Streams: 130 },
  { date: "2024-04-27", Downloads: 383, Streams: 420 },
  { date: "2024-04-28", Downloads: 122, Streams: 180 },
  { date: "2024-04-29", Downloads: 315, Streams: 240 },
  { date: "2024-04-30", Downloads: 454, Streams: 380 },
  { date: "2024-05-01", Downloads: 165, Streams: 220 },
  { date: "2024-05-02", Downloads: 293, Streams: 310 },
  { date: "2024-05-03", Downloads: 247, Streams: 190 },
  { date: "2024-05-04", Downloads: 385, Streams: 420 },
  { date: "2024-05-05", Downloads: 481, Streams: 390 },
  { date: "2024-05-06", Downloads: 498, Streams: 520 },
  { date: "2024-05-07", Downloads: 388, Streams: 300 },
  { date: "2024-05-08", Downloads: 149, Streams: 210 },
  { date: "2024-05-09", Downloads: 227, Streams: 180 },
  { date: "2024-05-10", Downloads: 293, Streams: 330 },
  { date: "2024-05-11", Downloads: 335, Streams: 270 },
  { date: "2024-05-12", Downloads: 197, Streams: 240 },
  { date: "2024-05-13", Downloads: 197, Streams: 160 },
  { date: "2024-05-14", Downloads: 448, Streams: 490 },
  { date: "2024-05-15", Downloads: 473, Streams: 380 },
  { date: "2024-05-16", Downloads: 338, Streams: 400 },
  { date: "2024-05-17", Downloads: 499, Streams: 420 },
  { date: "2024-05-18", Downloads: 315, Streams: 350 },
  { date: "2024-05-19", Downloads: 235, Streams: 180 },
  { date: "2024-05-20", Downloads: 177, Streams: 230 },
  { date: "2024-05-21", Downloads: 82, Streams: 140 },
  { date: "2024-05-22", Downloads: 81, Streams: 120 },
  { date: "2024-05-23", Downloads: 252, Streams: 290 },
  { date: "2024-05-24", Downloads: 294, Streams: 220 },
  { date: "2024-05-25", Downloads: 201, Streams: 250 },
  { date: "2024-05-26", Downloads: 213, Streams: 170 },
  { date: "2024-05-27", Downloads: 420, Streams: 460 },
  { date: "2024-05-28", Downloads: 233, Streams: 190 },
  { date: "2024-05-29", Downloads: 78, Streams: 130 },
  { date: "2024-05-30", Downloads: 340, Streams: 280 },
  { date: "2024-05-31", Downloads: 178, Streams: 230 },
  { date: "2024-06-01", Downloads: 178, Streams: 200 },
  { date: "2024-06-02", Downloads: 470, Streams: 410 },
  { date: "2024-06-03", Downloads: 103, Streams: 160 },
  { date: "2024-06-04", Downloads: 439, Streams: 380 },
  { date: "2024-06-05", Downloads: 88, Streams: 140 },
  { date: "2024-06-06", Downloads: 294, Streams: 250 },
  { date: "2024-06-07", Downloads: 323, Streams: 370 },
  { date: "2024-06-08", Downloads: 385, Streams: 320 },
  { date: "2024-06-09", Downloads: 438, Streams: 480 },
  { date: "2024-06-10", Downloads: 155, Streams: 200 },
  { date: "2024-06-11", Downloads: 92, Streams: 150 },
  { date: "2024-06-12", Downloads: 492, Streams: 420 },
  { date: "2024-06-13", Downloads: 81, Streams: 130 },
  { date: "2024-06-14", Downloads: 426, Streams: 380 },
  { date: "2024-06-15", Downloads: 307, Streams: 350 },
  { date: "2024-06-16", Downloads: 371, Streams: 310 },
  { date: "2024-06-17", Downloads: 475, Streams: 520 },
  { date: "2024-06-18", Downloads: 107, Streams: 170 },
  { date: "2024-06-19", Downloads: 341, Streams: 290 },
  { date: "2024-06-20", Downloads: 408, Streams: 450 },
  { date: "2024-06-21", Downloads: 169, Streams: 210 },
  { date: "2024-06-22", Downloads: 317, Streams: 270 },
  { date: "2024-06-23", Downloads: 480, Streams: 530 },
  { date: "2024-06-24", Downloads: 132, Streams: 180 },
  { date: "2024-06-25", Downloads: 141, Streams: 190 },
  { date: "2024-06-26", Downloads: 434, Streams: 380 },
  { date: "2024-06-27", Downloads: 448, Streams: 490 },
  { date: "2024-06-28", Downloads: 149, Streams: 200 },
  { date: "2024-06-29", Downloads: 103, Streams: 160 },
  { date: "2024-06-30", Downloads: 446, Streams: 400 },
]

const chartConfig = {
  views: {
    label: "Page Views",
  },
  Downloads: {
    label: "Downloads",
    color: "hsl(var(--chart-1))",
  },
  Streams: {
    label: "Streams",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function ArtistPerformanceChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("Downloads")

  const total = React.useMemo(
    () => ({
      Downloads: chartData.reduce((acc, curr) => acc + curr.Downloads, 0),
      Streams: chartData.reduce((acc, curr) => acc + curr.Streams, 0),
    }),
    []
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["Downloads", "Streams"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
