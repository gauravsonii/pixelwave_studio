"use client"

import { useRef, useState, useCallback } from "react"

export function useVideoRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [isRecording, setIsRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(5)

  // Function to get supported MIME type
  const getSupportedMimeType = useCallback(() => {
    const types = [
      'video/mp4; codecs="avc1.42E01E,mp4a.40.2"',
      "video/mp4",
      "video/webm; codecs=vp9,opus",
      "video/webm; codecs=vp8,opus",
      "video/webm",
    ]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }
    return "video/webm" // fallback
  }, [])

  const startRecording = useCallback(
    (canvas: HTMLCanvasElement, audioDestination?: MediaStreamAudioDestinationNode, soundEnabled?: boolean) => {
      if (!canvas) return

      recordedChunksRef.current = []
      setVideoBlob(null)

      try {
        // MP4/WebM recording
        const canvasStream = canvas.captureStream(30) // 30 FPS for video
        let combinedStream = canvasStream

        if (soundEnabled && audioDestination) {
          const audioStream = audioDestination.stream
          combinedStream = new MediaStream([...canvasStream.getVideoTracks(), ...audioStream.getAudioTracks()])
        }

        const mimeType = getSupportedMimeType()
        const recorder = new MediaRecorder(combinedStream, { mimeType })

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data)
          }
        }

        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, {
            type: mimeType.includes("mp4") ? "video/mp4" : "video/webm",
          })
          setVideoBlob(blob)
          setIsRecording(false)
          if (recordingTimeoutRef.current) {
            clearTimeout(recordingTimeoutRef.current)
          }
        }

        recorder.onerror = (event) => {
          console.error("MediaRecorder error:", event)
          setIsRecording(false)
          if (recordingTimeoutRef.current) {
            clearTimeout(recordingTimeoutRef.current)
          }
        }

        recorder.start(100)
        setIsRecording(true)
        mediaRecorderRef.current = recorder

        recordingTimeoutRef.current = setTimeout(
          () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
              mediaRecorderRef.current.stop()
            }
          },
          recordingDuration * 1000 + 100,
        )
      } catch (error) {
        console.error("Error starting recording:", error)
        setIsRecording(false)
      }
    },
    [recordingDuration, getSupportedMimeType],
  )

  const downloadVideo = useCallback(() => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob)
      const a = document.createElement("a")
      a.href = url

      const extension = videoBlob.type.includes("mp4") ? "mp4" : "webm"
      a.download = `pixelwave-${Date.now()}.${extension}`

      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }, [videoBlob])

  const discardVideo = useCallback(() => {
    setVideoBlob(null)
    recordedChunksRef.current = []
  }, [])

  const previewVideo = useCallback(() => {
    if (videoBlob) {
      const url = URL.createObjectURL(videoBlob)
      window.open(url, "_blank")
    }
  }, [videoBlob])

  const clearVideo = useCallback(() => {
    setVideoBlob(null)
    recordedChunksRef.current = []
  }, [])

  return {
    isRecording,
    videoBlob,
    recordingDuration,
    setRecordingDuration,
    startRecording,
    downloadVideo,
    discardVideo,
    previewVideo,
    clearVideo,
  }
}
