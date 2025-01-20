"use client";

import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Calendar, Disc, Music2 } from "lucide-react";
import { useArtist } from "@/contexts/ArtistContext";
import { useState, useEffect } from "react";
import { getArtistDiscovery } from "@/actions/getArtists";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ContentItem {
  id: string;
  title: string;
  releaseDate: string;
  releaseYear: number;
  tag: string;
  AES_code: string;
  exclusive: boolean;
  genre: string;
  artwork: {
    fileUrl: string;
  };
  totalSongs: number;
}

interface YearSection {
  year: number;
  items: ContentItem[];
}

function ContentSkeleton() {
  return (
    <div className="space-y-8">
      {[1, 2].map((section) => (
        <section key={section} className="mb-8">
          <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4 border-b">
            <Skeleton className="h-8 w-48 ml-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-4 rounded-md border p-4">
                <Skeleton className="h-44 w-44 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function ContentByYear() {
  const [selectedArtist] = useArtist();
  const [contentByYear, setContentByYear] = useState<YearSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleContentClick = (id: string) => {
    router.push(`/mwonya_release/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    const fetchArtists = async () => {
      if (!selectedArtist) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getArtistDiscovery(selectedArtist.id);

        if (response.status === "success") {
          const artistsData = response.artist_content || [];

          const groupedContent = artistsData.reduce((acc: YearSection[], item: ContentItem) => {
            let yearSection = acc.find((section) => section.year === item.releaseYear);
            if (!yearSection) {
              yearSection = { year: item.releaseYear, items: [] };
              acc.push(yearSection);
            }
            yearSection.items.push(item);
            return acc;
          }, []);

            setContentByYear(groupedContent.sort((a: YearSection, b: YearSection) => b.year - a.year));
        } else {
          setError('Failed to Fetch Artist Content');
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching artists.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [selectedArtist]);

  if (loading) return <ContentSkeleton />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-lg text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!loading && !error && contentByYear.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center space-y-2">
          <Music2 className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            No content available for the selected artist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <ScrollArea className="h-[800px] rounded-md">
        {contentByYear.map((section) => (
          <section key={section.year} className="mb-8">
            <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4 border-b">
              <div className="px-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-muted-foreground" />
                <h2 className="text-3xl font-bold">
                  {section.year} Release
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {section.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleContentClick(item.id)}
                  className="group relative flex items-center space-x-4 rounded-xl border p-4 hover:bg-accent cursor-pointer transition-all duration-200 hover:shadow-md"
                >
                  <div className="relative h-44 w-44 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={item.artwork.fileUrl}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.exclusive && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-white">Exclusive</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <h3 className="font-semibold leading-none tracking-tight line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(item.releaseDate)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.genre}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.AES_code}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Disc className="h-4 w-4" />
                      <span>{item.totalSongs} {item.totalSongs === 1 ? 'Track' : 'Tracks'}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </ScrollArea>
    </div>
  );
}