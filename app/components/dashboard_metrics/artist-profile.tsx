"use client"

import { useEffect, useState } from "react"
import { Music, Bookmark, Plus, Share2, Edit3, PlayCircle, Users, TrendingUp, Globe, Check } from "lucide-react"
import type { MetricItemProps, ArtistProfileProps } from "@/types/artist"
import { getArtistSummaryData } from "@/actions/dashboard/getOverview-stats"
import { MetricsGrid } from "@/components/dashboard_metrics/MetricsGrid"
import { Skeleton } from "@/components/ui/skeleton" // Add a skeleton component for loading states

const ArtistProfile = ({ artistID, name, coverArt, profileImage, isVerified }: ArtistProfileProps) => {
  const [metrics, setMetrics] = useState<MetricItemProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

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

  return (
    <div className="w-full border rounded-lg bg-background text-white">
      {/* Hero Section */}
      <div className="relative h-80 w-full overflow-hidden" key={`cover-${artistID}`}>
        {coverArt ? (
          <img
            src={coverArt || "/placeholder.svg"}
            alt={`${name}'s Cover Art`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-900 to-purple-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background/80" />

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <button
            className="p-2.5 rounded-full bg-background/40 hover:bg-background/60 transition-all backdrop-blur-sm border border-white/10"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            className="p-2.5 rounded-full bg-background/40 hover:bg-background/60 transition-all backdrop-blur-sm border border-white/10"
            aria-label="Bookmark"
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-row md:items-end -mt-24 mb-8">
          {/* Profile Image */}
          <div className="relative z-10" key={`profile-${artistID}`}>
            <div className="w-36 h-36 rounded-xl overflow-hidden border-4 border-white shadow-2xl hover:shadow-3xl transition-shadow">
              {profileImage ? (
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt={`${name}'s Profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Music className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            {isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5 border-2 border-background shadow-lg">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          {/* Artist Info */}
          <div className="flex-1 mt-6 md:mt-0 md:ml-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight mb-2">{name}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-white/80 text-sm bg-white/10 px-3 py-1 rounded-full">Creator</span>
                  
                </div>
              </div>
              <div className="flex mt-4 md:mt-0 space-x-3">
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all flex items-center gap-2 shadow-lg"
                  aria-label="Share Profile Link"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>Share Profile Link</span>
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all flex items-center gap-2 backdrop-blur-sm border border-white/10"
                  aria-label="Edit Profile"
                >
                  <Edit3 className="w-5 h-5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mb-8 flex gap-3">
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg"
            aria-label="New Release"
          >
            <Plus className="w-4 h-4" />
            <span>New Release</span>
          </button>
          <button
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-all backdrop-blur-sm border border-white/10"
            aria-label="Manage Releases"
          >
            <Users className="w-4 h-4" />
            <span>Manage Releases</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="bg-white/5 p-6 backdrop-blur-sm border border-white/10 shadow-xl">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-lg bg-white/10" />
            ))}
          </div>
        ) : (
          <MetricsGrid metrics={metrics} isLoading={isLoading} error={error} />
        )}
      </div>
    </div>
  )
}

export default ArtistProfile