"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Music,
    Building2,
    Sparkles,
    Users,
    Globe2,
    TrendingUp,
    Play,
    Wand2,
    Mic2,
    ChevronRight,
    Star,
    CheckCircle2,
    ArrowRight,
    Headphones,
    BarChart3,
    Award,
    Volume2,
    MessageSquare,
    X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function LandingPage() {

    const [showBanner, setShowBanner] = useState(true);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const testimonials = [
        {
            quote: "The best platform I've used to manage my music releases. The analytics are incredible!",
            author: "Sarah J.",
            role: "Independent Artist"
        },
        {
            quote: "Finally, a platform that understands what our artists really need. Highly recommended!",
            author: "Mike R.",
            role: "Record Label Owner"
        },
        {
            quote: "The marketing tools have helped me reach a whole new audience. Game changer!",
            author: "Alex M.",
            role: "Music Producer"
        }
    ];

    const features = [
        {
            icon: Headphones,
            title: "Professional Distribution",
            description: "Get your music on all major platforms with just a few clicks. Maintain 100% of your rights."
        },
        {
            icon: BarChart3,
            title: "Analytics & Insights",
            description: "Track your performance with detailed analytics. Make data-driven decisions for your career."
        },
        {
            icon: Award,
            title: "Industry Recognition",
            description: "Get featured in playlists and gain exposure to industry professionals and fans."
        },
        {
            icon: Globe2,
            title: "Global Network",
            description: "Connect with artists, producers, and industry professionals from around the world."
        },
        {
            icon: MessageSquare,
            title: "Expert Support",
            description: "Get guidance from industry experts and our dedicated support team."
        },
        {
            icon: Wand2,
            title: "Marketing Tools",
            description: "Promote your music effectively with our suite of marketing tools and resources."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Promotional Banner */}
            {showBanner && (
                <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-primary px-6 py-2.5 sm:px-3.5">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 flex-1">
                        <Volume2 className="h-5 w-5 text-primary-foreground" />
                        <p className="text-sm leading-6 text-primary-foreground">
                            <strong className="font-semibold">Early Access 2025</strong>
                            <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current"><circle cx="1" cy="1" r="1" /></svg>
                            We are adding real time Data reporting to stats..
                        </p>
                        <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            asChild
                        >
                            <Link href="/pricing">
                                Learn more <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 text-primary-foreground hover:bg-primary/90"
                        onClick={() => setShowBanner(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                        <div className="space-y-8">
                            <div className="inline-flex items-center rounded-full bg-muted px-4 py-1.5 text-sm font-medium">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Welcome to the future of music
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                                Think bigger. Create louder.
                                </h1>
                                <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                                Mwonya empowers artists and creators with digital tools to build, share, and grow—together. Whether you're an aspiring artist,
                                    a professional or a record label, start your journey with us today.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                    asChild
                                >
                                    <Link href="/auth/login">
                                        <Music className="mr-2 h-5 w-5" />
                                        Login
                                    </Link>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-input hover:bg-accent"
                                    asChild
                                >
                                    <Link href="/artist/create-profile">
                                        <Building2 className="mr-2 h-5 w-5" />
                                        Get Started, its free!
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="lg:pl-8">
                            <div className="grid gap-4 md:grid-cols-2">
                                {features.slice(0, 4).map((feature, index) => (
                                    <Card
                                        key={index}
                                        className={cn(
                                            "group p-6 hover:shadow-lg transition-all duration-300",
                                            "bg-card text-card-foreground"
                                        )}
                                    >
                                        <feature.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-16 md:py-24 bg-muted/50">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Comprehensive tools and resources to help you navigate the music industry and grow your career.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <Card
                                key={index}
                                className={cn(
                                    "group p-6 hover:shadow-lg transition-all duration-300",
                                    "bg-card text-card-foreground"
                                )}
                            >
                                <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-6 w-6 text-primary fill-primary" />
                            ))}
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Trusted by Artists Worldwide</h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <Card className={cn(
                            "p-8 relative overflow-hidden",
                            "bg-card text-card-foreground"
                        )}>
                            <div className="space-y-8">
                                <p className="text-xl italic text-center">
                                    "{testimonials[activeTestimonial].quote}"
                                </p>
                                <div className="flex items-center justify-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                        <Users className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold">{testimonials[activeTestimonial].author}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {testimonials[activeTestimonial].role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6">
                    <Card className={cn(
                        "p-8 md:p-12 text-center",
                        "bg-card text-card-foreground"
                    )}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join our community of artists and music professionals. Take the first step towards your music career goals.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                asChild
                            >
                                <Link href="/create_profile/artist">
                                    <Music className="mr-2 h-5 w-5" />
                                    Get Started Now
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-input hover:bg-accent"
                                asChild
                            >
                                <Link href="/learn-more">
                                    Learn More
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        </div>
    );
}