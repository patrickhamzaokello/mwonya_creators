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

const Navbar = ({ session, userRole }: any) => {
    const [artists, setArtists] = useState<TArtist[]>([]);
    const [selectedArtist, setSelectedArtist] = useArtist();
    const [isOpen, setIsOpen] = useState(false);
    const [role, setUserRole] = useState("");
    const router = useRouter()
    const { toast } = useToast()


    useEffect(() => {
        const fetchUserRole = async () => {

            if (userRole) {
                setUserRole(userRole);
            } else {
                setUserRole("dinna");
            }
        };
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

        fetchUserRole();
        fetchArtists();
    }, []);




    const handleSelectArtist = (artistId: string) => {
        const artist = artists.find(a => a.id === artistId);
        if (artist) {
            setSelectedArtist(artist); // Update the context with the selected artist object
        }
        setIsOpen(false);
        if (artistId == 'add-new') {

            router.push('/add-artist')
        } else {

            router.push('/studio')
        }
    };


    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="flex items-center justify-between py-3 px-4 bg-background border-b sticky top-0 z-10">
            <div className="flex items-center space-x-4">
                <Select onValueChange={handleSelectArtist} value={selectedArtist?.id || undefined}>
                    <SelectTrigger className="w-[250px] text-bold py-4 rounded-lg">
                        <SelectValue placeholder="Select Artist" />
                    </SelectTrigger>
                    <SelectContent>
                        <div className="max-h-[300px] overflow-y-auto">
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
                        </div>
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

            <div className="flex items-center space-x-4">
                <div className={`transition-all duration-300 ease-in-out ${isSearchOpen ? 'w-64' : 'w-8'}`}>
                    <div className="relative">
                        <Search
                            className={`h-5 w-5 absolute top-1/2 transform -translate-y-1/2 left-2 text-muted-foreground cursor-pointer transition-opacity duration-300 ${isSearchOpen ? 'opacity-100' : 'opacity-50'}`}
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className={`pl-9 pr-4 py-2 w-full ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}
                            onBlur={() => setIsSearchOpen(false)}
                        />
                    </div>
                </div>

                <Button variant="outline" asChild>
                    <Link href="/upload" className="flex items-center">
                        <FileUp className="mr-2 h-4 w-4" />
                        New Release
                    </Link>
                </Button>

                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center space-x-3 cursor-pointer">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold">{session?.user?.name || "User"}</span>
                                <span className="text-xs text-muted-foreground">{role || "Role"}</span>
                            </div>
                            <Avatar>
                                <AvatarImage src={session?.user?.image || "/avatar.png"} alt={session?.user?.name || "User"} />
                                <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <SignOutButton className='w-full'>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </SignOutButton>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default Navbar