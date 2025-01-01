'use client'

import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight } from 'lucide-react'
import { useArtist } from "@/contexts/ArtistContext";

interface ContentItem {
  title: string
  artist: string
  imageUrl: string
  category: string
}

interface YearSection {
  year: number
  items: ContentItem[]
}

// Example data structure
const contentByYear: YearSection[] = [
  {
    year: 2024,
    items: [
      {
        title: "Best of Dance",
        artist: "Various Artists",
        imageUrl: "/placeholder.svg?height=400&width=400",
        category: "Dance"
      },
      {
        title: "Winter Collection",
        artist: "Various Artists",
        imageUrl: "/placeholder.svg?height=400&width=400",
        category: "Pop"
      },
    ]
  },
  {
    year: 2023,
    items: [
      {
        title: "Summer Hits",
        artist: "Various Artists",
        imageUrl: "/placeholder.svg?height=400&width=400",
        category: "Pop"
      },
      {
        title: "Classical Moments",
        artist: "London Symphony",
        imageUrl: "/placeholder.svg?height=400&width=400",
        category: "Classical"
      },
    ]
  }
  ,{
    year: 2023,
    items: [
      {
        title: "Summer Hits",
        artist: "Various Artists",
        imageUrl: "/placeholder.svg?height=400&width=400",
        category: "Pop"
      },
      {
        title: "Classical Moments",
        artist: "London Symphony",
        imageUrl: "/placeholder.svg?height=400&width=400",
        category: "Classical"
      },
    ]
  },{
    year: 2023,
    items: [
      {
        title: "Summer Hits",
        artist: "Various Artists",
        imageUrl: "/placeholder.svg?height=400&width=400",
        category: "Pop"
      },
      {
        title: "Classical Moments",
        artist: "London Symphony",
        imageUrl: "/placeholder.svg?height=400&width=400",
        category: "Classical"
      },
    ]
  }
]

export default function ContentByYear() {

    const [selectedArtist, setSelectedArtist] = useArtist();
  return (
    <div className="w-full  mx-auto">
      <ScrollArea className="h-[800px] rounded-md">
        {contentByYear.map((section) => (
          <section key={section.year} className="mb-8">
            <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4 border-b">
              <h2 className="text-3xl font-bold px-6">{section.year}  Selected Artist: {selectedArtist?.name}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {section.items.map((item, index) => (
                <div
                  key={index}
                  className="group relative flex items-center space-x-4 rounded-md border p-4 hover:bg-accent transition-colors"
                >
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold leading-none tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.artist}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.category}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </ScrollArea>
    </div>
  )
}

