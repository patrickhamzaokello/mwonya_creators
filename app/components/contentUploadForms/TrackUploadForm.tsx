'use client'

import React, { useState, useRef, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { createTrack } from '@/actions/createTrack'
import { retrieveAllGenres } from '@/actions/getGenres'
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Play, Pause } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  artistId: z.string().min(1, "Artist ID is required"),
  artistName: z.string().min(1, "Artist name is required"),
  genre: z.string().min(1, "Genre is required"),
  exclusive: z.boolean(),
  explicit: z.boolean(),
  tag: z.string().min(1, "Tag is required"),
  producer: z.string().min(1, "Producer is required"),
  songwriter: z.string().min(1, "Songwriter is required"),
  labels: z.string().min(1, "Labels are required"),
  description: z.string().min(1, "Description is required"),
  releaseDate: z.date({
    required_error: "Release date is required",
  }),
  AESCode: z.string().min(1, "AES code is required"),
  trackFile: z.instanceof(File, { message: "Track file is required" }),
  coverArtFile: z.instanceof(File, { message: "Cover art is required" }),
})

interface TrackUploadFormProps {
  artistId: string;
  artistName: string;
}

export default function TrackUploadForm({ artistId, artistName }: TrackUploadFormProps) {
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([])
  const [isFormComplete, setIsFormComplete] = useState(false);
  const { toast } = useToast()
  const [trackPreview, setTrackPreview] = useState<string | null>(null)
  const [coverArtPreview, setCoverArtPreview] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artistId,
      artistName,
      genre: "",
      exclusive: false,
      explicit: false,
      tag: "single",
      producer: "",
      songwriter: "",
      labels: "",
      description: "",
      AESCode: "single",
    },
  })

  const trackType = form.watch('tag')

  useEffect(() => {
    form.reset((formValues) => ({
      ...formValues,
      artistId,
      artistName,
    }))
  }, [artistId, artistName, form])

  useEffect(() => {
    return () => {
      if (coverArtPreview) {
        URL.revokeObjectURL(coverArtPreview)
      }
    }
  }, [coverArtPreview])

  useEffect(() => {
    if (trackType) {
      fetchGenres(trackType)
    }
  }, [trackType])

  const fetchGenres = async (trackType: string) => {
    try {
      const result = await retrieveAllGenres(trackType)
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
    form.setValue('genre', '')
  }, [trackType, form])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

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
      const result = await createTrack(formData)

      if (result.success) {
        setStatus('success')
        form.reset()
        toast({
          title: "Success",
          description: "Track and cover art uploaded successfully!",
        })
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

  const nextStep = async () => {
    const isStepValid = await form.trigger(
      step === 1 ? ['title', 'tag', 'genre'] :
        step === 2 ? ['releaseDate', 'producer', 'songwriter', 'labels'] :
          ['description', 'AESCode', 'exclusive', 'explicit']
    );
    if (isStepValid) {
      if (step === 3) {
        setIsFormComplete(true);
      }
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(step - 1)

  return (
    <Form {...form}>
      <form onSubmit={(e) => {
        if (step !== 4) {
          e.preventDefault();
        } else {
          form.handleSubmit(onSubmit)(e);
        }
      }} className="space-y-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Upload New Track</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(step / 4) * 100} className="mb-4" />
            {step === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Track Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter track title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Track Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select track type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="episode">Episode</SelectItem>
                          <SelectItem value="mixtape">Mixtape</SelectItem>
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a genre" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
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
                              className={`w-[240px] pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
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
                              date < new Date() || date > new Date("2100-01-01")
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
                  name="producer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Producer</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="songwriter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Writer</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="labels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Labels</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Separate labels with commas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter track description"
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
                  name="AESCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>AES Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="exclusive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Exclusive</FormLabel>
                        <FormDescription>
                          Is this track exclusive?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="explicit"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Explicit</FormLabel>
                        <FormDescription>
                          Is this track explicit?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="trackFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Track File</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="audio/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 300 * 1024 * 1024) {
                                  toast({
                                    title: "Error",
                                    description: "Track file must be less than 300MB.",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                setTrackPreview(URL.createObjectURL(file)); // Create audio preview
                                field.onChange(file); // Update form state
                              }
                            }}
                            className="file-input" // Optional: Custom class for styling
                          />
                        </FormControl>
                        {trackPreview && (
                          <div className="mt-4 flex flex-col items-center">
                            <audio
                              controls
                              className="audio-player w-full max-w-md" // Optional: Custom styling for the player
                              key={trackPreview} // This forces the player to reload when the audio changes
                            >
                              <source src={trackPreview} type={field.value?.type || "audio/mpeg"} />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />



                  <FormField
                    control={form.control}
                    name="coverArtFile"
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <FormLabel>Cover Art</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                                setCoverArtPreview(URL.createObjectURL(file));
                              }
                            }}
                            {...rest}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload cover art for your track.
                        </FormDescription>
                        <FormMessage />
                        {coverArtPreview && (
                          <div className="mt-4">
                            <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={coverArtPreview}
                                alt="Cover Art Preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Supported formats:
                    <ul className="mt-2 text-sm list-disc list-inside">
                      <li>Audio: MP3, WAV, AAC (max 50MB)</li>
                      <li>Images: JPG, PNG (min 1400x1400px, max 3000x3000px)</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            {step < 4 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              step === 4 && isFormComplete && (
                <Button type="submit" disabled={status === 'uploading'}>
                  {status === 'uploading' ? 'Uploading...' : 'Upload Track'}
                </Button>
              )
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

