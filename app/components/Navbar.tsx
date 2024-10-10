"use client"

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { FileUp, ChevronDown, Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useArtist } from "@/contexts/ArtistContext"
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'
import { getArtistsForUser } from '@/actions/getArtists';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    }, [selectedArtist]);




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



    return (
        <div className="flex items-center justify-between py-2 px-4 bg-background border-b">
            <div className="flex items-center space-x-4">
                <Select onValueChange={handleSelectArtist} value={selectedArtist?.id || undefined}>
                    <SelectTrigger className="w-[250px] py-6">
                        <SelectValue  placeholder="Select Artist" />
                    </SelectTrigger>
                    <SelectContent>
                        {artists.map((artist) => (
                            <SelectItem key={artist.id} value={artist.id}>
                                <div className="flex items-center space-x-3 py-1">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={artist.profileImage} alt={artist.name} />
                                        <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className='text-bold'>{artist.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                        <SelectItem value="add-new">
                            <div className="flex items-center text-primary py-2">
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Artist
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center space-x-6">
                <Button variant="outline" asChild>
                    <Link href="/upload" className="flex items-center">
                        <FileUp className="mr-2 h-4 w-4" />
                        New Release
                    </Link>
                </Button>

                <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold">{session?.user?.name || "User"}</span>
                        <span className="text-xs text-muted-foreground">{role || "Role"}</span>
                    </div>
                    <Avatar>
                        <AvatarImage src={session?.user?.image || "/avatar.png"} alt={session?.user?.name || "User"} />
                        <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    )
}

export default Navbar