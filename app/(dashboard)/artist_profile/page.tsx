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
import ArtistProfileEditorWithActions from "@/components/artistSettings/artist-profile-editor";
import ProfileEditPage from "@/components/artistSettings/artist_profile_edit_better_flow";

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



    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    if (selectedArtist) {

        const artist = selectedArtist.id;
        return (
            <div className="min-h-screen text-foreground">
                <div className="max-w-7xl mx-auto flex flex-col space-y-4">
                    {/* <ArtistProfileEditorWithActions artistId={artist} /> */}
                    <ProfileEditPage artistId={artist} />
                </div>
            </div>
        )
    }


}

