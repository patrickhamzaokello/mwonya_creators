"use client"

import { useState } from "react"
import type { ProfileArtist } from "@/types/artist"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { updateArtistProfile } from "@/actions/getArtists"
import { Card } from "../ui/card"

type EditableFields = Pick<
  ProfileArtist,
  | "name"
  | "email"
  | "phone"
  | "bio"
  | "genre"
  | "RecordLable"
  | "facebookurl"
  | "twitterurl"
  | "instagramurl"
  | "youtubeurl"
  | "isIndependent"
  | "available"
>

export function ProfileEdit({
  data,
  onSave,
  onCancel,
}: { data: ProfileArtist; onSave: (data: Partial<ProfileArtist>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<EditableFields>({
    name: data.name,
    email: data.email,
    phone: data.phone,
    bio: data.bio,
    genre: data.genre,
    RecordLable: data.RecordLable,
    facebookurl: data.facebookurl,
    twitterurl: data.twitterurl,
    instagramurl: data.instagramurl,
    youtubeurl: data.youtubeurl,
    isIndependent: data.isIndependent,
    available: data.available,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: keyof EditableFields) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const result = await updateArtistProfile(formData)
    setIsLoading(false)
    if (result.success) {
      onSave(formData)
    } else {
      alert(result.message)
    }
  }

  return (
    <div className="container mx-auto px-10 py-8 max-w-5xl bg-background">
       <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="bio">Biography</Label>
          <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="genre">Genre</Label>
          <Input id="genre" name="genre" value={formData.genre} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="RecordLable">Record Label</Label>
          <Input id="RecordLable" name="RecordLable" value={formData.RecordLable} onChange={handleChange} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isIndependent"
            checked={formData.isIndependent}
            onCheckedChange={() => handleSwitchChange("isIndependent")}
          />
          <Label htmlFor="isIndependent">Independent Artist</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="available" checked={formData.available} onCheckedChange={() => handleSwitchChange("available")} />
          <Label htmlFor="available">Available for Booking</Label>
        </div>
        <div>
          <Label htmlFor="facebookurl">Facebook URL</Label>
          <Input id="facebookurl" name="facebookurl" value={formData.facebookurl} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="twitterurl">Twitter URL</Label>
          <Input id="twitterurl" name="twitterurl" value={formData.twitterurl} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="instagramurl">Instagram URL</Label>
          <Input id="instagramurl" name="instagramurl" value={formData.instagramurl} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="youtubeurl">YouTube URL</Label>
          <Input id="youtubeurl" name="youtubeurl" value={formData.youtubeurl} onChange={handleChange} />
        </div>
        <div className="flex space-x-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

