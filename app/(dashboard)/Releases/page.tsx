"use client";

import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import { useArtist } from "@/contexts/ArtistContext";
import { useState, useEffect } from "react";
import { getArtistDiscovery } from "@/actions/getArtists";
import { useRouter } from "next/navigation"

export default function ContentByYear() {
  const [selectedArtist, setSelectedArtist] = useArtist();
  const [contentByYear, setContentByYear] = useState<YearSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()

  const handleContentClick = (id: string) => {
    router.push(`/releases/${id}`)
  }

  useEffect(() => {
    const fetchArtists = async () => {
      if (!selectedArtist) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getArtistDiscovery(selectedArtist.id);

        if (response.status === "success") {

          const artistsData = response.artist_content || [];

          // Grouping content by year
          const groupedContent = artistsData.reduce((acc: YearSection[], item: any) => {
            let yearSection = acc.find((section) => section.year === item.releaseYear);
            if (!yearSection) {
              yearSection = { year: item.releaseYear, items: [] };
              acc.push(yearSection);
            }

            yearSection.items.push({
              content_id: item.id ?? "",
              title: item.title ?? "",
              artist: item.releaseDate ?? "",
              imageUrl: item.artwork?.fileUrl ?? "",
              category: item.genre ?? "",
            });

            return acc;
          }, []);

          setContentByYear(groupedContent);
        } else {
          setError('Failed to Fetch Artist Content');
        }
      } catch (err) {
        console.log(err);
        setError("An error occurred while fetching artists." + err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [selectedArtist]);

  return (
    <div className="w-full mx-auto">
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && contentByYear.length === 0 && (
        <p className="text-center">No content available for the selected artist.</p>
      )}
      {!loading && !error && contentByYear.length > 0 && (
        <ScrollArea className="h-[800px] rounded-md">
          {contentByYear.map((section) => (
            <section key={section.year} className="mb-8">
              <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4 border-b">
                <h2 className="text-3xl font-bold px-6">
                  {section.year} Release
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    className="group relative flex items-center space-x-4 rounded-md border p-4 hover:bg-accent transition-colors"
                    onClick={() => handleContentClick(item.content_id)}
                  >
                    <div className="relative h-44 w-44 flex-shrink-0">
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
      )}
    </div>
  );
}
