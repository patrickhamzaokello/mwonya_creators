"use client"

import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMonthlyStatsAction } from '@/actions/dashboard/getOverview-stats'

export function Overview({ artistID }: ArtistID) {
  const [data, setMonthly] = useState<MonthlyData[] | MessageType | any>()
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [valueRange, setValueRange] = useState({ min: 0, max: 0 })

  useEffect(() => {
    if (!artistID) return;
    setIsLoading(true);
    getMonthlyStatsAction(artistID)
      .then((monthlyData) => {
        setMonthly(monthlyData);
        if (Array.isArray(monthlyData)) {
          const years = Array.from(
            new Set(monthlyData.map((item: any) => new Date(item.date).getFullYear().toString()))
          );
          setAvailableYears(years);
          setSelectedYear(years[years.length - 1]);

          // Calculate overall min/max for better axis scaling
          const values = monthlyData.map((item: any) => item.total);
          setValueRange({
            min: Math.min(...values),
            max: Math.max(...values)
          });
        }
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setIsLoading(false));
  }, [artistID]);

  useEffect(() => {
    if (data) {
      const filtered = data.filter((item: any) =>
        new Date(item.date).getFullYear().toString() === selectedYear
      );
      setFilteredData(filtered);
    }
  }, [data, selectedYear]);

  const getStrokeColor = (value: number) => {
    return value >= 0 ? "#22c55e" : "#ef4444";
  };

  if (isLoading) {
    return <OverViewSkeleton />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  // Calculate padding for Y-axis based on data range
  const absMax = Math.max(Math.abs(valueRange.min), Math.abs(valueRange.max));
  const yAxisDomain = [-absMax, absMax];

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Total Plays Percentage Change</CardTitle>
            <CardDescription>Monthly total percentage change breakdown with increase/decrease indication</CardDescription>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              domain={yAxisDomain}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Month
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {label}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            % Change
                          </span>
                          <span className={`font-bold ${typeof value === 'number' && value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {value}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            {/* Zero reference line */}
            <ReferenceLine
              y={0}
              stroke="#888888"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#888888"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill={getStrokeColor(payload.total)}
                    stroke="white"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 6, strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function OverViewSkeleton() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[350px] w-full" />
      </CardContent>
    </Card>
  )
}

export default Overview;