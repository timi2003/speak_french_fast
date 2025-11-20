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

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-gray-600">Loading module settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Tabs defaultValue="listening" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-16 bg-white/90 backdrop-blur-md shadow-lg rounded-xl border border-gray-200">
          {MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <TabsTrigger
                key={mod.id}
                value={mod.id}
                className="text-sm md:text-base font-medium data-[state=active]:bg-[#0C1E46] data-[state=active]:text-white flex items-center justify-center gap-2"
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{mod.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {MODULES.map((mod) => {
          const config = getConfig(mod.id);
          const Icon = mod.icon;

          return (
            <TabsContent key={mod.id} value={mod.id} className="mt-6">
              <Card className="border-0 shadow-xl overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${mod.color} text-white py-10`}>
                  <div className="flex items-center justify-center gap-6">
                    <Icon className="w-16 h-16" />
                    <div className="text-center">
                      <CardTitle className="text-3xl md:text-4xl font-bold">
                        {mod.name} Module Configuration
                      </CardTitle>
                      <p className="text-lg mt-2 opacity-90">
                        Fine-tune the experience for Nigerian learners
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8 bg-white space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Timer */}
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-[#0C1E46]">
                        Exam Duration (minutes)
                      </Label>
                      <Input
                        type="number"
                        min="10"
                        max="180"
                        value={config.timer_minutes || 45}
                        onChange={(e) => {
                          const newConfigs = configs.map((c) =>
                            c.module === mod.id ? { ...c, timer_minutes: Number(e.target.value) } : c
                          );
                          setConfigs(newConfigs);
                        }}
                        className="h-14 text-lg border-2 rounded-xl focus:border-[#0C1E46]"
                      />
                    </div>

                    {/* Number of Questions */}
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-[#0C1E46]">
                        Number of Questions
                      </Label>
                      <Input
                        type="number"
                        min="5"
                        max="50"
                        value={config.number_of_questions || 20}
                        onChange={(e) => {
                          const newConfigs = configs.map((c) =>
                            c.module === mod.id ? { ...c, number_of_questions: Number(e.target.value) } : c
                          );
                          setConfigs(newConfigs);
                        }}
                        className="h-14 text-lg border-2 rounded-xl focus:border-[#0C1E46]"
                      />
                    </div>
                  </div>

                  {/* Listening: Replays */}
                  {mod.id === "listening" && (
                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-[#0C1E46]">
                        Audio Replays Allowed
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        max="5"
                        value={config.allow_replays || 3}
                        onChange={(e) => {
                          const newConfigs = configs.map((c) =>
                            c.module === mod.id ? { ...c, allow_replays: Number(e.target.value) } : c
                          );
                          setConfigs(newConfigs);
                        }}
                        className="h-14 text-lg border-2 rounded-xl focus:border-[#0C1E46]"
                      />
                    </div>
                  )}

                  {/* Instructions */}
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold text-[#0C1E46]">
                      Instructions for Students
                    </Label>
                    <Textarea
                      value={config.instructions || ""}
                      onChange={(e) => {
                        const newConfigs = configs.map((c) =>
                          c.module === mod.id ? { ...c, instructions: e.target.value } : c
                        );
                        setConfigs(newConfigs);
                      }}
                      placeholder="Enter clear instructions students will see before starting..."
                      rows={5}
                      className="text-base resize-none border-2 rounded-xl focus:border-[#0C1E46]"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="pt-6">
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
                      className="w-full h-16 text-xl font-bold bg-[#ED4137] hover:bg-red-600 shadow-xl rounded-xl"
                    >
                      <Save className="w-6 h-6 mr-3" />
                      {updating === config.id ? "Saving Changes..." : "Save Module Configuration"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}