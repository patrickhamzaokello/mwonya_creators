"use client"

import { CardWrapper } from "@/components/auth/CardWrapper";
import { newVerification } from "@/actions/new-verification";
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";
import { CircularProgress } from "@mui/material"
import { Suspense } from 'react'
import { useRouter } from "next/navigation";

const VerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const router = useRouter(); // Add this line

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;

        if (!token) {
            setError("No token provided");
            return;
        }

        // Check if this token was already verified
        const verified = localStorage.getItem(`verified_${token}`);
        if (verified) {
            router.push('/auth/login');
            return;
        }

        newVerification(token)
            .then((data) => {

                if (data.success) {
                    setSuccess(data.success);

                    setTimeout(() => {
                        router.push('/auth/login');
                    }, 2000); // Wait 2 seconds so user can see success message
                } else {
                    setError(data.error)
                }
            })
            .catch(() => {
                setError("Something went wrong");
            })
    }, [token, success, error, router]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit])

    return (
        <CardWrapper
            headerTitle="Verify your email"
            backButtonLabel="Back to Login"
            backButtonHref="/auth/login"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && (
                    <CircularProgress />
                )}
                <FormSuccess message={success} />
                {!success && (
                    <FormError message={error} />
                )}
            </div>
        </CardWrapper>
    )
}

export const NewVerificationForm = () => {
    return (
        <Suspense>
            <VerificationForm />
        </Suspense>
    )
}