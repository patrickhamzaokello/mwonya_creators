import { ResetConfirmation } from "@/components/auth/reset-confirmation"
import { CardWrapper } from "@/components/auth/CardWrapper"
import { Suspense } from "react"

export default function ResetConfirmationPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetConfirmation />
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


