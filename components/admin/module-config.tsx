"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones, BookOpen, PenTool, Mic, Save } from "lucide-react";

const MODULES = [
  { id: "listening", name: "Listening", icon: Headphones, color: "from-blue-600 to-indigo-700" },
  { id: "reading", name: "Reading", icon: BookOpen, color: "from-emerald-600 to-teal-700" },
  { id: "writing", name: "Writing", icon: PenTool, color: "from-[#ED4137] to-red-700" },
  { id: "speaking", name: "Speaking", icon: Mic, color: "from-purple-600 to-pink-700" },
];

export default function ModuleConfig() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("module_config").select("*");
      setConfigs(data || []);
    } catch (error) {
      console.error("[SFF] Error fetching configs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (moduleId: string, updatedData: any) => {
    setUpdating(moduleId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("module_config")
        .update(updatedData)
        .eq("id", moduleId);

      if (error) throw error;
      fetchConfigs();
    } catch (error) {
      console.error("[SFF] Error updating config:", error);
    } finally {
      setUpdating(null);
    }
  };

  const getConfig = (module: string) => configs.find((c) => c.module === module) || {};

  const updateLocalConfig = (module: string, field: string, value: any) => {
    setConfigs((prev) =>
      prev.map((c) => (c.module === module ? { ...c, [field]: value } : c))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-xl text-gray-600 animate-pulse">Loading module settings...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8">
      <Tabs defaultValue="listening" className="w-full">
        {/* RESPONSIVE TABS — Stacked on mobile, horizontal on larger */}
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto min-h-16 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 p-2 gap-2">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <TabsTrigger
                key={mod.id}
                value={mod.id}
                className="flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-3 text-xs sm:text-sm md:text-base font-bold data-[state=active]:bg-[#0C1E46] data-[state=active]:text-white rounded-xl transition-all"
              >
                <Icon className="w-6 h-6 sm:w-5 sm:h-5" />
                <span className="hidden xxs:inline sm:inline">{mod.name}</span>
                <span className="xxs:hidden text-xs">{mod.name[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* CONTENT — Fully responsive */}
        {MODULES.map((mod) => {
          const config = getConfig(mod.id);
          const Icon = mod.icon;

          return (
            <TabsContent key={mod.id} value={mod.id} className="mt-8">
              <Card className="border-0 shadow-2xl overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl">
                {/* Header — Beautiful gradient */}
                <CardHeader className={`bg-gradient-to-r ${mod.color} text-white py-10 sm:py-12 px-6`}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
                    <Icon className="w-20 h-20 sm:w-24 sm:h-24" />
                    <div>
                      <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                        {mod.name} Module
                      </CardTitle>
                      <p className="text-lg sm:text-xl mt-3 opacity-90 font-medium">
                        Configure experience for Nigerian learners
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 sm:p-8 lg:p-12 space-y-10 bg-gradient-to-b from-white to-gray-50">
                  {/* Grid — 1 col on mobile, 2 on md+ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Timer */}
                    <div className="space-y-4">
                      <Label className="text-lg sm:text-xl font-bold text-[#0C1E46] flex items-center gap-2">
                        Exam Duration (minutes)
                      </Label>
                      <Input
                        type="number"
                        min="10"
                        max="180"
                        value={config.timer_minutes || 45}
                        onChange={(e) =>
                          updateLocalConfig(mod.id, "timer_minutes", Number(e.target.value))
                        }
                        className="h-14 sm:h-16 text-xl border-2 rounded-2xl focus:border-[#0C1E46] focus:ring-4 focus:ring-[#B0CCFE]/30"
                        placeholder="45"
                      />
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                      <Label className="text-lg sm:text-xl font-bold text-[#0C1E46] flex items-center gap-2">
                        Number of Questions
                      </Label>
                      <Input
                        type="number"
                        min="5"
                        max="50"
                        value={config.number_of_questions || 20}
                        onChange={(e) =>
                          updateLocalConfig(mod.id, "number_of_questions", Number(e.target.value))
                        }
                        className="h-14 sm:h-16 text-xl border-2 rounded-2xl focus:border-[#0C1E46] focus:ring-4 focus:ring-[#B0CCFE]/30"
                        placeholder="20"
                      />
                    </div>
                  </div>

                  {/* Listening: Replays */}
                  {mod.id === "listening" && (
                    <div className="space-y-4">
                      <Label className="text-lg sm:text-xl font-bold text-[#0C1E46]">
                        Audio Replays Allowed
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={config.allow_replays || 3}
                        onChange={(e) =>
                          updateLocalConfig(mod.id, "allow_replays", Number(e.target.value))
                        }
                        className="h-14 sm:h-16 text-xl border-2 rounded-2xl focus:border-[#0C1E46] focus:ring-4 focus:ring-[#B0CCFE]/30"
                        placeholder="3"
                      />
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="space-y-4">
                    <Label className="text-lg sm:text-xl font-bold text-[#0C1E46]">
                      Instructions for Students
                    </Label>
                    <Textarea
                      value={config.instructions || ""}
                      onChange={(e) =>
                        updateLocalConfig(mod.id, "instructions", e.target.value)
                      }
                      placeholder="Write clear instructions students will see before starting this module..."
                      rows={6}
                      className="text-base sm:text-lg resize-none border-2 rounded-2xl focus:border-[#0C1E46] focus:ring-4 focus:ring-[#B0CCFE]/30 p-5"
                    />
                  </div>

                  {/* Save Button — Full width, epic */}
                  <div className="pt-8">
                    <Button
                      onClick={() =>
                        handleUpdateConfig(config.id, {
                          timer_minutes: config.timer_minutes,
                          number_of_questions: config.number_of_questions,
                          instructions: config.instructions,
                          allow_replays: config.allow_replays,
                        })
                      }
                      disabled={updating === config.id}
                      className="w-full h-16 sm:h-20 text-xl sm:text-2xl font-black bg-[#ED4137] hover:bg-red-600 shadow-2xl rounded-2xl flex items-center justify-center gap-4 transition-all transform hover:scale-105"
                    >
                      <Save className="w-8 h-8" />
                      {updating === config.id ? "Saving Changes..." : "Save Configuration"}
                    </Button>
                  </div>

                  {/* Success Hint */}
                  {updating === config.id && (
                    <p className="text-center text-green-600 font-bold text-lg animate-pulse">
                      Changes saved successfully!
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}