'use client'

import { useEffect, useState } from 'react'
import { Activity, DollarSign, Music, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getStatsMetric } from '@/actions/dashboard/getOverview-stats'



export function OverviewStats({artistID}: ArtistID) {
    const [data, setData] = useState<OverviewData | MessageType>()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!artistID) return; // Ensure id is available before calling the server action
        setIsLoading(true);

        getStatsMetric(artistID)
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

    if ('totalStreams' in data) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Streams
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalStreams.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.streamsLastmonth}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Earnings
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${data.totalEarnings.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.totalEarningsLastmonth}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Listeners
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.activeListeners.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.activeListenersLastmonth}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            New Releases
                        </CardTitle>
                        <Music className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.newReleases}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.newReleasesLastmonth}
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }
    // Fallback if data is not OverviewData
    return <div className="text-red-500">Unexpected data format received</div>;
}

function OverviewStatsSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array(4).fill(0).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-4 w-2/3 mt-2" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

