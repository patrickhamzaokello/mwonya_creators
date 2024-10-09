import React from 'react';
import { Users, Disc, Briefcase, DollarSign, CreditCard, ArrowUpRight, Pencil, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import ArtistPerformanceChart from './ArtistPerformanceChart';
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    LabelList,
    Line,
    LineChart,
    PolarAngleAxis,
    RadialBar,
    RadialBarChart,
    Rectangle,
    ReferenceLine,
    XAxis,
    YAxis,
} from "recharts"
import RevenueCard from '@/components/RevenueCard';
import ArtistProfileBanner from '@/components/ArtistProfileBanner';
import { useArtist } from "@/contexts/ArtistContext";


const DashboardLayout = () => {
    const [selectedArtist, setSelectedArtist] = useArtist();
    return (

        <div className="grid h-[300px] mb-6">

            <div>

                {selectedArtist ? (
                    <ArtistProfileBanner
                        artistName={selectedArtist.name}
                        tagline={selectedArtist.shortbio}
                        backgroundImageUrl={selectedArtist.coverImage}
                        profileImageUrl={selectedArtist.profileImage}
                        isVerified={selectedArtist.verified}
                        followerCount={selectedArtist.followers}
                        genre={selectedArtist.genreName}

                    />

                ) : (
                    <p>No artist selected</p>
                )}

            </div>






        </div>
    );
};

export default DashboardLayout;