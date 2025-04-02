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
                  <FormLabel>Enter Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        {...field}
                        placeholder="Email address"
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
         
          <Button 
            disabled={isPending} 
            className="w-full py-6 h-11 mt-2 text-md rounded-lg bg-purple-700 text-white hover:bg-primary font-bold transition-all duration-200"
            type="submit"
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </div>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
    )
}
