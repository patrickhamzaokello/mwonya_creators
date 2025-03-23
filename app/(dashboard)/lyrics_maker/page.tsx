"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  PlayCircle,
  PauseCircle,
  Download,
  TimerReset,
  Music,
  FileText,
  Timer,
  FileDown,
  ChevronRight,
} from "lucide-react"

export default function LyricsTimestampGenerator() {
  const [lyrics, setLyrics] = useState("")
  const [title, setTitle] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [timestampedLyrics, setTimestampedLyrics] = useState<Array<{ time: number; text: string }>>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [activeTab, setActiveTab] = useState("setup")
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const lyricsLineRef = useRef<HTMLDivElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Revoke previous URL to prevent memory leaks
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      const url = URL.createObjectURL(file)
      setAudioUrl(url)

      // Extract title from filename if not set
      if (!title) {
        const fileName = file.name.split(".")[0]
        setTitle(fileName)
      }
    }
  }

  const handleLyricsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLyrics(e.target.value)
  }

  const startRecording = () => {
    if (!audioUrl) return

    // Split lyrics into lines and filter out empty lines
    const lines = lyrics.split("\n").filter((line) => line.trim() !== "")

    if (lines.length === 0) return

    setTimestampedLyrics([])
    setCurrentLineIndex(0)
    setIsRecording(true)
    setStartTime(Date.now())

    if (audioRef.current) {
      // Reset audio to beginning
      audioRef.current.currentTime = 0

      // Use a small timeout to ensure UI updates before playing
      setTimeout(() => {
        const playPromise = audioRef.current?.play()

        // Handle play promise to avoid uncaught promise errors
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Audio play error:", error)
            setIsRecording(false)
          })
        }
      }, 100)
    }
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (audioRef.current) {
      audioRef.current.pause()
    }

    // If we have timestamps, move to the export tab
    if (timestampedLyrics.length > 0) {
      setActiveTab("export")
    }
  }

  const resetRecording = () => {
    setIsRecording(false)
    setTimestampedLyrics([])
    setCurrentLineIndex(0)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const markTimestamp = () => {
    if (!isRecording) return

    const lines = lyrics.split("\n").filter((line) => line.trim() !== "")

    if (currentLineIndex >= lines.length) {
      stopRecording()
      return
    }

    const currentTime = (Date.now() - startTime) / 1000

    setTimestampedLyrics((prev) => [...prev, { time: currentTime, text: lines[currentLineIndex] }])

    setCurrentLineIndex((prev) => prev + 1)

    // If we've timestamped all lines, stop recording
    if (currentLineIndex === lines.length - 1) {
      stopRecording()
      setActiveTab("export")
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toFixed(2).padStart(5, "0")}`
  }

  const exportLRC = () => {
    if (timestampedLyrics.length === 0) return

    let lrcContent = ""

    // Add title if provided
    if (title) {
      lrcContent += `[ti:${title}]\n`
    }

    // Add artist if file name is available
    if (selectedFile) {
      const artistName = selectedFile.name.split(".")[0]
      lrcContent += `[ar:${artistName}]\n`
    }

    // Add LRC by line
    lrcContent += `[00:00.00]Lyrics by LRC Generator\n`

    // Add timestamped lyrics
    timestampedLyrics.forEach((line) => {
      lrcContent += `[${formatTime(line.time)}]${line.text}\n`
    })

    // Create and download the file
    const blob = new Blob([lrcContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title || "lyrics"}.lrc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Update audio time and progress
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration) {
        setDuration(audio.duration)
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateTime)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateTime)
    }
  }, [audioRef.current])

  // Scroll to current line
  useEffect(() => {
    if (lyricsLineRef.current && isRecording) {
      lyricsLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [currentLineIndex, isRecording])

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [])

  // Get filtered lyrics lines
  const lyricsLines = lyrics.split("\n").filter((line) => line.trim() !== "")
  const totalLines = lyricsLines.length
  const lineProgress = totalLines > 0 ? (currentLineIndex / totalLines) * 100 : 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-primary">Lyrics Timestamp Generator</h1>
          <p className="text-muted-foreground text-sm">Create synchronized LRC files with ease</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="setup" className="flex items-center gap-2" disabled={isRecording}>
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Lyrics</span>
            </TabsTrigger>
            <TabsTrigger
              value="timestamp"
              className="flex items-center gap-2"
              disabled={!lyrics || lyrics.trim() === ""}
            >
              <Timer className="h-4 w-4" />
              <span className="hidden sm:inline">Timestamp</span>
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2" disabled={timestampedLyrics.length === 0}>
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-medium">
                <FileText className="h-5 w-5 text-primary" />
                <h2>Enter Lyrics</h2>
              </div>

              <div className="bg-card rounded-lg p-4 border shadow-sm">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Track Title (Optional)</Label>
                    <Input
                      id="title"
                      placeholder="Enter song title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lyrics">Enter lyrics (one line per row)</Label>
                    <Textarea
                      id="lyrics"
                      placeholder="Enter lyrics here, one line per row..."
                      className="min-h-[300px] font-mono text-sm"
                      value={lyrics}
                      onChange={handleLyricsChange}
                    />
                    <p className="text-xs text-muted-foreground">{lyricsLines.length} lines</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (lyrics && lyrics.trim() !== "") {
                    setActiveTab("timestamp")
                  }
                }}
                disabled={!lyrics || lyrics.trim() === ""}
                className="flex items-center gap-2"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="timestamp" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Music className="h-5 w-5 text-primary" />
                <h2>Select Audio Track</h2>
              </div>

              <div className="bg-card rounded-lg p-4 border shadow-sm">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="audio-file">Audio File</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="audio-file"
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {audioUrl && (
                    <div className="pt-2">
                      <audio ref={audioRef} src={audioUrl} controls preload="auto" className="w-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg p-4 border shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-medium">Timestamp Generator</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isRecording ? (
                      <Button
                        onClick={startRecording}
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={!audioUrl}
                      >
                        <PlayCircle className="h-4 w-4" /> Start
                      </Button>
                    ) : (
                      <Button
                        onClick={stopRecording}
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <PauseCircle className="h-4 w-4" /> Stop
                      </Button>
                    )}

                    <Button onClick={resetRecording} variant="outline" size="sm" className="flex items-center gap-2">
                      <TimerReset className="h-4 w-4" /> Reset
                    </Button>
                  </div>
                </div>

                <Separator />

                {audioUrl && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <Progress value={progress} className="h-1" />
                  </div>
                )}

                <div className="flex flex-col items-center">
                  <div className="w-full max-w-md">
                    <div className="relative py-4">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-full">
                        <div
                          className="w-full bg-primary rounded-full transition-all duration-300"
                          style={{ height: `${lineProgress}%` }}
                        ></div>
                      </div>

                      <div className="pl-4 space-y-2 max-h-[200px] overflow-y-auto">
                        {lyricsLines.map((line, index) => (
                          <div
                            key={index}
                            ref={index === currentLineIndex ? lyricsLineRef : null}
                            className={`py-2 px-3 rounded-lg transition-all ${
                              index === currentLineIndex && isRecording
                                ? "bg-primary/10 font-medium border-l-2 border-primary"
                                : index < currentLineIndex
                                  ? "text-muted-foreground line-through"
                                  : ""
                            }`}
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={markTimestamp}
                    disabled={!isRecording || currentLineIndex >= totalLines}
                    size="lg"
                    className="mt-4 w-full max-w-xs h-16 text-lg font-medium"
                  >
                    Mark Timestamp
                  </Button>

                  <p className="text-sm text-muted-foreground mt-2">
                    Line {currentLineIndex + 1} of {totalLines}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <div className="bg-card rounded-lg p-4 border shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileDown className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-medium">Export LRC File</h2>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Preview</h3>
                    <span className="text-xs text-muted-foreground">{timestampedLyrics.length} lines</span>
                  </div>

                  <div className="border rounded-lg p-4 max-h-[300px] overflow-y-auto bg-muted/30 font-mono text-sm">
                    {title && <div className="text-muted-foreground">[ti:{title}]</div>}
                    {selectedFile && (
                      <div className="text-muted-foreground">[ar:{selectedFile.name.split(".")[0]}]</div>
                    )}
                    <div className="text-muted-foreground">[00:00.00]Lyrics provided by Mwonya</div>

                    {timestampedLyrics.map((line, index) => (
                      <div key={index} className="flex py-1 border-b last:border-0 border-muted">
                        <span className="text-primary">[{formatTime(line.time)}]</span>
                        <span className="ml-1">{line.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <Button onClick={exportLRC} className="flex items-center gap-2 w-full max-w-xs" size="lg">
                    <Download className="h-4 w-4" /> Download LRC File
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("setup")} className="flex items-center gap-2">
                Start Over
              </Button>

              <Button variant="outline" onClick={() => setActiveTab("timestamp")} className="flex items-center gap-2">
                Edit Timestamps
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-4 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Lyrics Timestamp Generator &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}

