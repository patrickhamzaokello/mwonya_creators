"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, UserCircle, BarChart3, Music, Globe, CheckCircle2, ChevronRight, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function OnboardingView({ userRole }: { userRole: string }) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12 px-4 sm:px-6">
      <motion.div className="max-w-4xl mx-auto" initial="hidden" animate="visible" variants={fadeIn}>
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Getting Started</span>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>

        {/* Main content card */}
        <Card className="border-none shadow-lg overflow-hidden">
          <div className="relative h-40 bg-primary/10">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=160&width=1000')] opacity-20 bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  Welcome to Creator Studio <Sparkles className="h-6 w-6 text-primary" />
                </h1>
              </motion.div>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="mb-6">
              <p className="text-lg text-muted-foreground">
                Let's set up your {userRole === "label" ? "first artist" : "profile"} to get started with your creative
                journey
              </p>
            </div>

            {/* Steps visualization */}
            <div className="grid gap-6 md:grid-cols-3 mb-10">
              {[
                {
                  title: "Create Profile",
                  description: "Build your brand identity",
                  icon: UserCircle,
                  step: 1,
                },
                {
                  title: "Add Content",
                  description: "Upload your first release",
                  icon: Music,
                  step: 2,
                },
                {
                  title: "Connect",
                  description: "Reach your audience",
                  icon: Globe,
                  step: 3,
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`relative flex flex-col items-center p-6 rounded-lg border ${
                    currentStep === item.step
                      ? "border-primary bg-primary/5"
                      : currentStep > item.step
                        ? "border-muted bg-muted/30"
                        : "border-dashed"
                  }`}
                >
                  {currentStep > item.step && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`mb-4 p-3 rounded-full ${
                      currentStep === item.step ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold mb-2 text-center">{item.title}</h3>
                  <p className="text-sm text-center text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Why it matters section */}
            <div className="mb-10 bg-muted/30 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Why Your Profile Matters</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start">
                  <div className="mr-4 p-2 rounded-full bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Track Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Monitor listener engagement and growth with detailed analytics
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-4 p-2 rounded-full bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Global Reach</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with fans worldwide and expand your audience
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mb-10 border-l-4 border-primary/50 pl-4 py-2 italic text-muted-foreground">
              <p>
                "Setting up my profile was the first step to growing my audience. The analytics helped me understand
                what content resonates with my fans."
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">— Alex Rivera, Independent Artist</p>
            </div>

            {/* CTA section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Your profile can be updated anytime after creation</p>
              </div>
              <Link href="/artist/create-profile">
                <Button size="lg" className="group">
                  Create Your {userRole === "label" ? "First Artist" : "Profile"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Label-specific benefits */}
        {userRole === "label" && (
          <motion.div
            className="mt-8 bg-card rounded-lg border shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                Label Account Benefits
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: "Artist Management",
                    description: "Create and manage multiple artist profiles from a single dashboard",
                  },
                  {
                    title: "Advanced Analytics",
                    description: "Get comprehensive reporting and insights across your entire roster",
                  },
                  {
                    title: "Revenue Tracking",
                    description: "Consolidated revenue tracking and distribution for all your artists",
                  },
                  {
                    title: "Priority Support",
                    description: "Access to dedicated label support and early feature releases",
                  },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/30 p-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Need help setting up your label? Check our{" "}
                <Link href="/help/labels" className="text-primary hover:underline">
                  Label Guide
                </Link>
              </p>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                Learn more <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

