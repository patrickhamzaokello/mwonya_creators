import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <>
            <Card mb-2>
                <CardHeader mb-2>
                    <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent mb-2>
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4 mt-4">
                {Array(4).fill(0).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-4 w-2/3 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-4">
                <Card className="col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[350px] w-full" />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <Skeleton className="h-6 w-1span-3" />
                        <CardHeader>
                            <Skeleton className="h-6 w-1/4" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="flex items-center">
                                        <Skeleton className="h-9 w-9 rounded-full" />
                                        <div className="ml-4 space-y-1">
                                            <Skeleton className="h-4 w-[100px]" />
                                            <Skeleton className="h-4 w-[60px]" />
                                        </div>
                                        <Skeleton className="h-4 w-[20px] ml-auto" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array(3).fill(0).map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <div className="ml-4 space-y-1">
                                        <Skeleton className="h-4 w-[150px]" />
                                        <Skeleton className="h-4 w-[100px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-4 w-2/3 mt-2" />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

