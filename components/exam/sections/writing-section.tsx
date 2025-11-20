"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flag, FileText, PenTool, Flame, Crown, Clock, Send, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface WritingPrompt {
  id: string;
  task_number: number;
  prompt_text: string;
  min_word_count?: number;
  max_word_count?: number;
}

const FRENCH_ACCENTS = [
  { char: "é", label: "é (e acute)" },
  { char: "è", label: "è (e grave)" },
  { char: "ê", label: "ê (e circumflex)" },
  { char: "ë", label: "ë (e diaeresis)" },
  { char: "à", label: "à (a grave)" },
  { char: "â", label: "â (a circumflex)" },
  { char: "ä", label: "ä (a diaeresis)" },
  { char: "ô", label: "ô (o circumflex)" },
  { char: "ö", label: "ö (o diaeresis)" },
  { char: "ù", label: "ù (u grave)" },
  { char: "û", label: "û (u circumflex)" },
  { char: "ü", label: "ü (u diaeresis)" },
  { char: "î", label: "î (i circumflex)" },
  { char: "ï", label: "ï (i diaeresis)" },
  { char: "ç", label: "ç (cedilla)" },
  { char: "œ", label: "œ (oe ligature)" },
  { char: "æ", label: "æ (ae ligature)" },
];

export default function WritingSection({ section, userId, examAttemptId }: any) {
  const [timeLeft, setTimeLeft] = useState(section.timer_duration_minutes * 60);
  const [currentTask, setCurrentTask] = useState(0);
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingResponse, setSavingResponse] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("writing_prompts")
          .select("*")
          .eq("exam_section_id", section.id)
          .order("task_number", { ascending: true });

        setPrompts(data || []);
      } catch (error) {
        console.error("Failed to fetch prompts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, [section.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleResponseChange = async (text: string) => {
    const prompt = prompts[currentTask];
    if (!prompt) return;

    setResponses((prev) => ({ ...prev, [currentTask]: text }));
    setSavingResponse(true);

    try {
      const supabase = createClient();
      const { data: existing } = await supabase
        .from("student_responses")
        .select("id")
        .eq("student_id", userId)
        .eq("exam_section_id", section.id)
        .eq("question_id", prompt.id)
        .single();

      if (existing) {
        await supabase.from("student_responses").update({ text_response: text }).eq("id", existing.id);
      } else {
        await supabase.from("student_responses").insert({
          student_id: userId,
          exam_id: section.exam_id,
          exam_section_id: section.id,
          question_id: prompt.id,
          text_response: text,
        });
      }
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSavingResponse(false);
    }
  };

  const insertAccent = (char: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = responses[currentTask] || "";
    const newText = text.substring(0, start) + char + text.substring(end);
    handleResponseChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + char.length, start + char.length);
    }, 0);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const currentResponse = responses[currentTask] || "";
  const wordCount = currentResponse.trim().split(/\s+/).filter(Boolean).length;
  const prompt = prompts[currentTask];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
        <p className="text-5xl font-Coolvetica text-[#0C1E46] animate-pulse text-center">
          Préparation de ta plume française...
        </p>
      </div>
    );
  }

  if (prompts.length === 0) {
    return null;
  }

  const isCritical = timeLeft <= 300;
  const isFinal = timeLeft <= 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-Coolvetica px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* HERO TIMER — BLOOD-RED WHEN CRITICAL */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${isCritical ? "bg-gradient-to-r from-[#ED4137] to-red-700 shadow-2xl animate-pulse" : "bg-gradient-to-r from-[#0C1E46] to-[#0a1838]"}`}>
          <div className="container mx-auto px-6 py-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-6">
              <PenTool className="w-16 h-16" />
              <div>
                <p className="text-3xl font-bold">ÉCRITURE — {section.timer_duration_minutes} MINUTES</p>
                <p className="text-xl opacity-90">{isCritical ? "FINIS COMME UN CHAMPION" : "Écris comme si Paris t’attendait"}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {isFinal && <Flame className="w-16 h-16 animate-pulse" />}
              <Clock className={`w-16 h-16 ${isFinal ? "animate-spin" : ""}`} />
              <p className={`font-mono font-black ${isCritical ? "text-7xl animate-pulse" : "text-6xl"}`}>
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-48" />

        {/* TASK NAVIGATION — EPIC */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {prompts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCurrentTask(i)}
              className={`p-8 rounded-3xl shadow-2xl transition-all transform hover:scale-105 ${
                currentTask === i
                  ? "bg-gradient-to-r from-[#ED4137] to-red-700 text-white"
                  : responses[i]
                  ? "bg-gradient-to-r from-emerald-600 to-green-700 text-white"
                  : "bg-white border-4 border-[#B0CCFE] text-[#0C1E46]"
              }`}
            >
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <p className="text-3xl font-black">TÂCHE {i + 1}</p>
              {responses[i] && <p className="text-lg mt-2 opacity-90">{wordCount} mots</p>}
            </button>
          ))}
        </div>

        {/* CURRENT PROMPT — CINEMATIC */}
        <Card className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white shadow-4xl border-4 border-white/30">
          <CardHeader className="text-center py-16">
            <Crown className="w-24 h-24 mx-auto mb-8 text-yellow-400" />
            <CardTitle className="text-5xl md:text-7xl font-black">
              TÂCHE {prompt?.task_number}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl md:text-5xl leading-relaxed text-center pb-16 px-12">
            {prompt?.prompt_text}
          </CardContent>
        </Card>

        {/* WORD COUNT + PROGRESS */}
        {prompt && (prompt.min_word_count || prompt.max_word_count) && (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-3xl p-10 border-4 border-[#B0CCFE]">
            <div className="flex items-center justify-between mb-6">
              <p className="text-4xl font-bold text-[#0C1E46]">MOT COMPTEUR</p>
              <p className={`text-8xl font-black ${wordCount >= (prompt.min_word_count || 0) ? "text-emerald-600" : "text-red-600"}`}>
                {wordCount}
              </p>
            </div>
            <div className="h-12 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full transition-all duration-1000 ${wordCount >= (prompt.min_word_count || 0) ? "bg-gradient-to-r from-emerald-500 to-green-600" : "bg-gradient-to-r from-red-500 to-rose-600"}`}
                style={{ width: `${Math.min((wordCount / (prompt.max_word_count || prompt.min_word_count * 1.5 || 300)) * 100, 100)}%` }}
              />
            </div>
            <p className="text-center mt-6 text-2xl text-gray-700">
              Objectif: {prompt.min_word_count || 0}–{prompt.max_word_count || "∞"} mots
            </p>
          </div>
        )}

        {/* FRENCH ACCENT BAR — LEGENDARY */}
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-3xl">
          <CardHeader className="text-center py-8">
            <p className="text-4xl font-black">CLAVIER FRANÇAIS — CLIQUEZ POUR INSÉRER</p>
          </CardHeader>
          <CardContent className="grid grid-cols-6 md:grid-cols-9 gap-6 pb-12">
            {FRENCH_ACCENTS.map((a) => (
              <button
                key={a.char}
                onClick={() => insertAccent(a.char)}
                className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur hover:bg-white/40 text-5xl font-black shadow-2xl transform hover:scale-110 transition-all"
              >
                {a.char}
              </button>
            ))}
          </CardContent>
        </Card>

        {/* TEXTAREA — THE BATTLEFIELD */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-4xl border-8 border-[#B0CCFE] rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <Textarea
              ref={textareaRef}
              value={currentResponse}
              onChange={(e) => handleResponseChange(e.target.value)}
              placeholder="Écris ici comme si tu vivais déjà à Paris... Chaque mot te rapproche de la France."
              className="min-h-96 p-12 text-2xl md:text-3xl font-serif leading-relaxed border-0 resize-none focus:ring-0"
              disabled={savingResponse}
            />
            <div className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white p-6 text-center">
              {savingResponse ? (
                <p className="text-3xl animate-pulse">Sauvegarde en cours...</p>
              ) : (
                <p className="text-3xl font-bold">Sauvegardé automatiquement</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* NAVIGATION + FLAG */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="lg"
            disabled={currentTask === 0}
            onClick={() => setCurrentTask(currentTask - 1)}
            className="h-20 px-12 text-3xl border-4 border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold"
          >
            Tâche Précédente
          </Button>

          <Button
            variant={flagged.has(currentTask) ? "default" : "outline"}
            size="lg"
            onClick={() => setFlagged((s) => {
              const newSet = new Set(s);
              newSet.has(currentTask) ? newSet.delete(currentTask) : newSet.add(currentTask);
              return newSet;
            })}
            className={`h-20 px-16 text-3xl font-bold border-4 ${flagged.has(currentTask) ? "bg-red-600 hover:bg-red-700" : "border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white"}`}
          >
            <Flag className="w-10 h-10 mr-4" />
            {flagged.has(currentTask) ? "Drapeau retiré" : "Marquer pour révision"}
          </Button>

          <Button
            size="lg"
            disabled={currentTask === prompts.length - 1}
            onClick={() => setCurrentTask(currentTask + 1)}
            className="h-20 px-12 text-3xl bg-[#ED4137] hover:bg-red-600 font-bold"
          >
            Tâche Suivante
          </Button>
        </div>

        {/* FINAL MOTIVATION */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-20 px-12 rounded-3xl shadow-4xl">
            <Flame className="w-32 h-32 mx-auto mb-10 animate-pulse" />
            <p className="text-6xl md:text-8xl font-black">
              Tu n’écris plus en français
            </p>
            <p className="text-6xl md:text-8xl font-black mt-10 text-[#B0CCFE]">
              Tu vis en français
            </p>
            <p className="text-4xl md:text-5xl mt-16 opacity-90">
              Nigeria to Paris — chaque mot est un pas dans les rues de France
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}