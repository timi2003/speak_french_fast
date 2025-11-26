"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones, BookOpen, PenTool, Mic, Upload, Trash2, CheckCircle } from "lucide-react";

const MODULES = [
  { key: "listening", label: "Listening", icon: Headphones, color: "from-[#0C1E46] to-[#0a1838]" },
  { key: "reading", label: "Reading", icon: BookOpen, color: "from-emerald-600 to-teal-700" },
  { key: "writing", label: "Writing", icon: PenTool, color: "from-[#ED4137] to-red-700" },
  { key: "speaking", label: "Speaking", icon: Mic, color: "from-purple-600 to-pink-700" },
];

export default function EnhancedQuestionUpload() {
  const [module, setModule] = useState("listening");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [moduleConfig, setModuleConfig] = useState<any>(null);

  const [formData, setFormData] = useState({
    skill_type: "",
    question_text: "",
    question_number: 1,
    audio_url: "",
    passage_text: "",
    task_name: "",
    options: { A: "", B: "", C: "", D: "" },
    correct_answer: "A",
    explanation: "",
    difficulty_level: "intermediate",
  });

  useEffect(() => {
    fetchData();
  }, [module]);

  const fetchData = async () => {
    try {
      const supabase = createClient();
      const [qRes, cRes] = await Promise.all([
        supabase.from("question_bank").select("*").eq("module", module).order("question_number"),
        supabase.from("module_config").select("*").eq("module", module).single(),
      ]);
      setQuestions(qRes.data || []);
      setModuleConfig(cRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOption = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: { ...prev.options, [key]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createClient();
      const base = {
        module,
        skill_type: formData.skill_type,
        question_text: formData.question_text,
        question_number: formData.question_number,
        correct_answer: formData.correct_answer,
        explanation: formData.explanation,
        difficulty_level: formData.difficulty_level,
      };

      const data: any = { ...base };

      if (module === "listening") {
        data.audio_url = formData.audio_url;
        data.options = formData.options;
      } else if (module === "reading") {
        data.passage_text = formData.passage_text;
        data.options = formData.options;
      } else if (module === "writing" || module === "speaking") {
        data.task_name = formData.task_name;
      }

      const { error: insertError } = await supabase.from("question_bank").insert(data);
      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        ...formData,
        skill_type: "",
        question_text: "",
        question_number: formData.question_number + 1,
        audio_url: "",
        passage_text: "",
        task_name: "",
        options: { A: "", B: "", C: "", D: "" },
        explanation: "",
      });
      fetchData();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Delete this question permanently?")) return;
    try {
      const supabase = createClient();
      await supabase.from("question_bank").delete().eq("id", id);
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const currentModule = MODULES.find(m => m.key === module)!;

  return (
    <Tabs value={module} onValueChange={setModule} className="w-full">
      {/* Clean Responsive Tabs */}
      <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-16 bg-white shadow-md rounded-xl border border-gray-200 mb-8">
        {MODULES.map(({ key, label, icon: Icon }) => (
          <TabsTrigger
            key={key}
            value={key}
            className="text-[#0C1E46] text-sm font-medium data-[state=active]:bg-[#0C1E46] data-[state=active]:text-white flex items-center gap-2"
          >
            <Icon className="w-5 h-5" />
            <span className="hidden sm:inline">{label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={module} className="space-y-8">
        {/* Module Stats */}
        {moduleConfig && (
          <Card className="bg-gradient-to-r from-[#0C1E46]/5 to-[#ED4137]/5 border-0">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-2xl font-bold text-[#0C1E46]">{moduleConfig.timer_minutes} min</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Target</p>
                  <p className="text-2xl font-bold text-[#0C1E46]">{moduleConfig.number_of_questions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Uploaded</p>
                  <p className="text-2xl font-bold text-[#ED4137]">{questions.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((questions.length / moduleConfig.number_of_questions) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className={`bg-gradient-to-r ${currentModule.color} text-white rounded-t-xl py-6`}>
            <div className="flex items-center justify-center gap-4">
              <currentModule.icon className="w-12 h-12" />
              <CardTitle className="text-xl md:text-2xl font-bold">
                Add {currentModule.label} Question
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-6 md:p-8 bg-white">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Skill Type & Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[#0C1E46] font-medium">Skill Type</Label>
                  <Input
                    placeholder="e.g., Comprehension, Vocabulary"
                    value={formData.skill_type}
                    onChange={e => handleChange("skill_type", e.target.value)}
                    required
                    className="text-[#0C1E46] h-12 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[#0C1E46] font-medium">Question Number</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.question_number}
                    onChange={e => handleChange("question_number", +e.target.value)}
                    className="h-12 text-[#0C1E46]"
                  />
                </div>
              </div>

              {/* Module-Specific Fields */}
              {module === "listening" && (
                <div className="space-y-3">
                  <Label className="text-[#0C1E46] font-medium">Audio URL (MP3)</Label>
                  <Input
                    type="url"
                    placeholder="https://example.com/audio.mp3"
                    value={formData.audio_url}
                    onChange={e => handleChange("audio_url", e.target.value)}
                    required
                    className="h-12 text-[#0C1E46]"
                  />
                </div>
              )}

              {module === "reading" && (
                <div className="space-y-3">
                  <Label className="text-[#0C1E46] font-medium">Reading Passage</Label>
                  <Textarea
                    placeholder="Paste the full passage here..."
                    value={formData.passage_text}
                    onChange={e => handleChange("passage_text", e.target.value)}
                    required
                    rows={8}
                    className="text-[#0C1E46] resize-none"
                  />
                </div>
              )}

              {(module === "writing" || module === "speaking") && (
                <div className="space-y-3">
                  <Label className="text-[#0C1E46] font-medium">Task Type</Label>
                  <Select value={formData.task_name} onValueChange={v => handleChange("task_name", v)}>
                    <SelectTrigger className="text-[#0C1E46] bg-white h-12">
                      <SelectValue placeholder="Select task" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-[#0C1E46]">
                      <SelectItem value="Task 1">Task 1</SelectItem>
                      <SelectItem value="Task 2">Task 2</SelectItem>
                      <SelectItem value="Task 3">Task 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Question Text */}
              <div className="space-y-3">
                <Label className="text-[#0C1E46] font-medium">Question / Prompt</Label>
                <Textarea
                  placeholder="Enter the question students will see..."
                  value={formData.question_text}
                  onChange={e => handleChange("question_text", e.target.value)}
                  required
                  rows={4}
                  className="text-[#0C1E46] resize-none"
                />
              </div>

              {/* MCQ Options */}
              {(module === "listening" || module === "reading") && (
                <>
                  <div className="space-y-4">
                    <Label className="text-[#0C1E46] font-medium">Answer Options</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(formData.options).map(([k, v]) => (
                        <div key={k} className="space-y-2">
                          <Label className="text-[#0C1E46] text-sm font-medium">Option {k}</Label>
                          <Input
                            value={v as string}
                            onChange={e => handleOption(k, e.target.value)}
                            placeholder={`Option ${k}`}
                            required
                            className="text-[#0C1E46] h-12"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[#0C1E46] font-medium">Correct Answer</Label>
                    <Select value={formData.correct_answer} onValueChange={v => handleChange("correct_answer", v)}>
                      <SelectTrigger className="text-[#0C1E46]  h-12 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="text-[#0C1E46]">
                        {["A", "B", "C", "D"].map(l => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Explanation */}
              <div className="space-y-3">
                <Label className="text-[#0C1E46] font-medium">Explanation / Model Answer</Label>
                <Textarea
                  placeholder="Why is this correct? Provide guidance..."
                  value={formData.explanation}
                  onChange={e => handleChange("explanation", e.target.value)}
                  required
                  rows={5}
                  className="text-[#0C1E46] resize-none"
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-3">
                <Label className="text-[#0C1E46] font-medium">Difficulty Level</Label>
                <Select value={formData.difficulty_level} onValueChange={v => handleChange("difficulty_level", v)}>
                  <SelectTrigger className="text-[#0C1E46] h-12 w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-[#0C1E46]">
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feedback */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6" />
                  Question added successfully!
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 text-xl font-bold bg-[#ED4137] hover:bg-red-600 rounded-xl shadow-lg"
              >
                <Upload className="w-6 h-6 mr-3" />
                {loading ? "Adding Question..." : "Add Question"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Questions */}
        {questions.length > 0 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-xl font-bold">
                Existing Questions ({questions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {questions.map(q => (
                  <div
                    key={q.id}
                    className="p-5 border rounded-xl hover:bg-gray-50 transition-all flex justify-between items-start gap-4"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-lg">
                        Q{q.question_number}: {q.question_text.substring(0, 80)}...
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {q.skill_type} • {q.difficulty_level}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteQuestion(q.id)}
                      className="h-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}