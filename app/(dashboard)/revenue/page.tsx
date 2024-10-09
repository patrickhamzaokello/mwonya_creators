"use client"

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { AlertCircle, Upload, X } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useArtist } from "@/contexts/ArtistContext";

const AudioUploadForm = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useArtist();

  const onDrop = useCallback((acceptedFiles: any[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile && uploadedFile.type.startsWith('audio/')) {
      setFile(uploadedFile);
      setError(null);
    } else {
      setError(`Please upload a valid audio file.`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, multiple: false
  });

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (file) {
      setFile(null);
    }
  };

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
              <h2 className="text-3xl font-bold tracking-tight">Upload Audio</h2>
              <p className="text-muted-foreground">Audio file upload.</p>
              <h2>Selected Artist: {selectedArtist?.name}</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div>
                    <Label htmlFor="producer">Producer</Label>
                    <Input id="producer" placeholder="Enter producer name" />
                  </div>
                  <div>
                    <Label htmlFor="writer">Writer</Label>
                    <Input id="writer" placeholder="Enter writer name" />
                  </div>


                </div>

                <div className="space-y-4">

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={8} placeholder="Enter album description" />
                  </div>

                  <div>
                    <Label htmlFor="audio-type">Audio Type</Label>
                    <RadioGroup className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-sm" defaultValue="option-one">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">Music</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label htmlFor="option-two">Podcast</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-three" id="option-three" />
                        <Label htmlFor="option-three">Mixtape</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-four" id="option-four" />
                        <Label htmlFor="option-four">Band Content</Label>
                      </div>
                    </RadioGroup>
                  </div>


                  <div className="flex items-center space-x-2 bg-gray-100 p-4 rounded-sm">
                    <Checkbox id="exclusive" />
                    <Label htmlFor="exclusive" className="flex items-center">
                      Exclusive
                      <span className="ml-2 text-[10px] text-muted-foreground">
                      (Make it available only to premium users)
                    </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-100 p-4 rounded-sm">
                    <Checkbox id="exclusive" />
                    <Label htmlFor="exclusive" className="flex items-center">
                      Explicit
                      <span className="ml-2 text-[10px] text-muted-foreground">
                      (Contains explicit content)
                    </span>
                    </Label>
                  </div>


                </div>

              </div>

              <div
                  {...getRootProps()}
                  className={`p-8 border-2 border-dashed rounded-lg mt-4 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                  }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Drag & drop an audio file here, or click to select one
                </p>
              </div>

              {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
              )}

              {file && (
                  <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-900">{file["name"]}</div>
                      <div className="text-sm text-gray-500">({(file["size"] / 1024 / 1024).toFixed(2)} MB)</div>
                    </div>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
              )}

              {file && (
                  <audio controls className="w-full">
                    <source src={URL.createObjectURL(file)} type={file["type"]} />
                    Your browser does not support the audio element.
                  </audio>
              )}

              <button
                  type="submit"
                  disabled={!file}
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Upload Audio
              </button>
            </form>
          </div>
        </div>
      </section>
  );
};

export default AudioUploadForm;