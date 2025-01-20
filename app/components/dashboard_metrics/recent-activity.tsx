'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getArtistActivity } from '@/actions/dashboard/getOverview-stats'


export function RecentActivity({artistID}: ArtistID) {
  const [activities, setActivities] = useState<Activity[] | MessageType | any>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!artistID) return; // Ensure id is available before calling the server action
    setIsLoading(true);
    getArtistActivity(artistID)
        .then(setActivities)
        .catch(() => setError('Failed to load  data'))
        .finally(() => setIsLoading(false));
}, [artistID]);

  if (isLoading) {
    return <RecentActivitySkeleton />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your latest uploads and interactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activities.map((activity:Activity, index:any) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.avatar} alt="Avatar" />
                <AvatarFallback>{activity.title[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RecentActivitySkeleton() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <Skeleton className="h-6 w-1/4 bg-accent" />
        <Skeleton className="h-4 w-1/2 mt-2 bg-accent" />
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-9 w-9 rounded-full bg-accent" />
              <div className="ml-4 space-y-1">
                <Skeleton className="h-4 w-[150px] bg-accent" />
                <Skeleton className="h-4 w-[100px] bg-accent" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

