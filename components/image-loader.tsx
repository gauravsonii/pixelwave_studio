"use client"

import { useState, useCallback, useEffect } from "react"

const SAMPLE_IMAGES = [
  {
    id: 1,
    name: "Aesthetic Painting",
    url: "https://images.unsplash.com/photo-1578301996581-bf7caec556c0?w=800&h=600&fit=crop",
    thumb: "https://images.unsplash.com/photo-1578301996581-bf7caec556c0?w=150&h=150&fit=crop",
  },
  {
    id: 2,
    name: "Spooky House",
    url: "https://images.unsplash.com/photo-1481018085669-2bc6e4f00eed?w=800&h=600&fit=crop",
    thumb: "https://images.unsplash.com/photo-1481018085669-2bc6e4f00eed?w=150&h=150&fit=crop",
  },
  {
    id: 3,
    name: "Uncle Reading Newspaper",
    url: "https://images.unsplash.com/photo-1560957123-e8e019c66980?w=800&h=600&fit=crop",
    thumb: "https://images.unsplash.com/photo-1560957123-e8e019c66980?w=150&h=150&fit=crop",
  },
  {
    id: 4,
    name: "Astronaut on Rover",
    url: "https://images.unsplash.com/photo-1614315517650-3771cf72d18a?w=800&h=600&fit=crop&crop=face",
    thumb: "https://images.unsplash.com/photo-1614315517650-3771cf72d18a?w=150&h=150&fit=crop&crop=face",
  },
]

// Preload sample images for better performance
const preloadImages = () => {
  SAMPLE_IMAGES.forEach((sample) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = sample.url

    const thumb = new Image()
    thumb.crossOrigin = "anonymous"
    thumb.src = sample.thumb
  })
}

export function useImageLoader() {
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null)
  const [isLoadingImage, setIsLoadingImage] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)

  const loadSampleImage = useCallback((imageUrl: string, imageName: string) => {
    setIsLoadingImage(true)
    setCurrentImage(null)
    setUploadedFileName(null)

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setCurrentImage(img)
      setIsLoadingImage(false)
      setUploadedFileName(`${imageName} (Sample)`)
    }
    img.onerror = (e) => {
      console.error("Failed to load sample image:", imageUrl, e)
      setCurrentImage(null)
      setIsLoadingImage(false)
    }
    img.src = imageUrl
  }, [])

  const loadImage = useCallback((src: string, fileName?: string) => {
    setIsLoadingImage(true)
    setCurrentImage(null)
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setCurrentImage(img)
      setIsLoadingImage(false)
      if (fileName) {
        setUploadedFileName(fileName)
      }
    }
    img.onerror = (e) => {
      console.error("Failed to load image:", src, e)
      setCurrentImage(null)
      setIsLoadingImage(false)
    }
    img.src = src
  }, [])

  const handleFileSelect = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          loadImage(e.target.result as string, file.name)
        }
      }
      reader.onerror = (e) => {
        console.error("FileReader error:", e)
        setIsLoadingImage(false)
      }
      reader.readAsDataURL(file)
    },
    [loadImage],
  )

  const clearImage = useCallback(() => {
    setCurrentImage(null)
    setUploadedFileName(null)
  }, [])

  // Preload sample images on mount
  useEffect(() => {
    preloadImages()
  }, [])

  return {
    currentImage,
    isLoadingImage,
    uploadedFileName,
    loadSampleImage,
    loadImage,
    handleFileSelect,
    clearImage,
    SAMPLE_IMAGES,
  }
}
