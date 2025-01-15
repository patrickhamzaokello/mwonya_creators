'use client'
import { StatCard } from "@/components/dashboard_metrics/stat-card"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from 'lucide-react'
import { TotalRevenue } from "@/components/dashboard_metrics/total-revenue"
import { Skeleton } from "@/components/ui/skeleton"
import { getStatsMetric } from '@/actions/dashboard/getOverview-stats'


export function DashboardMetrics({ artistID, keyMetrics }: { artistID: string, keyMetrics: string[] }) {

    const [data, setData] = useState<OverviewData[] | MessageType>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!artistID) return; // Ensure id is available before calling the server action
        setIsLoading(true);

        getStatsMetric(artistID, keyMetrics)
            .then(setData)
            .catch(() => setError('Failed to load  data'))
            .finally(() => setIsLoading(false));
    }, [artistID]);

    if (isLoading) {
        return <OverviewStatsSkeleton />
    }

    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    if (!data) {
        return null
    }

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {Array.isArray(data) && data.map((stat: OverviewData, index: number) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        change={stat.change}
                        lastUpdated={stat.lastUpdated}
                        trend={stat.trend as 'up' | 'down'}
                    />
                ))}
            </div>
        </>
    )
}

function OverviewStatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-[120px] mb-2" />
                        <Skeleton className="h-4 w-[80px] mb-2" />
                        <Skeleton className="h-3 w-[140px]" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

