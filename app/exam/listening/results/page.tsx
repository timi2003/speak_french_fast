"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Trophy, Headphones, Zap, Mic2 } from "lucide-react";

export default function ListeningResultsPage() {
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
        .eq("module_name", "listening")
        .order("date_taken", { ascending: false })
        .limit(1)
        .single();

      if (data) setResult(data);
    } catch (error) {
      console.error("[SFF] Error fetching listening result:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <p className="text-3xl font-Coolvetica text-[#0C1E46] animate-pulse">
          Processing your French ears...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
        <Card className="text-center p-12 shadow-3xl bg-white/90 backdrop-blur">
          <Headphones className="w-28 h-28 mx-auto mb-8 text-[#ED4137]" />
          <p className="text-2xl text-gray-700 mb-8">No listening results yet</p>
          <Button size="lg" onClick={() => router.push("/exam/listening")} className="bg-[#ED4137] hover:bg-red-600 text-xl h-16">
            Take Your First Listening Exam
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

  const getEarLevel = () => {
    if (accuracy >= 90) return { title: "Native Ear!", desc: "You hear French like a Parisian born and raised", color: "from-emerald-500 to-green-600" };
    if (accuracy >= 80) return { title: "Fluent Listener!", desc: "Your ears are ready for real conversations", color: "from-blue-500 to-cyan-600" };
    if (accuracy >= 70) return { title: "Strong Listener!", desc: "You’re catching the rhythm of French", color: "from-purple-500 to-indigo-600" };
    if (accuracy >= 60) return { title: "Growing Ears!", desc: "Every sound is making you stronger", color: "from-orange-500 to-amber-600" };
    return { title: "Listening in Progress!", desc: "Keep training — your ears are awakening", color: "from-red-500 to-rose-600" };
  };

  const level = getEarLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-Coolvetica px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* HERO CELEBRATION */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-10 py-14 rounded-3xl shadow-3xl">
            <Trophy className="w-32 h-32 mx-auto mb-8 text-yellow-400 animate-pulse" />
            <h1 className="text-6xl md:text-8xl font-bold">Listening Results</h1>
            <div className="mt-8">
              <p className="text-4xl md:text-6xl font-bold text-yellow-300">{level.title}</p>
              <p className="text-2xl md:text-4xl text-blue-100 mt-6 max-w-4xl mx-auto">
                {level.desc}
              </p>
            </div>
          </div>
        </div>

        {/* SCORE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card className={`bg-gradient-to-br ${level.color} text-white shadow-3xl transform hover:scale-105 transition-all`}>
            <CardContent className="pt-12 text-center">
              <Headphones className="w-20 h-20 mx-auto mb-6 opacity-90" />
              <p className="text-9xl font-bold">{accuracy}<span className="text-6xl">%</span></p>
              <p className="text-3xl mt-6 font-medium">Ear Accuracy</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-3xl">
            <CardContent className="pt-12 text-center">
              <CheckCircle className="w-20 h-20 mx-auto mb-6" />
              <p className="text-8xl font-bold">{correctCount}<span className="text-5xl">/{total}</span></p>
              <p className="text-3xl mt-6">Correct</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-3xl">
            <CardContent className="pt-12 text-center">
              <Mic2 className="w-20 h-20 mx-auto mb-6" />
              <p className="text-8xl font-bold">{score}<span className="text-5xl">%</span></p>
              <p className="text-3xl mt-6">Final Score</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-3xl">
            <CardContent className="pt-12 text-center">
              <Zap className="w-20 h-20 mx-auto mb-6" />
              <p className="text-8xl font-bold">{timeTaken}</p>
              <p className="text-3xl mt-6">Minutes</p>
            </CardContent>
          </Card>
        </div>

        {/* DETAILED REVIEW */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-3xl border-4 border-[#B0CCFE] rounded-3xl">
          <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white rounded-t-3xl py-10">
            <CardTitle className="text-4xl md:text-5xl font-bold text-center">
              Your French Ear in Action
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-12 space-y-8">
            {result.questions_attempted?.map((q: any, i: number) => {
              const isCorrect = q.correct;

              return (
                <div
                  key={i}
                  className={`p-8 rounded-3xl border-4 transition-all shadow-xl
                    ${isCorrect
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-500"
                      : "bg-gradient-to-r from-red-50 to-rose-50 border-red-500"
                    }`}
                >
                  <div className="flex items-start gap-6">
                    {isCorrect ? (
                      <CheckCircle className="w-14 h-14 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-14 h-14 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-[#0C1E46]">
                        Question {i + 1}
                      </p>
                      <p className="text-xl mt-3 text-gray-800">
                        Your answer: <span className="font-bold">{q.answer || "Skipped"}</span>
                      </p>
                      {!isCorrect && q.correct_answer && (
                        <p className="text-xl mt-3 text-green-700">
                          Correct answer: <span className="font-bold">{q.correct_answer}</span>
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
        <div className="flex flex-col sm:flex-row gap-8">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-20 text-3xl border-4 border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold shadow-2xl"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>

          <Button
            size="lg"
            className="flex-1 h-20 text-3xl font-bold bg-[#ED4137] hover:bg-red-600 shadow-3xl"
            onClick={() => router.push("/exam/listening")}
          >
            Train Your Ears Again
          </Button>
        </div>

        {/* FINAL MOTIVATION */}
        <div className="text-center mt-24">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-20 px-12 rounded-3xl shadow-3xl">
            <p className="text-6xl md:text-8xl font-bold">
              You don’t just hear French
            </p>
            <p className="text-6xl md:text-8xl font-bold mt-10 text-[#B0CCFE]">
              You understand souls
            </p>
            <p className="text-4xl md:text-5xl mt-16 opacity-90">
              Nigeria to Paris — your ears have arrived
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}