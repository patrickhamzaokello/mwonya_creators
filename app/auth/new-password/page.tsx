import { NewPasswordForm } from "@/components/auth/NewPasswordForm"
import { CardWrapper } from "@/components/auth/CardWrapper"
import { Suspense } from "react"

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewPasswordForm />
    </Suspense>
  )
}

function LoadingFallback() {
  return (
    <CardWrapper headerTitle="Checking Reset Status" backButtonLabel="Back to login" backButtonHref="/auth/login">
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
      </div>
    </CardWrapper>
  )
}

