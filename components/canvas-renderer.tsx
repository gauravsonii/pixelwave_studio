"use client"

import { useRef, useEffect, useCallback } from "react"

type EffectType = "subtle-shimmer" | "wave-flow" | "twinkle" | "ascii" | "crt"

interface CanvasRendererProps {
  currentImage: HTMLImageElement | null
  isPlaying: boolean
  animationSpeed: number
  brightness: number
  effectType: EffectType
}

export function useCanvasRenderer({
  currentImage,
  isPlaying,
  animationSpeed,
  brightness,
  effectType,
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  // Convert UI speed (1-10) to actual animation speed (0.01-0.3)
  const getActualSpeed = useCallback((uiSpeed: number) => {
    return (uiSpeed / 10) * 0.3
  }, [])

  // Hash function for consistent per-pixel randomness
  const hash = useCallback((x: number, y: number) => {
    let h = x * 374761393 + y * 668265263
    h = (h ^ (h >>> 13)) * 1274126177
    return (h ^ (h >>> 16)) / 4294967296
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Get the actual display size of the canvas
    const rect = canvas.getBoundingClientRect()
    const displayWidth = rect.width
    const displayHeight = rect.height

    // Use higher internal resolution for better quality
    // Scale factor based on device pixel ratio and minimum quality threshold
    const pixelRatio = window.devicePixelRatio || 1
    const minWidth = 800 // Minimum internal width for quality
    const minHeight = 600 // Minimum internal height for quality

    // Calculate scale factor to ensure minimum quality while being responsive
    const scaleX = Math.max(1, minWidth / displayWidth)
    const scaleY = Math.max(1, minHeight / displayHeight)
    const scale = Math.max(scaleX, scaleY, pixelRatio)

    // Set high internal resolution
    const canvasWidth = Math.floor(displayWidth * scale)
    const canvasHeight = Math.floor(displayHeight * scale)

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Scale the canvas back down to display size
    canvas.style.width = `${displayWidth}px`
    canvas.style.height = `${displayHeight}px`

    // Scale the context to match the higher resolution
    ctx.scale(scale, scale)

    if (!currentImage) {
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, displayWidth, displayHeight)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = undefined
      }
      return
    }

    const img = currentImage

    let time = 0
    const asciiChars = " .:-=+*#%@".split("")

    const animate = () => {
      // Fill entire canvas with black first (using display dimensions)
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, displayWidth, displayHeight)

      // Show funny message when paused
      if (!isPlaying) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        const fontSize = Math.max(12, Math.min(displayWidth, displayHeight) * 0.04)
        ctx.font = `${fontSize}px monospace`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        const funnyMessages = [
          "🎬 PAUSED 🎬",
          "💤 Pixels went to sleep",
          "🍕 Pizza break!",
          "🚽 Bathroom break...",
          "🎮 Alt+tabbed to play games",
          "☕ Getting coffee, brb",
          "🐕 Walking the dog",
          "📱 Checking Instagram",
          "🛌 Taking a power nap",
          "🍿 Making popcorn",
          "🎯 Procrastinating like a pro",
          "🧘‍♂️ Meditating on life choices",
          "🎪 Circus left town",
          "🦄 Chasing unicorns",
          "🎭 Having an existential crisis",
          "🍔 Burger run!",
          "🎸 Started a band",
          "🚀 Gone to Mars",
          "🎨 Became an artist",
          "💸 Buying crypto",
          "🎲 Rolling dice",
          "🎪 Joined the circus",
          "🧙‍♂️ Learning magic tricks",
          "🎯 Missing the point",
          "🍜 Slurping noodles",
          "🎮 Rage quit",
          "🛸 Abducted by aliens",
          "🎭 Method acting",
          "🍰 Having cake",
          "🎪 Clowning around",
        ]

        const messageIndex = Math.floor(Date.now() / 2000) % funnyMessages.length
        const message = funnyMessages[messageIndex]

        ctx.fillText(message, displayWidth / 2, displayHeight / 2)

        return
      }

      // Calculate proper image scaling to fit within canvas bounds with padding
      const imgAspect = img.width / img.height
      const canvasAspect = displayWidth / displayHeight

      // Add padding to ensure image doesn't touch edges - REDUCED from 5% to 2%
      const padding = Math.min(displayWidth, displayHeight) * 0.02 // Reduced padding
      const availableWidth = displayWidth - padding * 2
      const availableHeight = displayHeight - padding * 2

      let drawWidth, drawHeight, offsetX, offsetY

      if (imgAspect > availableWidth / availableHeight) {
        // Image is wider relative to available space - fit to width
        drawWidth = availableWidth
        drawHeight = drawWidth / imgAspect
        offsetX = padding
        offsetY = padding + (availableHeight - drawHeight) / 2
      } else {
        // Image is taller relative to available space - fit to height
        drawHeight = availableHeight
        drawWidth = drawHeight * imgAspect
        offsetX = padding + (availableWidth - drawWidth) / 2
        offsetY = padding
      }

      // Ensure the image fits completely within the canvas with padding
      drawWidth = Math.min(drawWidth, availableWidth)
      drawHeight = Math.min(drawHeight, availableHeight)

      // Draw the image first to get pixel data (using display coordinates)
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
      const originalData = new Uint8ClampedArray(imageData.data)

      // Clear canvas again for effect rendering
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, displayWidth, displayHeight)

      // Use consistent effect parameters regardless of canvas resolution
      const dotSize = 2
      const spacing = effectType === "ascii" ? 8 : 3

      // Process using display coordinates but sample from high-res image data
      for (let y = 0; y < displayHeight; y += spacing) {
        for (let x = 0; x < displayWidth; x += spacing) {
          // Sample from the high-resolution image data
          const sampleX = Math.floor(x * scale)
          const sampleY = Math.floor(y * scale)
          const i = (sampleY * canvasWidth + sampleX) * 4

          if (i >= originalData.length) continue

          const r = originalData[i]
          const g = originalData[i + 1]
          const b = originalData[i + 2]

          let luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255
          luminance = Math.max(0, Math.min(1, luminance * brightness))

          let animatedSize = dotSize * (luminance * 0.8 + 0.2)
          let shouldDraw = false
          let finalR = r,
            finalG = g,
            finalB = b

          const pixelHash = hash(Math.floor(x / spacing), Math.floor(y / spacing))
          const phase = pixelHash * Math.PI * 2

          switch (effectType) {
            case "subtle-shimmer":
              const shimmerOffset = Math.sin(x * 0.02 + y * 0.02 + time * getActualSpeed(animationSpeed) * 3) * 0.15
              const shimmerOffset2 = Math.cos(x * 0.015 + y * 0.025 + time * getActualSpeed(animationSpeed) * 2) * 0.1
              const threshold = 0.5 + shimmerOffset + shimmerOffset2
              shouldDraw = luminance > threshold
              animatedSize =
                animatedSize + Math.sin(time * getActualSpeed(animationSpeed) * 4 + x * 0.1 + y * 0.1) * 0.4
              const colorShift = Math.sin(time * getActualSpeed(animationSpeed) * 2 + x * 0.01 + y * 0.01) * 15
              finalR = Math.max(0, Math.min(255, r + colorShift))
              finalG = Math.max(0, Math.min(255, g + colorShift * 0.5))
              finalB = Math.max(0, Math.min(255, b + colorShift * 0.8))
              break

            case "wave-flow":
              // Beautiful sine/cosine wave patterns
              const waveSpeed = time * getActualSpeed(animationSpeed)

              // Primary horizontal sine wave
              const horizontalWave = Math.sin(x * 0.01 + waveSpeed * 2) * 0.4

              // Secondary vertical cosine wave
              const verticalWave = Math.cos(y * 0.008 + waveSpeed * 1.5) * 0.3

              // Diagonal interference wave
              const diagonalWave = Math.sin((x + y) * 0.006 + waveSpeed * 2.5) * 0.2

              // Circular wave from center
              const centerX = displayWidth / 2
              const centerY = displayHeight / 2
              const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
              const circularWave = Math.cos(distance * 0.02 - waveSpeed * 3) * 0.25

              // Combine all waves
              const combinedWave = horizontalWave + verticalWave + diagonalWave + circularWave
              const waveThreshold = 0.5 + combinedWave * 0.3

              shouldDraw = luminance > waveThreshold

              // Dynamic size based on wave intensity
              const waveIntensity = (combinedWave + 1) / 2 // Normalize to 0-1
              animatedSize = dotSize * (luminance * 0.6 + 0.4) * (0.3 + waveIntensity * 1.2)

              // Color shifting based on wave patterns
              const colorWaveR = Math.sin(x * 0.005 + waveSpeed * 1.8) * 25
              const colorWaveG = Math.cos(y * 0.007 + waveSpeed * 2.2) * 20
              const colorWaveB = Math.sin((x + y) * 0.004 + waveSpeed * 1.6) * 30

              finalR = Math.max(0, Math.min(255, r + colorWaveR))
              finalG = Math.max(0, Math.min(255, g + colorWaveG))
              finalB = Math.max(0, Math.min(255, b + colorWaveB))
              break

            case "twinkle":
              // Use hash for consistent per-pixel phase
              const twinkleWave = Math.sin(phase + time * getActualSpeed(animationSpeed) * 2) * 0.5 + 0.5
              const twinkleThreshold = 0.3 + pixelHash * 0.3 // Vary threshold per pixel
              shouldDraw = luminance > twinkleThreshold && twinkleWave > 0.4
              animatedSize = dotSize * (luminance * 0.8 + 0.2) * (0.5 + twinkleWave * 0.8)
              // Add sparkle effect
              const sparkle = twinkleWave > 0.85 ? 1.5 : 1
              animatedSize *= sparkle
              break

            case "ascii":
              const charIndex = Math.floor(luminance * (asciiChars.length - 1))
              const char = asciiChars[charIndex]

              // More visible animation while keeping image readable
              const baseThreshold = 0.1 // Keep low threshold to show image structure

              // More noticeable flicker with multiple wave patterns
              const primaryFlicker = Math.sin(phase * 0.8 + time * getActualSpeed(animationSpeed) * 2.5) * 0.3 + 0.7
              const secondaryFlicker = Math.cos(phase * 1.3 + time * getActualSpeed(animationSpeed) * 3.2) * 0.2 + 0.8
              const tertiaryFlicker = Math.sin(phase * 0.5 + time * getActualSpeed(animationSpeed) * 1.8) * 0.15 + 0.85

              // Combine for more dynamic brightness variation
              const dynamicBrightness = primaryFlicker * secondaryFlicker * tertiaryFlicker

              // Show characters where there's image content
              const shouldShow = luminance > baseThreshold

              if (shouldShow) {
                // More dynamic alpha with better visibility
                const alpha = Math.max(0.4, Math.min(1, luminance * brightness * dynamicBrightness * 1.5))

                ctx.font = `${spacing}px monospace`
                ctx.textAlign = "center"
                ctx.textBaseline = "middle"

                // More dynamic colors with visible variation
                const colorVariation = 0.8 + dynamicBrightness * 0.4
                const dynamicR = Math.min(255, r * brightness * colorVariation)
                const dynamicG = Math.min(255, g * brightness * colorVariation)
                const dynamicB = Math.min(255, b * brightness * colorVariation)

                ctx.fillStyle = `rgba(${dynamicR}, ${dynamicG}, ${dynamicB}, ${alpha})`

                // More noticeable position animation
                const jitterX = Math.sin(phase * 0.7 + time * getActualSpeed(animationSpeed) * 2.8) * 0.8
                const jitterY = Math.cos(phase * 1.1 + time * getActualSpeed(animationSpeed) * 2.3) * 0.8

                ctx.fillText(char, x + spacing / 2 + jitterX, y + spacing / 2 + jitterY)
              }
              shouldDraw = false
              break

            case "crt":
              const crtThreshold =
                0.5 + Math.sin(x * 0.02 + y * 0.02 + time * getActualSpeed(animationSpeed) * 2) * 0.15
              shouldDraw = luminance > crtThreshold
              animatedSize =
                dotSize * (luminance * 0.8 + 0.2) + Math.sin(time * getActualSpeed(animationSpeed) * 3 + x * 0.1) * 0.3
              break
          }

          if (shouldDraw && effectType !== "ascii") {
            ctx.fillStyle = `rgb(${finalR}, ${finalG}, ${finalB})`
            ctx.beginPath()
            ctx.arc(
              x + Math.sin(time * getActualSpeed(animationSpeed) * 1.5 + x * 0.05) * 0.8,
              y + Math.cos(time * getActualSpeed(animationSpeed) * 1.2 + y * 0.05) * 0.8,
              Math.max(0.5, animatedSize),
              0,
              Math.PI * 2,
            )
            ctx.fill()
          }
        }
      }

      if (effectType === "crt") {
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.25 + Math.sin(time * getActualSpeed(animationSpeed) * 0.5) * 0.1})`
        ctx.lineWidth = 1
        for (let y = 0; y < displayHeight; y += 2) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(displayWidth, y)
          ctx.stroke()
        }

        const gradient = ctx.createRadialGradient(
          displayWidth / 2,
          displayHeight / 2,
          Math.min(displayWidth, displayHeight) * 0.3,
          displayWidth / 2,
          displayHeight / 2,
          Math.min(displayWidth, displayHeight) * 0.7,
        )
        gradient.addColorStop(0, "rgba(0,0,0,0)")
        gradient.addColorStop(1, "rgba(0,0,0,0.4)")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, displayWidth, displayHeight)
      }

      time += 1

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, animationSpeed, brightness, currentImage, effectType, hash, getActualSpeed])

  return { canvasRef }
}
