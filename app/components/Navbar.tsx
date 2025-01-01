"use client"

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useArtist } from "@/contexts/ArtistContext"
import { useRouter } from 'next/navigation'
import { getArtistsForUser } from '@/actions/getArtists';
import { useToast } from "@/hooks/use-toast";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, FileUp, LogOut, Plus, Search, Settings, User } from "lucide-react";
import { SignOutButton } from './SignOutButton';
import { SidebarTrigger } from "@/components/ui/sidebar"

const Navbar = ({ session, userRole }: any) => {
    const [artists, setArtists] = useState<TArtist[]>([]);
    const [selectedArtist, setSelectedArtist] = useArtist();
    const router = useRouter()
    const { toast } = useToast()


    useEffect(() => {

        const fetchArtists = async () => {
            try {

                const fetchArtists = await getArtistsForUser();

                if (fetchArtists.status === "error") {
                    toast({
                        title: "Error",
                        description: fetchArtists.message,
                    });
                }
                if (fetchArtists.status === "success") {
                    toast({
                        title: "success",
                        description: fetchArtists.message,
                    });
                    const artistsData: TArtist[] = fetchArtists.formattedArtists || [];

                    setArtists(artistsData);

                    // Set the first artist as the default selected artist if not already selected
                    if (artistsData.length > 0 && !selectedArtist) {
                        setSelectedArtist(artistsData[0]);
                    }
                }
            } catch (error) {
                throw (error)
            }
        };

        fetchArtists();
    }, []);






    const handleSelectArtist = (artistId: string) => {
        if (artistId === 'add-new') {
            router.push('/add-artist');
            return;
        }
        const artist = artists.find(a => a.id === artistId);
        if (artist) {
            setSelectedArtist(artist);
            router.refresh(); // Fix router.refresh call
        }
    };


    return (

        <nav className="flex h-16 items-center justify-between bg-background px-4 shadow">
            <div className="flex items-center">
                <SidebarTrigger />
                <div className="ml-4 text-xl font-semibold">Dashboard</div>
            </div>
            
            <div className="flex items-center space-x-2">

                <Select onValueChange={handleSelectArtist} value={selectedArtist?.id || undefined}>
                    <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Select Artist" />
                    </SelectTrigger>
                    <SelectContent>
                            {artists.map((artist) => (
                                <SelectItem key={artist.id} value={artist.id}>
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-7 w-7">
                                            <AvatarImage src={artist.profileImage} alt={artist.name} />
                                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{artist.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        <SelectItem value="add-new">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="flex items-center text-primary cursor-pointer">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add New Artist
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Artist</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <Input id="name" placeholder="Artist Name" />
                                        <Input id="image" type="file" accept="image/*" />
                                        <Button>Add Artist</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </nav>
    )
}

export default Navbar