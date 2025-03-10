"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MoonStar, Sun, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const pathname = usePathname()

  // Initialize theme from localStorage on mount
  useEffect(() => {
    // Get saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem("theme")
    const prefersDark =
      savedTheme === "dark" || (savedTheme === null && window.matchMedia("(prefers-color-scheme: dark)").matches)

    setIsDarkMode(prefersDark)

    // Apply the theme
    applyTheme(prefersDark)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Function to apply theme to document
  const applyTheme = (isDark) => {
    if (isDark) {
      // Dark mode
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
      document.documentElement.classList.remove("neumorphic")
    } else {
      // Neumorphic light mode
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      document.documentElement.classList.add("neumorphic")
    }
  }

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)

    // Save preference to localStorage
    localStorage.setItem("theme", newMode ? "dark" : "light")

    // Apply the theme
    applyTheme(newMode)
  }

  return (
    <header
      className={`sticky top-0 z-50 ${
        isDarkMode
          ? "border-b border-gray-800 bg-black/90 backdrop-blur-sm"
          : "border-b border-gray-200 bg-gray-100/90 backdrop-blur-sm shadow-neumorphic-header"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
              أسماء الله الحسنى
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === "/" ? "bg-primary text-primary-foreground" : "text-gray-300 hover:text-white",
                )}
              >
                Names List
              </Button>
            </Link>
            <Link href="/canvas">
              <Button
                variant={pathname === "/canvas" ? "default" : "ghost"}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === "/canvas" ? "bg-primary text-primary-foreground" : "text-gray-300 hover:text-white",
                )}
              >
                Canvas View
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`${
                isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900 shadow-neumorphic"
              }`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`mr-2 ${isDarkMode ? "text-gray-300" : "text-gray-700 shadow-neumorphic"}`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={isDarkMode ? "text-gray-300" : "text-gray-700 shadow-neumorphic"}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 animate-fade-in">
            <nav className="flex flex-col space-y-3">
              <Link href="/">
                <Button variant={pathname === "/" ? "default" : "ghost"} className="w-full justify-start">
                  Names List
                </Button>
              </Link>
              <Link href="/canvas">
                <Button variant={pathname === "/canvas" ? "default" : "ghost"} className="w-full justify-start">
                  Canvas View
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

