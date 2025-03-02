"use client"

import React, { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useForm } from "react-hook-form"
import type * as z from "zod"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

import { CreateArtistSchema } from "@/lib/schemas"
import { registerArtist } from "@/actions/create_profile"
import { retrieveAllGenres } from "@/actions/getGenres"
import { SocialMediaLinks } from "@/components/create_artist/social-media-links"
import type { Artist } from '@/types/artist'

interface AddArtistDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (artist: Omit<Artist, 'id'>) => void
}

export function AddArtistDialog({ isOpen, onClose, onSave }: AddArtistDialogProps) {
    const [isPending, startTransition] = useTransition()
    const [profileImagePreview, setProfileImagePreview] = useState("/album_placeholder.svg")
    const [coverImagePreview, setCoverImagePreview] = useState("/album_placeholder.svg")
    const [formProgress, setFormProgress] = useState(0)
    const [genres, setGenres] = useState<{ id: string; name: string }[]>([])
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof CreateArtistSchema>>({
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

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const result = await retrieveAllGenres("music")
                setGenres(result.fetchedgenres.genres)
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch genres",
                    variant: "destructive",
                })
            }
        }

        if (isOpen) {
            fetchGenres()
        }
    }, [isOpen, toast])

    useEffect(() => {
        const subscription = form.watch((value) => {
            const totalFields = Object.keys(form.getValues()).length
            const filledFields = Object.values(form.getValues()).filter(Boolean).length
            setFormProgress((filledFields / totalFields) * 100)
        })
        return () => subscription.unsubscribe()
    }, [form])

    const handleSubmit = async (values: z.infer<typeof CreateArtistSchema>) => {
        startTransition(async () => {
            const formData = new FormData()

            Object.entries(values).forEach(([key, value]) => {
                if (key === "socialLinks") {
                    Object.entries(value as Record<string, string>).forEach(([socialKey, socialValue]) => {
                        formData.append(`socialLinks.${socialKey}`, socialValue)
                    })
                } else if (value instanceof File) {
                    formData.append(key, value)
                } else {
                    formData.append(key, String(value))
                }
            })

            try {
                const response = await registerArtist(formData)

                if (response.status === "success") {
                    toast({
                        title: "Success",
                        description: response.message,
                    })
                    form.reset()
                    router.push("/artist")
                } else {
                    toast({
                        title: "Error",
                        description: response.message,
                        variant: "destructive",
                    })
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to create artist profile",
                    variant: "destructive",
                })
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Your Artist Profile</DialogTitle>
                    <p className="text-muted-foreground">
                        Start building your creative journey by creating a profile. This is where all your music, albums, and
                        updates will live.
                    </p>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
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



                            {/* Genre Selection */}
                            <FormField
                                control={form.control}
                                name="genre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Genre</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={isPending}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your main genre" />
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


                            {/* Preview Card */}
                            <Card>
                                <CardContent className="p-0">
                                    <div className="relative h-48 bg-muted">
                                        <Image
                                            src={coverImagePreview || "/album_placeholder.svg"}
                                            alt="Cover Picture"
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                    <div className="relative -mt-16 ml-4">
                                        <div className="relative h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                                            <Image
                                                src={profileImagePreview || "/album_placeholder.svg"}
                                                alt="Profile Picture"
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Progress */}
                            <div className="space-y-2">
                                <Progress value={formProgress} />
                                <p className="text-sm text-muted-foreground">
                                    Profile completion: {Math.round(formProgress)}%
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending}
                            >
                                {isPending ? "Creating Profile..." : "Create Profile"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}