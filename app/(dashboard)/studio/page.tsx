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
import { ArtistProfile } from "@/components/dashboard_metrics/artist-profile"
import { OverviewStats } from "@/components/dashboard_metrics/overview-stats";
import { UpcomingPayout } from "@/components/dashboard_metrics/upcoming-payment";
import { DashboardSkeleton } from "@/components/dashboard_metrics/dashboard-skeleton";
import { useEffect, useState } from 'react'

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

    if (error) {
        return <div className="text-red-500">{error}</div>
    }


    return (
        <>
            <div className="md:hidden">
                <Image
                    src="/examples/dashboard-light.png"
                    width={1280}
                    height={866}
                    alt="Dashboard"
                    className="block dark:hidden"
                />
                <Image
                    src="/examples/dashboard-dark.png"
                    width={1280}
                    height={866}
                    alt="Dashboard"
                    className="hidden dark:block"
                />
            </div>
            <div className="hidden flex-col md:flex">
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                        <MainNav className="mx-6" />
                        <div className="ml-auto flex items-center space-x-4">
                            <Search />
                            <UserNav />
                        </div>
                    </div>
                </div>
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <div className="flex items-center space-x-2">
                            <DatePickerWithRange />
                            <Button>Download</Button>
                        </div>
                    </div>
                    <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                            <TabsTrigger value="reports">Reports</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="space-y-4">

                            {selectedArtist ? (
                                <>
                                    <ArtistProfile name={selectedArtist.name}
                                        coverArt={selectedArtist.coverImage}
                                        profileImage={selectedArtist.profileImage}
                                        followers={selectedArtist.followers}
                                        monthlyListeners={selectedArtist.followers}
                                        isVerified={selectedArtist.verified} />

                                    <OverviewStats artistID={selectedArtist.id} />

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
            </div>
        </>
    )
}

