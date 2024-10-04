"use client"

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { FileUp, ChevronDown, Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useArtist } from "@/contexts/ArtistContext"

import { useRouter } from 'next/navigation'

interface Artist {
    id: string;
    name: string;
    image: string;
}

const Navbar = ({ session, userRole }: any) => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtist, setSelectedArtist] = useArtist();
    const [isOpen, setIsOpen] = useState(false);
    const [role, setUserRole] = useState("");
    const router = useRouter()

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
                const response = await fetch('/api/artists'); // Replace with your actual API endpoint
                const data = await response.json();
                setArtists(data);
            } catch (error) {
                throw(error)
            }
        };

        fetchUserRole();
        fetchArtists();
    }, []);


    

    const handleSelectArtist = (artistId: string) => {
        setSelectedArtist(artistId);
        setIsOpen(false);
        if (artistId == 'add-new') {

            router.push('/add-artist')
        } else {

            router.push('/studio')
        }
    };



    return (
        <div className='flex items-center justify-between py-4 px-4 bg-[#101010] border-b-[1px] border-[#ffffff14]'>
            <div className="relative">
                <Select onValueChange={handleSelectArtist} value={selectedArtist || undefined}>
                    <SelectTrigger className="w-[200px] text-bold">
                        <SelectValue placeholder="Select Artist" />
                    </SelectTrigger>
                    <SelectContent>
                        {artists.map((artist) => (
                            <div key={artist.id} className='flex items-center justify-center'>
                                <Image className="mr-0 h-4 w-4 ml-2 rounded-full" src={artist.image} alt="" width={25} height={25} />
                                <SelectItem key={artist.id} value={artist.id}>
                                    {artist.name}
                                </SelectItem>
                            </div>

                        ))}
                        <SelectItem value="add-new" className="mt-2 text-bold border-1 pt-2">
                            <span className="flex items-center text-purple-500">
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Artist
                            </span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-6 justify-end w-full">
                <div>
                    <Link className={buttonVariants({ variant: "secondary" })} href={"/upload"}> <FileUp className="mr-2 h-4 w-4" />New Release</Link>
                </div>
              
                {session?.user ? (
                    <>
                        <div className="flex flex-col">
                            <span className="text-xs leading-3 font-medium">{session.user.name}</span>
                            <span className="text-[12px] text-gray-500 font-medium text-right">Role: {role}</span>
                        </div>
                        {session.user.name && session.user.image && (
                            <Image className="rounded-full"
                                src={session.user.image}
                                alt={session.user.name}
                                width={28}
                                height={28}
                            />
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex flex-col">
                            <span className="text-xs leading-3 font-medium">User</span>
                            <span className="text-[10px] text-gray-500 text-right">Role</span>
                        </div>
                        <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full" />
                    </>
                )}
            </div>
        </div>
    )
}

export default Navbar