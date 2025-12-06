"use client"

import type React from "react"
import { useRef, useState, useCallback, useEffect } from "react"
import { Play, Pause, Upload, Video, Download, Volume2, VolumeX, ImageIcon, Power, Trash2 } from "lucide-react"

import { useAudioManager } from "@/components/audio-manager"
import { useCanvasRenderer } from "@/components/canvas-renderer"
import { useImageLoader } from "@/components/image-loader"
import { useVideoRecorder } from "@/components/video-recorder"

type EffectType = "subtle-shimmer" | "wave-flow" | "twinkle" | "ascii" | "crt"

export default function Component() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  const [isPlaying, setIsPlaying] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [brightness, setBrightness] = useState(1.0)
  const [effectType, setEffectType] = useState<EffectType>("subtle-shimmer")
  const [isDragOver, setIsDragOver] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundVolume, setSoundVolume] = useState(0.15)
  const [showSamples, setShowSamples] = useState(false)

  // Custom hooks
  const {
    currentImage,
    isLoadingImage,
    uploadedFileName,
    loadSampleImage,
    handleFileSelect,
    clearImage,
    SAMPLE_IMAGES,
  } = useImageLoader()

  const { canvasRef } = useCanvasRenderer({
    currentImage,
    isPlaying,
    animationSpeed,
    brightness,
    effectType,
  })

  const { audioDestinationRef, toggleSound, stopEffectAudio } = useAudioManager({
    soundEnabled,
    soundVolume,
    effectType,
    isPlaying,
    currentImage,
  })

  const {
    isRecording,
    videoBlob,
    recordingDuration,
    setRecordingDuration,
    startRecording,
    downloadVideo,
    discardVideo,
    clearVideo,
  } = useVideoRecorder()

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        handleFileSelect(file)
      }
    },
    [handleFileSelect],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      const imageFile = files.find((file) => file.type.startsWith("image/"))
      if (imageFile) {
        handleFileSelect(imageFile)
      }
    },
    [handleFileSelect],
  )

  const handleDropzoneClick = useCallback(() => {
    if (!showSamples) {
      fileInputRef.current?.click()
    }
  }, [showSamples])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const resetToDefault = () => {
    // Reset all values to default and remove image
    clearImage()
    clearVideo() // Clear video blob and buttons
    setIsPlaying(true)
    setAnimationSpeed(1)
    setBrightness(1.0)
    setSoundVolume(0.15)
    setEffectType("subtle-shimmer")
    setRecordingDuration(5)
    setShowSamples(false)

    // Stop audio
    stopEffectAudio()
    setSoundEnabled(true)

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleStartRecording = () => {
    if (canvasRef.current) {
      startRecording(canvasRef.current, audioDestinationRef.current || undefined, soundEnabled)
    }
  }

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled)
    toggleSound()
  }

  const handleLoadSample = (imageUrl: string, imageName: string) => {
    loadSampleImage(imageUrl, imageName)
    setShowSamples(false)
  }

  return (
    <div
      className="min-h-screen text-foreground font-orbitron transition-colors duration-300 page-fade-in"
      style={{ background: "hsl(var(--retro-bg))" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-12 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 slide-in-top delay-200 opacity-0">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-orbitron font-black text-green-400 mb-2 sm:mb-3 tracking-wider">
              PIXELWAVE STUDIO
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-amber-400 font-light max-w-2xl font-mono">
              &gt; Transform images into mesmerizing animated patterns using vintage dithering algorithms
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-amber-400 font-mono">SYSTEM ONLINE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-12 lg:gap-12">
          {/* CRT Monitor with Integrated Controls */}
          <div className="lg:col-span-2 w-full slide-in-left delay-400 opacity-0">
            <div className="crt-container relative w-full">
              {/* TV Brand Label - Top Panel */}
              <div className="tv-top-panel">
                <span className="text-xs text-gray-400 font-orbitron font-bold">RETRO-VISION</span>
              </div>

              {/* Main Screen */}
              {currentImage && !showSamples ? (
                <div className="crt-screen aspect-[4/3] w-full">
                  <canvas ref={canvasRef} className="w-full h-full block object-contain" />
                </div>
              ) : (
                <div
                  className={`crt-screen aspect-[4/3] w-full cursor-pointer transition-all duration-200 ${
                    isDragOver ? "ring-2 ring-green-400 ring-offset-4 ring-offset-black" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleDropzoneClick}
                >
                  {/* Gallery View */}
                  {showSamples ? (
                    <div className="absolute inset-0 p-4 sm:p-6 overflow-y-auto">
                      <div className="text-center mb-4">
                        <h3 className="font-orbitron text-green-400 font-bold text-base sm:text-lg mb-2">
                          IMAGE GALLERY
                        </h3>
                        <button
                          onClick={() => setShowSamples(false)}
                          className="text-amber-400 text-xs transition-colors font-mono"
                        >
                          &lt; BACK TO UPLOAD
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {SAMPLE_IMAGES.map((sample) => (
                          <button
                            key={sample.id}
                            onClick={() => handleLoadSample(sample.url, sample.name)}
                            className="group relative aspect-square rounded-lg overflow-hidden bg-black border border-green-400/30 transition-all duration-300"
                            disabled={isLoadingImage}
                          >
                            <img
                              src={sample.thumb || "/placeholder.svg"}
                              alt={sample.name}
                              className="w-full h-full object-cover transition-transform duration-300 opacity-80"
                              onError={(e) => {
                                e.currentTarget.src = `/placeholder.svg?height=150&width=150&text=${encodeURIComponent(sample.name)}`
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 flex items-end">
                              <div className="w-full p-2 text-xs text-green-400 font-orbitron font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80">
                                {sample.name.toUpperCase()}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Upload Screen */
                    <>
                      {isLoadingImage ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-green-400 font-mono text-sm animate-pulse">LOADING IMAGE...</div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center px-4">
                            <Upload className="w-10 sm:w-12 lg:w-16 h-10 sm:h-12 lg:h-16 mx-auto mb-3 sm:mb-4 lg:mb-6 text-green-400 opacity-60" />
                            <p className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-green-400 font-orbitron">
                              INSERT IMAGE
                            </p>
                            <p className="text-xs sm:text-sm text-amber-400 font-mono">
                              &gt; drag & drop or click to browse
                            </p>
                            <div className="mt-3 sm:mt-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowSamples(true)
                                }}
                                className="retro-button px-3 sm:px-4 py-2 rounded text-xs"
                              >
                                <ImageIcon className="w-4 h-4 mr-1 inline" />
                                GALLERY
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Bottom Control Panel */}
              <div className="tv-controls">
                <button
                  onClick={togglePlayPause}
                  disabled={!currentImage}
                  className="tv-button"
                  title={isPlaying ? "PAUSE" : "PLAY"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="w-px h-6 bg-gray-600"></div>
                <button onClick={handleToggleSound} className="tv-button" title="VOLUME">
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <div className="w-px h-6 bg-gray-600"></div>
                <button onClick={resetToDefault} className="tv-button power" title="POWER / RESET">
                  <Power className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filename with better spacing */}
            {uploadedFileName && (
              <p className="text-xs text-amber-400 mt-6 sm:mt-8 font-mono opacity-70 text-center lg:text-left">
                &gt; {uploadedFileName.toUpperCase()}
              </p>
            )}
          </div>

          {/* Control Panel */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 slide-in-right delay-600 opacity-0">
            {/* Settings */}
            <div className="retro-panel slide-in-bottom delay-800 opacity-0">
              <h3 className="retro-label font-orbitron mb-4">PARAMETERS</h3>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block retro-label mb-2">SPEED [{animationSpeed}]</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number.parseInt(e.target.value))}
                    disabled={!currentImage}
                    className="w-full slider"
                  />
                </div>
                <div>
                  <label className="block retro-label mb-2">BRIGHTNESS [{brightness.toFixed(1)}X]</label>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={brightness}
                    onChange={(e) => setBrightness(Number.parseFloat(e.target.value))}
                    disabled={!currentImage}
                    className="w-full slider"
                  />
                </div>
                <div>
                  <label className="block retro-label mb-2">VOLUME [{Math.round(soundVolume * 100)}%]</label>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(Number.parseFloat(e.target.value))}
                    disabled={!soundEnabled}
                    className="w-full slider"
                  />
                </div>
              </div>
            </div>

            {/* Effects */}
            <div className="retro-panel slide-in-bottom delay-900 opacity-0">
              <h3 className="retro-label font-orbitron mb-4">EFFECT MODE</h3>
              <div className="space-y-2">
                {[
                  { key: "subtle-shimmer", label: "SHIMMER" },
                  { key: "wave-flow", label: "WAVE" },
                  { key: "twinkle", label: "TWINKLE" },
                  { key: "ascii", label: "ASCII" },
                  { key: "crt", label: "CRT" },
                ].map(({ key, label }, index) => (
                  <button
                    key={key}
                    onClick={() => setEffectType(key as EffectType)}
                    disabled={!currentImage}
                    className={`w-full text-left px-4 py-2 rounded transition-all duration-150 text-xs ${
                      effectType === key ? "retro-button active" : "retro-button"
                    } slide-in-bottom opacity-0`}
                    style={{
                      animationDelay: `${1000 + index * 50}ms`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Export */}
            <div className="retro-panel slide-in-bottom delay-1200 opacity-0">
              <h3 className="retro-label font-orbitron mb-4">RECORD OUTPUT</h3>
              <div className="space-y-4">
                <div>
                  <label className="block retro-label mb-2">DURATION [{recordingDuration} sec]</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={recordingDuration}
                    onChange={(e) => setRecordingDuration(Number.parseInt(e.target.value))}
                    disabled={isRecording || !currentImage}
                    className="w-full slider"
                  />
                </div>
                {isRecording ? (
                  <div className="flex justify-center">
                    <button
                      disabled
                      className="retro-button px-4 py-3 rounded text-xs w-full bg-red-900 border-red-700"
                    >
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse inline-block"></div>
                      RECORDING...
                    </button>
                  </div>
                ) : videoBlob ? (
                  <div className="space-y-2">
                    <div
                      className="flex justify-center"
                      style={{
                        animation: "zoom-in 0.4s var(--ease-out-cubic) forwards",
                      }}
                    >
                      <button onClick={downloadVideo} className="retro-button px-6 py-3 rounded text-xs w-full">
                        <Download className="w-4 h-4 mr-2 inline" />
                        DOWNLOAD
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={discardVideo}
                        className="retro-button px-4 py-2 rounded text-xs w-full bg-red-900/50 border-red-700/50 text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2 inline" />
                        DISCARD
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <button
                      onClick={handleStartRecording}
                      disabled={!currentImage || !isPlaying}
                      className="retro-button px-4 py-3 rounded text-xs w-full"
                    >
                      <Video className="w-4 h-4 mr-2 inline" />
                      RECORD
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 lg:mt-24 pt-6 sm:pt-8 border-t border-green-400/20 slide-in-bottom delay-1400 opacity-0">
          <div className="text-center">
            <p className="text-xs text-amber-400 font-mono tracking-wide">
              &gt; CRAFTED WITH <span className="text-green-400 animate-pulse">💚</span> USING{" "}
              <a
                href="https://v0.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 transition-colors duration-150 ease-out underline decoration-dotted underline-offset-2"
              >
                v0.app
              </a>{" "}
              BY{" "}
              <a
                href="https://x.com/blakssh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 transition-colors duration-150 ease-out font-bold"
              >
                @BLAKSSH
              </a>{" "}
              | NO PIXELS WERE HARMED IN THE MAKING OF THIS APP
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
