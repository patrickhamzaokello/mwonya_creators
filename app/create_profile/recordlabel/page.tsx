
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
import { useToast } from "@/components/ui/use-toast";
import { CreateRecordLableSchema } from '@/lib/schemas';
import { useRef, useState, useTransition } from 'react'
import { registerArtist, registerNewRecordLable } from '@/actions/create_profile';
import { useRouter } from 'next/navigation'
import Image from 'next/image';

export default function CreateNewRecordLabel() {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof CreateRecordLableSchema>>({
    resolver: zodResolver(CreateRecordLableSchema),
    defaultValues: {
      name: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      address: "",
      city: "",
      state: "",
      country: "",
    },
  });



  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;
  const onSubmitForm: SubmitHandler<z.infer<typeof CreateRecordLableSchema>> = async (values) => {
    // call the server action     
    startTransition(() => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("contactEmail", values.contactEmail || "");
      formData.append("contactPhone", values.contactPhone || "");
      formData.append("website", values.website || "");
      formData.append("address", values.address || "");
      formData.append("city", values.city || "");
      formData.append("state", values.state || "");
      formData.append("country", values.country || "");

      registerNewRecordLable(formData).then((data) => {
        if (data?.error) {
          toast({
            title: "Warning",
            description: "error with the data",
          });
        }
        if (data?.success) {
          toast({
            title: data.success,
            description: "The artist has been successfully added to the database.",
          });
          form.reset({
            name: "",
            contactEmail: "",
            contactPhone: "",
            website: "",
            address: "",
            city: "",
            state: "",
            country: "",
          })
          // router.push("/sent_artist-email")
        }
      })
    })
  }
  return (
    <div className="bg-gray-50 border my-8">
      <div className="grid md:grid-cols-5 gap-8 bg-white">
        <div className="md:col-span-3  p-8">
          <h2 className="text-3xl font-bold text-primary mb-2">Add New Record Label</h2>
          <p className="mb-8 text-gray-600 font-regular">Enter the details of the new record label to add it to the database.</p>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter record label name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The official name of the record label.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="contact@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The primary contact email for the record label.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional: The contact phone number for the record label.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional: The official website of the record label.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Music Street" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional: The physical address of the record label.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Los Angeles" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="California" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="United States" {...field} />
                    </FormControl>
                    <FormDescription>
                      The country where the record label is based.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full py-3 text-lg font-semibold rounded-md bg-primary text-white shadow-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Create Record Lable"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="md:col-span-2 rounded-lg ">
          <div className="overflow-hidden">
            <CardContent className="p-0">

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

