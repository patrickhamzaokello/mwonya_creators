"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
    Music,
    Sparkles,
    Users,
    Play,
    Mic2,
    ChevronRight,
    CheckCircle2,
    ArrowRight,
    Volume2,
    MessageSquare,
    X,
    DollarSign,
    Share2,
    BookOpen,
    Music2,
    BarChart,
    Check,
    Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import HowMwonyaWorks from "./components/landingpage/how-mwonya-works"
import HeroSection from "./components/landingpage/hero-section"
import Component from "./components/landingpage/audio-upload-guide"

export default function LandingPage() {
    const [showBanner, setShowBanner] = useState(true)
    const [activeTestimonial, setActiveTestimonial] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % 3)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const testimonials = [
        {
            name: "Ezzy.",
            quote:
                "The analytics tools helped me understand where my audience is located, allowing me to plan my first successful tour across Uganda.",
            followers: "15.7K Followers",
            releases: "24 Releases",
            title: "Singer-Songwriter",
            artwork: "/artist.jpg"
        },
        {
            name: "Ole Jiggy",
            quote:
                "The direct fan subscription model has given me financial stability to focus on creating music that truly represents my artistic vision.",
            followers: "8.3K Followers",
            releases: "12 Releases",
            title: "Afrobeat Artist",
            artwork: "https://images.unsplash.com/photo-1641907068363-cd7789e13a45?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExMXx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            name: "DJ Swizz",
            title: "Producer & DJ",
            quote:
                "Mwonya has transformed how I connect with my fans. I've seen a 200% increase in my streaming revenue since joining the platform.",
            followers: "12.5K Followers",
            releases: "18 Releases",
            artwork: "/creative.png"
        },
    ]

    const features = [
        {
            icon: Users,
            title: "Artist Circles",
            description: "Earn directly from your biggest fans with exclusive content and special perks.",
        },
        {
            icon: DollarSign,
            title: "Stream Revenue",
            description: "Get paid for every stream of your music with transparent and fair revenue sharing.",
        },
        {
            icon: Mic2,
            title: "Live Shows",
            description: "Host and promote live performances to grow your audience and create new revenue streams.",
        },
        {
            icon: Music,
            title: "Promotion Tools",
            description: "Reach the right fans with AI-powered discovery and targeted promotion tools.",
        },
        {
            icon: Share2,
            title: "Collaboration",
            description: "Connect with other artists and create together through our collaboration platform.",
        },
        {
            icon: MessageSquare,
            title: "Community Engagement",
            description: "Build a loyal community with comments, shares, and playlists to grow your fanbase.",
        },
    ]

    return (
        <div className="min-h-screen bg-background">
            {/* Promotional Banner */}
            {showBanner && (
                <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-[#000] px-6 py-2.5 sm:px-3.5">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 flex-1">
                        <Volume2 className="h-5 w-5 text-white" />
                        <p className="text-sm leading-6 text-white">
                            <strong className="font-semibold">Mwonya</strong>
                            <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current">
                                <circle cx="1" cy="1" r="1" />
                            </svg>
                            Join mwonya and start sharing your work and meet your fans.
                        </p>
                        <Button size="sm" className=" bg-white text-black border-none hover:bg-purple-100" asChild>
                            <Link href="/auth/login">
                                Login / Register <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 text-white hover:bg-purple-600"
                        onClick={() => setShowBanner(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Hero Section */}


            <main>
                <HeroSection />
            </main>

            {/* Features Grid */}
            <section className="py-20 md:py-32 bg-gradient-to-b from-[#172026] to-[#333] relative">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <div className="inline-block text-sm font-medium text-white/90 mb-4 uppercase tracking-wider">
                            For Artists
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">Everything You Need to Succeed</h2>
                        <p className="text-white/80 mx-auto text-lg max-w-2xl">
                            Mwonya provides all the tools you need to grow your music career, connect with fans, and earn from your art.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (

                            <div key={index} className="group p-6 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300 flex flex-col h-full">
                                <div className="mb-5 text-white">{<feature.icon className="h-6 w-6" />}</div>
                                <h3 className="text-xl font-medium mb-2 text-white">{feature.title}</h3>
                                <p className="text-white/80 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            


            {/* How it works */}
            <HowMwonyaWorks />

            



            {/* Why Choose Mwonya Section */}
            <section className="py-16 md:py-24 ">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="relative h-[500px] w-full rounded-xl overflow-hidden">
                                <Image
                                    src="/creative.png"
                                    alt="Ugandan artist in studio"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-600 font-medium">
                                Why Mwonya
                            </div>
                            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">Why Mwonya is Different</h2>
                            <p className="text-lg text-muted-foreground">
                                We've built Mwonya specifically for Ugandan artists and music lovers, with features that address the
                                unique challenges and opportunities in our music industry.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold">Focused solely on Ugandan music and artists</h3>
                                        <p className="text-muted-foreground">We celebrate and promote Ugandan talent first and foremost.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold">90% revenue share from Artist Circles</h3>
                                        <p className="text-muted-foreground">
                                            Keep more of what you earn with our artist-friendly revenue model.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold">AI-powered tools to connect with your ideal audience</h3>
                                        <p className="text-muted-foreground">
                                            Our technology helps you find the fans who will love your music most.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-purple-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold">A community of passionate music lovers</h3>
                                        <p className="text-muted-foreground">
                                            Connect with fans who truly appreciate and support Ugandan music.
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <Component />

            {/* CTA Section */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-purple-700 to-purple-900 text-white">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Ready to Take Your Music to the Next Level?
                        </h2>
                        <p className="text-xl text-purple-100">
                            Join Mwonya today and start building your community, earning from your art, and connecting with fans like
                            never before.
                        </p>
                        <div className="pt-4">
                            <Button size="lg" className=" text-purple-700 bg-white hover:bg-purple-100" asChild>
                                <Link href="/auth/register">
                                    Sign Up Now – It's Free! <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                        <p className="text-sm text-purple-200 pt-2">
                            No credit card required. Start sharing your music in minutes.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-red-600 relative overflow-hidden">
                {/* Minimal background elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-red-700 to-transparent"></div>
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-700 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-block rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white mb-6">
                            SUCCESS STORIES
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6 text-white">
                            Artists Thriving with Mwonya
                        </h2>
                        <p className="text-white/90 max-w-2xl mx-auto text-lg">
                            See how artists across Uganda are building their careers and connecting with fans through our platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimony, index) => (
                            <div
                                className="bg-white/10 rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                                key={index}
                            >
                                <div className="flex items-center mb-6">
                                    <div className="h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-white/50">
                                        <Image
                                            src={testimony.artwork || "/placeholder.svg"}
                                            alt={`${testimony.name} portrait`}
                                            width={64}
                                            height={64}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{testimony.name}</h3>
                                        <p className="text-white/70">{testimony.title}</p>
                                    </div>
                                </div>

                                <blockquote className="text-white/90 mb-6 text-lg">"{testimony.quote}"</blockquote>

                                <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-4">
                                    <div className="flex items-center text-white/80">
                                        <Users className="h-4 w-4 mr-2" />
                                        <span className="text-sm">{testimony.followers}</span>
                                    </div>
                                    <div className="flex items-center text-white/80">
                                        <Music2 className="h-4 w-4 mr-2" />
                                        <span className="text-sm">{testimony.releases}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    
                </div>
            </section>



            {/* Footer Section */}
            <footer className="border-t  py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-10 w-10 rounded-md bg-purple-600 flex items-center justify-center">
                                    <Music className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-purple-600">Mwonya</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">Empowering Ugandan Artists, One Stream at a Time.</p>
                            <div className="flex gap-4">
                                <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-facebook"
                                    >
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                    <span className="sr-only">Facebook</span>
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-twitter"
                                    >
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                    </svg>
                                    <span className="sr-only">Twitter</span>
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-instagram"
                                    >
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                    </svg>
                                    <span className="sr-only">Instagram</span>
                                </Link>
                                <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-youtube"
                                    >
                                        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                                        <path d="m10 15 5-3-5-3z" />
                                    </svg>
                                    <span className="sr-only">YouTube</span>
                                </Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                        Careers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                        Press
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                        Blog
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                        FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                        Community
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                        Cookie Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className="text-muted-foreground hover:text-purple-600">
                                        Copyright Info
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t mt-12 pt-6 text-center text-sm text-muted-foreground">
                        <p>&copy; {new Date().getFullYear()} Mwonya. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

