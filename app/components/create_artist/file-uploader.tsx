import type React from "react"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  accept: string
  maxSize: number
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export const FileUploader: React.FC<FileUploaderProps> = ({ accept, maxSize, onFileSelect, disabled }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, type) => ({ ...acc, [type.trim()]: [] }), {}),
    maxSize: maxSize,
    disabled: disabled,
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
        isDragActive ? "border-primary" : "border-muted-foreground"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">
        {isDragActive ? "Drop the file here" : "Drag & drop a file here, or click to select"}
      </p>
    </div>
  )
}


//how to use it
{/* <FormField
control={form.control}
name="coverImage"
render={({ field: { onChange, value, ...rest } }) => (
  <FormItem>
    <FormLabel className="text-lg font-semibold">Cover Image</FormLabel>
    <FormControl>
      <FileUploader
        accept="image/png, image/jpeg, image/webp"
        maxSize={5 * 1024 * 1024}
        onFileSelect={(file) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            setCoverImagePreview(reader.result as string)
            onChange(file)
          }
          reader.readAsDataURL(file)
        }}
        disabled={isPending}
      />
    </FormControl>
    <FormDescription>
      Upload a cover image for your profile (max 5MB, jpg/png/webp).
    </FormDescription>
    <FormMessage />
  </FormItem>
)}
/> */}
