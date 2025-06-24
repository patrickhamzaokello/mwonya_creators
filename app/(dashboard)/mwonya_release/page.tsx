"use client"
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Disc, Music2, Grid, List, Filter, ChevronRight, Search, Clock, Star } from "lucide-react";
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
  } | null;
  totalSongs: number;
}

interface YearSection {
  year: number;
  items: ContentItem[];
}

const ViewToggle = ({ view, setView }: { view: string, setView: React.Dispatch<React.SetStateAction<string>> }) => (
  <div className="flex bg-gray-100 rounded-lg p-1">
    <button
      onClick={() => setView('grid')}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
        view === 'grid' 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      <Grid className="h-4 w-4 mr-2 inline" />
      Grid
    </button>
    <button
      onClick={() => setView('list')}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
        view === 'list' 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      <List className="h-4 w-4 mr-2 inline" />
      List
    </button>
  </div>
);

const AlbumPlaceholder = ({ size = 'default' }: { size?: 'small' | 'default' }) => (
  <div className={`bg-gray-200 flex items-center justify-center rounded-lg ${
    size === 'small' ? 'w-16 h-16' : 'w-full h-full'
  }`}>
    <Music2 className={`text-gray-400 ${size === 'small' ? 'h-6 w-6' : 'h-12 w-12'}`} />
  </div>
);

const ContentCard = ({ item, onClick, view }: { item: ContentItem, onClick: () => void, view: string }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (view === 'grid') {
    return (
      <Card
        onClick={onClick}
        className="group cursor-pointer bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden"
      >
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {item.artwork?.fileUrl ? (
            <Image
              src={item.artwork.fileUrl}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : (
            <AlbumPlaceholder />
          )}
          
          {item.exclusive && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium">
                Exclusive
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 line-clamp-1 text-base">
              {item.title}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{item.releaseYear}</span>
              <span>•</span>
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                {item.genre}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Disc className="h-3 w-3" />
                <span>{item.totalSongs} tracks</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(item.releaseDate)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                {item.AES_code}
              </Badge>
              <ShareComponent mediaId={item.id} mediaType='collection' />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all duration-200"
    >
      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        {item.artwork?.fileUrl ? (
          <Image
            src={item.artwork.fileUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <AlbumPlaceholder size="small" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-1 text-base">
              {item.title}
            </h3>
            
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              <span>{item.releaseYear}</span>
              <span>•</span>
              <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                {item.genre}
              </Badge>
              {item.exclusive && (
                <>
                  <span>•</span>
                  <Badge className="bg-red-500 text-white text-xs">
                    Exclusive
                  </Badge>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Disc className="h-3 w-3" />
                <span>{item.totalSongs} tracks</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(item.releaseDate)}</span>
              </div>
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                {item.AES_code}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShareComponent mediaId={item.id} mediaType='collection' />
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </div>
        </div>
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
  const [view, setView] = useState('grid');
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

  // Calculate total tracks
  const totalTracks = React.useMemo(() => {
    return contentByYear.reduce((acc, section) => 
      acc + section.items.reduce((sectionAcc, item) => sectionAcc + item.totalSongs, 0), 0
    );
  }, [contentByYear]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
            
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-40" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 bg-white p-8 rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Music2 className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-lg font-medium text-gray-900">Unable to load content</p>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!loading && !error && contentByYear.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 bg-white p-8 rounded-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <Music2 className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-900">No releases found</p>
          <p className="text-sm text-gray-600">
            This artist doesn't have any content available yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Discography</h1>
              <p className="text-gray-600 mt-1">
                {selectedArtist?.name}
              </p>
            </div>
            <ViewToggle view={view} setView={setView} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{totalReleases}</div>
              <div className="text-sm text-gray-600">Releases</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{totalTracks}</div>
              <div className="text-sm text-gray-600">Tracks</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{contentByYear.length}</div>
              <div className="text-sm text-gray-600">Years Active</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{allGenres.length}</div>
              <div className="text-sm text-gray-600">Genres</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search releases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-gray-400"
              />
            </div>
            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger className="w-full sm:w-[180px] border-gray-300">
                <SelectValue placeholder="All Genres" />
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
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">No releases match your search</p>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterGenre('all');
              }}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Content Timeline */}
        <div className="space-y-8">
          {filteredContent.map((section) => (
            <div key={section.year} className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">{section.year}</h2>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  {section.items.length} {section.items.length === 1 ? 'release' : 'releases'}
                </Badge>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className={
                view === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-3"
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