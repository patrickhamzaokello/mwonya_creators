import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  change: {
    amount: string
    percentage: string
  }
  lastUpdated: string
  trend: 'up' | 'down'
}

export function StatCard({ title, value, change, lastUpdated, trend }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend === 'up' ? (
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-sm font-medium mt-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {change.amount} ({change.percentage})
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Last updated: {lastUpdated}
        </p>
      </CardContent>
    </Card>
  )
}

