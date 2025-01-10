"use client"


import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getMonthlyStatsAction } from '@/actions/dashboard/getOverview-stats'

export function Overview({ artistID }: ArtistID) {
  const [data, setMonthly] = useState<MonthlyData[] | MessageType | any>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!artistID) return; // Ensure id is available before calling the server action
    setIsLoading(true);

    getMonthlyStatsAction(artistID)
      .then(setMonthly)
      .catch(() => setError('Failed to load  data'))
      .finally(() => setIsLoading(false));
  }, [artistID]);

  if (isLoading) {
    return <OverViewSkeleton />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
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
              tickFormatter={(value) => `$${value}`}
            />
            <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>

  )
}

function OverViewSkeleton() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="ml-4 space-y-1">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
              <Skeleton className="h-4 w-[20px] ml-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

