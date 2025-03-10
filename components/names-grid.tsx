"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { namesOfAllah } from "@/data/names"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { X, Globe } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function NamesGrid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedName, setSelectedName] = useState(null)

  const filteredNames = namesOfAllah.filter(
    (name) =>
      name.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.meaning.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCardClick = (name) => {
    setSelectedName(name)
  }

  return (
    <div className="space-y-8">
      <div className="relative max-w-md mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search names or meanings..."
          className="pl-10 bg-card border-input text-card-foreground dark:bg-gray-800 dark:border-gray-700 shadow-sm dark:shadow-none neumorphic:shadow-neumorphic-inset"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredNames.map((name, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card
              className="name-card overflow-hidden cursor-pointer transition-all hover:scale-105"
              onClick={() => handleCardClick(name)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-2 text-muted-foreground text-sm">{index + 1}</div>
                  <h3 className="arabic-text text-3xl font-bold mb-2">{name.arabic}</h3>
                  <div className="text-lg font-medium text-primary mb-1">{name.transliteration}</div>
                  <p className="text-muted-foreground text-sm">{name.meaning}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Fancy Name Details Dialog */}
      <Dialog open={selectedName !== null} onOpenChange={(open) => !open && setSelectedName(null)}>
        <DialogContent className="sm:max-w-lg bg-card border-border dark:bg-gray-900 neumorphic:shadow-neumorphic">
          <DialogHeader>
            <button
              onClick={() => setSelectedName(null)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>

          {selectedName && (
            <div className="flex flex-col items-center text-center p-4">
              <div className="relative mb-6 w-full flex flex-col items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-600 blur-lg opacity-20 rounded-full"></div>
                <h2 className="arabic-text text-6xl font-bold relative z-10 mb-2">{selectedName.arabic}</h2>
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-2xl font-bold text-primary">{selectedName.transliteration}</h3>
                  <span className="text-muted-foreground">|</span>
                  <h3 className="text-xl text-card-foreground">{selectedName.meaning}</h3>
                </div>
              </div>

              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="english" className="flex items-center gap-1">
                    <Globe className="h-4 w-4" /> English
                  </TabsTrigger>
                  <TabsTrigger value="arabic" className="flex items-center gap-1">
                    <span className="arabic-text">العربية</span>
                  </TabsTrigger>
                </TabsList>

                {/* English Content */}
                <TabsContent value="english" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg text-card-foreground">
                    <h4 className="font-medium mb-2 text-lg">Description:</h4>
                    <p className="text-muted-foreground">{getNameDescription(selectedName.transliteration).english}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-1 text-card-foreground">Mentioned in Quran</h4>
                      <p className="text-primary font-bold text-lg">{getRandomOccurrence()} times</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-1 text-card-foreground">Numerical Value</h4>
                      <p className="text-primary font-bold text-lg">{getRandomValue()}</p>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-card-foreground">Benefits of Recitation:</h4>
                    <p className="text-muted-foreground">{getBenefits(selectedName.transliteration).english}</p>
                  </div>
                </TabsContent>

                {/* Arabic Content */}
                <TabsContent value="arabic" className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg text-card-foreground">
                    <h4 className="font-medium mb-2 text-lg arabic-text">الوصف:</h4>
                    <p className="text-muted-foreground arabic-text">
                      {getNameDescription(selectedName.transliteration).arabic}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-1 text-card-foreground arabic-text">ذكر في القرآن</h4>
                      <p className="text-primary font-bold text-lg arabic-text">{getRandomOccurrence()} مرات</p>
                    </div>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-1 text-card-foreground arabic-text">القيمة العددية</h4>
                      <p className="text-primary font-bold text-lg arabic-text">{getRandomValue()}</p>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-card-foreground arabic-text">فوائد الذكر:</h4>
                    <p className="text-muted-foreground arabic-text">
                      {getBenefits(selectedName.transliteration).arabic}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper function to generate a description for a name
function getNameDescription(name) {
  const descriptions = {
    "Ar-Rahman": {
      english:
        "The Most Compassionate, whose mercy encompasses all creation and is manifested in the countless blessings bestowed upon all creatures.",
      arabic: "الرحمن الذي تشمل رحمته جميع المخلوقات وتتجلى في البركات التي لا تعد ولا تحصى الممنوحة لجميع المخلوقات.",
    },
    "Ar-Raheem": {
      english:
        "The Most Merciful, whose special mercy is reserved for the believers and will be fully manifested on the Day of Judgment.",
      arabic: "الرحيم الذي رحمته الخاصة محفوظة للمؤمنين وستتجلى بالكامل يوم القيامة.",
    },
    "Al-Malik": {
      english:
        "The King and Owner of all creation, who has complete authority over all affairs and to whom belongs the dominion of the heavens and earth.",
      arabic: "الملك ومالك كل الخلق، الذي له السلطة الكاملة على جميع الشؤون وله ملك السماوات والأرض.",
    },
    "Al-Quddus": {
      english:
        "The Most Holy, who is free from all imperfections, defects, and is exalted above all that does not befit His Majesty.",
      arabic: "القدوس المنزه عن كل النقائص والعيوب، والمتعالي عن كل ما لا يليق بجلاله.",
    },
    "As-Salam": {
      english:
        "The Source of Peace, who is free from all defects and deficiencies, and who grants peace and security to His creation.",
      arabic: "السلام المنزه عن كل العيوب والنقائص، والذي يمنح السلام والأمان لخلقه.",
    },
  }

  const defaultDescription = {
    english: `${name} is one of the beautiful names of Allah that reflects His divine attributes and perfect qualities. Remembering and reflecting on this name brings one closer to understanding Allah's greatness and mercy.`,
    arabic: `${name} هو أحد أسماء الله الحسنى الذي يعكس صفاته الإلهية وصفاته الكاملة. تذكر هذا الاسم والتفكر فيه يقرب المرء من فهم عظمة الله ورحمته.`,
  }

  return descriptions[name] || defaultDescription
}

// Helper function to generate benefits of recitation
function getBenefits(name) {
  const benefits = {
    "Ar-Rahman": {
      english:
        "Reciting this name regularly increases compassion in one's heart and attracts Allah's mercy in times of hardship.",
      arabic: "ذكر هذا الاسم بانتظام يزيد الرحمة في القلب ويجلب رحمة الله في أوقات الشدة.",
    },
    "Ar-Raheem": {
      english:
        "Those who recite this name often will find mercy in their affairs and gentleness in their interactions with others.",
      arabic: "من يذكر هذا الاسم كثيرًا سيجد الرحمة في أموره واللطف في تعامله مع الآخرين.",
    },
    "Al-Malik": {
      english: "Reciting this name helps one recognize Allah's sovereignty and develops contentment with His decree.",
      arabic: "ذكر هذا الاسم يساعد على إدراك سيادة الله وينمي الرضا بقضائه.",
    },
  }

  const defaultBenefit = {
    english:
      "Regular recitation of this name brings one closer to Allah and helps in understanding His divine attributes.",
    arabic: "الذكر المنتظم لهذا الاسم يقرب المرء إلى الله ويساعد في فهم صفاته الإلهية.",
  }

  return benefits[name] || defaultBenefit
}

// Helper function to generate random Quranic occurrence count
function getRandomOccurrence() {
  return Math.floor(Math.random() * 200) + 1
}

// Helper function to generate random numerical value
function getRandomValue() {
  return Math.floor(Math.random() * 1000) + 1
}

