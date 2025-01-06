'use client'
import * as z from 'zod'
import { CardWrapper } from '@/components/auth/CardWrapper'
import { useForm } from 'react-hook-form'
import { CardFooter } from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { RegisterSchema } from '@/lib/schemas'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { register } from '@/actions/register'

import { useState, useTransition } from 'react'
import toast, { Toaster } from 'react-hot-toast';

import { SocialProviders } from './SocialProviders'

import { useRouter } from 'next/navigation'

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition()
const router = useRouter()


  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      phone_number: '',
      password: '',
      name: ''
    }
  })

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(values).then((data) => {
        if (data?.error) {
          toast.error(data.error)
        }
        if (data?.success) {
          toast.success(data.success)
          form.reset({ email: '', phone_number: '', password: '', name: '' })
          router.push("/confirm-email")
        }
      })
    })
  }

  return (
    <CardWrapper
      headerTitle="Register"
      showSocial
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
    >
        <Toaster />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Kasfa"
                      {...field}
                      disabled={isPending}
                      type="name"
                      className=" border-baseContent/20 text-baseContent"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
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
                    <Input
                      placeholder="0787250196"
                      {...field}
                      disabled={isPending}
                      type="phone_number"
                      className=" border-baseContent/20 text-baseContent"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="kasfa@gmail.com"
                      disabled={isPending}
                      type="email"
                      className=" border-baseContent/20 text-baseContent"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      {...field}
                      disabled={isPending}
                      type="password"
                      className=" border-baseContent/20 text-baseContent"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isPending} className="px-8 py-2 font-semibold  rounded-[5px] relative w-full text-lg" type="submit">
          Register
      </Button>
        </form>
      </Form>
      <SocialProviders />
    </CardWrapper>
  )
}
