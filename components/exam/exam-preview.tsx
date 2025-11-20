"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Trophy, Flame, Crown, Target } from "lucide-react";

interface ExamPreviewProps {
  exam: any;
  sections: any[];
  onStart: () => void;
}

export default function ExamPreview({ exam, sections, onStart }: ExamPreviewProps) {
  const totalDuration = sections.reduce((sum, s) => sum + (s.timer_duration_minutes || 0), 0);

  const getExamBadge = () => {
    if (exam.title.toLowerCase().includes("delf")) return { label: "DELF OFFICIEL", color: "from-emerald-600 to-green-700", icon: <Crown className="w-20 h-20" /> };
    if (exam.title.toLowerCase().includes("dalf")) return { label: "DALF MASTERY", color: "from-purple-700 to-indigo-800", icon: <Trophy className="w-24 h-24 text-yellow-400" /> };
    if (exam.title.toLowerCase().includes("tcf")) return { label: "TCF CANADA", color: "from-red-600 to-rose-700", icon: <Target className="w-20 h-20" /> };
    return { label: "FRENCH EXAM", color: "from-[#0C1E46] to-[#0a1838]", icon: <Flame className="w-20 h-20" /> };
  };

  const badge = getExamBadge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4 font-Coolvetica">
      <div className="max-w-4xl w-full">

        {/* HERO EXAM CARD */}
        <Card className="border-0 shadow-4xl overflow-hidden bg-white/95 backdrop-blur-2xl">
          {/* EPIC HEADER */}
          <CardHeader className={`bg-gradient-to-r ${badge.color} text-white py-20 px-10 text-center`}>
            <div className="flex flex-col items-center gap-8">
              <div className="animate-pulse">{badge.icon}</div>
              <div>
                <div className="bg-white/20 backdrop-blur rounded-2xl px-8 py-4 inline-block mb-6">
                  <p className="text-4xl md:text-6xl font-black tracking-widest">
                    {badge.label}
                  </p>
                </div>
                <CardTitle className="text-6xl md:text-8xl font-black tracking-wider">
                  {exam.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-16 pb-20 px-8 md:px-16 space-y-16">

            {/* EXAM DESCRIPTION — SOUL-STIRRING */}
            <div className="text-center">
              <p className="text-3xl md:text-5xl font-bold text-[#0C1E46] leading-relaxed">
                {exam.description}
              </p>
            </div>

            {/* TOTAL DURATION — DRAMATIC */}
            <div className="bg-gradient-to-r from-orange-600 to-red-700 text-white p-10 rounded-3xl shadow-3xl text-center">
              <div className="flex items-center justify-center gap-8">
                <Clock className="w-20 h-20 animate-spin-slow" />
                <div>
                  <p className="text-3xl font-bold uppercase tracking-wider">Total Duration</p>
                  <p className="text-8xl md:text-9xl font-black mt-4">
                    {totalDuration}
                    <span className="text-5xl ml-2">MIN</span>
                  </p>
                  <p className="text-2xl mt-6 opacity-90">
                    This is not a test. This is your future.
                  </p>
                </div>
                <Flame className="w-20 h-20 animate-pulse" />
              </div>
            </div>

            {/* SECTIONS BREAKDOWN — EACH ONE A BATTLE */}
            <div>
              <h3 className="text-4xl md:text-5xl font-bold text-[#0C1E46] text-center mb-12">
                Your Four Battlegrounds
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sections.map((section, idx) => (
                  <div
                    key={section.id}
                    className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-all"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-6xl font-black opacity-30">
                        0{idx + 1}
                      </div>
                      <Clock className="w-12 h-12" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold mb-4">
                      {section.title}
                    </p>
                    <p className="text-xl opacity-90">
                      {section.timer_duration_minutes} minutes of pure French
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FINAL INSTRUCTIONS — WAR CRY */}
            <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-10 rounded-3xl shadow-3xl text-center">
              <h3 className="text-4xl md:text-5xl font-black mb-8">
                This Is How It Goes Down
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xl md:text-2xl">
                <div>Internet must be stable</div>
                <div>Quiet environment required</div>
                <div>No pausing. No mercy.</div>
                <div>Once started — you finish</div>
                <div>Auto-submit when time ends</div>
                <div>Your future begins now</div>
              </div>
            </div>

            {/* START BUTTON — THE MOMENT OF TRUTH */}
            <div className="text-center pt-12">
              <Button
                onClick={onStart}
                className="h-24 px-20 text-4xl md:text-5xl font-black bg-[#ED4137] hover:bg-red-600 shadow-4xl transform hover:scale-110 transition-all duration-300 rounded-full"
              >
                BEGIN EXAM — ENTER FRANCE
              </Button>

              <p className="text-2xl text-gray-700 mt-10 italic">
                When you click this button — you are no longer a student.<br />
                <span className="text-[#ED4137] font-bold text-3xl">
                  You become a French speaker.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FINAL MOTIVATION — NATIONAL ANTHEM LEVEL */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-20 px-12 rounded-3xl shadow-4xl">
            <p className="text-6xl md:text-8xl font-black">
              This Is Not An Exam
            </p>
            <p className="text-6xl md:text-8xl font-black mt-10 text-[#B0CCFE]">
              This Is Your Visa To France
            </p>
            <p className="text-4xl md:text-5xl mt-16 opacity-90">
              Nigeria to Paris — One Click Away
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}