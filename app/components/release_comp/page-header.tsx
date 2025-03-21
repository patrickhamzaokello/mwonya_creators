'use client'

import { useState, useEffect } from 'react'

import { ChevronLeft, ExternalLink, Share2, Download, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton";
import { getContentDetails, publish_content } from '@/actions/getArtists'
import { useToast } from '../ui/use-toast';

function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left section with back button and album info skeleton */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" disabled>
              <ChevronLeft className="h-5 w-5 text-muted-foreground/50" />
              <span className="sr-only">Back to My Albums</span>
            </Button>

            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Skeleton className="h-4 w-28" />
                <div className="h-4 w-1 opacity-40">•</div>
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>

          {/* Right section with artist actions skeleton */}
          <div className="flex items-center gap-2">
            <div className="mr-2 flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="w-32">
                <div className="flex justify-between text-xs">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-8" />
                </div>
                <Skeleton className="mt-1 h-2 w-full" />
              </div>
            </div>

            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
      </div>
    </header>
  )
}

interface AlbumContent {
  content_id: string
  title: string
  artist_id: string
  releasetype: string
  releaseDate: string
  exclusive: boolean
  available: boolean
  duration: string
}

function handlePublish(content_id: string) {
  console.log('Publishing content with ID:', content_id)
}

export function PageHeader({ id }: { id: string }) {
  const [content, setContent] = useState<AlbumContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentReleaseStatus, setCurrentReleaseStatus] = useState(false);

  const { toast } = useToast();

  const handleSubmitForReview = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Make API request to submit album for review
      const data = await publish_content(id);

      if (data.status === 'success' && data.data.success) {
        // Update local state
        setCurrentReleaseStatus(true);
        // Show success toast
        toast({
          title: "Release submitted for review",
          description: data.data.message || "Our team will review your release and get back to you within 2 business days.",
          variant: "default",
        });
      } else {
        throw new Error(data.data?.message || "Unknown error");
      }
    } catch (error) {
      console.error('Error submitting release for review:', error);

      // Show error toast
      toast({
        title: "Submission failed",
        description: "There was an error submitting your release. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true)
      try {
        const response = await getContentDetails(id)
        setContent(response.content_info)
        setCurrentReleaseStatus(response.content_info.available)
      } catch (error) {
        console.error('Error fetching content:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchContent()
  }, [id])

  if (isLoading) return <HeaderSkeleton />
  if (!content) return null
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left section with back button and album info */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back to My Albums</span>
            </Button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold md:text-lg">{content.title}</h1>
                <Badge variant="outline" className="text-xs font-normal">{content.available}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Date: {content.releaseDate}</span>
                <span>•</span>
                <span>Available: {content.available ? "True" : "False"}</span>
                <span>•</span>
                <span>Excusive: {content.exclusive ? "True" : "False"}</span>
                <span>•</span>
                <span>Type: {content.releasetype}</span>
              </div>
            </div>
          </div>

          {/* Right section with artist actions */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="mr-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="w-32">
                      <div className="flex justify-between text-xs">
                        <span>Release Prep</span>
                        <span>{content.available ? "100%" : "80%"}</span>
                      </div>
                      <Progress value={content.available ? 100 : 80} className="h-2" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{content.available ? "Your Release is LIVE" : "Publish your release to make it available to everyone"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>



            <Button variant="outline" size="sm" className="h-9">
              <Share2 className="mr-2 h-4 w-4" />
              Share Release
            </Button>

            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-2 h-4 w-4" />
              Download Files
            </Button>

            <Button
              variant="default"
              size="sm"
              className="h-9"
              onClick={currentReleaseStatus === false ? handleSubmitForReview : undefined}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : currentReleaseStatus === false ? (
                "Publish Release"
              ) : currentReleaseStatus ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-400" />
                  Released
                </>
              ) : (
                "View Analytics"
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

