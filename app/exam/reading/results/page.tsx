"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Trophy, Brain, Target, Zap } from "lucide-react";

export default function ReadingResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLatestResult();
  }, []);

  const fetchLatestResult = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("exam_attempts")
        .select("*")
        .eq("user_id", user.id)
        .eq("module_name", "reading")
        .order("date_taken", { ascending: false })
        .limit(1)
        .single();

      if (data) setResult(data);
    } catch (error) {
      console.error("[SFF] Error fetching reading result:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <p className="text-3xl font-Coolvetica text-[#0C1E46] animate-pulse">
          Analyzing your comprehension...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="text-center p-12 shadow-2xl">
          <p className="text-2xl text-gray-700 mb-6">No reading results yet</p>
          <Button size="lg" onClick={() => router.push("/exam/reading")} className="bg-[#ED4137] hover:bg-red-600">
            Take Your First Reading Exam
          </Button>
        </Card>
      </div>
    );
  }

  const correctCount = result.questions_attempted?.filter((q: any) => q.correct).length || 0;
  const total = result.total_questions || result.questions_attempted?.length || 0;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const score = result.score ? result.score.toFixed(1) : accuracy;
  const timeTaken = Math.round(result.time_taken_seconds / 60);

  const getPerformanceMessage = () => {
    if (accuracy >= 90) return "Master Reader! You read French like a Parisian";
    if (accuracy >= 80) return "Outstanding! Your comprehension is elite";
    if (accuracy >= 70) return "Excellent! You're understanding real French";
    if (accuracy >= 60) return "Very Good! Keep reading — fluency is near";
    return "You're growing! Every text makes you stronger";
  };

  const getScoreGradient = () => {
    if (accuracy >= 90) return "from-emerald-500 to-green-600";
    if (accuracy >= 80) return "from-blue-500 to-cyan-600";
    if (accuracy >= 70) return "from-purple-500 to-indigo-600";
    if (accuracy >= 60) return "from-orange-500 to-amber-600";
    return "from-red-500 to-rose-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 font-Coolvetica px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* HERO CELEBRATION */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-8 py-12 rounded-3xl shadow-3xl">
            <Trophy className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 text-yellow-400 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold">Reading Results</h1>
            <p className="text-blue-100 text-2xl md:text-4xl mt-6 max-w-4xl mx-auto">
              {getPerformanceMessage()}
            </p>
          </div>
        </div>

        {/* SCORE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className={`bg-gradient-to-br ${getScoreGradient()} text-white shadow-2xl transform hover:scale-105 transition-all`}>
            <CardContent className="pt-10 text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <p className="text-8xl font-bold">{accuracy}<span className="text-5xl">%</span></p>
              <p className="text-2xl mt-4 font-medium">Accuracy</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl">
            <CardContent className="pt-10 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <p className="text-7xl font-bold">{correctCount}<span className="text-4xl">/{total}</span></p>
              <p className="text-2xl mt-4">Correct</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-2xl">
            <CardContent className="pt-10 text-center">
              <Target className="w-16 h-16 mx-auto mb-4" />
              <p className="text-7xl font-bold">{score}<span className="text-4xl">%</span></p>
              <p className="text-2xl mt-4">Final Score</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl">
            <CardContent className="pt-10 text-center">
              <Zap className="w-16 h-16 mx-auto mb-4" />
              <p className="text-7xl font-bold">{timeTaken}</p>
              <p className="text-2xl mt-4">Minutes</p>
            </CardContent>
          </Card>
        </div>

        {/* DETAILED REVIEW */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl border-4 border-[#B0CCFE] rounded-3xl">
          <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white rounded-t-3xl py-8">
            <CardTitle className="text-3xl md:text-4xl font-bold text-center">
              Question-by-Question Review
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-10 space-y-6">
            {result.questions_attempted?.map((q: any, i: number) => {
              const question = result.questions_attempted[i];
              const isCorrect = question.correct;

              return (
                <div
                  key={i}
                  className={`p-6 rounded-2xl border-4 transition-all ${
                    isCorrect
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 shadow-lg"
                      : "bg-gradient-to-r from-red-50 to-rose-50 border-red-400 shadow-lg"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    {isCorrect ? (
                      <CheckCircle className="w-12 h-12 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-12 h-12 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-xl font-bold text-[#0C1E46]">
                        Question {i + 1}
                      </p>
                      <p className="text-lg mt-2 text-gray-800">
                        Your answer: <span className="font-medium">{question.answer || "Skipped"}</span>
                      </p>
                      {!isCorrect && question.correct_answer && (
                        <p className="text-lg mt-2 text-green-700">
                          Correct answer: <span className="font-bold">{question.correct_answer}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-6">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-16 text-2xl border-4 border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold shadow-xl"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>

          <Button
            size="lg"
            className="flex-1 h-16 text-2xl font-bold bg-[#ED4137] hover:bg-red-600 shadow-2xl"
            onClick={() => router.push("/exam/reading")}
          >
            Retake Reading Exam
          </Button>
        </div>

        {/* FINAL MOTIVATION */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-16 px-8 rounded-3xl shadow-3xl">
            <p className="text-5xl md:text-7xl font-bold">
              You don’t just read French
            </p>
            <p className="text-5xl md:text-7xl font-bold mt-8 text-[#B0CCFE]">
              You understand France
            </p>
            <p className="text-3xl md:text-4xl mt-12 opacity-90">
              Nigeria to Paris — the mind has arrived
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}