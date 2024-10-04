"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function Album() {

  const [artworkPreview, setArtworkPreview] = useState("/placeholder.svg");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagInput(value);

    if (value.endsWith(",")) {
      const newTag = value.slice(0, -1).trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <section className="w-full max-w-4xl mx-auto py-12 md:py-16 lg:py-20 bg-white">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Create New Album</h2>
            <p className="text-muted-foreground">Fill out the details below to add a new album.</p>
          </div>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Album Title</Label>
                <Input id="title" placeholder="Enter album title" />
              </div>
              <div>
                <Label htmlFor="artist">Artist</Label>
                <Input id="artist" placeholder="Enter artist name" />
              </div>
              <div>
                <Label htmlFor="artwork">Album Artwork</Label>
                <div className="flex items-center space-x-4">
                  <Input id="artwork" type="file"

                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setArtworkPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div className="w-24 h-24 overflow-hidden">
                    <img
                      id="artwork-preview"
                      src={artworkPreview}
                      alt="Album Artwork"
                      width={96}
                      height={96}
                      className="rounded-[5px] object-cover aspect-square"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  id="tags"
                  placeholder="Enter tags (separated by commas)"
                  value={tagInput}
                  onChange={handleTagInput}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="producer">Producer</Label>
                <Input id="producer" placeholder="Enter producer name" />
              </div>
              <div>
                <Label htmlFor="writer">Writer</Label>
                <Input id="writer" placeholder="Enter writer name" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} placeholder="Enter album description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="release-date">Release Date</Label>
                  <Input id="release-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="aes-code">AES Code</Label>
                  <Input id="aes-code" placeholder="Enter AES code" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="exclusive" />
                <Label htmlFor="exclusive" className="flex items-center">
                  Exclusive
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    (Make it available only to premium users)
                  </span>
                </Label>
              </div>
            </div>
          </form>
          <div className="flex justify-between items-center">
            <Button variant="ghost">Cancel</Button>
            <Button type="submit">Create Album</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
