"use client"

import React, { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import type * as z from "zod"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { CreateArtistSchema } from "@/lib/schemas"
import { registerArtist } from "@/actions/create_profile"
import { retrieveAllGenres } from "@/actions/getGenres"
import { FileUploader } from "@/components/create_artist/file-uploader"
import { SocialMediaLinks } from "@/components/create_artist/social-media-links"


export default function CreateArtistPage() {
  const [isPending, startTransition] = useTransition()
  const [profileImagePreview, setProfileImagePreview] = useState("/placeholder.svg")
  const [coverImagePreview, setCoverImagePreview] = useState("/placeholder.svg")
  const [formProgress, setFormProgress] = useState(0)
  const { toast } = useToast()
  const router = useRouter()


  const form = useForm<z.infer<typeof CreateArtistSchema>>({
    resolver: zodResolver(CreateArtistSchema),
    defaultValues: {
      name: "",
      biography: "",
      email: "",
      phone_number: "",
      genre: "",
      isIndependent: true,
      labelName: "",
      terms_conditions_pp: false,
      content_upload_policy: false,
      socialLinks: {
        instagram: "",
        twitter: "",
        facebook: "",
        youtube: "",
      },
    },
  })

  const [genres, setGenres] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    async function fetchGenres() {
      try {
        const result = await retrieveAllGenres("music")
        setGenres(result.fetchedgenres.genres)

      } catch (error) {
        toast({
          title: "Error",
          description: "Unknown Error with Genre Fetching Occurred",
        })
      }
    }

    fetchGenres()
  }, [toast])

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      const totalFields = Object.keys(form.getValues()).length
      const filledFields = Object.values(form.getValues()).filter(Boolean).length
      setFormProgress((filledFields / totalFields) * 100)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmitForm: SubmitHandler<z.infer<typeof CreateArtistSchema>> = async (values) => {
    startTransition(() => {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (key === "socialLinks") {
          if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([socialKey, socialValue]) => {
              formData.append(`socialLinks.${socialKey}`, socialValue as string)
            })
          }
        } else if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      })

      registerArtist(formData).then((data) => {
        if (data.status === "error") {
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive",
          })
        }
        if (data.status === "success") {
          toast({
            title: "Success",
            description: data.message,
          })
          form.reset()
          router.push("/studio")
        }
      })
    })
  }

  return (




    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>🎨 Create Your Artist Profile</CardTitle>
        <p className="text-muted-foreground">
          Start building your creative journey by creating a profile. This is where all your music, albums, and
          updates will live.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Stage Name</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-md border-2 border-input px-4 py-3 text-base focus:border-primary"
                      placeholder="DJ Blaze, Sarah Music, The Harmonizers"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the name that will appear on your profile and releases.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-md border-2 border-input px-4 py-3 text-base focus:border-primary"
                      placeholder="Email"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    This is required for account verification and communication.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Artist Phone number</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-md border-2 border-input px-4 py-3 text-base focus:border-primary"
                      placeholder="256787520"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Add your phone country code without  the (+) sign
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Genre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="rounded-md border-2 border-input px-4 py-3 text-base focus:border-primary">
                        <SelectValue placeholder="Select artist main genre" />
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
                  <FormDescription>Select up to 3 genres that best describe your music.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isIndependent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is Independent</FormLabel>
                    <FormDescription>
                      I confirm that I am an independent artist and not signed to any record label.

                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="labelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Record Label</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                    <FormControl>
                      <Input
                        className="rounded-md border-2 border-input px-4 py-3 text-base focus:border-primary"
                        placeholder="Label Name"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>

                  </Select>
                  <FormDescription>Record Label artist is signed under</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself and your music in a few words."
                      className="min-h-[120px] rounded-md border-2 border-input px-4 py-3 text-base focus:border-primary"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>This will appear on your profile page. Max 500 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


              <FormField
                control={form.control}
                name="profileImage"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Artist Profile Image</FormLabel>
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
                              setProfileImagePreview(reader.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Upload your profile picture (max 5MB, jpg/png/webp).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverImage"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Artist cover Image</FormLabel>
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
                              setCoverImagePreview(reader.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Upload your profile picture (max 5MB, jpg/png/webp).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <SocialMediaLinks control={form.control} disabled={isPending} />

            <FormField
              control={form.control}
              name="terms_conditions_pp"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Agree to Terms and Conditions & Privacy Policy</FormLabel>
                    <FormDescription>
                      I agree to the platform's{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content_upload_policy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Agree to Content Upload Policy</FormLabel>
                    <FormDescription>
                      I confirm that I hold all rights to the content I upload and agree to the{" "}
                      <Link href="/upload-policy" className="text-primary hover:underline">
                        Content Upload Policy
                      </Link>
                      .
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-4">

              <Card className="sticky top-4">
                <CardContent className="p-0">
                  <div className="relative h-48 bg-muted">
                    <Image
                      src={coverImagePreview || "/placeholder.svg"}
                      alt="Cover Picture"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="relative -mt-16 ml-4">
                    <div className="relative h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                      <Image
                        src={profileImagePreview || "/placeholder.svg"}
                        alt="Profile Picture"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-4 space-y-4">
                    <h2 className="text-2xl font-bold">{form.watch("name") || "Your Stage Name"}</h2>
                    <p className="text-muted-foreground">
                      {form.watch("biography") || "Your artist biography will appear here."}
                    </p>
                    <div className="flex space-x-2">
                      {Object.entries(form.watch("socialLinks") || {}).map(
                        ([platform, url]) =>
                          url && (
                            <Link
                              key={platform}
                              href={typeof url === "string" ? url : "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {platform}
                            </Link>
                          ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div>
                <h3 className="text-lg font-semibold mb-2">Profile Completion</h3>
                <Progress value={formProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">{Math.round(formProgress)}% complete</p>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold rounded-md bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                disabled={isPending}
              >
                {isPending ? "Creating Profile..." : "Create Profile 🎵"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>


  )
}

