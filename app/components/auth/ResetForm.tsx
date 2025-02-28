'use client';
import * as z from "zod";
import { CardWrapper } from "@/components/auth/CardWrapper"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { useRouter } from "next/navigation"
import { ResetSchema } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { useState, useTransition } from "react";
import {reset} from "@/actions/reset";
import toast from "react-hot-toast";
import { Mail } from "lucide-react"

export const ResetForm = () => {
    const router = useRouter()
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        }
    })
    
    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        startTransition(() => {
           reset(values)
              .then((data) => {
                if (data?.error) {
                    toast.error(data.error)
                  }
                  if (data?.success) {
                    toast.success(data.success)
                    router.push(`/auth/reset-confirmation?email=${encodeURIComponent(values.email)}`)
                  }
             })
        })
    }


    return (
        <CardWrapper headerTitle="Password Reset" backButtonLabel="Back to login" backButtonHref="/auth/login">
      <div className="mb-4 text-sm text-muted-foreground text-center">
        Enter your email address and we'll send you a link to reset your password.
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        {...field}
                        placeholder="your.email@example.com"
                        disabled={isPending}
                        type="email"
                        className="border-baseContent/20 text-baseContent pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isPending} type="submit" className="p-[3px] bg-transparent relative font-semibold w-full">
            <div className="px-8 py-2 w-full rounded-[5px] relative group transition duration-200 text-base100 bg-primary text-lg flex items-center justify-center">
              {isPending ? "Sending..." : "Reset Password"}
            </div>
          </Button>
        </form>
      </Form>
    </CardWrapper>
    )
}
