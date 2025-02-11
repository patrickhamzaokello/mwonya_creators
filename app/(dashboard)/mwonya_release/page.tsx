"use client"
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Disc, Music2, Grid, List, Filter, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useArtist } from "@/contexts/ArtistContext";
import { getArtistDiscovery } from "@/actions/getArtists";
import { Skeleton } from "@/components/ui/skeleton";

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

const ViewToggle = ({ view, setView }: { view: string, setView: React.Dispatch<React.SetStateAction<string>> }) => (
  <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
    <button
      onClick={() => setView('grid')}
      className={`p-2 rounded-md transition-all ${view === 'grid' ? 'bg-primary text-white' : 'hover:bg-accent'}`}
    >
      <Grid className="h-4 w-4" />
    </button>
    <button
      onClick={() => setView('list')}
      className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-primary text-white' : 'hover:bg-accent'}`}
    >
      <List className="h-4 w-4" />
    </button>
  </div>
);

const ContentCard = ({ item, onClick, view }: { item: ContentItem, onClick: () => void, view: string }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (view === 'grid') {
    return (
      <Card 
        onClick={onClick}
        className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      >
        <div className="relative aspect-square">
          <Image
            src={item.artwork.fileUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {item.exclusive && (
            <Badge className="absolute top-2 right-2 bg-primary text-white">
              Exclusive
            </Badge>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold line-clamp-1">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{formatDate(item.releaseDate)}</p>
          <div className="flex flex-wrap gap-2">
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
        </CardContent>
      </Card>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="group flex items-center gap-4 p-4 rounded-lg hover:bg-accent cursor-pointer transition-all"
    >
      <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={item.artwork.fileUrl}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold line-clamp-1">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{formatDate(item.releaseDate)}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            {item.genre}
          </Badge>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            {item.totalSongs} {item.totalSongs === 1 ? 'Track' : 'Tracks'}
          </span>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
    </div>
  );
};

export default function ContentByYear() {
  const [selectedArtist] = useArtist();
  const [contentByYear, setContentByYear] = useState<YearSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState('grid');
  const router = useRouter();

  useEffect(() => {
    const fetchArtists = async () => {
      if (!selectedArtist) return;
      setLoading(true);
      setError(null);

      try {
        const response = await getArtistDiscovery(selectedArtist.id);
        if (response.status === "success") {
          const groupedContent = (response.artist_content || []).reduce((acc: YearSection[], item: ContentItem) => {
            const yearSection = acc.find(section => section.year === item.releaseYear) || {
              year: item.releaseYear,
              items: []
            };
            if (!acc.find(section => section.year === item.releaseYear)) {
              acc.push(yearSection);
            }
            yearSection.items.push(item);
            return acc;
          }, []);

            setContentByYear(groupedContent.sort((a: YearSection, b: YearSection) => b.year - a.year));
        } else {
          setError('Failed to fetch artist content');
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

  if (loading) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

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
            No content available for this artist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Discography</h1>
          <Badge variant="secondary" className="text-sm">
            {contentByYear.reduce((acc, section) => acc + section.items.length, 0)} Releases
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter</span>
          </button>
          <ViewToggle view={view} setView={setView} />
        </div>
      </div>

      <Tabs defaultValue={contentByYear[0]?.year.toString()} className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-full justify-start border-b pb-0">
            {contentByYear.map((section) => (
              <TabsTrigger
                key={section.year}
                value={section.year.toString()}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {section.year}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {contentByYear.map((section) => (
          <TabsContent key={section.year} value={section.year.toString()}>
            <div className={
              view === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "divide-y"
            }>
              {section.items.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  onClick={() => router.push(`/mwonya_release/${item.id}`)}
                  view={view}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}