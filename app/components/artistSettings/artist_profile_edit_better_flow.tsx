"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Save,
    X,
    User,
    Mail,
    Music,
    DollarSign,
    FileText,
    Image,
    Share2,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { ArtistData, getArtistProfile, updateArtistProfile } from "@/actions/artist-profile-edit";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface ArtistProfileEditorProps {
    artistId: string;
}

export default function ProfileEditPage({ artistId }: ArtistProfileEditorProps) {
    const [loading, setLoading] = useState(true);
    const [data, setArtistData] = useState<ArtistData | null>(null);
    const [tempData, setTempData] = useState<ArtistData | null>(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [activeTab, setActiveTab] = useState("basic");

    const [scrollPosition, setScrollPosition] = useState(0);

    const tabs = [
        { id: 'basic', icon: User, label: 'Basic' },
        { id: 'contact', icon: Mail, label: 'Contact' },
        { id: 'artist', icon: Music, label: 'Artist Info' },
        { id: 'financial', icon: DollarSign, label: 'Financial' },
        { id: 'bio', icon: FileText, label: 'Biography' },
        { id: 'images', icon: Image, label: 'Images' },
        { id: 'social', icon: Share2, label: 'Social' },
    ];

    const handleScroll = (direction: string) => {
        const newPosition = direction === 'left'
            ? Math.max(0, scrollPosition - 1)
            : Math.min(tabs.length - (window.innerWidth < 768 ? 3 : 5), scrollPosition + 1);
        setScrollPosition(newPosition);
    };

    const isScrollable = window.innerWidth < 1024;

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

    useEffect(() => {
        // Check for changes between original and temp data
        if (data && tempData) {
            const changed = Object.keys(data).some(
                key => data[key as keyof ArtistData] !== tempData[key as keyof ArtistData]
            );
            setHasChanges(changed);
        }
    }, [data, tempData]);

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

    const openConfirmDialog = () => {
        setConfirmDialogOpen(true);
    };

    const cancelChanges = () => {
        if (data) {
            setTempData(data);
            setHasChanges(false);
            toast({
                title: "Changes discarded",
                description: "Your changes have been discarded."
            });
        }
    };

    const saveChangesToBackend = async (modifiedFields: Partial<ArtistData>) => {
        try {
            const updateprofile = await updateArtistProfile({
                ...modifiedFields,
                id: artistId // Ensure ID is included
            });

            if (!updateprofile.success) throw new Error(updateprofile.error || "Failed to save changes");

            // Update the base data with the new values
            setArtistData(tempData);
            setHasChanges(false);

            toast({
                title: "Success",
                description: "Profile updated successfully!"
            });

            setConfirmDialogOpen(false);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save changes",
                variant: "destructive"
            });
        }
    };

    const saveChanges = () => {
        if (data && tempData) {
            // Identify modified fields
            const modifiedFields: Partial<ArtistData> = { id: artistId };

            for (const [key, value] of Object.entries(tempData)) {
                if (value !== data[key as keyof ArtistData]) {
                    modifiedFields[key as keyof ArtistData] = value as any;
                }
            }

            // If no fields were modified, exit early
            if (Object.keys(modifiedFields).length <= 1) { // Only id is present
                toast({
                    title: "No Changes",
                    description: "No changes were made.",
                    variant: "default"
                });
                return;
            }

            // Send modified fields to the backend
            saveChangesToBackend(modifiedFields);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mx-auto py-10 text-center">
                <h2 className="text-2xl font-bold text-destructive">Error loading profile data</h2>
                <p className="mt-2">Unable to retrieve artist information. Please try again later.</p>
                <Button className="mt-4" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        );
    }


    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Edit Artist Profile</h1>
                    <p className="text-muted-foreground mt-1">Update your public profile information</p>
                </div>

                <div className="flex space-x-3">
                    {hasChanges && (
                        <>
                            <Button variant="outline" onClick={cancelChanges}>
                                <X className="h-4 w-4 mr-2" />
                                Discard
                            </Button>
                            <Button onClick={openConfirmDialog}>
                                <Save className="h-4 w-4 mr-2" />
                                Save All Changes
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Preview section with profile image and cover image */}
            <Card className="mb-8 overflow-hidden">
                <div
                    className="h-48 bg-cover bg-center relative"
                    style={{
                        backgroundImage: `url(${tempData?.cover_image || "/placeholder.svg"})`,
                        backgroundColor: !tempData?.cover_image ? "#f0f0f0" : undefined
                    }}
                >
                    <div className="absolute -bottom-16 left-8">
                        <div className="rounded-full w-32 h-32 border-4 border-background overflow-hidden bg-muted">
                            <img
                                src={tempData?.profilephoto || "/placeholder.svg"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-20 pb-6 px-8">
                    <h2 className="text-2xl font-bold">{tempData?.name}</h2>
                    <p className="text-muted-foreground">{tempData?.tag}</p>
                </div>
            </Card>

            {/* Tabs for different sections */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="relative flex items-center">
                    {isScrollable && scrollPosition > 0 && (
                        <button
                            onClick={() => handleScroll('left')}
                            className="absolute left-0 z-10 p-1 bg-background rounded-full shadow-md hover:bg-accent/50 transition-all"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    )}

                    <TabsList
                        className="relative flex h-auto p-1 bg-muted rounded-lg overflow-x-hidden w-full mx-auto"
                    >
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${scrollPosition * (100 / tabs.length)}%)` }}
                        >
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className={cn(
                                            "flex flex-col items-center py-3 px-4 gap-2 flex-1 min-w-24 transition-all duration-200",
                                            "data-[state=active]:bg-background data-[state=active]:shadow-sm",
                                            "hover:bg-accent/50"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-2 rounded-full transition-colors",
                                            activeTab === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground"
                                        )}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-medium">{tab.label}</span>
                                    </TabsTrigger>
                                );
                            })}
                        </div>
                    </TabsList>

                    {isScrollable && scrollPosition < tabs.length - (window.innerWidth < 768 ? 3 : 5) && (
                        <button
                            onClick={() => handleScroll('right')}
                            className="absolute right-0 z-10 p-1 bg-background rounded-full shadow-md hover:bg-accent/50 transition-all"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Basic Information */}
                <TabsContent value="basic">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                            <div className="space-y-2">
                                <Label htmlFor="name">Artist Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={tempData?.name || ""}
                                    onChange={handleChange}
                                    className="max-w-md"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Contact Information */}
                <TabsContent value="contact">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                            <div className="grid gap-6 max-w-md">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={tempData?.email || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
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
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Artist Information */}
                <TabsContent value="artist">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-xl font-semibold mb-4">Artist Information</h3>
                            <div className="grid gap-6 max-w-lg">
                                <div className="flex items-center space-x-4">
                                    <Switch
                                        id="isIndependent"
                                        checked={tempData?.isIndependent === 1}
                                        onCheckedChange={(checked) => handleSwitchChange("isIndependent", checked)}
                                    />
                                    <Label htmlFor="isIndependent">I am an independent artist</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="RecordLable">Record Label</Label>
                                    <Input
                                        id="RecordLable"
                                        name="RecordLable"
                                        value={tempData?.RecordLable || ""}
                                        onChange={handleChange}
                                        disabled={tempData?.isIndependent === 1}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tag">Artist Tag/Slogan</Label>
                                    <Input
                                        id="tag"
                                        name="tag"
                                        value={tempData?.tag || ""}
                                        onChange={handleChange}
                                        placeholder="Your signature phrase or tagline"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="genre">Primary Genre</Label>
                                    <Select
                                        value={tempData?.genre || ""}
                                        onValueChange={(value) => handleSelectChange("genre", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your main genre" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Hiphop or Rap">Hip-Hop / Rap</SelectItem>
                                            <SelectItem value="R&B">R&B / Soul</SelectItem>
                                            <SelectItem value="Pop">Pop</SelectItem>
                                            <SelectItem value="Rock">Rock</SelectItem>
                                            <SelectItem value="Electronic">Electronic / Dance</SelectItem>
                                            <SelectItem value="Jazz">Jazz</SelectItem>
                                            <SelectItem value="Classical">Classical</SelectItem>
                                            <SelectItem value="Country">Country</SelectItem>
                                            <SelectItem value="Folk">Folk</SelectItem>
                                            <SelectItem value="Alternative">Alternative</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Financial Information */}
                <TabsContent value="financial">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-xl font-semibold mb-4">Financial Information</h3>
                            <div className="grid gap-6 max-w-md">
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="circle_cost">Circle Cost ($)</Label>
                                    <Input
                                        id="circle_cost"
                                        name="circle_cost"
                                        type="number"
                                        step="0.01"
                                        value={tempData?.circle_cost || ""}
                                        onChange={handleChange}
                                    />
                                    <p className="text-sm text-muted-foreground">Base price for circle membership</p>
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="circle_cost_maximum">Circle Cost Maximum ($)</Label>
                                    <Input
                                        id="circle_cost_maximum"
                                        name="circle_cost_maximum"
                                        type="number"
                                        step="0.01"
                                        value={tempData?.circle_cost_maximum || ""}
                                        onChange={handleChange}
                                    />
                                    <p className="text-sm text-muted-foreground">The maximum price for upgraded membership</p>
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="circle_duration">Circle Duration (days)</Label>
                                    <Input
                                        id="circle_duration"
                                        name="circle_duration"
                                        type="number"
                                        value={tempData?.circle_duration || ""}
                                        onChange={handleChange}
                                    />
                                    <p className="text-sm text-muted-foreground">Length of membership period</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Biography */}
                <TabsContent value="bio">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-xl font-semibold mb-4">Biography</h3>
                            <div className="grid gap-6">
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="bio">Artist Biography</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={tempData?.bio || ""}
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder="Tell your story and connect with fans"
                                    />
                                </div>

                                <div className="flex flex-col space-y-2 max-w-md">
                                    <Label htmlFor="releaseDate">Next Release Date</Label>
                                    <Input
                                        id="releaseDate"
                                        name="releaseDate"
                                        type="datetime-local"
                                        value={tempData?.releaseDate ? tempData.releaseDate.replace(" ", "T") : ""}
                                        onChange={handleChange}
                                    />
                                    <p className="text-sm text-muted-foreground">When is your next song, album or EP dropping?</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Images */}
                <TabsContent value="images">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Image */}
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="text-xl font-semibold mb-4">Profile Image</h3>
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-40 h-40 rounded-full overflow-hidden bg-muted">
                                        <img
                                            src={tempData?.profilephoto || "/placeholder.svg"}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="w-full space-y-4">
                                        <Label htmlFor="profilephoto">Profile Image URL</Label>
                                        <Input
                                            id="profilephoto"
                                            name="profilephoto"
                                            value={tempData?.profilephoto || ""}
                                            onChange={handleChange}
                                            placeholder="https://example.com/image.jpg"
                                        />

                                        <div className="pt-2">
                                            <Label htmlFor="profile-upload">Or upload a new image</Label>
                                            <Input
                                                id="profile-upload"
                                                type="file"
                                                accept="image/*"
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cover Image */}
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="text-xl font-semibold mb-4">Cover Image</h3>
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-full h-40 rounded-md overflow-hidden bg-muted">
                                        <img
                                            src={tempData?.cover_image || "/placeholder.svg"}
                                            alt="Cover"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="w-full space-y-4">
                                        <Label htmlFor="cover_image">Cover Image URL</Label>
                                        <Input
                                            id="cover_image"
                                            name="cover_image"
                                            value={tempData?.cover_image || ""}
                                            onChange={handleChange}
                                            placeholder="https://example.com/cover.jpg"
                                        />

                                        <div className="pt-2">
                                            <Label htmlFor="cover-upload">Or upload a new image</Label>
                                            <Input
                                                id="cover-upload"
                                                type="file"
                                                accept="image/*"
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Social Media */}
                <TabsContent value="social">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-xl font-semibold mb-4">Social Media</h3>
                            <div className="grid gap-6 max-w-xl">
                                <div className="space-y-2">
                                    <Label htmlFor="instagramurl" className="flex items-center">
                                        <Instagram className="h-5 w-5 mr-2" />
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
                                    <Label htmlFor="twitterurl" className="flex items-center">
                                        <Twitter className="h-5 w-5 mr-2" />
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
                                    <Label htmlFor="facebookurl" className="flex items-center">
                                        <Facebook className="h-5 w-5 mr-2" />
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
                                    <Label htmlFor="youtubeurl" className="flex items-center">
                                        <Youtube className="h-5 w-5 mr-2" />
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
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Confirmation Dialog */}
            <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Save Profile Changes</AlertDialogTitle>
                        <AlertDialogDescription>
                            You've made changes to your artist profile. Would you like to save these changes?
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