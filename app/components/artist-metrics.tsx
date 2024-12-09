import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Music, Headphones, Mic } from 'lucide-react'

interface ArtistMetricsProps {
  earnings: number
  totalStreams: number
  avgDailyListeners: number
  topChartsEntries: number
}

export function ArtistMetrics({ earnings, totalStreams, avgDailyListeners, topChartsEntries }: ArtistMetricsProps) {
  return (
    <section className="w-full py-6 md:py-10">
      <div className="container">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.toLocaleString()}</div>
              <Progress value={earnings / 1000000 * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {(earnings / 1000000 * 100).toFixed(2)}% of $1M goal
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStreams.toLocaleString()}</div>
              <Progress value={totalStreams / 1000000000 * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {(totalStreams / 1000000000 * 100).toFixed(2)}% of 1B streams goal
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Daily Listeners</CardTitle>
              <Headphones className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgDailyListeners.toLocaleString()}</div>
              <Progress value={avgDailyListeners / 1000000 * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {(avgDailyListeners / 1000000 * 100).toFixed(2)}% of 1M listeners goal
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Charts Entries</CardTitle>
              <Mic className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topChartsEntries}</div>
              <Progress value={topChartsEntries / 100 * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {(topChartsEntries / 100 * 100).toFixed(2)}% of 100 entries goal
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

