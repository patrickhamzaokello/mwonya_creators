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
import { useRef, useState, useTransition } from 'react'
import { registerArtist } from '@/actions/create_profile';
import { useRouter } from 'next/navigation'
import Image from 'next/image';

const ArtistPage = () => {

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
      isIndependent: true,
      labelId: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
        setValue("profileImage", file); // manually set the image in the form state
      };

      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };



  const onSubmitForm: SubmitHandler<z.infer<typeof CreateArtistSchema>> = async (values) => {
    // call the server action     
    startTransition(() => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("biography", values.biography || "");
      formData.append("labelId", values.labelId || "");
      formData.append("isIndependent", values.isIndependent ? "true" : "false");
      formData.append("profileImage", values.profileImage as File);
      formData.append("coverImage", values.coverImage as File);

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
          router.push("/sent_artist-email")
        }
      })
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-12 md:py-16 lg:py-20 border-[1px] border-[#ffffff14] bg-[#111111] rounded-md">
      <div className="px-4 sm:px-6 md:px-8">
          <div className="md:col-span-3  p-8">
            <h2 className="text-3xl font-bold text-secondary mb-2">Add New Artist</h2>
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
                                };
                                reader.readAsDataURL(file);
                                onChange(file);
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
                                };
                                reader.readAsDataURL(file);
                                onChange(file);
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
                  name="isIndependent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border-2 border-gray-300 p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-semibold">Independent Artist</FormLabel>
                        <FormDescription>
                          Is this artist independent or signed to a label?
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

                {!form.watch("isIndependent") && (
                  <FormField
                    control={form.control}
                    name="labelId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">Record Label</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter label ID" className="rounded-md border-2 border-gray-300 px-4 py-3 text-base focus:border-primary" {...field} />
                        </FormControl>
                        <FormDescription>Enter the ID of the artist's record label.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full py-3 text-lg font-semibold rounded-md bg-[#6519fb] text-white shadow-md hover:bg-[#6519fb]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Add Artist"}
                </Button>
              </form>
            </Form>
          </div>

          <div className="md:col-span-2 rounded-lg ">
            <div className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-48 bg-zinc-900">
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
                    <div className="h-6 bg-zinc-900 rounded w-3/4"></div>
                    <div className="h-4 bg-zinc-900 rounded w-1/2"></div>
                  </div>
                  <div className="h-20 bg-zinc-900 rounded"></div>
                </div>
              </CardContent>
            </div>
          </div>
      </div>
    </div>
  )
}

export default ArtistPage