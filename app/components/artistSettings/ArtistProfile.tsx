"use client"

import { useState } from "react"
import type { ProfileArtist } from "@/types/artist"
import { ProfileView } from "./profileView"
import { ProfileEdit } from "./profileEdit"

export function ArtistProfile({ initialData }: { initialData: ProfileArtist }) {
  const [isEditing, setIsEditing] = useState(false)
  const [artistData, setArtistData] = useState(initialData)

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => setIsEditing(false)
  const handleSave = (updatedData: Partial<ProfileArtist>) => {
    setArtistData((prevData) => ({ ...prevData, ...updatedData }))
    setIsEditing(false)
  }

  return (
    <div>
      {isEditing ? (
        <ProfileEdit data={artistData} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <ProfileView data={artistData} onEdit={handleEdit} />
      )}
    </div>
  )
}

