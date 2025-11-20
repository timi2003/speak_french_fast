"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, Trophy, Sparkles, Target, PenTool } from "lucide-react";

export default function WritingResultsPage() {
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
        .eq("module_name", "writing")
        .order("date_taken", { ascending: false })
        .limit(1)
        .single();

      if (data) setResult(data);
    } catch (error) {
      console.error("[SFF] Error fetching writing result:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <p className="text-2xl font-Coolvetica text-[#0C1E46] animate-pulse">
          Analyzing your masterpiece...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="p-10 text-center">
          <p className="text-xl text-gray-600">No writing result found</p>
          <Button onClick={() => router.push("/exam/writing")} className="mt-6">
            Write Your First Essay
          </Button>
        </Card>
      </div>
    );
  }

  const aiFeedback = result?.questions_attempted?.[0]?.ai_feedback;
  const essay = result?.questions_attempted?.[0]?.answer || "";
  const score = aiFeedback?.score || 0;
  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;
  const timeTaken = Math.round(result?.time_taken_seconds / 60);

  const getScoreColor = () => {
    if (score >= 90) return "from-green-500 to-emerald-600";
    if (score >= 80) return "from-blue-500 to-cyan-600";
    if (score >= 70) return "from-purple-500 to-indigo-600";
    if (score >= 60) return "from-orange-500 to-amber-600";
    return "from-red-500 to-rose-600";
  };

  const getScoreMessage = () => {
    if (score >= 90) return "Outstanding! Paris is calling your name";
    if (score >= 80) return "Excellent work — you're ready for advanced French";
    if (score >= 70) return "Very good! Keep pushing — fluency is close";
    if (score >= 60) return "Solid foundation — practice makes perfect";
    return "You're learning! Every essay makes you stronger";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 font-Coolvetica px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* HERO RESULT */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-8 py-10 rounded-3xl shadow-2xl">
            <Trophy className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-6 text-yellow-400" />
            <h1 className="text-4xl md:text-6xl font-bold">Your Writing Result</h1>
            <p className="text-blue-100 text-xl md:text-2xl mt-4 max-w-3xl mx-auto">
              {getScoreMessage()}
            </p>
          </div>
        </div>

        {/* SCORE DISPLAY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className={`bg-gradient-to-br ${getScoreColor()} text-white shadow-2xl`}>
            <CardContent className="pt-8 text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <p className="text-7xl md:text-8xl font-bold">{score}</p>
              <p className="text-2xl mt-2 opacity-90">/100</p>
              <p className="text-lg mt-4 font-medium">AI Score</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-2xl">
            <CardContent className="pt-8 text-center">
              <Target className="w-16 h-16 mx-auto mb-4" />
              <p className="text-6xl md:text-7xl font-bold">{wordCount}</p>
              <p className="text-xl mt-2">words</p>
              <p className="text-lg mt-4">Essay Length</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl">
            <CardContent className="pt-8 text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-4" />
              <p className="text-6xl md:text-7xl font-bold">{timeTaken}</p>
              <p className="text-xl mt-2">minutes</p>
              <p className="text-lg mt-4">Time Taken</p>
            </CardContent>
          </Card>
        </div>

        {/* AI FEEDBACK */}
        {aiFeedback && (
          <Card className="bg-white/95 backdrop-blur shadow-2xl border-2 border-[#B0CCFE]">
            <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white rounded-t-2xl">
              <CardTitle className="text-2xl md:text-3xl flex items-center gap-3">
                <Sparkles className="w-8 h-8" /> AI-Powered Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">

              {/* Overall Feedback */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-[#0C1E46] mb-4">Overall Assessment</h3>
                <p className="text-lg leading-relaxed text-gray-800">
                  {aiFeedback.feedback || "Great effort! Your French is improving."}
                </p>
              </div>

              {/* Detailed Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiFeedback.analysis?.grammar && (
                  <div className="bg-red-50 border-2 border-red-300 p-6 rounded-2xl">
                    <h4 className="font-bold text-red-900 mb-3">Grammar & Accuracy</h4>
                    <p className="text-red-800 leading-relaxed">{aiFeedback.analysis.grammar}</p>
                  </div>
                )}

                {aiFeedback.analysis?.vocabulary && (
                  <div className="bg-blue-50 border-2 border-blue-300 p-6 rounded-2xl">
                    <h4 className="font-bold text-blue-900 mb-3">Vocabulary & Expression</h4>
                    <p className="text-blue-800 leading-relaxed">{aiFeedback.analysis.vocabulary}</p>
                  </div>
                )}

                {aiFeedback.analysis?.structure && (
                  <div className="bg-purple-50 border-2 border-purple-300 p-6 rounded-2xl">
                    <h4 className="font-bold text-purple-900 mb-3">Structure & Coherence</h4>
                    <p className="text-purple-800 leading-relaxed">{aiFeedback.analysis.structure}</p>
                  </div>
                )}

                {aiFeedback.analysis?.suggestions && (
                  <div className="bg-green-50 border-2 border-green-300 p-6 rounded-2xl">
                    <h4 className="font-bold text-green-900 mb-3">Next Steps</h4>
                    <p className="text-green-800 leading-relaxed">{aiFeedback.analysis.suggestions}</p>
                  </div>
                )}
              </div>

              {/* Your Essay */}
              <div className="mt-10">
                <h3 className="text-2xl font-bold text-[#0C1E46] mb-6 flex items-center gap-3">
                  <PenTool className="w-8 h-8" /> Your Essay
                </h3>
                <div className="bg-gray-50 p-8 rounded-2xl border-2 border-gray-300 font-serif text-lg leading-relaxed whitespace-pre-wrap">
                  {essay}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-6">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-16 text-xl border-2 border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </Button>

          <Button
            size="lg"
            className="flex-1 h-16 text-xl font-bold bg-[#ED4137] hover:bg-red-600 shadow-2xl"
            onClick={() => router.push("/exam/writing")}
          >
            Write Another Essay
          </Button>
        </div>

        {/* FINAL MOTIVATION */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-16 px-8 rounded-3xl shadow-3xl">
            <p className="text-4xl md:text-6xl font-bold">
              You didn’t just write an essay
            </p>
            <p className="text-4xl md:text-6xl font-bold mt-6 text-[#B0CCFE]">
              You spoke French from the soul
            </p>
            <p className="text-2xl md:text-3xl mt-10 opacity-90">
              Nigeria to Paris — your voice is ready
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}