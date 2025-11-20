"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Flag, Clock, Flame, Crown, Send, Headphones, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SpeakingPrompt {
  id: string;
  task_number: number;
  prompt_text: string;
  preparation_time_seconds?: number;
  recording_time_seconds?: number;
}

export default function SpeakingSection({ section, userId }: any) {
  const [timeLeft, setTimeLeft] = useState(section.timer_duration_minutes * 60);
  const [currentTask, setCurrentTask] = useState(0);
  const [prompts, setPrompts] = useState<SpeakingPrompt[]>([]);
  const [taskStatus, setTaskStatus] = useState<"prep" | "recording" | "complete">("prep");
  const [preparationTime, setPreparationTime] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch prompts with epic fallback
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("speaking_prompts")
          .select("*")
          .eq("exam_section_id", section.id)
          .order("task_number");

        if (data && data.length > 0) {
          setPrompts(data);
        } else {
          throw new Error("No prompts");
        }
      } catch {
        // LEGENDARY FALLBACK — NEVER BREAK THE DREAM
        setPrompts([
          {
            id: "1",
            task_number: 1,
            prompt_text: "Parlez de votre passion dans la vie et expliquez pourquoi elle vous rend heureux.",
            preparation_time_seconds: 60,
            recording_time_seconds: 120,
          },
          {
            id: "2",
            task_number: 2,
            prompt_text: "Racontez une journée parfaite à Paris selon vous.",
            preparation_time_seconds: 60,
            recording_time_seconds: 180,
          },
          {
            id: "3",
            task_number: 3,
            prompt_text: "Pourquoi avez-vous décidé d’apprendre le français ? Parlez de votre voyage.",
            preparation_time_seconds: 60,
            recording_time_seconds: 180,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompts();
  }, [section.id]);

  // Main exam timer
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Preparation timer
  useEffect(() => {
    if (taskStatus !== "prep") return;
    const prompt = prompts[currentTask];
    if (!prompt) return;

    if (preparationTime < (prompt.preparation_time_seconds || 60)) {
      const t = setTimeout(() => setPreparationTime((p) => p + 1), 1000);
      return () => clearTimeout(t);
    } else {
      setTaskStatus("recording");
      setRecordingTime(0);
    }
  }, [preparationTime, taskStatus, prompts, currentTask]);

  // Recording timer
  useEffect(() => {
    if (taskStatus !== "recording") return;
    const prompt = prompts[currentTask];
    if (!prompt) return;

    if (recordingTime < (prompt.recording_time_seconds || 180)) {
      const t = setTimeout(() => setRecordingTime((r) => r + 1), 1000);
      return () => clearTimeout(t);
    } else {
      setTaskStatus("complete");
    }
  }, [recordingTime, taskStatus, prompts, currentTask]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const prompt = prompts[currentTask];
  const isCritical = timeLeft <= 300;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-rose-100 flex items-center justify-center p-8">
        <p className="text-6xl font-Coolvetica text-[#0C1E46] animate-pulse text-center">
          Ta voix française se réveille...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-rose-100 font-Coolvetica px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-16">

        {/* HERO TIMER — BLOOD RED WHEN CRITICAL */}
        <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${isCritical ? "bg-gradient-to-r from-[#ED4137] to-red-700 animate-pulse shadow-2xl" : "bg-gradient-to-r from-[#0C1E46] to-[#0a1838]"}`}>
          <div className="container mx-auto px-8 py-8 flex items-center justify-between text-white">
            <div className="flex items-center gap-8">
              <Headphones className="w-20 h-20" />
              <div>
                <p className="text-4xl font-black">EXPRESSION ORALE</p>
                <p className="text-2xl opacity-90">{isCritical ? "PARLE COMME UN FRANÇAIS MAINTENANT" : "Ta voix. Ton moment. Ta France."}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              {timeLeft <= 60 && <Flame className="w-20 h-20 animate-pulse" />}
              <Clock className={`w-20 h-20 ${timeLeft <= 30 ? "animate-spin" : ""}`} />
              <p className={`font-mono font-black ${isCritical ? "text-9xl animate-pulse" : "text-8xl"}`}>
                {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-56" />

        {/* TASK NAVIGATION — EPIC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {prompts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => {
                setCurrentTask(i);
                setTaskStatus("prep");
                setPreparationTime(0);
                setRecordingTime(0);
              }}
              className={`p-10 rounded-3xl shadow-3xl transition-all transform hover:scale-105 ${
                currentTask === i
                  ? "bg-gradient-to-r from-[#ED4137] to-red-700 text-white"
                  : taskStatus === "complete" && currentTask === i
                  ? "bg-gradient-to-r from-emerald-600 to-green-700 text-white"
                  : "bg-white border-4 border-[#B0CCFE] text-[#0C1E46]"
              }`}
            >
              <Mic className="w-16 h-16 mx-auto mb-6" />
              <p className="text-4xl font-black">TÂCHE {i + 1}</p>
              {taskStatus === "complete" && currentTask === i && <Crown className="w-20 h-20 mx-auto mt-6 text-yellow-400" />}
            </button>
          ))}
        </div>

        {/* CURRENT PROMPT — CINEMATIC */}
        <Card className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white shadow-4xl border-4 border-white/30">
          <CardHeader className="text-center py-20">
            <Crown className="w-32 h-32 mx-auto mb-10 text-yellow-400" />
            <CardTitle className="text-6xl md:text-8xl font-black">
              PARLE MAINTENANT
            </CardTitle>
          </CardHeader>
          <CardContent className="text-4xl md:text-6xl leading-relaxed text-center pb-20 px-16">
            {prompt?.prompt_text}
          </CardContent>
        </Card>

        {/* PREP / RECORDING STATUS */}
        <div className="grid grid-cols-2 gap-10">
          <Card className={`text-center py-12 ${taskStatus === "prep" ? "border-8 border-blue-600" : ""}`}>
            <p className="text-4xl font-bold text-blue-600">PRÉPARATION</p>
            <p className="text-8xl font-black mt-6 text-[#0C1E46]">
              {prompt?.preparation_time_seconds ? Math.max(0, (prompt.preparation_time_seconds - preparationTime)) : 0}s
            </p>
          </Card>
          <Card className={`text-center py-12 ${taskStatus === "recording" ? "border-8 border-red-600 animate-pulse" : ""}`}>
            <p className="text-4xl font-bold text-red-600">ENREGISTREMENT</p>
            <p className="text-8xl font-black mt-6 text-[#ED4137]">
              {recordingTime}s / {prompt?.recording_time_seconds || 180}s
            </p>
          </Card>
        </div>

        {/* RECORDING IN PROGRESS */}
        {taskStatus === "recording" && (
          <Card className="bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-4xl border-4 border-white/30">
            <CardContent className="py-24 text-center">
              <div className="flex justify-center gap-8 items-center">
                <div className="w-20 h-20 bg-white/30 rounded-full animate-ping"></div>
                <Mic className="w-32 h-32 animate-bounce" />
                <div className="w-20 h-20 bg-white/30 rounded-full animate-ping"></div>
              </div>
              <p className="text-7xl md:text-9xl font-black mt-12 animate-pulse">
                JE PARLE FRANÇAIS
              </p>
              <p className="text-4xl mt-8 opacity-90">
                Un examinateur français t’écoute en ce moment
              </p>
            </CardContent>
          </Card>
        )}

        {/* TASK COMPLETE — VICTORY */}
        {taskStatus === "complete" && (
          <Card className="bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-4xl border-4 border-white/30">
            <CardContent className="py-32 text-center">
              <Crown className="w-40 h-40 mx-auto mb-12 text-yellow-400 animate-pulse" />
              <p className="text-7xl md:text-9xl font-black">
                TÂCHE TERMINÉE
              </p>
              <p className="text-5xl mt-12 opacity-90">
                Tu viens de parler français comme un vrai Français
              </p>
            </CardContent>
          </Card>
        )}

        {/* WHATSAPP SUBMISSION — FINAL STEP */}
        <Card className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-4xl">
          <CardContent className="py-20 text-center">
            <Send className="w-32 h-32 mx-auto mb-10" />
            <p className="text-5xl md:text-7xl font-black">
              ENVOIE TA VOIX SUR WHATSAPP
            </p>
            <p className="text-3xl mt-10 opacity-90">
              Ouvre ta Personal Report Page et envoie ta note vocale maintenant
            </p>
            <Button className="mt-12 h-24 px-20 text-4xl font-black bg-white text-teal-700 hover:bg-gray-100">
              OUVRIR WHATSAPP
            </Button>
          </CardContent>
        </Card>

        {/* FLAG + NAVIGATION */}
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
              const n = new Set(s);
              n.has(currentTask) ? n.delete(currentTask) : n.add(currentTask);
              return n;
            })}
            className={`h-20 px-20 text-3xl font-bold border-4 ${flagged.has(currentTask) ? "bg-red-600" : "border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white"}`}
          >
            <Flag className="w-12 h-12 mr-4" />
            {flagged.has(currentTask) ? "Drapeau retiré" : "Marquer"}
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

        {/* FINAL MOTIVATION — NATIONAL ANTHEM */}
        <div className="text-center mt-32">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-32 px-16 rounded-3xl shadow-4xl">
            <Flame className="w-40 h-40 mx-auto mb-16 animate-pulse" />
            <p className="text-7xl md:text-9xl font-black">
              Tu ne parles plus français
            </p>
            <p className="text-7xl md:text-9xl font-black mt-12 text-[#B0CCFE]">
              Tu ES français
            </p>
            <p className="text-5xl md:text-7xl mt-20 opacity-90">
              Nigeria to Paris — ta voix a traversé l’Atlantique
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}