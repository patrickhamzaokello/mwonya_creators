"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Facebook, Instagram, Twitter, Youtube, AlertCircle, Edit, Check, X, Download } from "lucide-react"
import { ImageUploadArea } from "@/components/artistSettings/image-upload-area"
import {
  getArtistProfile,
  updateArtistProfile,
  deleteArtistAccount,
  type ArtistData,
} from "@/actions/artist-profile-edit"

interface ArtistProfileEditorProps {
  artistId: string
}

export default function ArtistProfileEditorWithActions({ artistId }: ArtistProfileEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [artistData, setArtistData] = useState<ArtistData | null>(null)
  const [originalData, setOriginalData] = useState<ArtistData | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Load artist data
  useEffect(() => {
    async function loadArtistData() {
      try {
        setLoading(true)
        const result = await getArtistProfile(artistId)

        if (result.success && result.data) {
          setArtistData(result.data)
          setOriginalData(result.data)
        } else {
          toast({
            title: "Error loading profile",
            description: result.error || "Could not load artist profile",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading artist profile:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred while loading the profile",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadArtistData()
  }, [artistId])

  // Handle input changes
  const handleInputChange = (name: string, value: string | number | boolean) => {
    if (!artistData) return

    setArtistData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [name]: value,
      }
    })
    setHasChanges(true)
  }

  // Handle profile photo upload
  const handleProfilePhotoUpload = (url: string) => {
    if (!artistData) return

    setArtistData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        profilephoto: url,
      }
    })
    setHasChanges(true)

    toast({
      title: "Profile photo uploaded",
      description: "Your profile photo has been uploaded. Save changes to update your profile.",
    })
  }

  // Handle cover image upload
  const handleCoverImageUpload = (url: string) => {
    if (!artistData) return

    setArtistData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        cover_image: url,
      }
    })
    setHasChanges(true)

    toast({
      title: "Cover image uploaded",
      description: "Your cover image has been uploaded. Save changes to update your profile.",
    })
  }

  // Handle upload errors
  const handleUploadError = (error: string) => {
    toast({
      title: "Upload failed",
      description: error,
      variant: "destructive",
    })
  }

  // Save all changes
  const saveAllChanges = async () => {
    if (!artistData) return

    try {
      setIsSaving(true)

      const result = await updateArtistProfile(artistData)

      if (result.success) {
        setOriginalData(artistData)
        setHasChanges(false)
        setEditMode(false)

        toast({
          title: "Profile saved",
          description: "All changes have been saved successfully.",
        })
      } else {
        throw new Error(result.error || "Failed to save profile")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Cancel changes
  const cancelChanges = () => {
    setArtistData(originalData)
    setHasChanges(false)
    setEditMode(false)
  }

  // Delete account
  const handleDeleteAccount = async () => {
    if (!artistData) return

    try {
      setIsDeleting(true)

      // Verify email
      if (deleteEmail !== artistData.email) {
        toast({
          title: "Email verification failed",
          description: "The email you entered doesn't match your account email.",
          variant: "destructive",
        })
        return
      }

      const result = await deleteArtistAccount(artistData.id, deleteEmail)

      if (result.success) {
        toast({
          title: "Account deleted",
          description: "Your account has been successfully deleted.",
          variant: "destructive",
        })
        setShowDeleteDialog(false)

        // Redirect to home or login page
        router.push("/")
      } else {
        throw new Error(result.error || "Failed to delete account")
      }
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Deletion failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Download data
  const downloadData = () => {
    if (!artistData) return

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(artistData, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "artist-profile-data.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  // If still loading, show a loading state
  if (loading || !artistData) {
    return (
      <div className="container max-w-4xl py-10">
        <Card className="border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl">Artist Profile</CardTitle>
            <CardDescription>Loading profile information...</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl bg-background">
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-2xl">Artist Profile</CardTitle>
            <CardDescription>Update your profile information and manage your account</CardDescription>
          </div>
          <div className="flex gap-2">
            {!editMode ? (
              <Button variant="outline" onClick={() => setEditMode(true)} className="gap-2">
                <Edit size={16} />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={cancelChanges} className="gap-2">
                  <X size={16} />
                  Cancel
                </Button>
                <Button onClick={saveAllChanges} disabled={!hasChanges || isSaving} className="gap-2">
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-background"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Images Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Profile Images</h3>
            <Separator />

            <div className="grid gap-8 md:grid-cols-2">
              {/* Profile Photo */}
              <div className="space-y-4">
                <Label htmlFor="profilephoto">Profile Photo</Label>
                <ImageUploadArea
                  currentImageUrl={artistData.profilephoto}
                  onUploadComplete={handleProfilePhotoUpload}
                  onUploadError={handleUploadError}
                  aspectRatio="square"
                  isRounded={true}
                  maxWidth="200px"
                  disabled={!editMode}
                />
                {editMode && (
                  <p className="text-xs text-muted-foreground">Click or drag and drop to change your profile photo</p>
                )}
              </div>

              {/* Cover Image */}
              <div className="space-y-4">
                <Label htmlFor="cover_image">Cover Image</Label>
                <ImageUploadArea
                  currentImageUrl={artistData.cover_image}
                  onUploadComplete={handleCoverImageUpload}
                  onUploadError={handleUploadError}
                  aspectRatio="video"
                  disabled={!editMode}
                />
                {editMode && (
                  <p className="text-xs text-muted-foreground">Click or drag and drop to change your cover image</p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                {editMode ? (
                  <Input
                    id="name"
                    value={artistData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                ) : (
                  <div className="rounded-md border border-transparent bg-muted px-3 py-2">{artistData.name}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {editMode ? (
                  <Input
                    id="email"
                    type="email"
                    value={artistData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  <div className="rounded-md border border-transparent bg-muted px-3 py-2">{artistData.email}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                {editMode ? (
                  <Input
                    id="phone"
                    value={artistData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                ) : (
                  <div className="rounded-md border border-transparent bg-muted px-3 py-2">{artistData.phone}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                {editMode ? (
                  <Input
                    id="genre"
                    value={artistData.genre}
                    onChange={(e) => handleInputChange("genre", e.target.value)}
                  />
                ) : (
                  <div className="rounded-md border border-transparent bg-muted px-3 py-2">{artistData.genre}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              {editMode ? (
                <Textarea
                  id="bio"
                  value={artistData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="min-h-[120px]"
                />
              ) : (
                <div className="rounded-md border border-transparent bg-muted p-3 min-h-[120px]">{artistData.bio}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              {editMode ? (
                <Input id="tags" value={artistData.tag} onChange={(e) => handleInputChange("tag", e.target.value)} />
              ) : (
                <div className="rounded-md border border-transparent bg-muted px-3 py-2">
                  {artistData.tag.split(",").map((tag, index) => (
                    <span key={index} className="mr-2 inline-block rounded-full bg-primary/10 px-2 py-1 text-xs">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Career Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Career Details</h3>
            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isIndependent">Independent Artist</Label>
                <p className="text-sm text-muted-foreground">Are you an independent artist?</p>
              </div>
              {editMode ? (
                <Switch
                  id="isIndependent"
                  checked={artistData.isIndependent}
                  onCheckedChange={(checked) => handleInputChange("isIndependent", checked)}
                />
              ) : (
                <div className="text-sm font-medium">{artistData.isIndependent ? "Yes" : "No"}</div>
              )}
            </div>

            {!artistData.isIndependent && (
              <div className="space-y-2">
                <Label htmlFor="RecordLable">Record Label</Label>
                {editMode ? (
                  <Input
                    id="RecordLable"
                    value={artistData.RecordLable}
                    onChange={(e) => handleInputChange("RecordLable", e.target.value)}
                  />
                ) : (
                  <div className="rounded-md border border-transparent bg-muted px-3 py-2">
                    {artistData.RecordLable}
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="circle_cost">Circle Cost</Label>
                {editMode ? (
                  <Input
                    id="circle_cost"
                    type="number"
                    value={artistData.circle_cost}
                    onChange={(e) => handleInputChange("circle_cost", Number.parseInt(e.target.value))}
                  />
                ) : (
                  <div className="rounded-md border border-transparent bg-muted px-3 py-2">
                    {artistData.circle_cost}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="circle_cost_maximum">Maximum Circle Cost</Label>
                {editMode ? (
                  <Input
                    id="circle_cost_maximum"
                    type="number"
                    value={artistData.circle_cost_maximum}
                    onChange={(e) => handleInputChange("circle_cost_maximum", Number.parseInt(e.target.value))}
                  />
                ) : (
                  <div className="rounded-md border border-transparent bg-muted px-3 py-2">
                    {artistData.circle_cost_maximum}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="circle_duration">Circle Duration (days)</Label>
                {editMode ? (
                  <Input
                    id="circle_duration"
                    type="number"
                    value={artistData.circle_duration}
                    onChange={(e) => handleInputChange("circle_duration", Number.parseInt(e.target.value))}
                  />
                ) : (
                  <div className="rounded-md border border-transparent bg-muted px-3 py-2">
                    {artistData.circle_duration}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Social Media</h3>
            <Separator />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="facebookurl" className="flex items-center gap-2">
                  <Facebook size={16} /> Facebook
                </Label>
                {editMode ? (
                  <Input
                    id="facebookurl"
                    value={artistData.facebookurl}
                    onChange={(e) => handleInputChange("facebookurl", e.target.value)}
                  />
                ) : (
                  <div className="rounded-md border border-transparent bg-muted px-3 py-2">
                    {artistData.facebookurl}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitterurl" className="flex items-center gap-2">
                  <Twitter size={16} /> Twitter
                </Label>
                {editMode ? (
                  <Input
                    id="twitterurl"
                    value={artistData.twitterurl}
                    onChange={(e) => handleInputChange("twitterurl", e.target.value)}
                  />
                ) : (
                  <div className="rounded-md border border-transparent bg-muted px-3 py-2">{artistData.twitterurl}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramurl" className="flex items-center gap-2">
                  <Instagram size={16} /> Instagram
                </Label>
                {editMode ? (
                  <Input
                    id="instagramurl"
                    value={artistData.instagramurl}
                    onChange={(e) => handleInputChange("instagramurl", e.target.value)}
                  />
                ) : (
                  <div className="rounded-md border border-transparent bg-muted px-3 py-2">
                    {artistData.instagramurl}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeurl" className="flex items-center gap-2">
                  <Youtube size={16} /> YouTube
                </Label>
                {editMode ? (
                  <Input
                    id="youtubeurl"
                    value={artistData.youtubeurl}
                    onChange={(e) => handleInputChange("youtubeurl", e.target.value)}
                  />
                ) : (
                  <div className="rounded-md border border-transparent bg-muted px-3 py-2">{artistData.youtubeurl}</div>
                )}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
            <Separator className="bg-destructive/20" />

            <div className="rounded-md border border-destructive/20 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-base font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="outline" onClick={downloadData} className="gap-2">
                    <Download size={16} />
                    Download Data
                  </Button>
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog for Account Deletion */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle size={18} />
              Delete Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-4">
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers.
              </p>
              <p className="font-medium">Please type your email address to confirm:</p>
              <Input
                className="mt-2"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                placeholder={artistData.email}
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-background"></div>
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

