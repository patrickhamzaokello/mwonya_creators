'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Upload, X } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { createTrackDetails, getTrackSignedURL } from '@/actions/aws/release_track_upload'
import { getAudioMetadata, generateContentId } from '@/utils/audioutils';
import { AudioMetadata } from '@/types/audioMetadata'
import { useToast } from "@/components/ui/use-toast"

interface UploadingFile {
    file: File
    progress: number
    status: 'Selected file' | 'uploading' | 'completed' | 'error'
    name: string
}

interface AddTrackDialogProps {
    onUploadSuccess: () => void
    artist_id: string;
    album_id: string;
    genre_id: number;
    album_tag: string;
    album_release_date: string; // ISO date string
    album_available: boolean;
}

const computeSHA256 = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
    return hashHex
}


export function AddTrackDialog({ onUploadSuccess, artist_id, album_id, genre_id, album_tag, album_release_date, album_available }: AddTrackDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [is_album_available, set_is_album_available] = useState(album_available)
    const { toast } = useToast()
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        const validFiles = files.filter(file => file.type.startsWith('audio/'))

        const newUploadingFiles: UploadingFile[] = validFiles.map(file => ({
            file,
            progress: 0,
            status: 'Selected file',
            name: file.name
        }))

        setUploadingFiles(prev => [...prev, ...newUploadingFiles])
    }

    useEffect(() => {
        const fetchContent = async () => {
            set_is_album_available(album_available)
        }
        fetchContent()
    }, [album_available])

    const removeFile = (index: number) => {
        setUploadingFiles(prev => prev.filter((_, i) => i !== index))
    }

    const uploadFile = async (file: UploadingFile, index: number) => {

        try {

            const checksum = await computeSHA256(file.file)
            const signedURLResult = await getTrackSignedURL(file.file.type, file.file.size, checksum, 'track', 'tracks/');


            if (signedURLResult.failure !== undefined) {
                toast({
                    title: "Error",
                    description: signedURLResult.message,
                    variant: "destructive",
                })
                throw new Error(signedURLResult.failure)
            }

            const { signedURL, upload_id } = signedURLResult.success

            const xhr = new XMLHttpRequest()

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const progress = (event.loaded / event.total) * 100
                    setUploadingFiles(prev => prev.map((f, i) =>
                        i === index ? { ...f, progress, status: 'uploading' } : f
                    ))
                }
            })

            await new Promise((resolve, reject) => {
                xhr.open('PUT', signedURL)

                xhr.onload = async () => {
                    if (xhr.status === 200) {

                        // upload completed successfully
                        setUploadingFiles(prev => prev.map((f, i) =>
                            i === index ? { ...f, progress: 100, status: 'completed' } : f
                        ))

                        // get metadata and save audio to database
                        let metadata: AudioMetadata;
                        try {
                            metadata = await getAudioMetadata(file.file)
                        } catch (error) {
                            console.error('Error getting metadata:', error)
                            metadata = {
                                title: file.file.name,
                                artist: '',
                                album: '',
                                genre: [],
                                duration: 0,
                                bitrate: 0,
                                sampleRate: 0,
                                lossless: false,
                                codec: '',
                                year: '',
                                track: { no: 0, of: 0 },
                                disk: { no: 0, of: 0 },
                                picture: [],
                                native: {},
                                quality: {},
                            };
                        }

                        const reference_id = await generateContentId('track');

                        try {
                            const createTrackResponse = await createTrackDetails({
                                reference_id,
                                title: metadata.title,
                                artist: artist_id,
                                album: album_id,
                                genre: genre_id,
                                upload_id,
                                duration: metadata.duration,
                                tag: album_tag,
                                metadata: JSON.stringify(metadata),
                                releasedate: album_release_date
                            });

                            if (!createTrackResponse.success) {
                                toast({
                                    title: "Success",
                                    description: "Failed to save track details",
                                    variant: "destructive",
                                })
                                throw new Error(createTrackResponse.failure)
                            }

                            const { track_reference_id, message } = createTrackResponse.success

                            toast({
                                title: "Success",
                                description: message,
                                variant: "default",
                            })


                        } catch (saveError) {
                            toast({
                                title: "Error",
                                description: "Failed to save track details",
                                variant: "destructive",
                            })
                            console.log(saveError);
                            setUploadingFiles(prev => prev.map((f, i) =>
                                i === index ? { ...f, status: 'error' } : f
                            ));
                        }

                        resolve(xhr.response)
                    } else {
                        reject(new Error('Upload failed'))
                    }
                }

                xhr.onerror = () => {
                    setUploadingFiles(prev => prev.map((f, i) =>
                        i === index ? { ...f, status: 'error' } : f
                    ))
                    reject(new Error('Upload failed'))
                }

                xhr.send(file.file)
            })

        } catch (error) {
            setUploadingFiles(prev => prev.map((f, i) =>
                i === index ? { ...f, status: 'error' } : f
            ))
        }
    }

    const handleUpload = async () => {
        if (uploadingFiles.length === 0) return

        setIsUploading(true)

        // Upload files sequentially
        for (let i = 0; i < uploadingFiles.length; i++) {
            if (uploadingFiles[i].status !== 'completed') {
                await uploadFile(uploadingFiles[i], i)
            }
        }

        setIsUploading(false)
        onUploadSuccess()

        // Clear completed uploads after a brief delay
        setTimeout(() => {
            setUploadingFiles([])
            setIsOpen(false)
        }, 1000)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {!is_album_available ? (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tracks
                    </Button>
                ) : null}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload Tracks</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="tracks">Select Audio Files</Label>
                        <div className="flex items-center justify-center w-full">
                            <label
                                htmlFor="tracks"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        Click to upload or drag and drop multiple audio files
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        MP3, WAV, or M4A (max. 300MB each)
                                    </p>
                                </div>
                                <Input
                                    id="tracks"
                                    type="file"
                                    className="hidden"
                                    accept="audio/*"
                                    multiple
                                    onChange={handleFileSelect}
                                />
                            </label>
                        </div>
                    </div>

                    {uploadingFiles.length > 0 && (
                        <div className="space-y-2">
                            <Label>Selected Files</Label>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {uploadingFiles.map((file, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm truncate">{file.name}</span>
                                            {file.status !== 'uploading' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFile(index)}
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <Progress value={file.progress} className="h-2" />
                                        <span className="text-xs text-muted-foreground">
                                            {file.status === 'Selected file' && 'Selected file'}
                                            {file.status === 'uploading' && `Uploading: ${Math.round(file.progress)}%`}
                                            {file.status === 'completed' && 'Upload complete'}
                                            {file.status === 'error' && 'Upload failed'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isUploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={uploadingFiles.length === 0 || isUploading}
                        >
                            {isUploading ? 'Uploading...' : 'Upload All'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
