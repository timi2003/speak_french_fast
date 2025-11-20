"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import ExamPreview from "./exam-preview"
import PreTestScreen from "./pre-test-screen"
import ListeningSection from "./sections/listening-section"
import ReadingSection from "./sections/reading-section"
import WritingSection from "./sections/writing-section"
import SpeakingSection from "./sections/speaking-section"
import YouTubeVideoSection from "./sections/youtube-video-section"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ExamInterfaceProps {
  exam: any
  sections: any[]
  userId: string
}

export default function ExamInterface({ exam, sections, userId }: ExamInterfaceProps) {
  const [currentSection, setCurrentSection] = useState<number | null>(null)
  const [showPreview, setShowPreview] = useState(true)
  const [showPreTest, setShowPreTest] = useState(true)
  const [examAttemptId, setExamAttemptId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isStartingSection, setIsStartingSection] = useState(false)
  const router = useRouter()

  const handleStartExam = async () => {
    const supabase = createClient()
    const clientIp = await fetch("/api/get-ip")
      .then((r) => r.json())
      .then((d) => d.ip)
      .catch(() => "unknown")

    const { data: attempt, error } = await supabase
      .from("exam_attempts")
      .insert({
        student_id: userId,
        exam_id: exam.id,
        status: "in_progress",
        ip_address: clientIp,
      })
      .select()
      .single()

    if (error) {
      console.error("Failed to create exam attempt:", error)
      return
    }

    setExamAttemptId(attempt.id)
    setShowPreview(false)
    setCurrentSection(0)
  }

  const handleStartSection = () => {
    setShowPreTest(false)
  }

  if (showPreview) {
    return <ExamPreview exam={exam} sections={sections} onStart={handleStartExam} />
  }

  if (currentSection === null) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const section = sections[currentSection]
  const progress = ((currentSection + 1) / sections.length) * 100

  if (
    showPreTest &&
    ["comprehension_orale", "comprehension_ecrite", "expression_ecrite", "expression_orale"].includes(
      section.section_type,
    )
  ) {
    return <PreTestScreen section={section} onStart={handleStartSection} isLoading={isStartingSection} />
  }

  const handleSubmitExam = async () => {
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      await supabase
        .from("exam_attempts")
        .update({ status: "submitted", end_time: new Date().toISOString() })
        .eq("id", examAttemptId)

      router.push(`/exam/${exam.id}/results`)
    } catch (error) {
      console.error("Failed to submit exam:", error)
      alert("Failed to submit exam. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
      setShowPreTest(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with progress */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow sticky top-4 z-10">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-2">{section.title}</h1>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-600 mt-1">
                Section {currentSection + 1} of {sections.length}
              </p>
            </div>
            <div className="text-sm font-semibold text-gray-600 whitespace-nowrap">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </div>

        <div className="mb-8">
          {section.section_type === "comprehension_orale" && <ListeningSection section={section} userId={userId} />}
          {section.section_type === "comprehension_ecrite" && <ReadingSection section={section} userId={userId} />}
          {section.section_type === "expression_ecrite" && <WritingSection section={section} userId={userId} />}
          {section.section_type === "expression_orale" && <SpeakingSection section={section} userId={userId} />}
          {section.section_type === "youtube_video_report" && <YouTubeVideoSection section={section} userId={userId} />}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-between sticky bottom-4 bg-white p-4 rounded-lg shadow">
          <Button
            variant="outline"
            disabled={currentSection === 0}
            onClick={() => {
              setCurrentSection(currentSection - 1)
              setShowPreTest(true)
            }}
          >
            Previous Section
          </Button>

          <div className="flex gap-2">
            {currentSection < sections.length - 1 ? (
              <Button onClick={handleNextSection} className="bg-blue-600 hover:bg-blue-700">
                Next Section
              </Button>
            ) : (
              <Button onClick={handleSubmitExam} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? "Submitting..." : "Submit Exam"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
