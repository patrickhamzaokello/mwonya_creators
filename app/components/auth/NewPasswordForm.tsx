"use client"

import * as z from "zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams, useRouter } from "next/navigation"
import { Eye, EyeOff, Check, X, Lock, AlertCircle } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

import { CardWrapper } from "@/components/auth/CardWrapper"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { newPassword } from "@/actions/new-password" // Import the server action

// This should match the schema in your server action
const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const PasswordForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [resetSuccess, setResetSuccess] = useState(false)

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0

    let strength = 0

    if (password.length >= 8) strength += 20
    if (/[A-Z]/.test(password)) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[0-9]/.test(password)) strength += 20
    if (/[^A-Za-z0-9]/.test(password)) strength += 20

    return strength
  }

  // Password requirements
  const passwordRequirements = [
    { id: "length", label: "At least 8 characters", regex: /.{8,}/ },
    { id: "uppercase", label: "At least one uppercase letter", regex: /[A-Z]/ },
    { id: "lowercase", label: "At least one lowercase letter", regex: /[a-z]/ },
    { id: "number", label: "At least one number", regex: /[0-9]/ },
    { id: "special", label: "At least one special character", regex: /[^A-Za-z0-9]/ },
  ]

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    if (!token) {
      toast.error("Missing reset token. Please use the link from your email.")
      return
    }

    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          if (data?.error) {
            toast.error(data.error)
          }
          if (data?.success) {
            setResetSuccess(true)
            toast.success(data.success)
            form.reset()
            router.push("/auth/login")
          }
        })
        .catch((error) => {
          toast.error("An unexpected error occurred")
          console.error(error)
        })
    })
  }

  // Watch password to calculate strength
  const watchedPassword = form.watch("password")

  // Update strength when password changes
  useState(() => {
    setPasswordStrength(calculatePasswordStrength(watchedPassword))
  })

  // Get strength color
  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-destructive"
    if (passwordStrength < 80) return "bg-amber-500"
    return "bg-emerald-500"
  }

  // Get strength label
  const getStrengthLabel = () => {
    if (passwordStrength < 40) return "Weak"
    if (passwordStrength < 80) return "Medium"
    return "Strong"
  }

  if (resetSuccess) {
    return (
      <CardWrapper headerTitle="Password Reset Successful" backButtonHref="/auth/login" backButtonLabel="Back to login">
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="rounded-full bg-emerald-100 p-3">
            <Check className="h-10 w-10 text-emerald-600" />
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">Password successfully reset!</h3>
            <p className="text-sm text-muted-foreground">
              Your password has been updated. You can now log in with your new password.
            </p>
          </div>

          <Button onClick={() => router.push("/auth/login")} className="w-full mt-4">
            <div className="px-8 py-2 w-full rounded-[5px] relative group transition duration-200 text-base100 bg-primary text-lg">
              Go to Login
            </div>
          </Button>
        </div>
      </CardWrapper>
    )
  }

  return (
    <CardWrapper headerTitle="Create New Password" backButtonHref="/auth/login" backButtonLabel="Back to login">
      <Toaster />

      <div className="mb-4 text-sm text-muted-foreground">
        Please create a strong password for your account. Your password should include a mix of letters, numbers, and
        symbols.
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        {...field}
                        placeholder="••••••••"
                        disabled={isPending}
                        type={showPassword ? "text" : "password"}
                        className="border-baseContent/20 text-baseContent pl-10 pr-10"
                        onChange={(e) => {
                          field.onChange(e)
                          setPasswordStrength(calculatePasswordStrength(e.target.value))
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />

                  {/* Password strength meter */}
                  {watchedPassword && (
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span>Password strength:</span>
                        <span
                          className={
                            passwordStrength >= 80
                              ? "text-emerald-500"
                              : passwordStrength >= 40
                                ? "text-amber-500"
                                : "text-destructive"
                          }
                        >
                          {getStrengthLabel()}
                        </span>
                      </div>
                      <Progress value={passwordStrength} className="h-1.5" indicatorClassName={getStrengthColor()} />
                    </div>
                  )}

                  {/* Password requirements */}
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted-foreground">Password requirements:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
                      {passwordRequirements.map((req) => (
                        <li key={req.id} className="flex items-center gap-1.5">
                          {watchedPassword && req.regex.test(watchedPassword) ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          <span
                            className={
                              watchedPassword && req.regex.test(watchedPassword)
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {req.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        {...field}
                        placeholder="••••••••"
                        disabled={isPending}
                        type={showConfirmPassword ? "text" : "password"}
                        className="border-baseContent/20 text-baseContent pl-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isPending} type="submit" className="p-[3px] bg-transparent relative font-semibold w-full">
            <div className="px-8 py-2 w-full rounded-[5px] relative group transition duration-200 text-base100 bg-primary text-lg flex items-center justify-center">
              {isPending ? "Resetting..." : "Reset Password"}
            </div>
          </Button>

          {!token && (
            <div className="text-sm text-destructive flex items-center gap-2 mt-2">
              <AlertCircle className="h-4 w-4" />
              <span>Invalid or missing reset token. Please use the link from your email.</span>
            </div>
          )}
        </form>
      </Form>
    </CardWrapper>
  )
}

export const NewPasswordForm = () => {
  return <PasswordForm />
}

