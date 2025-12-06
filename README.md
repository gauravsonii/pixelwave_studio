<h1 align="center">PixelWave Studio</h1>

<p align="center">

<img src ="https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white">
<img src ="https://img.shields.io/badge/v0-000000.svg?style=for-the-badge&logo=v0&logoColor=white">
<img src ="https://img.shields.io/badge/TailwindCSS-000000.svg?style=for-the-badge&logo=TailwindCSS&logoColor=white">
<img src ="https://img.shields.io/badge/Vercel-000000.svg?style=for-the-badge&logo=Vercel&logoColor=white">

</p>

![PixelWave Studio](https://pixelwave-studio.vercel.app/og-image.png)

A retro-futuristic web application that brings the nostalgic charm of CRT monitors and vintage computer graphics to modern image processing. Built with Next.js, TypeScript, and Canvas API.

## Features

- 🖼️ **Image Upload & Processing** - Drag & drop or browse to upload images
- 🎨 **Real-time Dithering Effects** - Multiple vintage algorithms (Floyd-Steinberg, Ordered, Random)
- 📺 **CRT Monitor Simulation** - Authentic retro display with scanlines and curvature
- 🎵 **Audio Integration** - Ambient soundscapes and interactive audio feedback
- 📹 **Video Recording** - Export your creations as MP4 videos
- 🎮 **Interactive Controls** - Real-time parameter adjustment
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile


## Implementation

### **Canvas Rendering Engine**
The heart of the application lies in `canvas-renderer.tsx`, which implements:
- **Real-time dithering algorithms** using pixel manipulation
- **CRT simulation effects** with scanlines, curvature, and phosphor glow
- **Responsive canvas sizing** that adapts to different screen sizes
- **Performance optimization** with requestAnimationFrame loops

### **Dithering Algorithms**
- **Floyd-Steinberg**: Error diffusion dithering for smooth gradients
- **Ordered Dithering**: Pattern-based dithering using Bayer matrices
- **Random Dithering**: Noise-based approach for artistic effects
- **Threshold**: Simple binary conversion with adjustable levels

### **Audio System**
The `audio-manager.tsx` component provides:
- **Ambient soundscapes** for immersive experience
- **Interactive audio feedback** responding to user actions
- **Web Audio API integration** for real-time audio processing
- **Volume controls** and audio state management

### **Video Recording**
Built-in screen recording via `video-recorder.tsx`:
- **MediaRecorder API** for capturing canvas output
- **MP4 export** with configurable quality settings
- **Real-time preview** during recording
- **Download management** for exported videos

## License

This project is open source and available under the [MIT License](LICENSE).


## Acknowledgments

This project was completely made in [v0.app](https://v0.app), you can find the project [here](https://v0.app/chat/pixel-wave-studio-uSE9p11dsVA).
