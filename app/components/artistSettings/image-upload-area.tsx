"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { uploadImageToS3 } from "@/actions/artist-profile-edit"

interface ImageUploadAreaProps {
  currentImageUrl: string
  onUploadComplete: (url: string) => void
  onUploadError: (error: string) => void
  aspectRatio?: "square" | "video"
  className?: string
  isRounded?: boolean
  maxWidth?: string
  disabled?: boolean
}

export function ImageUploadArea({
  currentImageUrl,
  onUploadComplete,
  onUploadError,
  aspectRatio = "square",
  className = "",
  isRounded = false,
  maxWidth = "100%",
  disabled = false,
}: ImageUploadAreaProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aspectRatioClass = aspectRatio === "square" ? "aspect-square" : "aspect-video"
  const roundedClass = isRounded ? "rounded-full" : "rounded-md"

  const simulateProgress = () => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15
      if (currentProgress > 95) {
        currentProgress = 95 // Cap at 95% until actual completion
        clearInterval(interval)
      }
      setProgress(currentProgress)
    }, 300)

    return () => clearInterval(interval)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Create local preview immediately
      const localPreview = URL.createObjectURL(file)
      setPreviewUrl(localPreview)

      setIsUploading(true)
      setProgress(0)

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

        // Revoke the local preview URL to avoid memory leaks
        URL.revokeObjectURL(localPreview)

        // Set the preview to the AWS URL
        setPreviewUrl(result.url)

        // Notify parent component
        onUploadComplete(result.url)
      } else {
        // Revert to the original image on error
        setPreviewUrl(currentImageUrl)
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
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled || isUploading) return
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    if (disabled || isUploading) return
    e.preventDefault()
    e.stopPropagation()

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    try {
      // Create local preview immediately
      const localPreview = URL.createObjectURL(file)
      setPreviewUrl(localPreview)

      setIsUploading(true)
      setProgress(0)

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

        // Revoke the local preview URL to avoid memory leaks
        URL.revokeObjectURL(localPreview)

        // Set the preview to the AWS URL
        setPreviewUrl(result.url)

        // Notify parent component
        onUploadComplete(result.url)
      } else {
        // Revert to the original image on error
        setPreviewUrl(currentImageUrl)
        throw new Error(result.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      onUploadError(error instanceof Error ? error.message : "Unknown error occurred")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div
      className={`relative overflow-hidden border ${aspectRatioClass} ${roundedClass} ${className} ${!disabled && !isUploading ? "cursor-pointer" : ""}`}
      style={{ maxWidth }}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <Image src={previewUrl || "/placeholder.svg"} alt="Uploadable image" fill className="object-cover" />

      {isUploading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 p-4">
          <Loader2 size={24} className="animate-spin text-primary" />
          <div className="w-full max-w-[80%]">
            <Progress value={progress} className="h-2 w-full" />
            <p className="mt-1 text-center text-xs">{Math.round(progress)}%</p>
          </div>
        </div>
      )}

      {!disabled && !isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 transition-opacity hover:opacity-100">
          <Upload size={24} />
        </div>
      )}
    </div>
  )
}

