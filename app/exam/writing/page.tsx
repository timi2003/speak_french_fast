"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ArrowLeft, PenTool, Save, CheckCircle, AlertCircle } from "lucide-react";
import WritingTimer from "@/components/exam/writing-timer";
import { Textarea } from "@/components/ui/textarea";

export default function WritingExamPage() {
  const router = useRouter();
  const [question, setQuestion] = useState<any>(null);
  const [essayText, setEssayText] = useState("");
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "unsaved">("unsaved");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    // Load draft from localStorage
    const saved = localStorage.getItem(`writing_draft_${question?.id}`);
    if (saved) {
      setEssayText(saved);
      setAutoSaveStatus("saved");
    }
  }, [question?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (essayText.trim() && autoSaveStatus !== "saving") {
        saveProgress();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [essayText, autoSaveStatus]);

  const fetchQuestion = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("question_bank")
        .select("*")
        .eq("module", "writing")
        .limit(1)
        .single();

      if (data) setQuestion(data);
    } catch (error) {
      console.error("[SFF] Error fetching writing prompt:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async () => {
    if (!essayText.trim()) return;

    setAutoSaveStatus("saving");
    try {
      localStorage.setItem(`writing_draft_${question?.id}`, essayText);
      setAutoSaveStatus("saved");

      setTimeout(() => {
        if (autoSaveStatus === "saved") setAutoSaveStatus("unsaved");
      }, 3000);
    } catch (err) {
      setAutoSaveStatus("unsaved");
    }
  };

  const submitExam = async () => {
    if (!essayText.trim() || essayText.trim().split(/\s+/).length < 150) {
      alert("Please write at least 150 words before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Call AI grading
      const gradeRes = await fetch("/api/exam/grade-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay: essayText, question: question?.question_text }),
      });

      const aiFeedback = await gradeRes.json();

      // Submit exam
      const submitRes = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_name: "writing",
          questions_attempted: [{
            question_id: question?.id,
            answer: essayText,
            correct: true,
            ai_feedback: aiFeedback,
          }],
          time_taken_seconds: 3600 - timeLeft,
        }),
      });

      if (submitRes.ok) {
        localStorage.removeItem(`writing_draft_${question?.id}`);
        router.push("/exam/writing/results");
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-2xl font-Coolvetica text-[#0C1E46] animate-pulse">Preparing your writing challenge...</p>
      </div>
    );
  }

  const wordCount = essayText.trim() === "" ? 0 : essayText.trim().split(/\s+/).length;
  const minWords = 250;
  const isGoodLength = wordCount >= minWords;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 font-Coolvetica">
      <WritingTimer timeLeft={timeLeft} onTimeUp={submitExam} setTimeLeft={setTimeLeft} />

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* HERO HEADER */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-8 py-8 rounded-2xl shadow-2xl">
            <PenTool className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4" />
            <h1 className="text-3xl md:text-5xl font-bold">Writing Exam</h1>
            <p className="text-blue-100 text-lg md:text-xl mt-3">Express yourself in French — this is your moment</p>
          </div>
        </div>

        {/* AUTO-SAVE STATUS */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 text-[#0C1E46] hover:bg-[#B0CCFE]/20">
            <ArrowLeft className="w-5 h-5" /> Back
          </Button>

          <div className="flex items-center gap-3 text-sm md:text-base">
            {autoSaveStatus === "saving" && (
              <span className="flex items-center gap-2 text-orange-600">
                <div className="w-3 h-3 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            )}
            {autoSaveStatus === "saved" && (
              <span className="flex items-center gap-2 text-green-600 font-bold">
                <CheckCircle className="w-5 h-5" /> Saved
              </span>
            )}
            {autoSaveStatus === "unsaved" && essayText && (
              <span className="flex items-center gap-2 text-gray-600">
                <Save className="w-5 h-5" /> Auto-save in 30s
              </span>
            )}
          </div>
        </div>

        {/* PROMPT CARD */}
        <Card className="bg-white/95 backdrop-blur shadow-xl border-2 border-[#B0CCFE]">
          <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white rounded-t-xl">
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
              <PenTool className="w-8 h-8" /> Your Writing Prompt
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
              <p className="text-lg md:text-xl leading-relaxed text-[#0C1E46] font-medium">
                {question?.question_text}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-6 italic">
              Write a well-structured essay in French (250–400 words recommended)
            </p>
          </CardContent>
        </Card>

        {/* ESSAY INPUT */}
        <Card className="bg-white/95 backdrop-blur shadow-xl border-2 border-[#B0CCFE]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl text-[#0C1E46]">Your Essay</CardTitle>
              <div className={`text-lg font-bold ${isGoodLength ? "text-green-600" : "text-orange-600"}`}>
                {wordCount} words
                {!isGoodLength && wordCount > 0 && (
                  <span className="text-sm block font-normal text-gray-600">
                    Aim for {minWords}+ words
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Commencez à écrire ici... Let your French flow. This is your voice."
              className="min-h-96 md:min-h-[500px] text-lg leading-relaxed resize-none border-2 rounded-xl focus:border-[#ED4137] font-serif"
              value={essayText}
              onChange={(e) => {
                setEssayText(e.target.value);
                setAutoSaveStatus("unsaved");
              }}
            />

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Save className="w-5 h-5" />
              <span>Your work is automatically saved every 30 seconds</span>
            </div>
          </CardContent>
        </Card>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-14 text-lg border-2 border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white"
            onClick={() => router.push("/dashboard")}
          >
            Save & Exit
          </Button>

          <Button
            size="lg"
            className="flex-1 h-14 text-lg md:text-xl font-bold bg-[#ED4137] hover:bg-red-600 shadow-xl"
            onClick={submitExam}
            disabled={isSubmitting || wordCount < 150}
          >
            {isSubmitting ? (
              <>Submitting & Analyzing with AI...</>
            ) : (
              <>Submit Essay & Get AI Feedback</>
            )}
          </Button>
        </div>

        {/* MOTIVATION */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-12 px-8 rounded-2xl shadow-2xl">
            <p className="text-3xl md:text-5xl font-bold">
              This is not just an essay
            </p>
            <p className="text-3xl md:text-5xl font-bold mt-4 text-[#B0CCFE]">
              This is your voice in French
            </p>
            <p className="text-xl md:text-2xl mt-8 opacity-90">
              Write boldly. France is listening.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}