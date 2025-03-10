import { NamesGrid } from "@/components/names-grid"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-600 bg-clip-text text-transparent">
            أسماء الله الحسنى
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            The 99 Beautiful Names of Allah
          </p>
        </section>

        <NamesGrid />
      </main>
      <Footer />
    </div>
  )
}

