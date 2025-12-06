"use client"

import { useRef, useCallback, useEffect } from "react"

type EffectType = "subtle-shimmer" | "wave-flow" | "twinkle" | "ascii" | "crt"

interface AudioManagerProps {
  soundEnabled: boolean
  soundVolume: number
  effectType: EffectType
  isPlaying: boolean
  currentImage: HTMLImageElement | null
}

export function useAudioManager({ soundEnabled, soundVolume, effectType, isPlaying, currentImage }: AudioManagerProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null)

  // Initialize audio context with destination for recording
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      gainNodeRef.current = audioContextRef.current.createGain()
      audioDestinationRef.current = audioContextRef.current.createMediaStreamDestination()

      gainNodeRef.current.gain.value = soundVolume
      gainNodeRef.current.connect(audioContextRef.current.destination) // For speakers
      gainNodeRef.current.connect(audioDestinationRef.current) // For recording
    }
  }, [soundVolume])

  // Update volume when slider changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = soundVolume
    }
  }, [soundVolume])

  // Create high-quality looping sound effects for all effects
  const startEffectAudio = useCallback(
    (effectType: EffectType) => {
      if (!soundEnabled || !audioContextRef.current || !gainNodeRef.current) return

      // Stop ALL previous audio completely
      stopEffectAudio()

      const audioContext = audioContextRef.current
      const gainNode = gainNodeRef.current

      switch (effectType) {
        case "subtle-shimmer":
          // Beautiful ambient shimmer with multiple harmonics
          const shimmer1 = audioContext.createOscillator()
          const shimmer2 = audioContext.createOscillator()
          const shimmer3 = audioContext.createOscillator()
          const shimmerGain1 = audioContext.createGain()
          const shimmerGain2 = audioContext.createGain()
          const shimmerGain3 = audioContext.createGain()

          shimmer1.type = "sine"
          shimmer2.type = "sine"
          shimmer3.type = "triangle"
          shimmer1.frequency.value = 220
          shimmer2.frequency.value = 330
          shimmer3.frequency.value = 440

          shimmerGain1.gain.value = 0.2
          shimmerGain2.gain.value = 0.15
          shimmerGain3.gain.value = 0.1

          // Create gentle modulation for shimmer effect
          const shimmerLFO1 = audioContext.createOscillator()
          const shimmerLFO2 = audioContext.createOscillator()
          const shimmerLFOGain1 = audioContext.createGain()
          const shimmerLFOGain2 = audioContext.createGain()

          shimmerLFO1.type = "sine"
          shimmerLFO2.type = "sine"
          shimmerLFO1.frequency.value = 0.3
          shimmerLFO2.frequency.value = 0.7
          shimmerLFOGain1.gain.value = 15
          shimmerLFOGain2.gain.value = 10

          shimmerLFO1.connect(shimmerLFOGain1)
          shimmerLFO2.connect(shimmerLFOGain2)
          shimmerLFOGain1.connect(shimmer1.frequency)
          shimmerLFOGain2.connect(shimmer2.frequency)

          shimmer1.connect(shimmerGain1)
          shimmer2.connect(shimmerGain2)
          shimmer3.connect(shimmerGain3)
          shimmerGain1.connect(gainNode)
          shimmerGain2.connect(gainNode)
          shimmerGain3.connect(gainNode)

          shimmer1.start()
          shimmer2.start()
          shimmer3.start()
          shimmerLFO1.start()
          shimmerLFO2.start()

          oscillatorRef.current = shimmer1
          ;(oscillatorRef.current as any).additionalOscillators = [shimmer2, shimmer3, shimmerLFO1, shimmerLFO2]
          break

        case "wave-flow":
          // Rich ocean wave sounds with multiple layers
          const wave1 = audioContext.createOscillator()
          const wave2 = audioContext.createOscillator()
          const wave3 = audioContext.createOscillator()
          const wave4 = audioContext.createOscillator()
          const waveGain1 = audioContext.createGain()
          const waveGain2 = audioContext.createGain()
          const waveGain3 = audioContext.createGain()
          const waveGain4 = audioContext.createGain()

          wave1.type = "sine"
          wave2.type = "sine"
          wave3.type = "triangle"
          wave4.type = "sawtooth"

          wave1.frequency.value = 60
          wave2.frequency.value = 90
          wave3.frequency.value = 120
          wave4.frequency.value = 40

          waveGain1.gain.value = 0.25
          waveGain2.gain.value = 0.2
          waveGain3.gain.value = 0.15
          waveGain4.gain.value = 0.1

          // Create wave-like modulation with multiple LFOs
          const waveLFO1 = audioContext.createOscillator()
          const waveLFO2 = audioContext.createOscillator()
          const waveLFO3 = audioContext.createOscillator()
          const waveLFOGain1 = audioContext.createGain()
          const waveLFOGain2 = audioContext.createGain()
          const waveLFOGain3 = audioContext.createGain()

          waveLFO1.type = "sine"
          waveLFO2.type = "sine"
          waveLFO3.type = "triangle"
          waveLFO1.frequency.value = 0.2
          waveLFO2.frequency.value = 0.5
          waveLFO3.frequency.value = 0.8
          waveLFOGain1.gain.value = 20
          waveLFOGain2.gain.value = 15
          waveLFOGain3.gain.value = 10

          waveLFO1.connect(waveLFOGain1)
          waveLFO2.connect(waveLFOGain2)
          waveLFO3.connect(waveLFOGain3)
          waveLFOGain1.connect(wave1.frequency)
          waveLFOGain2.connect(wave2.frequency)
          waveLFOGain3.connect(wave3.frequency)

          wave1.connect(waveGain1)
          wave2.connect(waveGain2)
          wave3.connect(waveGain3)
          wave4.connect(waveGain4)
          waveGain1.connect(gainNode)
          waveGain2.connect(gainNode)
          waveGain3.connect(gainNode)
          waveGain4.connect(gainNode)

          wave1.start()
          wave2.start()
          wave3.start()
          wave4.start()
          waveLFO1.start()
          waveLFO2.start()
          waveLFO3.start()

          oscillatorRef.current = wave1
          ;(oscillatorRef.current as any).additionalOscillators = [wave2, wave3, wave4, waveLFO1, waveLFO2, waveLFO3]
          break

        case "twinkle":
          // Magical ambient sparkle with continuous twinkling
          const twinkleBase = audioContext.createOscillator()
          const twinkleBaseGain = audioContext.createGain()

          twinkleBase.type = "sine"
          twinkleBase.frequency.value = 660
          twinkleBaseGain.gain.value = 0.1

          // Create sparkle modulation
          const twinkleLFO = audioContext.createOscillator()
          const twinkleLFOGain = audioContext.createGain()
          twinkleLFO.type = "triangle"
          twinkleLFO.frequency.value = 1.5
          twinkleLFOGain.gain.value = 200

          twinkleLFO.connect(twinkleLFOGain)
          twinkleLFOGain.connect(twinkleBase.frequency)

          // Add high frequency sparkles
          const sparkle1 = audioContext.createOscillator()
          const sparkle2 = audioContext.createOscillator()
          const sparkleGain1 = audioContext.createGain()
          const sparkleGain2 = audioContext.createGain()

          sparkle1.type = "triangle"
          sparkle2.type = "sine"
          sparkle1.frequency.value = 1320
          sparkle2.frequency.value = 1760

          sparkleGain1.gain.value = 0.08
          sparkleGain2.gain.value = 0.06

          // Modulate sparkles
          const sparkleLFO1 = audioContext.createOscillator()
          const sparkleLFO2 = audioContext.createOscillator()
          const sparkleLFOGain1 = audioContext.createGain()
          const sparkleLFOGain2 = audioContext.createGain()

          sparkleLFO1.type = "sine"
          sparkleLFO2.type = "sine"
          sparkleLFO1.frequency.value = 2.3
          sparkleLFO2.frequency.value = 3.1
          sparkleLFOGain1.gain.value = 0.05
          sparkleLFOGain2.gain.value = 0.04

          sparkleLFO1.connect(sparkleLFOGain1)
          sparkleLFO2.connect(sparkleLFOGain2)
          sparkleLFOGain1.connect(sparkleGain1.gain)
          sparkleLFOGain2.connect(sparkleGain2.gain)

          twinkleBase.connect(twinkleBaseGain)
          sparkle1.connect(sparkleGain1)
          sparkle2.connect(sparkleGain2)
          twinkleBaseGain.connect(gainNode)
          sparkleGain1.connect(gainNode)
          sparkleGain2.connect(gainNode)

          twinkleBase.start()
          sparkle1.start()
          sparkle2.start()
          twinkleLFO.start()
          sparkleLFO1.start()
          sparkleLFO2.start()

          oscillatorRef.current = twinkleBase
          ;(oscillatorRef.current as any).additionalOscillators = [
            sparkle1,
            sparkle2,
            twinkleLFO,
            sparkleLFO1,
            sparkleLFO2,
          ]
          break

        case "ascii":
          // Retro computer sounds
          const ascii1 = audioContext.createOscillator()
          const ascii2 = audioContext.createOscillator()
          const asciiGain1 = audioContext.createGain()
          const asciiGain2 = audioContext.createGain()

          ascii1.type = "square"
          ascii2.type = "square"
          ascii1.frequency.value = 220
          ascii2.frequency.value = 110

          asciiGain1.gain.value = 0.15
          asciiGain2.gain.value = 0.1

          // Create digital-style modulation
          const asciiLFO = audioContext.createOscillator()
          const asciiLFOGain = audioContext.createGain()
          asciiLFO.type = "square"
          asciiLFO.frequency.value = 2
          asciiLFOGain.gain.value = 50

          asciiLFO.connect(asciiLFOGain)
          asciiLFOGain.connect(ascii1.frequency)

          ascii1.connect(asciiGain1)
          ascii2.connect(asciiGain2)
          asciiGain1.connect(gainNode)
          asciiGain2.connect(gainNode)

          ascii1.start()
          ascii2.start()
          asciiLFO.start()

          oscillatorRef.current = ascii1
          ;(oscillatorRef.current as any).additionalOscillators = [ascii2, asciiLFO]
          break

        case "crt":
          // CRT monitor hum and buzz
          const crtHum = audioContext.createOscillator()
          const crtBuzz = audioContext.createOscillator()
          const crtHumGain = audioContext.createGain()
          const crtBuzzGain = audioContext.createGain()

          crtHum.type = "sawtooth"
          crtBuzz.type = "square"
          crtHum.frequency.value = 60 // Power line hum
          crtBuzz.frequency.value = 15734 // Horizontal sync frequency

          crtHumGain.gain.value = 0.3
          crtBuzzGain.gain.value = 0.05

          // Add some modulation to the buzz
          const crtLFO = audioContext.createOscillator()
          const crtLFOGain = audioContext.createGain()
          crtLFO.type = "sine"
          crtLFO.frequency.value = 0.1
          crtLFOGain.gain.value = 0.02

          crtLFO.connect(crtLFOGain)
          crtLFOGain.connect(crtBuzzGain.gain)

          crtHum.connect(crtHumGain)
          crtBuzz.connect(crtBuzzGain)
          crtHumGain.connect(gainNode)
          crtBuzzGain.connect(gainNode)

          crtHum.start()
          crtBuzz.start()
          crtLFO.start()

          oscillatorRef.current = crtHum
          ;(oscillatorRef.current as any).additionalOscillators = [crtBuzz, crtLFO]
          break
      }
    },
    [soundEnabled],
  )

  const stopEffectAudio = useCallback(() => {
    if (oscillatorRef.current) {
      try {
        // Stop main oscillator
        oscillatorRef.current.stop()

        // Stop additional oscillators if they exist
        if ((oscillatorRef.current as any).additionalOscillators) {
          ;(oscillatorRef.current as any).additionalOscillators.forEach((osc: OscillatorNode) => {
            try {
              osc.stop()
            } catch (e) {
              // Oscillator might already be stopped
            }
          })
        }

        // Clear sparkle interval if it exists
        if ((oscillatorRef.current as any).sparkleInterval) {
          clearInterval((oscillatorRef.current as any).sparkleInterval)
        }
      } catch (e) {
        // Oscillator might already be stopped
      }

      oscillatorRef.current = null
    }
  }, [])

  const toggleSound = useCallback(() => {
    if (!soundEnabled) {
      initAudio()
      if (currentImage && isPlaying) {
        startEffectAudio(effectType)
      }
    } else {
      stopEffectAudio()
    }
  }, [soundEnabled, initAudio, startEffectAudio, stopEffectAudio, currentImage, effectType, isPlaying])

  // Start/stop audio when effect changes or playback state changes
  useEffect(() => {
    if (soundEnabled && currentImage) {
      if (isPlaying) {
        stopEffectAudio()
        startEffectAudio(effectType)
      } else {
        stopEffectAudio()
      }
    }
  }, [effectType, soundEnabled, currentImage, isPlaying, startEffectAudio, stopEffectAudio])

  // Initialize audio on mount
  useEffect(() => {
    initAudio()
  }, [initAudio])

  return {
    audioDestinationRef,
    toggleSound,
    stopEffectAudio,
  }
}
