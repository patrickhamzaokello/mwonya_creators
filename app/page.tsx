import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {auth, signIn, signOut} from '@/auth';
import Image from 'next/image';
import Link from 'next/link';
import {Card, CardContent} from "@/components/ui/card"
import {MusicIcon, Share2Icon, TrendingUpIcon, HeadphonesIcon, PlayCircleIcon} from "lucide-react"
import {redirect} from "next/navigation";


export default async function LandingPage() {
    const session = await auth();


    if (session) {
        redirect("/studio");
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#272727] text-gray-100">
            <header
                className="fixed top-0 left-0 right-0 z-50 bg-[#272727]/90 backdrop-blur-sm border-b border-gray-800">
                <div className="container mx-auto flex items-center justify-between py-3 px-4">
                    <div className="flex items-center space-x-2">
                        <MusicIcon className="h-6 w-6"/>
                        <span className="text-lg font-bold">MWONYA</span>
                    </div>
                    <nav className="flex items-center space-x-4">
                        <a href="#features" className="text-sm hover:text-gray-300">Features</a>
                        <a href="#testimonials" className="text-sm hover:text-gray-300">Testimonials</a>


                        <Link href="/api/auth/signin">
                            <Button variant="outline" size="sm"
                                    className="bg-purple-600 border border-grey-100 hover:border-slate-400">
                                Log in
                            </Button>
                        </Link>

                    </nav>
                </div>
            </header>

            <main className="flex-grow pt-16">
                <section className="relative py-32 px-4 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-green-900 animate-gradient-x"></div>
                    </div>
                    <div className="relative z-10 container mx-auto">
                        <div className="max-w-2xl">
                            <h1 className="text-6xl font-bold mb-6">Your sound is unique, Your success should be
                                too.</h1>
                            <p className="text-xl mb-8">
                                Upload your tracks, mixes, and podcasts to reach listeners everywhere. Watch your
                                fanbase grow, track your impact, and turn your passion into income—all on one simple
                                platform.
                            </p>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="max-w-xs bg-gray-800 text-gray-100 border-gray-700"
                                />
                                <Button className="bg-yellow-500 text-[#272727] hover:bg-gray-300">
                                    Get Started
                                </Button>
                            </div>
                            <blockquote className="border-l-4 border-gray-100 pl-4 mb-8 italic">
                                "Music can change the world because it can change people." - Bono
                            </blockquote>
                        </div>
                    </div>
                </section>

                <section id="features" className="py-20 px-4 bg-[#272727]">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Artists Choose Mwonya</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center">
                            <Share2Icon className="h-12 w-12 mx-auto mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
                            <p className="text-gray-400">One-click distribution to Spotify, Apple Music, and more.</p>
                        </div>
                        <div className="text-center">
                            <TrendingUpIcon className="h-12 w-12 mx-auto mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
                            <p className="text-gray-400">Advanced analytics and promotional tools to expand your
                                fanbase.</p>
                        </div>
                        <div className="text-center">
                            <HeadphonesIcon className="h-12 w-12 mx-auto mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">Studio-Quality Audio</h3>
                            <p className="text-gray-400">Lossless streaming to showcase your music as intended.</p>
                        </div>
                    </div>
                </section>

                <section id="testimonials" className="py-20 px-4 bg-[#1a1a1a] overflow-hidden">
                    <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
                    <div className="relative">
                        <div className="flex animate-scroll">
                            {[
                                {
                                    name: "Alex Rivera",
                                    role: "Indie Artist",
                                    quote: "Mwonya helped me gain 100K new listeners in just 3 months. The global reach is unreal!"
                                },
                                {
                                    name: "Sarah Chen",
                                    role: "Electronic Producer",
                                    quote: "The analytics tools are a game-changer. I can now tailor my music to what my fans love."
                                },
                                {
                                    name: "Marcus Johnson",
                                    role: "Hip-Hop Artist",
                                    quote: "From unknown to chart-topping in a year. Mwonya made it possible."
                                },
                                {
                                    name: "Marcus Johnson",
                                    role: "Hip-Hop Artist",
                                    quote: "From unknown to chart-topping in a year. Mwonya made it possible."
                                },
                                {
                                    name: "Marcus Johnson",
                                    role: "Hip-Hop Artist",
                                    quote: "From unknown to chart-topping in a year. Mwonya made it possible."
                                },
                                {
                                    name: "Marcus Johnson",
                                    role: "Hip-Hop Artist",
                                    quote: "From unknown to chart-topping in a year. Mwonya made it possible."
                                },
                                {
                                    name: "Lena Rodriguez",
                                    role: "Singer-Songwriter",
                                    quote: "The seamless distribution across platforms saved me countless hours. More time for creating!"
                                },
                                {
                                    name: "David Kim",
                                    role: "Classical Composer",
                                    quote: "I was skeptical about digital platforms, but Mwonya opened up a whole new audience for my compositions."
                                },
                                {
                                    name: "Emma Thompson",
                                    role: "Pop Artist",
                                    quote: "The support from the Mwonya team is incredible. They truly care about artists' success."
                                }
                            ].map((testimonial, index) => (
                                <Card key={index}
                                      className="flex-shrink-0 w-80 mx-4 border-color: rgb(31 41 55); bg-neutral-900 text-gray-200">
                                    <CardContent className="p-6">
                                        <blockquote className="text-sm mb-4 font-light">"{testimonial.quote}"
                                        </blockquote>
                                        <footer className="text-sm text-gray-500">
                                            <strong className="block text-gray-300">{testimonial.name}</strong>
                                            {testimonial.role}
                                        </footer>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="text-center py-20 px-4 bg-[#272727]">
                    <h2 className="text-3xl font-bold mb-6">Ready to Take Your Music to the Next Level?</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join over 100,000 artists who are changing the game with Mwonya.
                        Your audience is waiting.
                    </p>
                    <Button className="bg-gray-100 text-[#272727] hover:bg-gray-300 text-lg py-6 px-8">
                        <PlayCircleIcon className="mr-2 h-6 w-6"/>
                        Start Your Musical Journey
                    </Button>
                </section>
            </main>

            <footer className="text-center py-6 bg-[#1a1a1a] border-t border-gray-800">
                <p className="text-gray-400">&copy; 2023 Mwonya. All rights reserved.</p>
            </footer>
        </div>
    )
}