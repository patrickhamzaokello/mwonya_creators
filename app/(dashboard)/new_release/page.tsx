"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Music, Podcast, X, Plus, Upload, ArrowLeft } from 'lucide-react'

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { retrieveAllGenres } from '@/actions/getGenres'
import { useArtist } from "@/contexts/ArtistContext";
import { createNewRelease } from '@/actions/createTrack'
import { useRouter } from 'next/navigation'
import Link from "next/link"

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
    aesCode: z.enum(["single", "ep", "album", "mixtape", "episode", "live"], {
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
    const [artworkPreview, setArtworkPreview] = useState("/album_album_placeholder.svg?height=300&width=300")
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
                router.push(`/mwonya_release/${result.releaseID}`);
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Create New Release</h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    {selectedArtist ? `For ${selectedArtist.name}` : "No artist selected"}
                                </p>
                            </div>
                        </div>
                        <Link href="/mwonya_release">
                            <Button variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                                Add Tracks to Existing Release
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-800">
                            <CardContent className="p-8">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        {/* Basic Information */}
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Basic Information</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <FormField
                                                        control={form.control}
                                                        name="title"
                                                        render={({ field }) => (
                                                            <FormItem className="md:col-span-2">
                                                                <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Release Title</FormLabel>
                                                                <FormControl>
                                                                    <Input 
                                                                        placeholder="Enter your release title" 
                                                                        className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                                                                        {...field} 
                                                                    />
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
                                                                <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Content Type</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400">
                                                                            <SelectValue placeholder="Select type" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                                                        <SelectItem value="music" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">
                                                                            <div className="flex items-center">
                                                                                <Music className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                                                Music
                                                                            </div>
                                                                        </SelectItem>
                                                                        <SelectItem value="podcast" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">
                                                                            <div className="flex items-center">
                                                                                <Podcast className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
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
                                                                <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Genre</FormLabel>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400">
                                                                            <SelectValue placeholder="Select genre" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                                                        {genres.map((genre) => (
                                                                            <SelectItem key={genre.id} value={genre.id} className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">
                                                                                {genre.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="aesCode"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Format</FormLabel>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400">
                                                                            <SelectValue placeholder="Select format" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                                                        <SelectItem value="single" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">Single</SelectItem>
                                                                        <SelectItem value="ep" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">EP</SelectItem>
                                                                        <SelectItem value="album" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">Album</SelectItem>
                                                                        <SelectItem value="mixtape" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">Mixtape</SelectItem>
                                                                        <SelectItem value="episode" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">Episode</SelectItem>
                                                                        <SelectItem value="live" className="text-gray-900 dark:text-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700">Live</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <FormField
                                                        control={form.control}
                                                        name="releaseDate"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Release Date</FormLabel>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <FormControl>
                                                                            <Button
                                                                                variant={"outline"}
                                                                                className={cn(
                                                                                    "w-full justify-start text-left font-normal border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400",
                                                                                    !field.value && "text-gray-500 dark:text-gray-400"
                                                                                )}
                                                                            >
                                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                                {field.value ? (
                                                                                    format(field.value, "PPP")
                                                                                ) : (
                                                                                    <span>Select date</span>
                                                                                )}
                                                                            </Button>
                                                                        </FormControl>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" align="start">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={field.value}
                                                                            onSelect={field.onChange}
                                                                            disabled={(date) =>
                                                                                date < new Date(new Date().setHours(0, 0, 0, 0)) || date < new Date("1900-01-01")
                                                                            }
                                                                            initialFocus
                                                                            className="dark:text-gray-100"
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Description</h3>
                                            <FormField
                                                control={form.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder="Describe your release..."
                                                                className="min-h-[120px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Artwork Upload */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Artwork</h3>
                                            <FormField
                                                control={form.control}
                                                name="artwork"
                                                render={({ field: { value, onChange, ...field } }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                                                                <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                                                                <div className="space-y-2">
                                                                    <p className="text-gray-600 dark:text-gray-400">Upload your release artwork</p>
                                                                    <Input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        className="hidden"
                                                                        id="artwork-upload"
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
                                                                    <label 
                                                                        htmlFor="artwork-upload"
                                                                        className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 cursor-pointer transition-colors"
                                                                    >
                                                                        Choose File
                                                                    </label>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                                                </div>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Tags */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Tags</h3>
                                            <FormField
                                                control={form.control}
                                                name="tags"
                                                render={() => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="space-y-3">
                                                                {tags.length > 0 && (
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {tags.map((tag) => (
                                                                            <span
                                                                                key={tag}
                                                                                className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full"
                                                                            >
                                                                                {tag}
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeTag(tag)}
                                                                                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                                                                >
                                                                                    <X size={14} />
                                                                                </button>
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <Input
                                                                    placeholder="Add tags (press Enter or comma to add)"
                                                                    value={tagInput}
                                                                    onChange={(e) => setTagInput(e.target.value)}
                                                                    onKeyDown={handleTagInput}
                                                                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription className="text-gray-600 dark:text-gray-400">
                                                            Add relevant tags to help users discover your release
                                                        </FormDescription>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Options */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Options</h3>
                                            <FormField
                                                control={form.control}
                                                name="exclusive"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                    className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-600"
                                                                />
                                                            </FormControl>
                                                            <div>
                                                                <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Exclusive Release</FormLabel>
                                                                <FormDescription className="text-gray-600 dark:text-gray-400">
                                                                    Make this release available only to premium users
                                                                </FormDescription>
                                                            </div>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Submit Buttons */}
                                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <Button type="button" variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                                                Cancel
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                disabled={status === 'uploading'}
                                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                                            >
                                                {status === 'uploading' ? 'Creating Release...' : 'Create Release'}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-white dark:bg-gray-900 shadow-sm border-gray-200 dark:border-gray-800">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">Release Preview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Artwork */}
                                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                    <img
                                        src={artworkPreview || "/album_placeholder.svg"}
                                        alt="Release artwork"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Release Info */}
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                                            {watchedValues.title || "Untitled Release"}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {selectedArtist?.name || "Unknown Artist"}
                                        </p>
                                    </div>

                                    {/* Metadata */}
                                    <div className="space-y-2 text-sm">
                                        {watchedValues.releaseType && (
                                            <div className="flex items-center text-gray-600">
                                                {watchedValues.releaseType === "music" ? 
                                                    <Music className="h-4 w-4 mr-2" /> : 
                                                    <Podcast className="h-4 w-4 mr-2" />
                                                }
                                                {watchedValues.releaseType === "music" ? "Music" : "Podcast"}
                                            </div>
                                        )}
                                        
                                        {watchedValues.aesCode && (
                                            <p className="text-gray-600">
                                                Format: {watchedValues.aesCode.charAt(0).toUpperCase() + watchedValues.aesCode.slice(1)}
                                            </p>
                                        )}

                                        {watchedValues.releaseDate && (
                                            <p className="text-gray-600">
                                                Release: {format(watchedValues.releaseDate, "PP")}
                                            </p>
                                        )}

                                        {watchedValues.exclusive && (
                                            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                                Exclusive
                                            </span>
                                        )}
                                    </div>

                                    {/* Description */}
                                    {watchedValues.description && (
                                        <div>
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {watchedValues.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {tags.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-gray-600 text-sm font-medium">Tags</p>
                                            <div className="flex flex-wrap gap-1">
                                                {tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
