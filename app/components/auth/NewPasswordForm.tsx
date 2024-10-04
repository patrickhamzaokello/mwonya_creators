'use client';
import * as z from "zod";
import { CardWrapper } from "@/components/auth/CardWrapper"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { NewPasswordSchema } from "@/lib/schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { useState, useTransition } from "react";
import { newPassword } from "@/actions/new-password";
import toast, { Toaster } from 'react-hot-toast';
import { Suspense } from 'react'

const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: "",
        }
    })
    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        startTransition(() => {
            newPassword(values, token)
                .then((data) => {
                    if (data?.error) {
                        toast.error(data.error)
                    }
                    if (data?.success) {
                        toast.success(data.success)
                        form.reset({ password: '' })
                    }
                })
        })
    }


    return (
        <CardWrapper
            headerTitle="Reset Password"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <Toaster />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="••••••••"
                                            disabled={isPending}
                                            type='password'
                                            className="border-baseContent/20 text-baseContent"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="p-[3px] bg-transparent relative font-semibold w-full">
                        <div className="px-8 py-2  w-full rounded-[5px] relative group transition duration-200 text-base100 bg-primary text-lg">
                            Reset
                        </div>
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}

export const PasswordForm = () => {
    return (
        <Suspense>
            <NewPasswordForm />
        </Suspense>
    )
}
