"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { CalendarIcon, Upload, Music, ImageIcon, Tag, Users } from 'lucide-react'

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
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type FormData = {
  title: string
  type: string
  coverArt: FileList
  trackFile: FileList
  isExplicit: boolean
  isExclusive: boolean
  releaseDate: Date
  labels: string
  featuredArtists: string
}

export default function ArtistUploadForm() {
  const [date, setDate] = useState<Date>()

  const form = useForm<FormData>({
    defaultValues: {
      title: "",
      type: "",
      isExplicit: false,
      isExclusive: false,
      labels: "",
      featuredArtists: "",
    },
  })

  function onSubmit(data: FormData) {
    // Here you would typically send the data to your backend
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Upload Your Track</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Track Title</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Enter track title" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="podcast">Podcast</SelectItem>
                        <SelectItem value="mixtape">Mixtape</SelectItem>
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Release Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              field.value.toDateString()
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
                            date < new Date() || date < new Date("1900-01-01")
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
                name="coverArt"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Cover Art</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Upload your cover art (JPEG, PNG)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="trackFile"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Track File</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Music className="h-12 w-12 text-gray-400" />
                        </div>
                        <Input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Upload your track file (MP3, WAV)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-4 md:col-span-2">
                <FormField
                  control={form.control}
                  name="isExplicit"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Explicit Content</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isExclusive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Exclusive Content</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="labels"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Labels</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input placeholder="Enter labels (comma-separated)" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter labels separated by commas (e.g., Rock, Alternative, Indie)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featuredArtists"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Featured Artists</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 text-gray-400" />
                        <Textarea
                          placeholder="Enter featured artists (optional)"
                          className="resize-none pl-10 pt-2"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter featured artists, one per line (if any)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              <Upload className="mr-2 h-4 w-4" /> Upload Track
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

