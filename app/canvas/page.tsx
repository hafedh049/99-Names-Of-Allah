"use client"

import { CanvasVisualization } from "@/components/canvas-visualization"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CanvasPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Names
            </Button>
          </Link>
        </div>

        <section className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
            Canvas Visualization
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Interactive visualization of the 99 names of Allah arranged in a circular pattern
          </p>
        </section>

        <div className="rounded-xl p-4 border border-border">
          <CanvasVisualization />
        </div>
      </main>
      <Footer />
    </div>
  )
}

