"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Facebook, Instagram, Twitter, Youtube, Edit2, Save } from "lucide-react";
import { ArtistData, getArtistProfile } from "@/actions/artist-profile-edit";
import { toast } from "@/components/ui/use-toast";

interface ArtistProfileEditorProps {
    artistId: string;
}

export default function ProfileEditPage({ artistId }: ArtistProfileEditorProps) {
    const [loading, setLoading] = useState(true);
    const [data, setArtistData] = useState<ArtistData | null>(null);
    const [editSections, setEditSections] = useState({
        name: false,
        contact: false,
        artistInfo: false,
        financial: false,
        bio: false,
        profileImage: false,
        coverImage: false,
        socialMedia: false,
    });
    const [tempData, setTempData] = useState<ArtistData | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [currentSection, setCurrentSection] = useState("");

    useEffect(() => {
        async function loadArtistData() {
            try {
                setLoading(true);
                const result = await getArtistProfile(artistId);

                if (result.success && result.data) {
                    setArtistData(result.data);
                    setTempData(result.data);
                } else {
                    toast({
                        title: "Error loading profile",
                        description: result.error || "Could not load artist profile",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error("Error loading artist profile:", error);
                toast({
                    title: "Error",
                    description: "An unexpected error occurred while loading the profile",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        }

        loadArtistData();
    }, [artistId]);

    const toggleEdit = (section: string) => {
        setEditSections({
            ...editSections,
            [section]: !editSections[section as keyof typeof editSections],
        });
        setTempData(data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (tempData) {
            setTempData({
                ...tempData,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        if (tempData) {
            setTempData({
                ...tempData,
                [name]: value,
            });
        }
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        if (tempData) {
            setTempData({
                ...tempData,
                [name]: checked ? 1 : 0,
            });
        }
    };

    const openConfirmDialog = (section: string) => {
        setCurrentSection(section);
        setConfirmDialogOpen(true);
    };

    const saveChanges = () => {
        if (data && tempData) {
            setArtistData({
                ...data,
                ...Object.fromEntries(
                    Object.entries(tempData).filter(([key]) => {
                        switch (currentSection) {
                            case "name":
                                return key === "name";
                            case "contact":
                                return ["email", "phone"].includes(key);
                            case "artistInfo":
                                return ["RecordLable", "isIndependent", "tag", "genre", "genre_id"].includes(key);
                            case "financial":
                                return ["circle_cost", "circle_cost_maximum", "circle_duration"].includes(key);
                            case "bio":
                                return ["bio", "releaseDate"].includes(key);
                            case "profileImage":
                                return ["profilephoto", "profile_image_id"].includes(key);
                            case "coverImage":
                                return ["cover_image", "cover_image_id"].includes(key);
                            case "socialMedia":
                                return ["facebookurl", "twitterurl", "instagramurl", "youtubeurl"].includes(key);
                            default:
                                return false;
                        }
                    }),
                ),
            });
            setEditSections({
                ...editSections,
                [currentSection]: false,
            });
            setConfirmDialogOpen(false);
        }
    };

    const cancelEdit = (section: string) => {
        setEditSections({
            ...editSections,
            [section]: false,
        });
        setTempData(data);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data) {
        return <div>Error loading profile data.</div>;
    }

    return (
        <div className="container mx-auto py-6 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

            <div className="grid gap-6">
                {/* Name Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Name</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => toggleEdit("name")}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {editSections.name ? (
                            <div className="space-y-2">
                                <Label htmlFor="name">Artist Name</Label>
                                <Input id="name" name="name" value={tempData?.name || ""} onChange={handleChange} />
                            </div>
                        ) : (
                            <p className="text-lg">{data.name}</p>
                        )}
                    </CardContent>
                    {editSections.name && (
                        <CardFooter className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => cancelEdit("name")}>
                                Cancel
                            </Button>
                            <Button onClick={() => openConfirmDialog("name")}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                {/* Contact Info Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Contact Information</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => toggleEdit("contact")}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {editSections.contact ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" value={tempData?.email || ""} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={tempData?.phone || ""}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p>
                                    <strong>Email:</strong> {data.email}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {data.phone || "Not provided"}
                                </p>
                            </div>
                        )}
                    </CardContent>
                    {editSections.contact && (
                        <CardFooter className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => cancelEdit("contact")}>
                                Cancel
                            </Button>
                            <Button onClick={() => openConfirmDialog("contact")}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                {/* Artist Info Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Artist Information</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => toggleEdit("artistInfo")}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {editSections.artistInfo ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="RecordLable">Record Label</Label>
                                    <Input id="RecordLable" name="RecordLable" value={tempData?.RecordLable || ""} onChange={handleChange} />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isIndependent"
                                        checked={tempData?.isIndependent === 1}
                                        onCheckedChange={(checked) => handleSwitchChange("isIndependent", checked)}
                                    />
                                    <Label htmlFor="isIndependent">Independent Artist</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tag">Tag</Label>
                                    <Input id="tag" name="tag" value={tempData?.tag || ""} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="genre">Genre</Label>
                                    <Select value={tempData?.genre || ""} onValueChange={(value) => handleSelectChange("genre", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select genre" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Hiphop or Rap">Hiphop or Rap</SelectItem>
                                            <SelectItem value="R&B">R&B</SelectItem>
                                            <SelectItem value="Pop">Pop</SelectItem>
                                            <SelectItem value="Rock">Rock</SelectItem>
                                            <SelectItem value="Electronic">Electronic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p>
                                    <strong>Record Label:</strong> {data.RecordLable}
                                </p>
                                <p>
                                    <strong>Independent Artist:</strong> {data.isIndependent === 1 ? "Yes" : "No"}
                                </p>
                                <p>
                                    <strong>Tag:</strong> {data.tag}
                                </p>
                                <p>
                                    <strong>Genre:</strong> {data.genre}
                                </p>
                            </div>
                        )}
                    </CardContent>
                    {editSections.artistInfo && (
                        <CardFooter className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => cancelEdit("artistInfo")}>
                                Cancel
                            </Button>
                            <Button onClick={() => openConfirmDialog("artistInfo")}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                {/* Financial Info Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Financial Information</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => toggleEdit("financial")}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {editSections.financial ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="circle_cost">Circle Cost</Label>
                                    <Input
                                        id="circle_cost"
                                        name="circle_cost"
                                        type="number"
                                        step="0.01"
                                        value={tempData?.circle_cost || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="circle_cost_maximum">Circle Cost Maximum</Label>
                                    <Input
                                        id="circle_cost_maximum"
                                        name="circle_cost_maximum"
                                        type="number"
                                        step="0.01"
                                        value={tempData?.circle_cost_maximum || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="circle_duration">Circle Duration (days)</Label>
                                    <Input
                                        id="circle_duration"
                                        name="circle_duration"
                                        type="number"
                                        value={tempData?.circle_duration || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p>
                                    <strong>Circle Cost:</strong> ${Number.parseFloat(data.circle_cost).toFixed(2)}
                                </p>
                                <p>
                                    <strong>Circle Cost Maximum:</strong> ${Number.parseFloat(data.circle_cost_maximum).toFixed(2)}
                                </p>
                                <p>
                                    <strong>Circle Duration:</strong> {data.circle_duration} days
                                </p>
                            </div>
                        )}
                    </CardContent>
                    {editSections.financial && (
                        <CardFooter className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => cancelEdit("financial")}>
                                Cancel
                            </Button>
                            <Button onClick={() => openConfirmDialog("financial")}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                {/* Bio Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Biography</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => toggleEdit("bio")}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {editSections.bio ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea id="bio" name="bio" value={tempData?.bio || ""} onChange={handleChange} rows={4} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="releaseDate">Release Date</Label>
                                    <Input
                                        id="releaseDate"
                                        name="releaseDate"
                                        type="datetime-local"
                                        value={tempData?.releaseDate ? tempData.releaseDate.replace(" ", "T") : ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p>
                                    <strong>Bio:</strong> {data.bio}
                                </p>
                                <p>
                                    <strong>Release Date:</strong> {new Date(data.releaseDate).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </CardContent>
                    {editSections.bio && (
                        <CardFooter className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => cancelEdit("bio")}>
                                Cancel
                            </Button>
                            <Button onClick={() => openConfirmDialog("bio")}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                {/* Profile Image Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Profile Image</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => toggleEdit("profileImage")}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center">
                            <img
                                src={data.profilephoto || "/placeholder.svg"}
                                alt="Profile"
                                className="w-48 h-48 object-cover rounded-full mb-4"
                            />
                            {editSections.profileImage && (
                                <div className="w-full space-y-2">
                                    <Label htmlFor="profilephoto">Profile Image URL</Label>
                                    <Input id="profilephoto" name="profilephoto" value={tempData?.profilephoto || ""} onChange={handleChange} />
                                    <div className="mt-4">
                                        <Label htmlFor="profile-upload">Or upload a new image</Label>
                                        <Input id="profile-upload" type="file" accept="image/*" className="mt-2" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    {editSections.profileImage && (
                        <CardFooter className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => cancelEdit("profileImage")}>
                                Cancel
                            </Button>
                            <Button onClick={() => openConfirmDialog("profileImage")}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                {/* Cover Image Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Cover Image</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => toggleEdit("coverImage")}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center">
                            <img
                                src={data.cover_image || "/placeholder.svg"}
                                alt="Cover"
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                            {editSections.coverImage && (
                                <div className="w-full space-y-2">
                                    <Label htmlFor="cover_image">Cover Image URL</Label>
                                    <Input id="cover_image" name="cover_image" value={tempData?.cover_image || ""} onChange={handleChange} />
                                    <div className="mt-4">
                                        <Label htmlFor="cover-upload">Or upload a new image</Label>
                                        <Input id="cover-upload" type="file" accept="image/*" className="mt-2" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    {editSections.coverImage && (
                        <CardFooter className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => cancelEdit("coverImage")}>
                                Cancel
                            </Button>
                            <Button onClick={() => openConfirmDialog("coverImage")}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                {/* Social Media Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Social Media</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => toggleEdit("socialMedia")}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {editSections.socialMedia ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="facebookurl" className="flex items-center">
                                        <Facebook className="h-4 w-4 mr-2" />
                                        Facebook
                                    </Label>
                                    <Input
                                        id="facebookurl"
                                        name="facebookurl"
                                        value={tempData?.facebookurl || ""}
                                        onChange={handleChange}
                                        placeholder="https://facebook.com/username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="twitterurl" className="flex items-center">
                                        <Twitter className="h-4 w-4 mr-2" />
                                        Twitter
                                    </Label>
                                    <Input
                                        id="twitterurl"
                                        name="twitterurl"
                                        value={tempData?.twitterurl || ""}
                                        onChange={handleChange}
                                        placeholder="https://twitter.com/username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="instagramurl" className="flex items-center">
                                        <Instagram className="h-4 w-4 mr-2" />
                                        Instagram
                                    </Label>
                                    <Input
                                        id="instagramurl"
                                        name="instagramurl"
                                        value={tempData?.instagramurl || ""}
                                        onChange={handleChange}
                                        placeholder="https://instagram.com/username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="youtubeurl" className="flex items-center">
                                        <Youtube className="h-4 w-4 mr-2" />
                                        YouTube
                                    </Label>
                                    <Input
                                        id="youtubeurl"
                                        name="youtubeurl"
                                        value={tempData?.youtubeurl || ""}
                                        onChange={handleChange}
                                        placeholder="https://youtube.com/channel/id"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <Facebook className="h-5 w-5 mr-2" />
                                    <span>{data.facebookurl || "Not provided"}</span>
                                </div>
                                <div className="flex items-center">
                                    <Twitter className="h-5 w-5 mr-2" />
                                    <span>{data.twitterurl || "Not provided"}</span>
                                </div>
                                <div className="flex items-center">
                                    <Instagram className="h-5 w-5 mr-2" />
                                    <span>{data.instagramurl || "Not provided"}</span>
                                </div>
                                <div className="flex items-center">
                                    <Youtube className="h-5 w-5 mr-2" />
                                    <span>{data.youtubeurl || "Not provided"}</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    {editSections.socialMedia && (
                        <CardFooter className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => cancelEdit("socialMedia")}>
                                Cancel
                            </Button>
                            <Button onClick={() => openConfirmDialog("socialMedia")}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>

            {/* Confirmation Dialog */}
            <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will update your profile information. Do you want to continue?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={saveChanges}>Save Changes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}