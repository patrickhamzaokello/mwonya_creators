"use client"

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { FileUp, ChevronDown, Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useArtist } from "@/contexts/ArtistContext"

import { useRouter } from 'next/navigation'
import { getArtistsForUser } from '@/actions/getArtists';
import { useToast } from "@/hooks/use-toast";

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
        <div className='flex items-center justify-between py-4 px-4 bg-[#fff] border-b-[1px] border-[#e7e7e7]'>
            <div className="relative block">
                <Select onValueChange={handleSelectArtist} value={selectedArtist?.id || undefined}>
                    <SelectTrigger className="w-[200px] text-bold">
                        <SelectValue placeholder="Select Artist" />
                    </SelectTrigger>
                    <SelectContent>
                        {artists.map((artist) => (
                            <div key={artist.id} className='flex items-center justify-center'>
                                <Image className="mr-0 h-4 w-4 ml-2 rounded-full" src={artist.profileImage} alt="" width={25} height={25} />
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
                            <span className="text-[12px]  font-medium text-right">{role}</span>
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
                            <span className="text-[10px] text-right">Role</span>
                        </div>
                        <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full" />
                    </>
                )}
            </div>
        </div>
    )
}

export default Navbar