'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getArtistPaymentDate } from '@/actions/dashboard/getOverview-stats'



export function UpcomingPayout({ artistID }: ArtistID) {
  const [payments, setData] = useState<PayoutData | MessageType | any>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!artistID) return; // Ensure id is available before calling the server action
    setIsLoading(true);

    getArtistPaymentDate(artistID)
      .then(setData)
      .catch(() => setError('Failed to load  data'))
      .finally(() => setIsLoading(false));
  }, [artistID]);

  if (isLoading) {
    return <UpcomingPayoutSkeleton />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!payments) {
    return null
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Circle Earnings</CardTitle>
        <CardDescription>
          Earners from Circle Subscriptions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {payments.map((payment: PayoutData, index: any) => (
          <div key={index}>

            <div className="text-2xl font-bold">${payment.amount.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mb-4">
              Estimated payout on {new Date(payment.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function UpcomingPayoutSkeleton() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <Skeleton className="h-6 w-1/4 bg-accent" />
        <Skeleton className="h-4 w-1/2 mt-2 bg-accent" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-full bg-accent" />
        <Skeleton className="h-4 w-2/3 mt-2 bg-accent" />
      </CardContent>
    </Card>
  )
}

