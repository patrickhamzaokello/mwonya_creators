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

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 items-stretch my-8">
            <p>Selected Artist: {selectedArtist}</p>
            <div className='xl:col-span-2'>
                <ArtistProfileBanner
                    artistName="Drillz The Rapper"
                    tagline="I am here to spread positivity"
                    backgroundImageUrl="https://assets.mwonya.com/images/artistprofiles/Lukas Blacc_profile_20230317135613_04099.JPG"
                    profileImageUrl="https://assets.mwonya.com/images/artistprofiles/Lukas Blacc_cover_20230317135613_04099.JPG"
                    isVerified={true}
                    followerCount={1000000}
                    genre="Hip-Hop / Rap"
                   
                />
            </div>


            <Card x-chunk="charts-01-chunk-0"
            >
                <CardHeader className="space-y-0 pb-2">
                    <CardDescription>Today</CardDescription>
                    <CardTitle className="text-4xl tabular-nums">
                        12,584{" "}
                        <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                            steps
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={{
                            steps: {
                                label: "Steps",
                                color: "hsl(var(--chart-1))",
                            },
                        }}
                    >
                        <BarChart
                            accessibilityLayer
                            margin={{
                                left: -4,
                                right: -4,
                            }}
                            data={[
                                {
                                    date: "2024-01-01",
                                    steps: 2000,
                                },
                                {
                                    date: "2024-01-02",
                                    steps: 2100,
                                },
                                {
                                    date: "2024-01-03",
                                    steps: 2200,
                                },
                                {
                                    date: "2024-01-04",
                                    steps: 1300,
                                },
                                {
                                    date: "2024-01-05",
                                    steps: 1400,
                                },
                                {
                                    date: "2024-01-06",
                                    steps: 2500,
                                },
                                {
                                    date: "2024-01-07",
                                    steps: 1600,
                                },
                            ]}
                        >
                            <Bar
                                dataKey="steps"
                                fill="var(--color-steps)"
                                radius={5}
                                fillOpacity={0.6}
                                activeBar={<Rectangle fillOpacity={0.8} />}
                            />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                tickFormatter={(value) => {
                                    return new Date(value).toLocaleDateString("en-US", {
                                        weekday: "short",
                                    })
                                }}
                            />
                            <ChartTooltip
                                defaultIndex={2}
                                content={
                                    <ChartTooltipContent
                                        hideIndicator
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("en-US", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })
                                        }}
                                    />
                                }
                                cursor={false}
                            />
                            <ReferenceLine
                                y={1200}
                                stroke="hsl(var(--muted-foreground))"
                                strokeDasharray="3 3"
                                strokeWidth={1}
                            >
                                <Label
                                    position="insideBottomLeft"
                                    value="Average Steps"
                                    offset={10}
                                    fill="hsl(var(--foreground))"
                                />
                                <Label
                                    position="insideTopLeft"
                                    value="12,343"
                                    className="text-lg"
                                    fill="hsl(var(--foreground))"
                                    offset={10}
                                    startOffset={100}
                                />
                            </ReferenceLine>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-1">
                    <CardDescription>
                        Over the past 7 days, you have walked{" "}
                        <span className="font-medium text-foreground">53,305</span> steps.
                    </CardDescription>
                    <CardDescription>
                        You need{" "}
                        <span className="font-medium text-foreground">12,584</span> more
                        steps to reach your goal.
                    </CardDescription>
                </CardFooter>
            </Card>



        </div>
    );
};

export default DashboardLayout;