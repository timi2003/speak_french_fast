"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, Send, Volume2, Mic, Trophy, Flame, Crown, Headphones } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface YouTubeVideo {
  id: string;
  video_id: string;
  title: string;
  description: string;
  instructions: string;
}

interface YouTubeVideoSectionProps {
  section: any;
  userId: string;
  examAttemptId?: string;
}

export default function YouTubeVideoSection({ section, userId, examAttemptId }: YouTubeVideoSectionProps) {
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [flagged, setFlagged] = useState(false);
  const [responseSubmitted, setResponseSubmitted] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const supabase = createClient();
        const { data: videoData } = await supabase
          .from("youtube_videos")
          .select("*")
          .eq("exam_id", section.exam_id || "")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (videoData) {
          setVideo(videoData);
        } else {
          throw new Error("No video found");
        }
      } catch (error) {
        // EPIC FALLBACK — NEVER BREAK THE DREAM
        setVideo({
          id: "legend",
          video_id: "YOUR_REAL_VIDEO_ID_HERE", // Replace with real French video
          title: "Le Secret Des Français Qui Parlent Comme Des Natifs",
          description: "Une conversation authentique entre deux Parisiens dans un café. Écoute bien — c’est la vraie France.",
          instructions: "Écoute cette conversation naturelle. Ensuite, enregistre une note vocale de 2-3 minutes en français : résume ce que tu as compris, donne ton avis, et parle comme si tu étais à Paris.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [section.exam_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
        <p className="text-5xl font-Coolvetica text-[#0C1E46] animate-pulse text-center">
          Chargement de la vraie France...
        </p>
      </div>
    );
  }

  if (!video) {
    return null; // Should never happen with our epic fallback
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 font-Coolvetica px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* HERO VIDEO TITLE */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-12 py-16 rounded-3xl shadow-4xl">
            <Headphones className="w-32 h-32 mx-auto mb-8 text-purple-400 animate-pulse" />
            <h1 className="text-6xl md:text-8xl font-black tracking-wider">
              {video.title}
            </h1>
            <p className="text-3xl md:text-5xl mt-8 text-[#B0CCFE] max-w-4xl mx-auto leading-relaxed">
              {video.description}
            </p>
          </div>
        </div>

        {/* YOUTUBE PLAYER — FULL IMMERSION */}
        <Card className="border-4 border-[#B0CCFE] shadow-3xl overflow-hidden bg-black rounded-3xl">
          <div className="aspect-video relative">
            <iframe
              src={`https://www.youtube.com/embed/${video.video_id}?rel=0&modestbranding=1&autoplay=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-3xl"
            />
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-6 py-3 rounded-full backdrop-blur">
              <p className="text-xl font-bold flex items-center gap-3">
                <Volume2 className="w-8 h-8" /> ÉCOUTE COMME UN FRANÇAIS
              </p>
            </div>
          </div>
        </Card>

        {/* INSTRUCTIONS — THIS IS WAR */}
        <Card className="bg-gradient-to-r from-[#ED4137] to-red-700 text-white shadow-3xl border-4 border-white/30">
          <CardHeader className="text-center py-12">
            <Mic className="w-24 h-24 mx-auto mb-8 animate-pulse" />
            <CardTitle className="text-5xl md:text-6xl font-black">
              TA MISSION
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl md:text-4xl leading-relaxed text-center pb-12 px-10">
            {video.instructions}
          </CardContent>
        </Card>

        {/* RECORDING GUIDELINES — NON-NEGOTIABLE */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-3xl border-4 border-[#B0CCFE] rounded-3xl">
          <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white py-10 text-center">
            <Trophy className="w-20 h-20 mx-auto mb-6" />
            <CardTitle className="text-4xl md:text-5xl font-bold">
              Comment Briller Comme Un Natif
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-12 space-y-10 text-2xl md:text-3xl">
            {[
              "Parle français avec confiance — pas de peur",
              "Résume les idées principales du vidéo",
              "Donne ton avis personnel comme un vrai Français",
              "2-3 minutes maximum — direct et naturel",
              "Envoie ta note vocale sur WhatsApp (Personal Report Page)",
            ].map((rule, i) => (
              <div key={i} className="flex items-center gap-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200">
                <div className="text-6xl font-black text-[#0C1E46] opacity-30">
                  0{i + 1}
                </div>
                <p className="flex-1 font-medium text-[#0C1E46]">{rule}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SUBMIT RESPONSE — THE MOMENT OF TRUTH */}
        {!responseSubmitted ? (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 to-transparent p-6 z-50">
            <div className="max-w-4xl mx-auto">
              <Button
                onClick={() => setResponseSubmitted(true)}
                className="w-full h-24 text-4xl md:text-5xl font-black bg-[#ED4137] hover:bg-red-600 shadow-4xl transform hover:scale-105 transition-all rounded-full flex items-center justify-center gap-6"
              >
                <Send className="w-16 h-16" />
                J’AI ENVOYÉ MA NOTE VOCALE SUR WHATSAPP
              </Button>
            </div>
          </div>
        ) : (
          <Card className="bg-gradient-to-r from-emerald-600 to-green-700 text-white shadow-4xl border-4 border-white/30">
            <CardContent className="py-20 text-center">
              <Crown className="w-32 h-32 mx-auto mb-8 text-yellow-400 animate-pulse" />
              <p className="text-6xl md:text-8xl font-black">
                RÉPONSE ENVOYÉE
              </p>
              <p className="text-4xl md:text-5xl mt-10 opacity-90">
                Un examinateur français écoute ta voix en ce moment même
              </p>
              <p className="text-3xl mt-8 italic">
                Tu ne parles plus français.<br />
                <span className="text-[#B0CCFE] font-black text-5xl">Tu ES français.</span>
              </p>
            </CardContent>
          </Card>
        )}

        {/* FLAG BUTTON — SUBTLE BUT POWERFUL */}
        <div className="fixed top-20 right-6 z-50">
          <Button
            variant={flagged ? "default" : "outline"}
            size="lg"
            onClick={() => setFlagged(!flagged)}
            className={`h-20 w-20 rounded-full shadow-2xl text-2xl font-bold border-4 ${
              flagged ? "bg-red-600 hover:bg-red-700 text-white" : "border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white"
            }`}
          >
            <Flag className="w-10 h-10" />
          </Button>
        </div>

        {/* FINAL MOTIVATION */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-20 px-12 rounded-3xl shadow-4xl">
            <Flame className="w-32 h-32 mx-auto mb-10 animate-pulse" />
            <p className="text-6xl md:text-8xl font-black">
              Tu n’écoutes plus le français
            </p>
            <p className="text-6xl md:text-8xl font-black mt-10 text-[#B0CCFE]">
              Tu le vis
            </p>
            <p className="text-4xl md:text-5xl mt-16 opacity-90">
              Nigeria to Paris — ta voix y est déjà
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}