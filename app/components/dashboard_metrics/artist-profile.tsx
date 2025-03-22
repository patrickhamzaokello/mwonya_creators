"use client"

import { useEffect, useState } from "react"
import { Music, Plus, Edit3, Users, Check, Share2 } from "lucide-react"
import type { MetricItemProps, ArtistProfileProps } from "@/types/artist"
import { getArtistSummaryData } from "@/actions/dashboard/getOverview-stats"
import { ShareComponent } from "../ShareComponent"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const ArtistProfile = ({ artistID, name, coverArt, profileImage, isVerified }: ArtistProfileProps) => {
  const [metrics, setMetrics] = useState<MetricItemProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!artistID) return

      try {
        setIsLoading(true)
        const data = (await getArtistSummaryData(artistID, isVerified)) as MetricItemProps[]
        setMetrics(data)
      } catch (err) {
        setError("Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [artistID, isVerified])

  const MetricItem = ({ value, label, prefix }: MetricItemProps) => (
    <Card className="bg-background/60 border-border/40 hover:bg-accent/10 transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex flex-col space-y-1">
          <div className="flex items-baseline gap-1">
            {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
            <span className="text-2xl font-bold tracking-tight">{value.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )

  const renderMetricsGrid = () => {
    if (error) {
      return (
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading
          ? Array.from({ length: 4 }, (_, i) => (
              <Card key={i} className="bg-background/60 border-border/40">
                <CardContent className="p-5">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))
          : metrics.map((metric, index) => <MetricItem key={index} {...metric} />)}
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 w-full" key={`cover-${artistID}`}>
        {coverArt ? (
          <img
            src={coverArt || "/placeholder.svg"}
            alt={`${name}'s Cover Art`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row md:items-end -mt-20 mb-10">
          {/* Profile Image */}
          <div className="relative z-10" key={`profile-${artistID}`}>
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden border-4 border-background shadow-lg">
              {profileImage ? (
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt={`${name}'s Profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-muted to-muted/70 flex items-center justify-center">
                  <Music className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
            {isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-1.5 border-2 border-background shadow-md">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Artist Info */}
          <div className="flex-1 mt-6 md:mt-0 md:ml-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{name}</h1>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs font-normal">
                    Creator
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <ShareComponent
                  title="Share Profile Link"
                  triggerClassName="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-foreground hover:text-accent-foreground h-9 px-4 py-2"
                  mediaId={artistID}
                  mediaType="artist"
                />
                <Button variant="outline" size="sm" className="gap-2" aria-label="Edit Profile">
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-10 flex flex-wrap gap-3">
          <Link href={`/new_release`}>
            <Button className="gap-2" aria-label="New Release">
              <Plus className="w-4 h-4" />
              <span>New Release</span>
            </Button>
          </Link>
          <Link href={`/mwonya_release`}>
            <Button variant="outline" className="gap-2" aria-label="Manage Releases">
              <Users className="w-4 h-4" />
              <span>Manage Releases</span>
            </Button>
          </Link>
        </div>

        {/* Metrics Section */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
          {renderMetricsGrid()}
        </div>
      </div>
    </div>
  )
}

export default ArtistProfile

