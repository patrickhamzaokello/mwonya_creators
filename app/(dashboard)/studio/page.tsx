"use client"
import { Metadata } from "next"
import Image from "next/image"
import { useArtist } from "@/contexts/ArtistContext";

import { Button } from "@/components/ui/button"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/dashboard_metrics/date-range-picker"
import { MainNav } from "@/components/dashboard_metrics/main-nav"
import { Overview } from "@/components/dashboard_metrics/overview"
import { RecentActivity } from "@/components/dashboard_metrics/recent-activity"
import { Search } from "@/components/dashboard_metrics/search"
import { TopSongs } from "@/components/dashboard_metrics/top-songs"
import { UserNav } from "@/components/dashboard_metrics/user-nav"
import { UpcomingPayout } from "@/components/dashboard_metrics/upcoming-payment";
import { DashboardSkeleton } from "@/components/dashboard_metrics/dashboard-skeleton";
import { useEffect, useState } from 'react'
import { DashboardMetrics } from "@/components/dashboard_metrics/metrics";
import ArtistProfile from "@/components/dashboard_metrics/artist-profile";

export default function DashboardPage() {

    const [selectedArtist, setSelectedArtist] = useArtist();

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (selectedArtist) {
            setIsLoading(false)
        }
    }, [selectedArtist])

    if (isLoading) {
        return <DashboardSkeleton />
    }

    console.log(selectedArtist)


    if (error) {
        return <div className="text-red-500">{error}</div>
    }


    return (
        <>

            <div className="flex-col md:flex">


                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                    </TabsList>
                    <TabsContent value="analytics" className="space-y-4">
                        {selectedArtist ? (
                            <>
                                <DashboardMetrics artistID={selectedArtist.id} keyMetrics={[]} />
                                <Overview artistID={selectedArtist.id} />
                            </>

                        ) : (
                            // no artist
                            <p> Select Artist to Begin</p>
                        )}
                    </TabsContent>
                    <TabsContent value="reports" className="space-y-4">
                        <p>Check back soon for Reports</p>
                    </TabsContent>
                    <TabsContent value="overview" className="space-y-4">


                        {selectedArtist ? (
                            
                            <>
                            
                                <ArtistProfile 
                                    artistID={selectedArtist.id}
                                    name={selectedArtist.name}
                                    coverArt={selectedArtist.coverImage}
                                    profileImage={selectedArtist.profileImage}
                                    isVerified={selectedArtist.verified}
                                    />

                                <DashboardMetrics artistID={selectedArtist.id} keyMetrics={["total_plays", "song_variety", "unique_listeners", "engagement_score", "current_play_count"]} />

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                    <Overview artistID={selectedArtist.id} />
                                    <TopSongs artistID={selectedArtist.id} />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                    <RecentActivity artistID={selectedArtist.id} />
                                    <UpcomingPayout artistID={selectedArtist.id} />
                                </div>

                            </>

                        ) : (
                            // no artist
                            <p> Select Artist to Begin</p>
                        )}


                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}

