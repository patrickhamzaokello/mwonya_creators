import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Plus } from 'lucide-react'

interface ArtistSelectorProps {
    artists: TArtist[]
    selectedArtist: TArtist | null
    onSelectArtist: (artistId: string) => void
}

export function ArtistSelector({ artists, selectedArtist, onSelectArtist }: ArtistSelectorProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={false}
                    className="w-[200px] justify-between"
                >
                    {selectedArtist ? (
                        <>
                            <Avatar className="mr-2 h-5 w-5">
                                <AvatarImage src={selectedArtist.profileImage} alt={selectedArtist.name} />
                                <AvatarFallback>{selectedArtist.name[0]}</AvatarFallback>
                            </Avatar>
                            {selectedArtist.name}
                        </>
                    ) : (
                        "Select artist..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search artist..." />
                        <CommandEmpty>No artist found.</CommandEmpty>
                        <CommandGroup>
                            {artists.map((artist) => (
                                <CommandItem
                                    key={artist.id}
                                    onSelect={() => onSelectArtist(artist.id)}
                                    className="text-sm"
                                >
                                    <Avatar className="mr-2 h-5 w-5">
                                        <AvatarImage src={artist.profileImage} alt={artist.name} />
                                        <AvatarFallback>{artist.name[0]}</AvatarFallback>
                                    </Avatar>
                                    {artist.name}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            selectedArtist?.id === artist.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => onSelectArtist('add-new')}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Artist
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

