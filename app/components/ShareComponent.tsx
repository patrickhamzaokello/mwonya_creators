'use client'

import { useState } from 'react'
import { Copy, Facebook, Twitter, Linkedin, Mail, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { FaFacebook, FaTwitter } from 'react-icons/fa'

interface ShareComponentProps {
    title?: string
    mediaId: string
    mediaType: 'track' | 'collection' | 'artist'
    className?: string // Allow custom className
    style?: React.CSSProperties // Allow custom inline styles
    triggerClassName?: string // Allow custom styling for the trigger button
    triggerStyle?: React.CSSProperties // Allow custom inline styles for the trigger button
}

export function ShareComponent({
    title = 'Share link',
    mediaId,
    mediaType,
    className,
    style,
    triggerClassName,
    triggerStyle,
}: ShareComponentProps) {
    const [isCopied, setIsCopied] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Generate the shareable link based on media type and ID
    const generateShareLink = () => {
        const baseUrl = "https://open.mwonya.com/link/share"

        let media_url = ''

        switch (mediaType) {
            case 'track':
                media_url = `${baseUrl}/track/${mediaId}`
                break
            case 'collection':
                media_url = `${baseUrl}/collection/${mediaId}`
                break
            case 'artist':
                media_url = `${baseUrl}/artist/${mediaId}`
                break
            default:
                break
        }

        return media_url
    }

    const shareLink = generateShareLink()

    // Copy the link to the clipboard
    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink)
        setIsCopied(true)
        toast({
            title: 'Link copied!',
            description: 'The shareable link has been copied to your clipboard.',
        })
        setTimeout(() => setIsCopied(false), 2000) // Reset copied state after 2 seconds
    }

    // Share to social media platforms
    const shareToSocialMedia = (platform: string) => {
        let url = ''
        switch (platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`
                break
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}`
                break
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`
                break
            case 'email':
                url = `mailto:?subject=Check this out!&body=${encodeURIComponent(shareLink)}`
                break
            default:
                return
        }
        window.open(url, '_blank')
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>

                <Button
                    className={triggerClassName} // Apply custom className to the trigger button
                    style={triggerStyle} // Apply custom inline styles to the trigger button
                >
                    <Share2 className="h-4 w-4 mr-2" />
                    {title}
                </Button>
            </DialogTrigger>
            <DialogContent className={`sm:max-w-md ${className}`} style={style}>
                <DialogHeader>
                    <DialogTitle>Share {mediaType === 'track' ? 'Track' : 'Link'}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                    {/* Shareable Link */}
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={shareLink}
                            readOnly
                            className="flex-1 p-2 border rounded-lg text-sm bg-muted/50"
                        />
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCopyLink}
                            disabled={isCopied}
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            {isCopied ? 'Copied!' : 'Copy Link'}
                        </Button>
                    </div>

                    {/* Social Media Sharing Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => shareToSocialMedia('facebook')}
                            className="flex-1"
                        >
                            <FaFacebook className="h-4 w-4 mr-2" />
                            Facebook
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => shareToSocialMedia('twitter')}
                            className="flex-1"
                        >
                            <FaTwitter className="h-4 w-4 mr-2" />
                            Twitter
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => shareToSocialMedia('linkedin')}
                            className="flex-1"
                        >
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => shareToSocialMedia('email')}
                            className="flex-1"
                        >
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}