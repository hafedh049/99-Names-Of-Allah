"use client"

import { useEffect, useRef, useState } from "react"
import { namesOfAllah } from "@/data/names"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

export function CanvasVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [hoveredName, setHoveredName] = useState<{
    name: string
    meaning: string
    arabic: string
    index: number
    x: number
    y: number
  } | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 800 })
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [bgColor, setBgColor] = useState("#111827")

  // Handle resize and theme changes
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        const size = Math.min(width, height)
        setCanvasSize({ width: size, height: size })
      }
    }

    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setIsDarkMode(isDark)

      // Get the computed background color from the container
      if (containerRef.current) {
        const computedStyle = window.getComputedStyle(containerRef.current)
        setBgColor(computedStyle.backgroundColor)
      }
    }

    // Initial checks
    handleResize()
    checkTheme()

    // Set up observers
    window.addEventListener("resize", handleResize)

    // Create a mutation observer to watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      window.removeEventListener("resize", handleResize)
      observer.disconnect()
    }
  }, [])

  // Draw the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvasSize.width
    canvas.height = canvasSize.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Use the website's background color
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add subtle background pattern
    ctx.save()
    ctx.globalAlpha = isDarkMode ? 0.05 : 0.03
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const radius = Math.random() * 2
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fillStyle = isDarkMode ? "#10b981" : "#38b2ac"
      ctx.fill()
    }
    ctx.restore()

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.75 * zoom
    const innerCircleRadius = radius * 0.3

    // Draw decorative outer circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 1.05, 0, Math.PI * 2)
    ctx.strokeStyle = isDarkMode ? "rgba(16, 185, 129, 0.15)" : "rgba(56, 178, 172, 0.2)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw decorative inner circle with fill
    ctx.beginPath()
    ctx.arc(centerX, centerY, innerCircleRadius, 0, Math.PI * 2)
    ctx.fillStyle = isDarkMode ? "rgba(16, 185, 129, 0.05)" : "rgba(56, 178, 172, 0.05)"
    ctx.fill()
    ctx.strokeStyle = isDarkMode ? "rgba(16, 185, 129, 0.2)" : "rgba(56, 178, 172, 0.25)"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw Allah in the center of the inner circle with glow effect
    ctx.save()
    // Add glow effect
    ctx.shadowColor = isDarkMode ? "rgba(16, 185, 129, 0.6)" : "rgba(56, 178, 172, 0.7)"
    ctx.shadowBlur = 15

    // Calculate font size to fit within inner circle
    const fontSize = innerCircleRadius * 0.7
    ctx.font = `bold ${fontSize}px 'Amiri', serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Create gradient for center text
    const gradient = ctx.createLinearGradient(
      centerX - innerCircleRadius * 0.5,
      centerY,
      centerX + innerCircleRadius * 0.5,
      centerY,
    )

    if (isDarkMode) {
      gradient.addColorStop(0, "#10b981")
      gradient.addColorStop(0.5, "#14b8a6")
      gradient.addColorStop(1, "#0d9488")
    } else {
      gradient.addColorStop(0, "#0d9488")
      gradient.addColorStop(0.5, "#0f766e")
      gradient.addColorStop(1, "#0f766e")
    }

    ctx.fillStyle = gradient
    ctx.fillText("الله", centerX, centerY)
    ctx.restore()

    // Draw names in a circle
    const totalNames = namesOfAllah.length

    // Calculate optimal spacing to prevent collisions
    const spacingFactor = 1.8 // Increased spacing
    const angleStep = (Math.PI * 2) / totalNames

    // Calculate adaptive node size based on total names and available space
    const circumference = 2 * Math.PI * radius
    const maxNodeSize = Math.min(radius * 0.06, (circumference / totalNames) * 0.4)

    // Function to calculate text width
    const getTextWidth = (text, font) => {
      ctx.font = font
      const metrics = ctx.measureText(text)
      return metrics.width
    }

    namesOfAllah.forEach((name, index) => {
      const angle = index * angleStep + rotation

      // Calculate position with adjusted radius to prevent inner collisions
      // Names with longer text are placed slightly further out
      const nameLength = name.arabic.length
      const radiusAdjustment = 1 + (nameLength > 4 ? 0.05 : 0)
      const x = centerX + Math.cos(angle) * radius * radiusAdjustment
      const y = centerY + Math.sin(angle) * radius * radiusAdjustment

      // Draw connection line with gradient
      const lineGradient = ctx.createLinearGradient(centerX, centerY, x, y)
      if (isDarkMode) {
        lineGradient.addColorStop(0, "rgba(16, 185, 129, 0.1)")
        lineGradient.addColorStop(1, "rgba(16, 185, 129, 0.3)")
      } else {
        lineGradient.addColorStop(0, "rgba(56, 178, 172, 0.1)")
        lineGradient.addColorStop(1, "rgba(56, 178, 172, 0.3)")
      }

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = lineGradient
      ctx.lineWidth = 1
      ctx.stroke()

      // Determine if this is the hovered name
      const isHovered = hoveredName && hoveredName.index === index

      // Calculate adaptive font size based on available space
      const fontSize = Math.min(maxNodeSize * 1.2, radius * 0.04)
      const font = `${isHovered ? "bold " : ""}${fontSize}px 'Amiri', serif`
      const textWidth = getTextWidth(name.arabic, font)

      // Draw name with slight shadow for better readability
      ctx.save()

      // Add glow effect for hovered name
      if (isHovered) {
        ctx.shadowColor = isDarkMode ? "rgba(16, 185, 129, 0.8)" : "rgba(56, 178, 172, 0.9)"
        ctx.shadowBlur = 15
      } else {
        ctx.shadowColor = isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.3)"
        ctx.shadowBlur = 4
      }

      ctx.font = font
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = isHovered ? (isDarkMode ? "#10b981" : "#0d9488") : isDarkMode ? "#e2e8f0" : "#1e293b"
      ctx.fillText(name.arabic, x, y)
      ctx.restore()
    })

    // Check if mouse is hovering over a name
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      let hovered = null

      namesOfAllah.forEach((name, index) => {
        const angle = index * angleStep + rotation
        const nameLength = name.arabic.length
        const radiusAdjustment = 1 + (nameLength > 4 ? 0.05 : 0)
        const x = centerX + Math.cos(angle) * radius * radiusAdjustment
        const y = centerY + Math.sin(angle) * radius * radiusAdjustment

        // Calculate font size for hit testing
        const fontSize = Math.min(maxNodeSize * 1.2, radius * 0.04)
        const font = `${fontSize}px 'Amiri', serif`
        const textWidth = getTextWidth(name.arabic, font)

        // Use a slightly larger hit area for better usability
        const hitRadius = textWidth / 1.5

        const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2)
        if (distance <= hitRadius) {
          hovered = {
            name: name.transliteration,
            meaning: name.meaning,
            arabic: name.arabic,
            index: index,
            x: x,
            y: y,
          }
        }
      })

      setHoveredName(hovered)
      canvas.style.cursor = hovered ? "pointer" : "default"
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    return () => canvas.removeEventListener("mousemove", handleMouseMove)
  }, [rotation, zoom, canvasSize, isDarkMode, bgColor, hoveredName])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      // Only rotate if not hovering over a name and if playing is enabled
      if (isPlaying && !hoveredName) {
        setRotation((prev) => prev + 0.0005) // Slower, smoother rotation
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationRef.current)
  }, [isPlaying, hoveredName])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setRotation(0)
    setZoom(1)
  }

  return (
    <div className="flex flex-col items-center">
      <div ref={containerRef} className="canvas-container relative mb-4 overflow-hidden bg-background rounded-xl">
        <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} className="mx-auto" />

        {hoveredName && (
          <div
            className={`absolute p-4 rounded-lg shadow-lg text-center border border-primary/20 animate-fade-in backdrop-blur-md ${
              isDarkMode ? "bg-gray-900/90" : "bg-gray-100/90"
            }`}
            style={{
              left: `${hoveredName.x}px`,
              top: `${hoveredName.y + 30}px`,
              transform: "translate(-50%, 0)",
              maxWidth: "250px",
              zIndex: 10,
            }}
          >
            <div className="arabic-text text-2xl font-bold mb-1 text-primary">{hoveredName.arabic}</div>
            <div className="font-medium text-lg mb-1">{hoveredName.name}</div>
            <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{hoveredName.meaning}</div>
            <div className="mt-2 pt-2 border-t border-primary/10 text-xs text-muted-foreground">
              Click to learn more
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={handlePlayPause} className="w-10 h-10">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset} className="w-10 h-10">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

