"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

// macOS-inspired loading spinner component
export const MacOSSpinner = ({ size = 24 }: { size?: number }) => {
  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="relative" style={{ width: size, height: size }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-muted-foreground rounded-full animate-macos-spinner"
            style={{
              width: size * 0.08,
              height: size * 0.25,
              left: "50%",
              top: "10%",
              transformOrigin: `0 ${size * 0.4}px`,
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
              animationDelay: `${i * 0.083}s`,
              opacity: 0.3 + (i / 12) * 0.7,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Theme toggle component
export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-transparent">
        <div className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-9 h-9 sm:w-10 sm:h-10 transition-all duration-200 hover:scale-105"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
