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
          questions_attempted: questionsAttempted,
          time_taken_seconds: 2700 - timeLeft,
        }),
      });

      if (response.ok) {
        router.push("/exam/reading/results");
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("[SFF] Submission error:", error);
      alert("Network error. Check your connection.");
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
        <Card className="text-center p-10">
          <p className="text-xl text-gray-600 mb-6">No reading questions available yet.</p>
          <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
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
           <div className="inline-block bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-8 py-8 rounded-3xl shadow-2xl">
            <BookOpen className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold">Reading Exam</h1>
            <p className="text-blue-100 text-xl md:text-2xl mt-4">
              Understand French like a native
            </p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="text-[#0C1E46] hover:bg-[#B0CCFE]/20"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
              </Button>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0C1E46]">
                Question {currentQuestion + 1} / {questions.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {answeredCount} answered • {questions.length - answeredCount} remaining
              </p>
            </div>
            <div className="w-20" /> {/* Spacer */}
          </div>

          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ED4137] to-orange-600 transition-all duration-700 ease-out rounded-full shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* QUESTION CARD */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-4 border-[#B0CCFE] rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white py-8">
            <CardTitle className="text-2xl md:text-3xl font-bold flex items-center gap-4 justify-center">
              <Trophy className="w-10 h-10 text-yellow-400" />
              Question {currentQuestion + 1}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-10 pb-12 px-6 md:px-10 space-y-10">

            {/* Passage (if exists) */}
            {question?.passage && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200">
                <p className="text-lg md:text-xl leading-relaxed text-[#0C1E46] italic font-medium">
                  {question.passage}
                </p>
              </div>
            )}

            {/* Question Text */}
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-[#0C1E46] leading-relaxed">
                {question?.question_text}
              </p>
            </div>

            {/* Options */}
            <RadioGroup
              value={answers[question?.id] || ""}
              onValueChange={(value) => handleAnswerChange(question?.id, value)}
              className="text-[#0C1E46] space-y-5"
            >
              {question?.options &&
                Object.entries(question.options).map(([key, value]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-5 p-6 rounded-2xl border-4 transition-all cursor-pointer
                      ${answers[question.id] === key
                        ? "border-[#ED4137] bg-red-50 shadow-xl scale-105"
                        : "border-[#0C1E46] bg-white hover:border-[#B0CCFE] hover:shadow-lg"
                      }`}
                  >
                    <RadioGroupItem value={key} id={key} className="border-[#0C1E46] w-7 h-7" />
                    <Label
                      htmlFor={key}
                      className="text-lg md:text-xl font-medium cursor-pointer flex-1"
                    >
                      {value}
                    </Label>
                  </div>
                ))}
            </RadioGroup>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="px-8 h-14 text-lg border-2 border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold"
              >
                <ChevronLeft className="w-6 h-6 mr-2" /> Previous
              </Button>

              {currentQuestion === questions.length - 1 ? (
                <Button
                  size="lg"
                  onClick={submitExam}
                  disabled={isSubmitting || answeredCount < questions.length}
                  className="px-10 h-16 text-xl font-bold bg-[#ED4137] hover:bg-red-600 shadow-2xl"
                >
                  {isSubmitting ? "Submitting..." : "Submit Exam"}
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  className="px-8 h-14 text-lg bg-[#0C1E46] hover:bg-[#0a1838] text-white font-bold"
                >
                  Next <ChevronRight className="w-6 h-6 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}