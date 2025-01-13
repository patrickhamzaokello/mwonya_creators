"use client"

import { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getMonthlyStatsAction } from '@/actions/dashboard/getOverview-stats'

type MonthlyData = {
  name: string
  total: number
  positive: number
  negative: number
}

interface OverviewProps {
  artistID: string
}

export function Overview({ artistID }: OverviewProps) {
  const [chartData, setChartData] = useState<MonthlyData[]>([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [valueRange, setValueRange] = useState({ min: 0, max: 0 })

  // Process data to separate positive and negative values
  const processChartData = (rawData: any[]): MonthlyData[] => {
    return rawData.map(item => ({
      name: item.name,
      total: item.total,
      positive: item.total > 0 ? item.total : 0,
      negative: item.total < 0 ? item.total : 0
    }))
  }

  const fetchYearData = async (year: string) => {
    if (!artistID) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const monthlyData = await getMonthlyStatsAction(artistID, year)
      
      if (Array.isArray(monthlyData) && monthlyData.length > 0) {
        const processedData = processChartData(monthlyData)
        setChartData(processedData)
        
        const values = monthlyData.map(item => item.total)
        setValueRange({
          min: Math.min(...values),
          max: Math.max(...values)
        })
      } else {
        setChartData([])
        setError('No records available for the selected year.')
      }
    } catch (err) {
      setError('Failed to load data')
      setChartData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchYearData(selectedYear)
  }, [artistID, selectedYear])

  if (isLoading) {
    return <OverViewSkeleton />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  // Calculate padding for Y-axis based on data range
  const absMax = Math.max(Math.abs(valueRange.min), Math.abs(valueRange.max))
  const yAxisDomain = [-absMax, absMax]

  const availableYears = ['2021', '2022', '2023', '2024', '2025']

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Total Plays Overview</CardTitle>
            <CardDescription>Monthly % Change in Total Track Plays showing increase (green) and decline (red) areas</CardDescription>
          </div>
          <Select
            value={selectedYear}
            onValueChange={(year) => {
              setSelectedYear(year)
            }}
          >
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
          <AreaChart data={chartData}>
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
                  const value = payload[0].payload.total
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
            <ReferenceLine y={0} stroke="#888888" strokeWidth={1} strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="positive"
              stroke="rgb(34, 197, 94)"
              fillOpacity={1}
              fill="url(#positiveGradient)"
              strokeWidth={2}
            />
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

export default Overview