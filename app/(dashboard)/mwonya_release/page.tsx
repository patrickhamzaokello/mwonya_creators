"use client"
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Disc, Music2, Grid, List, Filter, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useArtist } from "@/contexts/ArtistContext";
import { getArtistDiscovery } from "@/actions/getArtists";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShareComponent } from '@/components/ShareComponent';

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
      aria-label="Grid view"
    >
      <Grid className="h-4 w-4" />
    </button>
    <button
      onClick={() => setView('list')}
      className={`p-2 rounded-md transition-all ${view === 'list' ? 'bg-primary text-white' : 'hover:bg-accent'}`}
      aria-label="List view"
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

  // Format year only for display in grid view
  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear().toString();
  };

  if (view === 'grid') {
    return (
      <Card
        onClick={onClick}
        className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden bg-gradient-to-b from-background to-background/80 border border-border hover:border-primary/30"
      >
        <div className="relative aspect-square overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          <Image
            src={item.artwork.fileUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-20">
            <Badge variant="outline" className="bg-black/40 text-white border-white/20 backdrop-blur-sm">
              {formatYear(item.releaseDate)}
            </Badge>
            {item.exclusive && (
              <Badge className="bg-primary text-white font-medium animate-pulse">
                Exclusive
              </Badge>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-8 group-hover:translate-y-0 transition-transform duration-300 z-10">
            <div className="flex items-center gap-2 text-xs text-white/90">
              <Disc className="h-3 w-3" />
              <span>{item.totalSongs} {item.totalSongs === 1 ? 'Track' : 'Tracks'}</span>
              <span className="mx-1">•</span>
              <span>{item.AES_code}</span>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold line-clamp-1 text-base group-hover:text-primary transition-colors">{item.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs font-normal">
              {item.genre}
            </Badge>
            <span className="text-xs text-muted-foreground">{formatDate(item.releaseDate)}</span>
          </div>
          <ShareComponent mediaId={item.id} mediaType='collection' triggerClassName='mt-4 bg-white' />
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-all border-l-2 border-transparent hover:border-l-primary"
    >
      <div className="relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded overflow-hidden shadow-sm group-hover:shadow-md transition-all">
        <Image
          src={item.artwork.fileUrl}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {item.exclusive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <Badge className="bg-primary text-white font-medium">
              Exclusive
            </Badge>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-1 px-2">
          <span className="text-xs font-medium text-white">{formatYear(item.releaseDate)}</span>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
         <div className='flex items-center gap-2'>
         <Badge 
            variant={item.AES_code.includes('EP') ? "secondary" : "outline"} 
            className="text-xs ml-2 opacity-70 group-hover:opacity-100 transition-opacity"
          >
            {item.AES_code}
          </Badge>

          <ShareComponent mediaId={item.id} mediaType='collection' />
         </div>
        </div>
        
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
          <Badge variant="secondary" className="text-xs font-normal">
            {item.genre}
          </Badge>
          <span className="text-xs text-muted-foreground">{formatDate(item.releaseDate)}</span>
        </div>
        
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <Disc className="h-3 w-3" />
          <span>{item.totalSongs} {item.totalSongs === 1 ? 'Track' : 'Tracks'}</span>
          {item.exclusive && (
            <>
              <span className="mx-1">•</span>
              <span className="text-xs text-primary font-medium">Exclusive</span>
            </>
          )}
        </div>
      </div>
      
      <div className="flex items-center self-center h-full text-muted-foreground group-hover:text-primary transition-colors">
        <ChevronRight className="h-5 w-5" />
      </div>
    </div>
  );
};

export default function ContentByYear() {
  const [selectedArtist] = useArtist();
  const [contentByYear, setContentByYear] = useState<YearSection[]>([]);
  const [filteredContent, setFilteredContent] = useState<YearSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
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

          // Sort items within each year by release date (newest first)
            groupedContent.forEach((section: YearSection) => {
            section.items.sort((a: ContentItem, b: ContentItem) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
            });

          const sortedByYear = groupedContent.sort((a: YearSection, b: YearSection) => b.year - a.year);
          setContentByYear(sortedByYear);
          setFilteredContent(sortedByYear);
        } else {
          setError('Failed to fetch artist content');
        }
      } catch (err) {
        setError("An error occurred while fetching artists.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [selectedArtist]);

  // Extract all unique genres
  const allGenres = React.useMemo(() => {
    const genres = new Set<string>();
    contentByYear.forEach(section => {
      section.items.forEach(item => {
        genres.add(item.genre);
      });
    });
    return Array.from(genres);
  }, [contentByYear]);

  // Filter content when search or genre filter changes
  useEffect(() => {
    if (contentByYear.length === 0) return;

    const filtered = contentByYear.map(section => {
      const filteredItems = section.items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = filterGenre === 'all' || item.genre === filterGenre;
        return matchesSearch && matchesGenre;
      });
      
      return {
        year: section.year,
        items: filteredItems
      };
    }).filter(section => section.items.length > 0);

    setFilteredContent(filtered);
  }, [searchQuery, filterGenre, contentByYear]);

  // Calculate total releases count
  const totalReleases = React.useMemo(() => {
    return contentByYear.reduce((acc, section) => acc + section.items.length, 0);
  }, [contentByYear]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col space-y-4">
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
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header with stats */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Discography</h1>
              <p className="text-muted-foreground mt-1">
                {selectedArtist?.name} • {totalReleases} {totalReleases === 1 ? 'Release' : 'Releases'}
              </p>
            </div>
            <ViewToggle view={view} setView={setView} />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search releases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {allGenres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* No results state */}
        {filteredContent.length === 0 && (
          <div className="flex items-center justify-center h-[200px] bg-accent/20 rounded-lg">
            <div className="text-center space-y-2">
              <p className="text-lg text-muted-foreground">
                No releases match your filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterGenre('all');
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {/* Timeline view */}
        <div className="space-y-12">
          {filteredContent.map((section) => (
            <div key={section.year} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold">{section.year}</h2>
                <Badge variant="secondary">
                  {section.items.length} {section.items.length === 1 ? 'Release' : 'Releases'}
                </Badge>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <div className={
                view === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-2 divide-y divide-border"
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}