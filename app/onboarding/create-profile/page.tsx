"use client"

import { useState, useEffect, useTransition } from "react"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

import { CreateArtistSchema } from "@/lib/schemas"
import { registerArtist } from "@/actions/create_profile"
import { retrieveAllGenres } from "@/actions/getGenres"
import { FaInstagram, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa"

export default function CreateArtistPage() {
    const [isPending, startTransition] = useTransition()
    const [profileImagePreview, setProfileImagePreview] = useState("/album_placeholder.svg?height=300&width=300")
    const [coverImagePreview, setCoverImagePreview] = useState("/album_placeholder.svg?height=800&width=1200")
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
                tiktok: "",
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
                    description: "Failed to load genres",
                    variant: "destructive",
                })
            }
        }

        fetchGenres()
    }, [toast])

    useEffect(() => {
        const subscription = form.watch(() => {
            const totalFields = 10 // Count of important fields
            let filledFields = 0

            // Count filled fields
            if (form.getValues("name")) filledFields++
            if (form.getValues("email")) filledFields++
            if (form.getValues("phone_number")) filledFields++
            if (form.getValues("genre")) filledFields++
            if (form.getValues("biography")) filledFields++
            if (form.getValues("profileImage")) filledFields++
            if (form.getValues("coverImage")) filledFields++
            if (Object.values(form.getValues("socialLinks") || {}).some((v) => v)) filledFields++
            if (form.getValues("terms_conditions_pp")) filledFields++
            if (form.getValues("content_upload_policy")) filledFields++

            setFormProgress((filledFields / totalFields) * 100)
        })
        return () => subscription.unsubscribe()
    }, [form])

    const onSubmitForm: SubmitHandler<z.infer<typeof CreateArtistSchema>> = async (values) => {
        startTransition(() => {
            const formData = new FormData()
            Object.entries(values).forEach(([key, value]) => {
                if (key === "socialLinks") {
                    if (typeof value === "object" && value !== null) {
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
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Left side - Form */}
                <div className="w-full md:w-2/3">
                    <Card className="shadow-md border-t-4 border-t-primary">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                Create Your Artist Profile
                            </CardTitle>
                            <CardDescription>Start your musical journey by creating a professional profile</CardDescription>

                        </CardHeader>

                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
                                    {/* Basic Info Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Stage Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} disabled={isPending} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email Address</FormLabel>
                                                            <FormControl>
                                                                <Input type="email" {...field} disabled={isPending} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="phone_number"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phone Number</FormLabel>
                                                            <FormControl>
                                                   
                                                    <Input {...field} disabled={isPending} required={true}  />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="genre"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Genre</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
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
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="isIndependent"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>I am an independent artist</FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />

                                            {!form.watch("isIndependent") && (
                                                <FormField
                                                    control={form.control}
                                                    name="labelName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Record Label</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} disabled={isPending} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}

                                            <FormField
                                                control={form.control}
                                                name="biography"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Biography</FormLabel>
                                                        <FormControl>
                                                            <Textarea className="min-h-[120px] resize-none" {...field} disabled={isPending} />
                                                        </FormControl>
                                                        <FormDescription className="text-right">{(field.value?.length || 0)}/500</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Media Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Media</h3>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="profileImage"
                                                    render={({ field: { value, onChange, ...field } }) => (
                                                        <FormItem>
                                                            <FormLabel>Profile Image</FormLabel>

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

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="coverImage"
                                                    render={({ field: { value, onChange, ...field } }) => (
                                                        <FormItem>
                                                            <FormLabel>Cover Image</FormLabel>

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

                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Social Media Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="socialLinks.instagram"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Instagram</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} disabled={isPending} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="socialLinks.twitter"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Twitter</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} disabled={isPending} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="socialLinks.tiktok"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Tiktok</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} disabled={isPending} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="socialLinks.youtube"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>YouTube</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} disabled={isPending} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Legal Agreements Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Legal Agreements</h3>
                                        <div className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="terms_conditions_pp"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>
                                                                I agree to the{" "}
                                                                <Link href="/terms" className="text-primary hover:underline">
                                                                    Terms and Conditions
                                                                </Link>{" "}
                                                                and{" "}
                                                                <Link href="/privacy" className="text-primary hover:underline">
                                                                    Privacy Policy
                                                                </Link>
                                                            </FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="content_upload_policy"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>
                                                                I confirm that I hold all rights to the content I upload and agree to the{" "}
                                                                <Link href="/upload-policy" className="text-primary hover:underline">
                                                                    Content Upload Policy
                                                                </Link>
                                                            </FormLabel>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={isPending}>
                                        {isPending ? "Saving..." : "Create Artist Profile"}
                                    </Button>

                                    
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right side - Preview */}
                <div className="w-full md:w-1/3">
                    <div className="sticky top-4">
                        <Card className="shadow-lg border-0 overflow-hidden">
                            <CardHeader className="p-0">
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={coverImagePreview || "/placeholder.svg"}
                                        alt="Cover Picture"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="relative -mt-16 ml-4">
                                    <div className="relative h-32 w-32 rounded-full border-4 border-background bg-background shadow-lg overflow-hidden">
                                        <Image
                                            src={profileImagePreview || "/placeholder.svg"}
                                            alt="Profile Picture"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 space-y-4">
                                    <h2 className="text-2xl font-bold">{form.watch("name") || "Your Stage Name"}</h2>
                                    <p className="text-sm text-muted-foreground line-clamp-4">
                                        {form.watch("biography") || "Your artist biography will appear here."}
                                    </p>

                                    {form.watch("genre") && genres.length > 0 && (
                                        <div className="flex">
                                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                {genres.find((g) => g.id === form.watch("genre"))?.name || "Music Genre"}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {form.watch("socialLinks.instagram") && (
                                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                                <FaInstagram className="h-5 w-5" />
                                            </Link>
                                        )}
                                        {form.watch("socialLinks.twitter") && (
                                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                                <FaTwitter className="h-5 w-5" />
                                            </Link>
                                        )}
                                        {form.watch("socialLinks.tiktok") && (
                                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                                <FaTiktok className="h-5 w-5" />
                                            </Link>
                                        )}
                                        {form.watch("socialLinks.youtube") && (
                                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                                <FaYoutube className="h-5 w-5" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 border-t">
                                <div className="w-full">
                                    <h3 className="text-sm font-medium mb-2">Profile Completion</h3>
                                    <Progress value={formProgress} className="h-2" />
                                    <p className="text-xs text-muted-foreground mt-2 text-right">{Math.round(formProgress)}% complete</p>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

