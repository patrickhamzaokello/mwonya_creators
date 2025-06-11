import Link from "next/link"
import Image from "next/image"
import { Music, Sparkles, Play, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-green-500/20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/5 blur-3xl"></div>
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 text-sm font-medium text-white/90 mb-8">
            <Sparkles className="mr-2 h-4 w-4 text-green-400" />
            The Home of Ugandan Music
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Music,{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Your Community
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Empowering Ugandan artists to build careers, connect with fans, and create sustainable income through their
            art.
          </p>

          {/* Description */}
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of artists who are taking control of their music careers with direct fan connections, fair
            revenue sharing, and powerful promotion tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl shadow-green-900/30 transition-all duration-300 hover:shadow-green-700/40 hover:scale-105"
              asChild
            >
              <Link href="/auth/register">
                <Music className="mr-3 h-5 w-5" />
                Start Your Journey
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm transition-all duration-300 hover:border-white/50"
              asChild
            >
              <Link href="/learn-more">
                <Play className="mr-3 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Featured Image */}
          <div className="relative max-w-4xl mx-auto">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
              <Image
                src="/placeholder.svg?height=500&width=800"
                alt="Ugandan artists performing and creating music"
                fill
                className="object-cover"
              />

              {/* Floating Stats */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between z-20">
                <div className="bg-black/50 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                  <p className="text-sm text-green-300 font-medium">Active Artists</p>
                  <p className="text-white font-bold text-xl">12K+</p>
                </div>
                <div className="bg-black/50 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                  <p className="text-sm text-green-300 font-medium">Monthly Listeners</p>
                  <p className="text-white font-bold text-xl">2.5M+</p>
                </div>
                <div className="bg-black/50 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
                  <p className="text-sm text-green-300 font-medium">Songs Streamed</p>
                  <p className="text-white font-bold text-xl">50M+</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-green-400/30 rounded-full"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-purple-400/30 rounded-full"></div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm mb-6">Trusted by artists across Uganda</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-white/80 font-semibold">Kampala</div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="text-white/80 font-semibold">Entebbe</div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="text-white/80 font-semibold">Jinja</div>
              <div className="w-1 h-1 bg-white/40 rounded-full"></div>
              <div className="text-white/80 font-semibold">Mbarara</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <ChevronRight className="h-6 w-6 text-white/60 rotate-90" />
        </div>
      </div>
    </section>
  )
}
