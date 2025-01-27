"use client"

import { useState } from "react"
import Image from "next/image"
import { searchArtistsName } from "@/actions/getArtists"
import type { TsearchArtist } from "@/types/artist"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Plus } from "lucide-react"

export function ArtistSearchPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<TsearchArtist[]>([])
  const [selectedArtists, setSelectedArtists] = useState<TsearchArtist[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      try {
        const results = await searchArtistsName(searchQuery)
        setSearchResults(results)
      } catch (error) {
        console.error("Error searching artists:", error)
        // You might want to show an error message to the user here
      } finally {
        setIsSearching(false)
      }
    } else {
      setSearchResults([])
    }
  }

  const addArtist = (artist: TsearchArtist) => {
    if (!selectedArtists.some((a) => a.id === artist.id)) {
      setSelectedArtists([...selectedArtists, artist])
    }
  }

  const removeArtist = (artistId: string) => {
    setSelectedArtists(selectedArtists.filter((a) => a.id !== artistId))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
      <Button variant="ghost" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Artists</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search and Add Artists</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
          {searchResults.length > 0 && (
            <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
              {searchResults.map((artist) => (
                <div key={artist.id} className="flex items-center justify-between p-2 hover:bg-accent">
                  <div className="flex items-center gap-2">
                    <Image
                      src={artist.imageUrl || "/placeholder.svg"}
                      alt={artist.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span>{artist.name}</span>
                  </div>
                  <Button size="sm" onClick={() => addArtist(artist)}>
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
          {selectedArtists.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Selected Artists:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedArtists.map((artist) => (
                  <div
                    key={artist.id}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1"
                  >
                    <span>{artist.name}</span>
                    <Button size="icon" variant="ghost" className="h-4 w-4" onClick={() => removeArtist(artist.id)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button onClick={() => setIsOpen(false)}>Done</Button>
      </DialogContent>
    </Dialog>
  )
}

