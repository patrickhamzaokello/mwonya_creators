import { Skeleton } from '@/components/ui/skeleton'

export function ContentSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex gap-6">
          <Skeleton className="aspect-square w-48 h-48" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  )
}

