"use client"

import { useState, useEffect } from 'react'
import { useArtist } from "@/contexts/ArtistContext"
import { useRouter } from 'next/navigation'
import { getArtistsForUser } from '@/actions/getArtists'
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, FileUp, LogOut, Plus, Search, Settings, User } from 'lucide-react'
import { SignOutButton } from './sign-out-button'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArtistSelector } from './artist-selector'
import { Session } from "next-auth";

const DashboardNavbar = ({ session }: { session: Session }) => {
    const [artists, setArtists] = useState<TArtist[]>([])
    const [selectedArtist, setSelectedArtist] = useArtist()
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const fetchedArtists = await getArtistsForUser()

                if (fetchedArtists.status === "error") {
                    toast({
                        title: "Error",
                        description: fetchedArtists.message,
                    })
                }
                if (fetchedArtists.status === "success") {
                    toast({
                        title: "Success",
                        description: fetchedArtists.message,
                    })
                    const artistsData: TArtist[] = fetchedArtists.formattedArtists || []

                    setArtists(artistsData)

                    if (artistsData.length > 0 && !selectedArtist) {
                        setSelectedArtist(artistsData[0])
                    }
                }
            } catch (error) {
                console.error(error)
                toast({
                    title: "Error",
                    description: "Failed to fetch artists",
                    variant: "destructive",
                })
            }
        }

        fetchArtists()
    }, [])

    const handleSelectArtist = (artistId: string) => {
        if (artistId === 'add-new') {
            router.push('/add-artist')
            return
        }
        const artist = artists.find(a => a.id === artistId)
        if (artist) {
            setSelectedArtist(artist)
            router.refresh()
        }
    }

    const filteredArtists = artists.filter(artist => 
        artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    
                    <span className="text-xl font-semibold">Artist</span>
                    <ArtistSelector
                        artists={filteredArtists}
                        selectedArtist={selectedArtist}
                        onSelectArtist={handleSelectArtist}
                    />
                </div>
                
                                        
                   

            </div>
        </nav>
    )
}

export default DashboardNavbar

