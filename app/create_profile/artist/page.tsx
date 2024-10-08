
"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { CreateArtistSchema } from '@/lib/schemas';
import { useRef, useState, useEffect, useTransition } from 'react'
import { registerArtist } from '@/actions/create_profile';
import { useRouter } from 'next/navigation'
import Image from 'next/image';
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { retrieveAllGenres } from "@/actions/genre"

export default function Component() {
    const [isPending, startTransition] = useTransition()
    const [profileImagePreview, setProfileImagePreview] = useState("/placeholder.svg");
    const [coverImagePreview, setCoverImagePreview] = useState("/placeholder.svg");
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof CreateArtistSchema>>({
        resolver: zodResolver(CreateArtistSchema),
        defaultValues: {
            name: "",
            biography: "",
            genre: "",
            isIndependent: true,
            labelId: "",
            terms_conditions_pp: true,
            content_upload_policy: true
        },
    });

    const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        // Fetch genres from the database
        async function fetchGenres() {
            try {
                const result = await retrieveAllGenres();
                if (result.status === "success" && Array.isArray(result.fetchedgenres)) {
                    setGenres(result.fetchedgenres);
                } else {
                    toast({
                        title: "Error",
                        description: "Unable to fetch Genre Data",
                    });
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Unknown Error with Genre Fetching Occurred",
                });
            }
        }

        fetchGenres();
    }, []);

    const {
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = form;

   
    const onSubmitForm = (values: z.infer<typeof CreateArtistSchema>)  => {     
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("genre", values.genre);
            formData.append("biography", values.biography || "");
            formData.append("profileImage", values.profileImage as File);
            formData.append("coverImage", values.coverImage as File);
            formData.append("labelId",values.biography || "")
            formData.append("isIndependent", values.isIndependent ? "true" : "false");
            formData.append("terms_conditions_pp", values.terms_conditions_pp ? "true" : "false");
            formData.append("content_upload_policy", values.content_upload_policy ? "true" : "false");

            console.log({formData})

            registerArtist(formData).then((data: MessageType) => {
                if (data.status === "error") {
                    toast({
                        title: "Error",
                        description: data.message,
                    });
                }
                if (data.status === "success") {
                    toast({
                        title: "success",
                        description: data.message,
                    });
                    form.reset({
                        name: '', biography: '', profileImage: undefined, coverImage: undefined,
                        isIndependent: true,
                        labelId: ''
                    })
                    router.push("/studio")
                }
            })
    }
    return (
        <div className="container mx-auto max-w-7xl  bg-gray-50 border text-[#000]">
            <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3  p-8">
                    <h2 className="text-3xl font-bold text-primary mb-2">Add New Artist</h2>
                    <p className="mb-8 text-gray-600 font-regular">Enter the details of the new artist to save.</p>

                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold">Artist Name</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-md border-2 border-gray-300 px-4 py-3 text-base focus:border-primary" placeholder="Enter artist name" {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="genre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold">Artist Genre</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <FormControl>
                                                <SelectTrigger className="rounded-md border-2 border-gray-300 px-4 py-3 text-base focus:border-primary">
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
                                        <FormDescription>
                                            You can manage email addresses in your{" "}
                                            <Link href="/examples/forms">email settings</Link>.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="biography"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-semibold">Biography</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter artist biography"
                                                className="min-h-[120px] rounded-md border-2 border-gray-300 px-4 py-3 text-base focus:border-primary"
                                                {...field}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormDescription>Optional: Provide a brief biography of the artist.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="profileImage"
                                    render={({ field: { onChange, value, ...rest } }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-semibold">Profile Image</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/webp"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setProfileImagePreview(reader.result as string);
                                                                setValue("profileImage", file);
                                                            };
                                                            reader.readAsDataURL(file);
                                                            onChange(file);
                                                        }else {
                                                            setProfileImagePreview("");
                                                        }

                                                       
                                                    }}
                                                    className="cursor-pointer file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                                                    {...rest}
                                                />
                                            </FormControl>
                                            <FormDescription>Upload the artist's profile image (max 5MB, jpg/png/webp).</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="coverImage"
                                    render={({ field: { onChange, value, ...rest } }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-semibold">Cover Image</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/webp"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setCoverImagePreview(reader.result as string);
                                                                setValue("coverImage", file);
                                                            };
                                                            reader.readAsDataURL(file);
                                                            onChange(file);
                                                        } else {
                                                            setCoverImagePreview("");
                                                        }
                                                    }}
                                                    className="cursor-pointer  file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                                                    {...rest}
                                                />
                                            </FormControl>
                                            <FormDescription>Upload the artist's cover image (max 5MB, jpg/png/webp).</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="terms_conditions_pp"
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
                                                Agree to Terms and Conditions & Privacy Policy
                                            </FormLabel>
                                            <FormDescription>
                                                I agree to the platform's Terms and Conditions and Privacy Policy{" "}
                                                <Link href="/examples/forms">Read more</Link> link.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="content_upload_policy"
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
                                                Agree to Content Upload Policy
                                            </FormLabel>
                                            <FormDescription>
                                                I confirm that I hold all rights to the content I upload.{" "}
                                                <Link href="/examples/forms">Read more</Link> link.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full py-3 text-lg font-semibold rounded-md bg-primary text-white shadow-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Add Artist"}
                            </Button>
                        </form>
                    </Form>
                </div>

                <div className="md:col-span-2 rounded-lg ">
                    <div className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="relative h-48 bg-gray-200">
                                <Image
                                    src={coverImagePreview || "/api/placeholder/1200/400"}
                                    alt="Cover Picture"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className="relative -mt-16 ml-4">
                                <div className="relative h-32 w-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                                    <Image
                                        src={profileImagePreview || "/api/placeholder/128/128"}
                                        alt="Profile Picture"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 p-4 space-y-4">
                                <div className="space-y-2">
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                                <div className="h-20 bg-gray-200 rounded"></div>
                            </div>
                        </CardContent>
                    </div>
                </div>
            </div>
        </div>
    )
}

