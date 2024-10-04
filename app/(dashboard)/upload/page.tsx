"use client"
import Image from "next/image"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import AudioWaveformPlayer from "@/components/AudioWaveformPlayer";



import { getSignedURL, createMediaDescription } from "./actions";

const UploadPage = () => {

    const [content, setContent] = useState("")
    const [file, setFile] = useState<File | undefined>(undefined)

    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined)

    const [statusMessage, setStatusMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const buttonDisabled = content.length < 1 || loading

    const computeSHA256 = async (file: File) => {
        const arrayBuffer = await file.arrayBuffer()
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
        return hashHex
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setStatusMessage("Creating")
        setLoading(true)


        try {
            if (file) {
                setStatusMessage("Uploading file")
                const checksum = await computeSHA256(file)
                const signedURLResult = await getSignedURL(file.type, file.size, checksum)

                if (signedURLResult.failure !== undefined) {
                    setStatusMessage("Failed")
                    throw new Error(signedURLResult.failure)
                }

                const { url, mediaId } = signedURLResult.success


                await fetch(url, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type,
                    },
                })

                // create album
                await createMediaDescription({ content, mediaId })
            }
        } catch (error) {
            setStatusMessage("Failed")
        } finally {
            setLoading(false)
        }

        setStatusMessage("Created")
        setLoading(false)
    }


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        setFile(file)

        if (fileUrl) {
            URL.revokeObjectURL(fileUrl)
        }

        if (file) {
            const url = URL.createObjectURL(file)
            setFileUrl(url)
        } else {
            setFileUrl(undefined)
        }
    }



    return (
        <>
            <div className=''>UploadPage</div>

            <form className="border border-neutral-500 rounded-lg px-6 py-4" onSubmit={handleSubmit}>

                {statusMessage && (
                    <p className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 mb-4 rounded relative">
                        {statusMessage}
                    </p>
                )}

                <label className="w-full">
                    <input className="bg-transparent flex-1 border-none outline-none"
                        type="text"
                        placeholder="Post a thing..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </label>

                {fileUrl && file && (
                    <div className="flex flex-col gap-4 items-center">
                        {file.type.startsWith("image/") ? (
                            <div className="rounded-lg overflow-hidden w-32 h-32 relative">
                                <img className="object-cover" src={fileUrl} alt={file.name} />
                            </div>
                        ) : file.type.startsWith("audio/") ? (
                            <div className="rounded-lg overflow-hidden w-32 h-32 relative">
                                <AudioWaveformPlayer fileUrl={fileUrl} />
                                <audio className="object-cover" src={fileUrl} controls />
                            </div>

                        ) : file.type.startsWith("video/") ? (
                            <div className="rounded-lg overflow-hidden w-32 h-32 relative">
                                <video className="object-cover" src={fileUrl} autoPlay muted loop />
                            </div>
                        ) : (
                            <div className="rounded-lg overflow-hidden w-32 h-32 relative">
                                <audio className="object-cover" src={fileUrl} controls />
                            </div>
                        )}

                        <button
                            type="button"
                            className="border rounded-xl px-4 py-2"
                            onClick={() => {
                                setFile(undefined);
                                setFileUrl(undefined);
                            }}
                        >
                            Remove
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    className="bg-transparent flex-1 border-none outline-none"
                    name="media"
                    accept="image/jpeg, image/png, image/webp, image/gif, video/mp4,video/webm, audio/mp3, audio/wav, audio/m4a"
                    onChange={handleChange}
                />


                <div className="flex justify-between items-center mt-5">
                    <div className="text-neutral-500">Characters: {content.length}</div>
                    <button
                        type="submit"
                        className={twMerge(
                            "border rounded-xl px-4 py-2 disabled", buttonDisabled && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={buttonDisabled}
                        aria-disabled={buttonDisabled}
                    >            Post
                    </button>
                </div>

            </form>


        </>
    )
}

export default UploadPage