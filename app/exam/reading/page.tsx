"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import ReadingTimer from "@/components/exam/reading-timer";

export default function ReadingExamPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("question_bank")
        .select("*")
        .eq("module", "reading")
        .limit(5)
        .order("id");

      if (data && data.length > 0) {
        setQuestions(data);
      }
    } catch (error) {
      console.error("[SFF] Error fetching reading questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUp = async () => {
    await submitExam();
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const submitExam = async () => {
    setIsSubmitting(true);
    try {
      const questionsAttempted = questions.map((q) => ({
        question_id: q.id,
        answer: answers[q.id] || "",
        correct: answers[q.id] === q.correct_answer,
      }));

      const response = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_name: "reading",
          questionsAttempted,
          time_taken_seconds: 2700 - timeLeft,
        }),
      });

      if (response.ok) {
        router.push("/exam/reading/results");
      } else {
        const err = await response.json();
        alert(err.message || "Failed to submit exam.");
      }
    } catch (error) {
      console.error("[SFF] Submission error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <p className="text-2xl md:text-3xl font-Coolvetica text-[#0C1E46] animate-pulse">
          Loading your reading challenge...
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="text-center p-10 bg-white/90 backdrop-blur shadow-2xl">
          <BookOpen className="w-24 h-24 mx-auto mb-6 text-[#0C1E46]" />
          <p className="text-xl text-gray-600 mb-6">No reading questions available yet.</p>
          <Button onClick={() => router.push("/dashboard")} className="bg-[#0C1E46] hover:bg-[#0a1838]">
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 font-Coolvetica">
      <ReadingTimer timeLeft={timeLeft} onTimeUp={handleTimeUp} setTimeLeft={setTimeLeft} />

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* HERO HEADER */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-8 py-10 rounded-3xl shadow-3xl">
            <BookOpen className="w-24 h-24 mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-bold">Reading Exam</h1>
            <p className="text-blue-100 text-xl md:text-3xl mt-6">
              Understand French like a native
            </p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => router.back()}
              className="text-[#0C1E46] hover:bg-[#B0CCFE]/30"
            >
              <ArrowLeft className="w-6 h-6 mr-3" /> Back
            </Button>

            <div className="text-center">
              <p className="text-3xl font-bold text-[#0C1E46]">
                {currentQuestion + 1} / {questions.length}
              </p>
              <p className="text-lg text-gray-600 mt-1">
                {answeredCount} answered • {questions.length - answeredCount} to go
              </p>
            </div>

            <div className="w-32" />
          </div>

          <div className="h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#ED4137] via-orange-500 to-pink-600 transition-all duration-1000 ease-out rounded-full shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* MAIN QUESTION CARD */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-3xl border-4 border-[#B0CCFE] rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white py-10">
            <CardTitle className="text-3xl md:text-4xl font-bold text-center flex items-center justify-center gap-4">
              <Trophy className="w-12 h-12 text-yellow-400" />
              Question {currentQuestion + 1}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-12 pb-16 px-6 md:px-12 space-y-12">

            {/* READING PASSAGE */}
            {question?.passage_text && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-10 rounded-3xl border-4 border-blue-200 shadow-2xl">
                <p className="text-lg md:text-xl leading-relaxed text-[#0C1E46] font-medium whitespace-pre-wrap">
                  {question.passage_text}
                </p>
              </div>
            )}

            {/* QUESTION TEXT */}
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-bold text-[#0C1E46] leading-relaxed">
                {question?.question_text}
              </p>
            </div>

            {/* ANSWER OPTIONS — FULLY TYPE-SAFE */}
            <RadioGroup
              value={answers[question?.id] || ""}
              onValueChange={(value) => handleAnswerChange(question?.id, value)}
              className="space-y-6"
            >
              {question?.options &&
                Object.entries(question.options as Record<string, string>).map(([key, value]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-6 p-8 rounded-3xl border-4 transition-all cursor-pointer
                      ${answers[question.id] === key
                        ? "border-[#ED4137] bg-red-50 shadow-2xl scale-105"
                        : "border-gray-300 bg-white hover:border-[#B0CCFE] hover:shadow-xl"
                      }`}
                  >
                    <RadioGroupItem value={key} id={key} className="w-8 h-8" />
                    <Label
                      htmlFor={key}
                      className="text-xl md:text-2xl font-medium cursor-pointer flex-1"
                    >
                      {value}
                    </Label>
                  </div>
                ))}
            </RadioGroup>

            {/* NAVIGATION */}
            <div className="flex justify-between items-center mt-16">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-10 h-16 text-xl border-4 border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold"
              >
                <ChevronLeft className="w-7 h-7 mr-3" /> Previous
              </Button>

              {currentQuestion === questions.length - 1 ? (
                <Button
                  size="lg"
                  onClick={submitExam}
                  disabled={isSubmitting || answeredCount < questions.length}
                  className="px-12 h-20 text-2xl font-bold bg-[#ED4137] hover:bg-red-600 shadow-3xl"
                >
                  {isSubmitting ? "Submitting..." : "Submit & See Results"}
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="px-10 h-16 text-xl bg-[#0C1E46] hover:bg-[#0a1838] text-white font-bold"
                >
                  Next Question <ChevronRight className="w-7 h-7 ml-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FINAL MOTIVATION */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-16 px-10 rounded-3xl shadow-3xl">
            <p className="text-5xl md:text-7xl font-bold">
              Every word you read
            </p>
            <p className="text-5xl md:text-7xl font-bold mt-8 text-[#B0CCFE]">
              Is a street in Paris
            </p>
            <p className="text-3xl mt-12 opacity-90">
              You’re not just reading — you’re walking
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}