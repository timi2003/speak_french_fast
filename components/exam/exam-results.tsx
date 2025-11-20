"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowLeft, Trophy, Flame, Crown, Target, Zap } from "lucide-react";
import Link from "next/link";

interface ExamResultsProps {
  attempt: any;
  responses: any[];
}

export default function ExamResults({ attempt, responses }: ExamResultsProps) {
  const resultsBySection = responses.reduce((acc: any, response: any) => {
    const sectionId = response.exam_section_id;
    if (!acc[sectionId]) {
      acc[sectionId] = {
        section: response.exam_sections,
        responses: [],
        correct: 0,
        total: 0,
      };
    }

    const isCorrect =
      response.questions.question_type === "mcq"
        ? response.questions.answer_options?.some(
            (opt: any) => opt.id === response.selected_answer_id && opt.is_correct,
          )
        : null;

    acc[sectionId].responses.push({ ...response, isCorrect });

    if (response.questions.question_type === "mcq") {
      acc[sectionId].total++;
      if (isCorrect) acc[sectionId].correct++;
    }

    return acc;
  }, {});

  const getCECRLBadge = (level: string) => {
    const badges: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      A1: { label: "Beginner", color: "from-red-500 to-rose-600", icon: <Target className="w-12 h-12" /> },
      A2: { label: "Elementary", color: "from-orange-500 to-amber-600", icon: <Zap className="w-12 h-12" /> },
      B1: { label: "Intermediate", color: "from-blue-500 to-cyan-600", icon: <Flame className="w-12 h-12" /> },
      B2: { label: "Upper Intermediate", color: "from-purple-500 to-indigo-600", icon: <Trophy className="w-12 h-12" /> },
      C1: { label: "Advanced", color: "from-emerald-500 to-green-600", icon: <Crown className="w-12 h-12" /> },
      C2: { label: "Mastery", color: "from-yellow-500 to-amber-700", icon: <Crown className="w-16 h-16 text-yellow-300" /> },
    };
    return badges[level] || badges.A1;
  };

  const levelInfo = getCECRLBadge(attempt.cecrl_level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 font-Coolvetica px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* BACK BUTTON */}
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-3 text-[#0C1E46] hover:bg-[#B0CCFE]/30 text-xl">
            <ArrowLeft className="w-6 h-6" /> Back to Dashboard
          </Button>
        </Link>

        {/* HERO RESULT — THIS IS THE MOMENT */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-12 py-16 rounded-3xl shadow-3xl shadow-4xl">
            <Trophy className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 text-yellow-400 animate-pulse" />
            <h1 className="text-6xl md:text-8xl font-black tracking-wider">OFFICIAL RESULT</h1>
            <p className="text-4xl md:text-6xl mt-8 text-[#B0CCFE]">
              You Are Now Certified
            </p>
          </div>
        </div>

        {/* MAIN SCORE CARD — EPIC */}
        <Card className={`bg-gradient-to-br ${levelInfo.color} text-white shadow-3xl border-4 border-white/30`}>
          <CardContent className="pt-16 pb-20 text-center">
            <div className="flex flex-col items-center gap-10">
              {levelInfo.icon}
              <div>
                <p className="text-6xl md:text-8xl font-black">{attempt.total_score}<span className="text-5xl">%</span></p>
                <p className="text-4xl md:text-6xl font-bold mt-4">Total Score</p>
              </div>
              <div className="mt-10">
                <Badge className="text-5xl md:text-7xl px-12 py-6 font-black bg-white/20 backdrop-blur border-4 border-white">
                  {attempt.cecrl_level}
                </Badge>
                <p className="text-4xl md:text-6xl mt-6 font-bold opacity-90">
                  {levelInfo.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION BREAKDOWN */}
        <div className="space-y-10">
          {Object.values(resultsBySection).map((section: any) => {
            const accuracy = section.total > 0 ? Math.round((section.correct / section.total) * 100) : 0;

            return (
              <Card key={section.section.id} className="bg-white/95 backdrop-blur-xl shadow-2xl border-4 border-[#B0CCFE] rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white py-8">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-3xl md:text-4xl font-bold">
                      {section.section.title}
                    </CardTitle>
                    {section.total > 0 && (
                      <div className="text-right">
                        <p className="text-5xl font-black">{accuracy}%</p>
                        <p className="text-xl opacity-90">
                          {section.correct}/{section.total} Correct
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-10 space-y-8">
                  {section.responses.map((response: any, i: number) => {
                    const selectedOption = response.questions.answer_options?.find(
                      (opt: any) => opt.id === response.selected_answer_id
                    );
                    const correctOption = response.questions.answer_options?.find((opt: any) => opt.is_correct);

                    return (
                      <div
                        key={i}
                        className={`p-8 rounded-3xl border-4 shadow-xl transition-all ${
                          response.isCorrect === true
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-500"
                            : response.isCorrect === false
                            ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-500"
                            : "bg-gray-50 border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-6">
                          {response.isCorrect === true && <CheckCircle2 className="w-14 h-14 text-green-600" />}
                          {response.isCorrect === false && <XCircle className="w-14 h-14 text-red-600" />}
                          {response.isCorrect === null && <div className="w-14 h-14 rounded-full bg-gray-300" />}

                          <div className="flex-1">
                            <p className="text-2xl font-bold text-[#0C1E46] mb-4">
                              Question {i + 1}
                            </p>
                            <p className="text-xl text-gray-800 leading-relaxed mb-6">
                              {response.questions.question_text}
                            </p>

                            {response.questions.question_type === "mcq" && (
                              <>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-lg font-semibold text-gray-700">Your Answer:</p>
                                    <p className={`text-xl p-4 rounded-2xl font-medium ${
                                      response.isCorrect
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}>
                                      {selectedOption
                                        ? `${selectedOption.option_letter}. ${selectedOption.option_text}`
                                        : "No answer selected"}
                                    </p>
                                  </div>
                                  {response.isCorrect === false && correctOption && (
                                    <div>
                                      <p className="text-lg font-semibold text-green-700">Correct Answer:</p>
                                      <p className="text-xl p-4 rounded-2xl bg-green-100 text-green-800 font-medium">
                                        {correctOption.option_letter}. {correctOption.option_text}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}

                            {response.questions.question_type === "essay" && (
                              <div>
                                <p className="text-lg font-semibold text-[#0C1E46] mb-3">Your Essay:</p>
                                <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 font-serif text-lg leading-relaxed">
                                  {response.text_response || "No response submitted"}
                                </div>
                                <p className="text-sm text-orange-600 mt-4 font-bold">
                                  Pending expert review — results in 48h
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FINAL CALL TO ACTION */}
        <div className="text-center space-y-8">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-20 px-12 rounded-3xl shadow-4xl">
            <p className="text-6xl md:text-8xl font-black">
              You Didn’t Just Pass An Exam
            </p>
            <p className="text-6xl md:text-8xl font-black mt-10 text-[#B0CCFE]">
              You Earned Your Place In France
            </p>
            <p className="text-4xl md:text-5xl mt-16 opacity-90">
              Nigeria to Paris — The Journey Is Real
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link href="/dashboard">
              <Button className="h-20 px-16 text-3xl font-bold bg-[#0C1E46] hover:bg-[#0a1838] shadow-2xl">
                Return to Dashboard
              </Button>
            </Link>
            <Link href="/exam">
              <Button className="h-20 px-16 text-3xl font-bold bg-[#ED4137] hover:bg-red-600 shadow-3xl">
                Take Next Exam
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}