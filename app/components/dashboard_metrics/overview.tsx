"use client"

import { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMonthlyStatsAction } from '@/actions/dashboard/getOverview-stats'

export function Overview({ artistID }: ArtistID) {
  const [data, setMonthly] = useState<MonthlyData[] | MessageType | any>()
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [selectedYear, setSelectedYear] = useState('2024')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [valueRange, setValueRange] = useState({ min: 0, max: 0 })

  // Process data to separate positive and negative values
  const processChartData = (data: any[]) => {
    return data.map(item => ({
      ...item,
      positive: item.total > 0 ? item.total : 0,
      negative: item.total < 0 ? item.total : 0
    }));
  };

  useEffect(() => {
    if (!artistID) return;
    setIsLoading(true);
    getMonthlyStatsAction(artistID, '2024')
      .then((monthlyData) => {
        if (Array.isArray(monthlyData) && monthlyData.length > 0) {
          setMonthly(monthlyData);
          setError(null);

          const values = monthlyData.map((item: any) => item.total);
          setValueRange({
            min: Math.min(...values),
            max: Math.max(...values)
          });
        } else {
          setFilteredData([]);
          setError('No records available for the selected year.');
        }
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setIsLoading(false));
  }, [artistID]);

  useEffect(() => {
    if (data) {
      setFilteredData(processChartData(data));
    }
  }, [data]);

  useEffect(() => {
    if (!artistID) return;
    setIsLoading(true);
    getMonthlyStatsAction(artistID, selectedYear)
      .then((monthlyData) => {
        if (Array.isArray(monthlyData) && monthlyData.length > 0) {
          setMonthly(monthlyData);
          setError(null);

          const values = monthlyData.map((item: any) => item.total);
          setValueRange({
            min: Math.min(...values),
            max: Math.max(...values)
          });
        } else {
          setFilteredData([]);
          setError('No records available for the selected year.');
        }
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setIsLoading(false));
  }, [artistID, selectedYear]);

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
            <CardTitle>Total Plays Overview</CardTitle>
            <CardDescription>Monthly % Change in Total Track Plays showing increase (green) and decline (red) areas</CardDescription>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {['2021', '2022', '2023', '2024', '2025'].map((year) => (
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
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="negativeGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
                  const value = payload[0].payload.total;
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
                          <span className={`font-bold ${value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
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
            {/* Positive Area */}
            <Area
              type="monotone"
              dataKey="positive"
              stroke="rgb(34, 197, 94)"
              fillOpacity={1}
              fill="url(#positiveGradient)"
              strokeWidth={2}
            />
            {/* Negative Area */}
            <Area
              type="monotone"
              dataKey="negative"
              stroke="rgb(239, 68, 68)"
              fillOpacity={1}
              fill="url(#negativeGradient)"
              strokeWidth={2}
            />
          </AreaChart>
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