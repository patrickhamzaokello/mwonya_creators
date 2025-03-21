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
import { useRouter } from 'next/navigation'
import Link from "next/link";
import { CardTitle, CardDescription, CardFooter, Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Music, Users, DollarSign, BarChart3, ChevronRight, Clock, Gift, Heart, MessageSquare, TrendingUp, Zap } from "lucide-react";

export default function DashboardPage() {

    const [selectedArtist, setSelectedArtist] = useArtist();
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userRole, setUserRole] = useState<string>('');
    const [hasArtists, setHasArtists] = useState(false)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const role = 'artist'; // Default to artist if not found
                setUserRole(role);
                const hasAnyArtists = !!selectedArtist; // Or check length of artists array
                setHasArtists(hasAnyArtists);

                setIsLoading(false);
            } catch (err) {
                setError("Failed to load user data");
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [selectedArtist]);


    if (isLoading) {
        return <DashboardSkeleton />
    }


    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    if (selectedArtist) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    {/* Welcome Header */}
                    <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-md border border-border/50">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Welcome to Mwonya, creator!</h1>
                                <p className="text-muted-foreground mb-4">Your hub for growing your music career in Uganda</p>
                                <div className="flex flex-wrap gap-3">
                                    <span className="bg-accent text-accent-foreground text-sm px-3 py-1 rounded-full">Your Music</span>
                                    <span className="bg-accent text-accent-foreground text-sm px-3 py-1 rounded-full">Your Community</span>
                                    <span className="bg-accent text-accent-foreground text-sm px-3 py-1 rounded-full">Your Future</span>
                                </div>
                            </div>
                            <div className="mt-6 md:mt-0 gap-2 flex flex-col md:flex-row items-center">


                                <Link href="/new_release" >
                                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Upload New Music</Button>
                                </Link>
                                <Link href="/account" ><Button className="bg-primary hover:bg-primary/90 text-primary-foreground">View Account</Button></Link>
                            </div>
                        </div>
                    </div>

                    {/* What You Can Do Section */}
                    <h2 className="text-2xl font-bold mb-6">What You Can Do With Mwonya</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Feature Card 1 */}
                        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group bg-background text-foreground">
                            <CardContent className="p-6">
                                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                    <Music className="text-primary" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                                    Artist Circles
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Create subscription tiers and offer exclusive content to your biggest fans.
                                </p>
                                <Button variant="outline" className="w-full justify-center">
                                    Set Up Your Circle
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Feature Card 2 */}
                        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group bg-background text-foreground">
                            <CardContent className="p-6">
                                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                    <Calendar className="text-primary" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                                    Live Shows
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Schedule and promote virtual or physical performances to your audience.
                                </p>
                                <Button variant="outline" className="w-full justify-center">
                                    Create an Event
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Feature Card 3 */}
                        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
                            <CardContent className="p-6">
                                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                    <Heart className="text-primary" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                                    Fan Engagement
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Interact with your audience through comments, direct messages, and more.
                                </p>
                                <Button variant="outline" className="w-full justify-center">
                                    View Messages
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Feature Card 4 */}
                        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
                            <CardContent className="p-6">
                                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                    <Zap className="text-primary" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                                    Promotion Tools
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Reach new audiences with AI-powered recommendations and targeted campaigns.
                                </p>
                                <Button variant="outline" className="w-full justify-center">
                                    Boost Your Music
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Feature Card 5 */}
                        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
                            <CardContent className="p-6">
                                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                    <Gift className="text-primary" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                                    Revenue Streams
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Monitor your streams, subscription revenue, and merchandise sales in one place.
                                </p>
                                <Button variant="outline" className="w-full justify-center">
                                    View Earnings
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Feature Card 6 */}
                        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
                            <CardContent className="p-6">
                                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                    <MessageSquare className="text-primary" size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                                    Collaboration
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Connect with other Ugandan artists to create music and grow together.
                                </p>
                                <Button variant="outline" className="w-full justify-center">
                                    Find Collaborators
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Getting Started Guide */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-2xl">Getting Started Guide</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Complete Your Profile</h3>
                                    <p className="text-muted-foreground">
                                        Add your bio, profile picture, and links to your social media accounts.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Upload Your Music</h3>
                                    <p className="text-muted-foreground">Share your tracks, albums, and EPs with your audience.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Set Up Your Artist Circle</h3>
                                    <p className="text-muted-foreground">
                                        Create subscription tiers to offer exclusive content to your biggest fans.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                    4
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Promote Your First Release</h3>
                                    <p className="text-muted-foreground">Use our promotion tools to reach new listeners across Uganda.</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">View Complete Guide</Button>
                        </CardFooter>
                    </Card>

                    {/* Need Help? */}
                    <div className="bg-card/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-border/50">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-grow">
                                <h2 className="text-2xl font-bold mb-2">Need Help Getting Started?</h2>
                                <p className="text-muted-foreground">
                                    Our team is here to help you make the most of Mwonya. Schedule a one-on-one session with a Mwonya
                                    expert.
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Book a Session</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // return (

    //     <div className="flex-col space-y-4 rounded-lg shadow-md">

    //         <ArtistProfile
    //             artistID={selectedArtist.id}
    //             name={selectedArtist.name}
    //             coverArt={selectedArtist.coverImage}
    //             profileImage={selectedArtist.profileImage}
    //             isVerified={selectedArtist.verified}
    //         />


    //         <DashboardMetrics artistID={selectedArtist.id} keyMetrics={["total_plays", "song_variety", "unique_listeners", "engagement_score", "current_play_count"]} />

    //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
    //             <RecentActivity artistID={selectedArtist.id} />
    //             <TopSongs artistID={selectedArtist.id} />
    //         </div>

    //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
    //             <Overview artistID={selectedArtist.id} />
    //             {/* <UpcomingPayout artistID={selectedArtist.id} /> */}
    //         </div>



    //     </div>
    // )
}

