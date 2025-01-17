"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Music, Podcast, X } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { retrieveAllGenres } from '@/actions/getGenres'
import { useArtist } from "@/contexts/ArtistContext";
import { createNewRelease } from '@/actions/createTrack'
import { useRouter } from 'next/navigation'


const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    artistID: z.string().min(1, "Artist ID is required"),
    artistName: z.string().min(1, "Artist name is required"),
    releaseType: z.enum(["music", "podcast"]),
    genre: z.string().min(1, {
        message: "Please select a genre.",
    }),
    releaseDate: z.date({
        required_error: "A release date is required.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    aesCode: z.enum(["single", "ep", "album", "mixtape"], {
        message: "You must select a valid release type",
    }),
    exclusive: z.boolean().default(false),
    artwork: z.instanceof(File).refine(file => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"];
        return allowedTypes.includes(file.type);
    }, {
        message: "You must select a valid image file (jpeg, png, gif, bmp, webp).",
    }),
    tags: z.array(z.string()).optional(),
})


export default function NewReleasePage() {
    const [artworkPreview, setArtworkPreview] = useState("/album_placeholder.svg?height=300&width=300")
    const [tags, setTags] = useState<string[]>([])
    const [genres, setGenres] = useState<{ id: string; name: string }[]>([])
    const [tagInput, setTagInput] = useState("")
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
    const [selectedArtist, setSelectedArtist] = useArtist();
    const [artistName, setArtistName] = useState<string | undefined>();
    const [artistID, setArtistID] = useState<string | undefined>();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            artistID,
            artistName,
            releaseType: "music",
            genre: "",
            description: "",
            aesCode: undefined,
            exclusive: false,
            tags: [],
        },
    })

    const { watch, setValue } = form
    const watchedValues = watch()

    async function onSubmit(values: z.infer<typeof formSchema>) {

        setStatus('uploading')

        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
            if (value instanceof File) {
                formData.append(key, value)
            } else if (value instanceof Date) {
                formData.append(key, value.toISOString())
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0')
            } else {
                formData.append(key, String(value))
            }
        })

        try {
            const result = await createNewRelease(formData)

            if (result.success) {
                setStatus('success')
                form.reset()
                toast({
                    title: "Success",
                    description: "Track and cover art uploaded successfully!",
                })

                // Route to release/releaseID
                router.push(`/releases/${result.releaseID}`);

            } else {
                throw new Error(result.error || "Unknown error occurred")
            }
        } catch (error) {
            setStatus('error')
            toast({
                title: "Error",
                description: "Failed to upload track and cover art. Please try again.",
                variant: "destructive",
            })
        }
    }

    useEffect(() => {
        if (!selectedArtist) {
            // Reset states when no artist is selected
            setArtistID(undefined);
            setArtistName(undefined);
            return;
        }

        setArtistID(selectedArtist.id);
        setArtistName(selectedArtist.name);
    }, [selectedArtist]);

    useEffect(() => {
        form.reset({
            ...form.getValues(),
            artistID: artistID || "",
            artistName: artistName || "",
        })
    }, [artistID, artistName, form])

    useEffect(() => {
        if (watchedValues.releaseType) {
            fetchGenres(watchedValues.releaseType)
        }
    }, [watchedValues.releaseType])

    const fetchGenres = async (releaseType: string) => {
        try {
            const result = await retrieveAllGenres(releaseType)
            if (result.status === 'success') {
                setGenres(result.fetchedgenres?.genres || [])
            } else {
                throw new Error('Failed to fetch genres')
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch genres. Please try again.",
                variant: "destructive",
            })
        }
    }

    useEffect(() => {
        setValue('genre', '');
    }, [watchedValues.releaseType, setValue]);

    const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            const newTag = tagInput.trim()
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag])
                form.setValue("tags", [...tags, newTag])
            }
            setTagInput("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        const updatedTags = tags.filter((tag) => tag !== tagToRemove)
        setTags(updatedTags)
        form.setValue("tags", updatedTags)
    }

    const calculateProgress = () => {
        const fields = Object.keys(formSchema.shape) as Array<keyof typeof watchedValues>
        const filledFields = fields.filter((field) => watchedValues[field])
        return (filledFields.length / fields.length) * 100
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Create a New Release </h1>
            <p className=" font-bold mb-6">Artist- {selectedArtist ? selectedArtist.name : "No artist selected"}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardContent className="p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter release title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="releaseType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Release Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select release type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="music">
                                                        <div className="flex items-center">
                                                            <Music className="mr-2 h-4 w-4" />
                                                            Music
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="podcast">
                                                        <div className="flex items-center">
                                                            <Podcast className="mr-2 h-4 w-4" />
                                                            Podcast
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="genre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Genre</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select genre" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>

                                                    {genres.map((genre) => (
                                                        <SelectItem key={genre.id} value={genre.id}>
                                                            {genre.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Select the genre that best fits your {watchedValues.releaseType === "music" ? "music" : "podcast"}.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {watchedValues.releaseType === "music" && (
                                    <FormField
                                        control={form.control}
                                        name="aesCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Release Format</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select release format" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="single">Single</SelectItem>
                                                        <SelectItem value="ep">EP</SelectItem>
                                                        <SelectItem value="album">Album</SelectItem>
                                                        <SelectItem value="mixtape">Mixtape</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Select the format of your music release.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <FormField
                                    control={form.control}
                                    name="releaseDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Release Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date < new Date(new Date().setHours(0, 0, 0, 0)) || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter release description"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="exclusive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Exclusive
                                                </FormLabel>
                                                <FormDescription>
                                                    Make this release available only to premium users.
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="artwork"
                                    render={({ field: { value, onChange, ...field } }) => (
                                        <FormItem>
                                            <FormLabel>Release Artwork</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            onChange(file)
                                                            const reader = new FileReader()
                                                            reader.onloadend = () => {
                                                                setArtworkPreview(reader.result as string)
                                                            }
                                                            reader.readAsDataURL(file)
                                                        }
                                                    }}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tags"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Tags</FormLabel>
                                            <FormControl>
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap gap-2">
                                                        {tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm flex items-center"
                                                            >
                                                                {tag}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeTag(tag)}
                                                                    className="ml-1 text-secondary-foreground hover:text-primary-foreground"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <Input
                                                        placeholder="Enter tags (press Enter or comma to add)"
                                                        value={tagInput}
                                                        onChange={(e) => setTagInput(e.target.value)}
                                                        onKeyDown={handleTagInput}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Add relevant tags to help users discover your release.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline">Cancel</Button>
                                    <Button type="submit" disabled={status === 'uploading'}>
                                        {status === 'uploading' ? 'Uploading...' : 'Create Release'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Release Preview</h2>
                            <div className="space-y-4">
                                <img
                                    src={artworkPreview || "/placeholder.svg"}
                                    alt="Release Artwork"
                                    className="w-full aspect-square object-cover rounded-md"
                                />
                                <div>
                                    <h3 className="font-semibold">{watchedValues.title || "Untitled Release"}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {watchedValues.releaseType === "music" ? "Music Release" : "Podcast Release"}
                                        {watchedValues.genre && ` • ${watchedValues.genre.charAt(0).toUpperCase() + watchedValues.genre.slice(1)}`}
                                    </p>
                                </div>
                                <p className="text-sm">
                                    {watchedValues.description || "No description provided."}
                                </p>
                                {watchedValues.releaseDate && (
                                    <p className="text-sm">
                                        Release Date: {format(watchedValues.releaseDate, "PPP")}
                                    </p>
                                )}
                                {watchedValues.releaseType === "music" && watchedValues.aesCode && (
                                    <p className="text-sm">
                                        Format: {watchedValues.aesCode.charAt(0).toUpperCase() + watchedValues.aesCode.slice(1)}
                                    </p>
                                )}
                                {watchedValues.exclusive && (
                                    <p className="text-sm font-semibold text-primary">Exclusive Release</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Form Progress</h2>
                            <Progress value={calculateProgress()} className="w-full" />
                            <p className="text-sm text-muted-foreground mt-2">
                                {Math.round(calculateProgress())}% complete
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

