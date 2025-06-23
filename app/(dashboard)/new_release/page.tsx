"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Calendar, Music, Podcast, X, Upload, Check, ArrowLeft } from 'lucide-react'

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
    artwork: z.instanceof(File, { message: "Artwork is required" }).refine(file => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"];
        return allowedTypes.includes(file.type);
    }, {
        message: "You must select a valid image file (jpeg, png, gif, bmp, webp).",
    }),
    tags: z.array(z.string()).optional(),
})

export default function NewReleasePage() {
    const [artworkPreview, setArtworkPreview] = useState("/api/placeholder/300/300")
    const [tags, setTags] = useState<string[]>([])
    const [genres, setGenres] = useState<{ id: string; name: string }[]>([
        { id: "1", name: "Pop" },
        { id: "2", name: "Rock" },
        { id: "3", name: "Hip Hop" },
        { id: "4", name: "Electronic" },
        { id: "5", name: "Jazz" },
        { id: "6", name: "Classical" },
    ])
    const [tagInput, setTagInput] = useState("")
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
    const [selectedArtist] = useState({ id: "1", name: "John Doe" }) // Mock data
    const [showCalendar, setShowCalendar] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            artistID: selectedArtist?.id || "",
            artistName: selectedArtist?.name || "",
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
        
        // Simulate API call
        setTimeout(() => {
            setStatus('success')
            console.log('Form submitted:', values)
        }, 2000)
    }

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
        const filledFields = fields.filter((field) => {
            const value = watchedValues[field]
            return value !== undefined && value !== null && value !== ""
        })
        return (filledFields.length / fields.length) * 100
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("artwork", file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setArtworkPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const CustomCalendar = ({ value, onChange }: { value?: Date, onChange: (date: Date) => void }) => {
        const today = new Date()
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
        
        const days = []
        
        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-8"></div>)
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day)
            const isSelected = value && format(value, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
            const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
            
            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => onChange(date)}
                    className={`h-8 w-8 text-sm rounded transition-colors ${
                        isSelected 
                            ? 'bg-blue-500 text-white' 
                            : isToday 
                                ? 'bg-gray-700 text-white' 
                                : 'hover:bg-gray-700 text-gray-300'
                    }`}
                >
                    {day}
                </button>
            )
        }
        
        return (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 absolute top-full left-0 z-50 mt-1">
                <div className="text-center mb-4 font-medium text-gray-200">
                    {format(new Date(currentYear, currentMonth), 'MMMM yyyy')}
                </div>
                <div className="grid grid-cols-7 gap-1 text-xs text-gray-400 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <button className="flex items-center text-gray-400 hover:text-gray-200 mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2">
                                Create New Release
                            </h1>
                            <p className="text-gray-400">
                                for <span className="text-blue-400 font-medium">{selectedArtist?.name}</span>
                            </p>
                        </div>
                        <button className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg transition-colors">
                            Add Tracks Instead
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="space-y-6" onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit)(e); }}>
                            {/* Basic Info */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Release Title
                                        </label>
                                        <input
                                            {...form.register("title")}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="Enter release title"
                                        />
                                        {form.formState.errors.title && (
                                            <p className="text-red-400 text-sm mt-1">{form.formState.errors.title.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Release Type
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                                watchedValues.releaseType === 'music' 
                                                    ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                                                    : 'border-gray-600 hover:border-gray-500 text-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    {...form.register("releaseType")}
                                                    value="music"
                                                    className="sr-only"
                                                />
                                                <Music className="w-4 h-4 mr-2" />
                                                Music
                                            </label>
                                            <label className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                                watchedValues.releaseType === 'podcast' 
                                                    ? 'border-blue-500 bg-blue-500/10 text-blue-400' 
                                                    : 'border-gray-600 hover:border-gray-500 text-gray-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    {...form.register("releaseType")}
                                                    value="podcast"
                                                    className="sr-only"
                                                />
                                                <Podcast className="w-4 h-4 mr-2" />
                                                Podcast
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Genre
                                        </label>
                                        <select
                                            {...form.register("genre")}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        >
                                            <option value="">Select genre</option>
                                            {genres.map((genre) => (
                                                <option key={genre.id} value={genre.id}>
                                                    {genre.name}
                                                </option>
                                            ))}
                                        </select>
                                        {form.formState.errors.genre && (
                                            <p className="text-red-400 text-sm mt-1">{form.formState.errors.genre.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Release Format
                                        </label>
                                        <select
                                            {...form.register("aesCode")}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        >
                                            <option value="">Select format</option>
                                            <option value="single">Single</option>
                                            <option value="ep">EP</option>
                                            <option value="album">Album</option>
                                            <option value="mixtape">Mixtape</option>
                                            <option value="episode">Episode</option>
                                            <option value="live">Live</option>
                                        </select>
                                        {form.formState.errors.aesCode && (
                                            <p className="text-red-400 text-sm mt-1">{form.formState.errors.aesCode.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Release Date
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowCalendar(!showCalendar)}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-left text-white focus:outline-none focus:border-blue-500 transition-colors flex items-center justify-between"
                                    >
                                        {watchedValues.releaseDate ? format(watchedValues.releaseDate, "PPP") : "Select release date"}
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                    </button>
                                    {showCalendar && (
                                        <CustomCalendar
                                            value={watchedValues.releaseDate}
                                            onChange={(date) => {
                                                form.setValue("releaseDate", date)
                                                setShowCalendar(false)
                                            }}
                                        />
                                    )}
                                    {form.formState.errors.releaseDate && (
                                        <p className="text-red-400 text-sm mt-1">{form.formState.errors.releaseDate.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
                                <textarea
                                    {...form.register("description")}
                                    rows={4}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    placeholder="Describe your release..."
                                />
                                {form.formState.errors.description && (
                                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.description.message}</p>
                                )}
                            </div>

                            {/* Artwork Upload */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-white mb-4">Artwork</h2>
                                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="artwork-upload"
                                    />
                                    <label htmlFor="artwork-upload" className="cursor-pointer">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-300 mb-1">Click to upload artwork</p>
                                        <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
                                    </label>
                                </div>
                                {form.formState.errors.artwork && (
                                    <p className="text-red-400 text-sm mt-1">{form.formState.errors.artwork.message}</p>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-white mb-4">Tags</h2>
                                <div className="space-y-3">
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm flex items-center"
                                                >
                                                    {tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="ml-2 text-blue-300 hover:text-white"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <input
                                        type="text"
                                        placeholder="Add tags (press Enter or comma)"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagInput}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Options */}
                            <div className="bg-gray-800 rounded-lg p-6">
                                <h2 className="text-lg font-semibold text-white mb-4">Options</h2>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...form.register("exclusive")}
                                        className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="text-gray-300 font-medium">Exclusive Release</span>
                                        <p className="text-gray-500 text-sm">Only available to premium users</p>
                                    </div>
                                </label>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-between pt-4">
                                <button
                                    type="button"
                                    className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={status === 'uploading'}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                                >
                                    {status === 'uploading' ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Uploading...
                                        </>
                                    ) : status === 'success' ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Created!
                                        </>
                                    ) : (
                                        'Create Release'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Preview */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
                            <div className="space-y-4">
                                <div className="aspect-square rounded-lg overflow-hidden bg-gray-700">
                                    <img
                                        src={artworkPreview}
                                        alt="Release Artwork"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">
                                        {watchedValues.title || "Untitled Release"}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {watchedValues.releaseType === "music" ? "Music" : "Podcast"}
                                        {watchedValues.aesCode && ` • ${watchedValues.aesCode.charAt(0).toUpperCase() + watchedValues.aesCode.slice(1)}`}
                                    </p>
                                </div>
                                {watchedValues.description && (
                                    <p className="text-sm text-gray-300 line-clamp-3">
                                        {watchedValues.description}
                                    </p>
                                )}
                                {watchedValues.releaseDate && (
                                    <p className="text-sm text-gray-400">
                                        {format(watchedValues.releaseDate, "PPP")}
                                    </p>
                                )}
                                {watchedValues.exclusive && (
                                    <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm">
                                        Exclusive
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Progress</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Form Completion</span>
                                    <span className="text-gray-300">{Math.round(calculateProgress())}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${calculateProgress()}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}