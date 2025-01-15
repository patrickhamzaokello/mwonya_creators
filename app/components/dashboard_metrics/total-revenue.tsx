import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from 'lucide-react'

export function TotalRevenue() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$12,345.67</div>
        <p className="text-xs text-muted-foreground">+15% from last month</p>
      </CardContent>
    </Card>
  )
}

