"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, Upload } from "lucide-react"
import { uploadImageToS3 } from "@/actions/artist-profile-edit"

interface UploadButtonProps {
  onUploadComplete: (url: string) => void
  onUploadError: (error: string) => void
  onUploadStart: () => void
  onUploadProgress?: (progress: number) => void
  accept?: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  children?: React.ReactNode
}

export function UploadButton({
  onUploadComplete,
  onUploadError,
  onUploadStart,
  onUploadProgress,
  accept = "image/*",
  className = "",
  variant = "outline",
  size = "sm",
  disabled = false,
  children,
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const simulateProgress = () => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15
      if (currentProgress > 95) {
        currentProgress = 95 // Cap at 95% until actual completion
        clearInterval(interval)
      }
      setProgress(currentProgress)
      onUploadProgress?.(currentProgress)
    }, 300)

    return () => clearInterval(interval)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      setProgress(0)
      onUploadStart()

      // Start simulating progress
      const stopProgress = simulateProgress()

      // Create form data
      const formData = new FormData()
      formData.append("file", file)

      // Upload using server action
      const result = await uploadImageToS3(formData)

      // Stop progress simulation
      stopProgress()

      if (result.success) {
        setProgress(100)
        onUploadProgress?.(100)
        onUploadComplete(result.url)
      } else {
        throw new Error(result.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      onUploadError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setIsUploading(false)

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading || disabled}
      />

      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isUploading || disabled}
        className={className}
      >
        {isUploading ? (
          <>
            <Loader2 size={14} className="mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          children || (
            <>
              <Upload size={14} className="mr-2" />
              Upload
            </>
          )
        )}
      </Button>

      {isUploading && (
        <div className="w-full">
          <Progress value={progress} className="h-1" />
          <p className="mt-1 text-xs text-muted-foreground text-right">{Math.round(progress)}%</p>
        </div>
      )}
    </div>
  )
}

