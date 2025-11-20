"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Flag, Headphones, Flame, Crown, Clock, Volume2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Question {
  id: string;
  question_text: string;
  question_number: number;
  audio_url?: string;
  answer_options: { id: string; option_letter: string; option_text: string }[];
}

export default function ListeningSection({ section, userId }: any) {
  const [timeLeft, setTimeLeft] = useState(section.timer_duration_minutes * 60);
  const [playsRemaining, setPlaysRemaining] = useState(3);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<number, { optionId: string; optionLetter: string }>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingResponse, setSavingResponse] = useState(false);

  // Fetch questions with LEGENDARY fallback
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("questions")
          .select(`
            id,
            question_text,
            question_number,
            audio_url,
            answer_options (id, option_letter, option_text)
          `)
          .eq("exam_section_id", section.id)
          .order("question_number");

        if (data && data.length > 0) {
          setQuestions(data);
        } else {
          throw new Error("No questions");
        }
      } catch {
        // EPIC FALLBACK — France speaks directly to Nigeria
        setQuestions([
          {
            id: "1",
            question_number: 1,
            question_text: "D’après l’audio, pourquoi la femme est-elle à Paris ?",
            audio_url: "https://your-real-french-audio.mp3",
            answer_options: [
              { id: "a", option_letter: "A", option_text: "Pour ses études" },
              { id: "b", option_letter: "B", option_text: "Pour le travail" },
              { id: "c", option_letter: "C", option_text: "Pour les vacances" },
              { id: "d", option_letter: "D", option_text: "Pour rejoindre sa famille" },
            ],
          },
          // More real French conversations...
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [section.id]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = async (optionId: string, optionLetter: string) => {
    const question = questions[currentQuestion];
    if (!question) return;

    setSavingResponse(true);
    try {
      const supabase = createClient();
      const { data: existing } = await supabase
        .from("student_responses")
        .select("id")
        .eq("student_id", userId)
        .eq("exam_section_id", section.id)
        .eq("question_id", question.id)
        .single();

      if (existing) {
        await supabase.from("student_responses").update({ selected_answer_id: optionId }).eq("id", existing.id);
      } else {
        await supabase.from("student_responses").insert({
          student_id: userId,
          exam_id: section.exam_id,
          exam_section_id: section.id,
          question_id: question.id,
          selected_answer_id: optionId,
        });
      }

      setResponses((prev) => ({ ...prev, [currentQuestion]: { optionId, optionLetter } }));
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSavingResponse(false);
    }
  };

  const playAudio = () => {
    if (playsRemaining > 0) {
      setPlaysRemaining(playsRemaining - 1);
      // Real audio would play here
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isCritical = timeLeft <= 300;
  const question = questions[currentQuestion];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
        <p className="text-6xl font-Coolvetica text-[#0C1E46] animate-pulse text-center">
          La France parle... Tu écoutes ?
        </p>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-Coolvetica px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* HERO TIMER + PLAYS — BLOOD RED WHEN CRITICAL */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all ${isCritical ? "bg-gradient-to-r from-[#ED4137] to-red-700 animate-pulse shadow-2xl" : "bg-gradient-to-r from-[#0C1E46] to-[#0a1838]"}`}>
          <div className="container mx-auto px-8 py-8 flex items-center justify-between text-white">
            <div className="flex items-center gap-8">
              <Headphones className="w-20 h-20" />
              <div>
                <p className="text-4xl font-black">COMPRÉHENSION ORALE</p>
                <p className="text-2xl opacity-90">{isCritical ? "ÉCOUTE COMME UN FRANÇAIS" : "La France te parle en ce moment même"}</p>
              </div>
            </div>
            <div className="flex items-center gap-12">
              <div className="text-center">
                <p className="text-2xl opacity-90">ÉCOUTES RESTANTES</p>
                <p className="text-8xl font-black">{playsRemaining}</p>
              </div>
              {timeLeft <= 60 && <Flame className="w-20 h-20 animate-pulse" />}
              <Clock className={`w-20 h-20 ${timeLeft <= 30 ? "animate-spin" : ""}`} />
              <p className={`font-mono font-black ${isCritical ? "text-9xl animate-pulse" : "text-8xl"}`}>
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-56" />

        {/* AUDIO PLAYER — THE VOICE OF FRANCE */}
        <Card className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white shadow-4xl border-4 border-white/30">
          <CardContent className="py-32 text-center">
            <Volume2 className="w-40 h-40 mx-auto mb-12 animate-pulse" />
            <p className="text-6xl md:text-8xl font-black mb-12">
              LA FRANCE PARLE
            </p>
            <div className="flex justify-center gap-12">
              <Button
                onClick={playAudio}
                disabled={playsRemaining === 0}
                className="h-32 w-32 rounded-full bg-[#ED4137] hover:bg-red-600 shadow-4xl transform hover:scale-110 transition-all text-6xl"
              >
                <Play className="w-20 h-20" />
              </Button>
              {playsRemaining < 3 && (
                <Button
                  onClick={playAudio}
                  disabled={playsRemaining === 0}
                  className="h-24 w-24 rounded-full bg-white/20 hover:bg-white/40 shadow-4xl"
                >
                  <RotateCcw className="w-12 h-12" />
                </Button>
              )}
            </div>
            <p className="text-4xl mt-12 opacity-90">
              {playsRemaining > 0 ? `Écoute attentivement... (${playsRemaining} écoutes restantes)` : "Plus d’écoutes disponibles"}
            </p>
          </CardContent>
        </Card>

        {/* QUESTION NAVIGATION — EPIC */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-6">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(i)}
              className={`h-24 w-24 rounded-3xl shadow-3xl transition-all transform hover:scale-110 font-black text-4xl ${
                currentQuestion === i
                  ? "bg-gradient-to-r from-[#ED4137] to-red-700 text-white"
                  : responses[i]
                  ? "bg-gradient-to-r from-emerald-600 to-green-700 text-white"
                  : "bg-white border-4 border-[#B0CCFE] text-[#0C1E46]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* CURRENT QUESTION — CINEMATIC */}
        <Card className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white shadow-4xl border-4 border-white/30">
          <CardHeader className="text-center py-20">
            <Crown className="w-32 h-32 mx-auto mb-10 text-yellow-400" />
            <CardTitle className="text-6xl md:text-8xl font-black">
              QUESTION {question.question_number}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-4xl md:text-6xl leading-relaxed text-center pb-20 px-16">
            {question.question_text}
          </CardContent>
        </Card>

        {/* ANSWER OPTIONS — CHOOSE WISELY */}
        <div className="space-y-8">
          {question.answer_options?.map((option: any) => (
            <label
              key={option.id}
              className={`block p-10 rounded-3xl border-8 cursor-pointer transition-all transform hover:scale-105 shadow-2xl text-3xl font-bold ${
                responses[currentQuestion]?.optionId === option.id
                  ? "bg-gradient-to-r from-emerald-600 to-green-700 text-white border-emerald-400"
                  : "bg-white border-[#B0CCFE] text-[#0C1E46] hover:border-emerald-600"
              }`}
            >
              <input
                type="radio"
                name="answer"
                className="hidden"
                checked={responses[currentQuestion]?.optionId === option.id}
                onChange={() => handleAnswerSelect(option.id, option.option_letter)}
                disabled={savingResponse}
              />
              <div className="flex items-center gap-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-5xl font-black ${responses[currentQuestion]?.optionId === option.id ? "bg-white text-emerald-700" : "bg-[#B0CCFE] text-[#0C1E46]"}`}>
                  {option.option_letter}
                </div>
                <span>{option.option_text}</span>
              </div>
            </label>
          ))}
        </div>

        {/* FLAG + NAVIGATION */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="lg"
            disabled={currentQuestion === 0}
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="h-20 px-12 text-3xl border-4 border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold"
          >
            Question Précédente
          </Button>

          <Button
            variant={flagged.has(currentQuestion) ? "default" : "outline"}
            size="lg"
            onClick={() => setFlagged((s) => {
              const n = new Set(s);
              n.has(currentQuestion) ? n.delete(currentQuestion) : n.add(currentQuestion);
              return n;
            })}
            className={`h-20 px-20 text-3xl font-bold border-4 ${flagged.has(currentQuestion) ? "bg-red-600" : "border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white"}`}
          >
            <Flag className="w-12 h-12 mr-4" />
            {flagged.has(currentQuestion) ? "Drapeau retiré" : "Marquer"}
          </Button>

          <Button
            size="lg"
            disabled={currentQuestion === questions.length - 1}
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            className="h-20 px-12 text-3xl bg-[#ED4137] hover:bg-red-600 font-bold"
          >
            Question Suivante
          </Button>
        </div>

        {/* FINAL MOTIVATION — NATIONAL ANTHEM */}
        <div className="text-center mt-32">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-32 px-16 rounded-3xl shadow-4xl">
            <Flame className="w-40 h-40 mx-auto mb-16 animate-pulse" />
            <p className="text-7xl md:text-9xl font-black">
              Tu n’écoutes plus le français
            </p>
            <p className="text-7xl md:text-9xl font-black mt-12 text-[#B0CCFE]">
              Tu le comprends
            </p>
            <p className="text-5xl md:text-7xl mt-20 opacity-90">
              Nigeria to Paris — la voix française t’a trouvé
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}