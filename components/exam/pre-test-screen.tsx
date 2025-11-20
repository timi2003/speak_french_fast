"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Volume2, BookOpen, PenTool, Mic, Flame, AlertCircle } from "lucide-react";

interface PreTestScreenProps {
  section: any;
  onStart: () => void;
  isLoading?: boolean;
}

export default function PreTestScreen({ section, onStart, isLoading = false }: PreTestScreenProps) {
  const getSection = () => {
    switch (section.section_type) {
      case "comprehension_orale":
        return {
          title: "COMPRÉHENSION ORALE",
          subtitle: "Listening Mastery",
          icon: <Volume2 className="w-20 h-20 md:w-28 md:h-28" />,
          color: "from-indigo-600 to-purple-700",
          iconColor: "text-purple-500",
          instructions: [
            "You will hear real French conversations",
            "Each audio plays up to 3 times",
            "Answer immediately after listening",
            "Your ears will be tested like never before",
            "This is how natives speak — are you ready?",
          ],
          time: section.timer_duration_minutes,
        };
      case "comprehension_ecrite":
        return {
          title: "COMPRÉHENSION ÉCRITE",
          subtitle: "Reading Mastery",
          icon: <BookOpen className="w-20 h-20 md:w-28 md:h-28" />,
          color: "from-emerald-600 to-teal-700",
          iconColor: "text-emerald-500",
          instructions: [
            "Read authentic French texts",
            "From articles to emails — real French",
            "Understand every detail",
            "No dictionary. No mercy.",
            "This is how the French read — can you?",
          ],
          time: section.timer_duration_minutes,
        };
      case "expression_ecrite":
        return {
          title: "EXPRESSION ÉCRITE",
          subtitle: "Writing Mastery",
          icon: <PenTool className="w-20 h-20 md:w-28 md:h-28" />,
          color: "from-[#ED4137] to-red-700",
          iconColor: "text-[#ED4137]",
          instructions: [
            "Write in French like your future depends on it",
            "AI will grade you like a CEFR examiner",
            "250–400 words. No excuses.",
            "Grammar. Vocabulary. Soul.",
            "This is your voice in French — make it loud",
          ],
          time: section.timer_duration_minutes,
        };
      case "expression_orale":
        return {
          title: "EXPRESSION ORALE",
          subtitle: "Speaking Mastery",
          icon: <Mic className="w-20 h-20 md:w-28 md:h-28" />,
          color: "from-orange-600 to-red-600",
          iconColor: "text-orange-500",
          instructions: [
            "Speak French like you mean it",
            "No script. No filter.",
            "Record your truth",
            "Examiners will hear your soul",
            "This is how the French speak — now it's your turn",
          ],
          time: section.timer_duration_minutes,
        };
      default:
        return {
          title: "EXAM SECTION",
          icon: <AlertCircle className="w-20 h-20" />,
          color: "from-gray-600 to-gray-800",
          iconColor: "text-gray-500",
          instructions: [],
          time: 0,
        };
    }
  };

  const s = getSection();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4 font-Coolvetica">
      <div className="max-w-4xl w-full">

        {/* HERO CARD */}
        <Card className="border-0 shadow-3xl overflow-hidden bg-white/95 backdrop-blur-xl">
          <CardHeader className={`bg-gradient-to-r ${s.color} text-white py-16 px-10 text-center`}>
            <div className="flex flex-col items-center gap-8">
              <div className={s.iconColor}>{s.icon}</div>
              <div>
                <CardTitle className="text-5xl md:text-7xl font-bold tracking-wider">
                  {s.title}
                </CardTitle>
                <p className="text-3xl md:text-5xl mt-4 opacity-90">{s.subtitle}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-12 pb-16 px-8 md:px-16 space-y-12">

            {/* TIME WARNING — DRAMATIC */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8 rounded-3xl shadow-2xl text-center">
              <div className="flex items-center justify-center gap-6">
                <Clock className="w-16 h-16 animate-pulse" />
                <div>
                  <p className="text-2xl font-bold uppercase">Time Limit</p>
                  <p className="text-6xl md:text-8xl font-black mt-4">
                    {s.time}
                    <span className="text-4xl md:text-6xl ml-2">MIN</span>
                  </p>
                  <p className="text-xl mt-4 opacity-90">
                    When time ends — your fate is sealed
                  </p>
                </div>
                <Flame className="w-16 h-16 animate-pulse" />
              </div>
            </div>

            {/* INSTRUCTIONS — NUMBERED & BOLD */}
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#0C1E46] text-center mb-10">
                This Is How It Goes Down
              </h3>
              <div className="space-y-6">
                {s.instructions.map((instruction, idx) => (
                  <div key={idx} className="flex items-start gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-200">
                    <div className="flex-shrink-0 w-16 h-16 bg-[#0C1E46] text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-xl">
                      {idx + 1}
                    </div>
                    <p className="text-xl md:text-2xl text-[#0C1E46] font-medium pt-3 leading-relaxed">
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FINAL WARNING — RED ZONE */}
            <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white p-8 rounded-3xl shadow-2xl">
              <div className="flex items-center gap-6">
                <AlertCircle className="w-14 h-14 animate-pulse flex-shrink-0" />
                <div>
                  <p className="text-2xl md:text-3xl font-bold uppercase">
                    No Second Chances
                  </p>
                  <ul className="mt-4 space-y-2 text-lg md:text-xl">
                    <li>Stable internet required</li>
                    <li>Quiet environment (especially for speaking)</li>
                    <li>Full battery or plugged in</li>
                    <li>Once started — no pause, no mercy</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* START BUTTON — THE MOMENT OF TRUTH */}
            <div className="text-center pt-8">
              <Button
                onClick={onStart}
                disabled={isLoading}
                size="lg"
                className="h-20 px-16 text-3xl md:text-4xl font-bold bg-[#ED4137] hover:bg-red-600 shadow-3xl transform hover:scale-105 transition-all duration-300"
              >
                {isLoading ? (
                  <>Starting...</>
                ) : (
                  <>BEGIN NOW — ENTER FRANCE</>
                )}
              </Button>

              <p className="text-lg text-gray-600 mt-8 italic">
                By clicking begin, you accept the challenge.<br />
                <span className="text-[#ED4137] font-bold">
                  This is not a test. This is your arrival.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FINAL MOTIVATION */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-12 px-10 rounded-3xl shadow-3xl">
            <p className="text-5xl md:text-7xl font-bold">
              Nigeria to Paris
            </p>
            <p className="text-5xl md:text-7xl font-bold mt-6 text-[#B0CCFE]">
              Starts Right Here
            </p>
            <p className="text-3xl md:text-4xl mt-10 opacity-90">
              When you click START — you’re no longer learning French<br />
              You’re becoming French
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}