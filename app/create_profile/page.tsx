import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Music, Building2, Sparkles, Users, Globe2, TrendingUp, Play, Wand2, Mic2 } from 'lucide-react';
import { Card } from "@/components/ui/card";

export default function Component() {
  return (
    
      <div className="h-full bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
        {/* Modern geometric shapes and gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs */}
          <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-tr from-secondary/20 via-secondary/5 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          {/* Floating shapes */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full mix-blend-multiply animate-float"
            style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-secondary/5 rounded-full mix-blend-multiply animate-float"
            style={{ animationDelay: '2s' }} />

          {/* Geometric patterns */}
          <div className="absolute top-1/3 left-1/4 w-16 h-16 border border-primary/20 rounded-lg rotate-45 animate-spin-slow" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-secondary/20 rounded-full animate-spin-slow"
            style={{ animationDelay: '3s' }} />

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000,transparent)]" />
        </div>

        <section className="w-full py-12 md:py-24 lg:py-32 relative">
          <div className="container mx-auto px-4 md:px-6">
            {/* Highlight accent */}
            <div className="absolute -top-48 -left-48 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-20 animate-blob" />
            <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-secondary/30 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000" />

            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-8 relative">
                <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 group cursor-pointer backdrop-blur-sm">
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Welcome to the future of music
                  <span className="ml-2 text-primary/40 group-hover:translate-x-1 transition-transform">→</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary relative">
                    Join Our Creative Community
                    <span className="absolute -top-6 right-0 text-base font-normal text-muted-foreground">★ Where talent meets opportunity</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl/relaxed lg:text-lg/relaxed xl:text-xl/relaxed">
                    Discover tools and resources tailored for you. Whether you're an aspiring artist,
                    a professional musician or a record label, start your journey with us today.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-4 min-[400px]:flex-row lg:justify-start">
                    <Link href="/create_profile/artist" prefetch={false}>
                      <Button size="lg" className="w-full min-[400px]:w-auto bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent animate-shimmer" />
                        <Music className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                        Register as Artist
                      </Button>
                    </Link>
                    <Link href="/create_profile/recordlabel" prefetch={false}>
                      <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto border-primary text-primary hover:bg-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" />
                        <Building2 className="mr-2 h-5 w-5" />
                        Register as Record Label
                      </Button>
                    </Link>
                  </div>
                  <p className="text-sm text-muted-foreground backdrop-blur-sm bg-background/50 inline-block px-2 py-1 rounded-full">
                    Join 10,000+ music professionals worldwide • No credit card required
                  </p>
                </div>
              </div>

              <div className="lg:pl-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/10 col-span-2 group hover:bg-card/60 transition-colors duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Users className="h-8 w-8 mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-semibold mb-2 text-lg">Growing Community</h3>
                    <p className="text-sm text-muted-foreground">Join thousands of artists and labels worldwide. Collaborate, learn, and grow together.</p>
                  </Card>
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/10 group hover:bg-card/60 transition-colors duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Globe2 className="h-8 w-8 mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-semibold mb-2 text-lg">Global Reach</h3>
                    <p className="text-sm text-muted-foreground">Connect with industry professionals and expand your network.</p>
                  </Card>
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/10 group hover:bg-card/60 transition-colors duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <TrendingUp className="h-8 w-8 mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-semibold mb-2 text-lg">Career Growth</h3>
                    <p className="text-sm text-muted-foreground">Take your music career to the next level with our tools.</p>
                  </Card>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground backdrop-blur-sm bg-background/50 px-3 py-2 rounded-full">
                    <Play className="h-4 w-4" />
                    <span>Music Distribution</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground backdrop-blur-sm bg-background/50 px-3 py-2 rounded-full">
                    <Wand2 className="h-4 w-4" />
                    <span>Marketing Tools</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground backdrop-blur-sm bg-background/50 px-3 py-2 rounded-full">
                    <Mic2 className="h-4 w-4" />
                    <span>Artist Resources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    
  );
}