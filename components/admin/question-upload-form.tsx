"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, CheckCircle, Headphones, FileText, PenTool, Mic } from "lucide-react";

export default function QuestionUploadForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    module: "listening",
    skill_type: "",
    question_text: "",
    audio_url: "",
    options: { A: "", B: "", C: "", D: "" },
    correct_answer: "A",
    explanation: "",
    difficulty_level: "intermediate",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (key: "A" | "B" | "C" | "D", value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: { ...prev.options, [key]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("question_bank").insert({
        module: formData.module,
        skill_type: formData.skill_type,
        question_text: formData.question_text,
        audio_url: formData.audio_url || null,
        options: formData.options,
        correct_answer: formData.correct_answer,
        explanation: formData.explanation,
        difficulty_level: formData.difficulty_level,
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);

      // Reset form but keep module
      setFormData((prev) => ({
        ...prev,
        skill_type: "",
        question_text: "",
        audio_url: "",
        options: { A: "", B: "", C: "", D: "" },
        correct_answer: "A",
        explanation: "",
      }));
    } catch (err: any) {
      setError(err.message || "Failed to upload question");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const getModuleIcon = () => {
    const icons = {
      listening: <Headphones className="w-7 h-7 md:w-8 md:h-8" />,
      reading: <FileText className="w-7 h-7 md:w-8 md:h-8" />,
      writing: <PenTool className="w-7 h-7 md:w-8 md:h-8" />,
      speaking: <Mic className="w-7 h-7 md:w-8 md:h-8" />,
    };
    return icons[formData.module as keyof typeof icons];
  };

  return (
    <div className="max-w-4xl mx-auto font-Coolvetica px-4">

      {/* Compact Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-6 py-5 rounded-2xl shadow-xl">
          <Upload className="w-10 h-10" />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl md:text-4xl font-bold">Upload Question</h2>
            <p className="text-blue-100 text-sm md:text-base mt-1">
              Power the next generation of French speakers in Nigeria
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">

        {/* Module + Skill Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-lg md:text-xl font-bold text-[#0C1E46] flex items-center gap-3">
              {getModuleIcon()}
              Module
            </Label>
            <Select value={formData.module} onValueChange={(v) => handleInputChange("module", v)}>
              <SelectTrigger className="h-12 md:h-14 text-base md:text-lg border-2 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="listening">Listening</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="speaking">Speaking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-lg md:text-xl font-bold text-[#0C1E46]">
              Skill Focus
            </Label>
            <Input
              placeholder="e.g. Vocabulary, Grammar, Comprehension"
              value={formData.skill_type}
              onChange={(e) => handleInputChange("skill_type", e.target.value)}
              required
              className="h-12 md:h-14 text-base border-2 rounded-xl"
            />
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-3">
          <Label className="text-lg md:text-xl font-bold text-[#0C1E46]">
            Question / Prompt
          </Label>
          <Textarea
            placeholder="Write the full question, passage, or prompt..."
            value={formData.question_text}
            onChange={(e) => handleInputChange("question_text", e.target.value)}
            required
            rows={5}
            className="text-base resize-none border-2 rounded-xl focus:border-[#0C1E46]"
          />
        </div>

        {/* Audio URL — Listening Only */}
        {formData.module === "listening" && (
          <div className="space-y-3">
            <Label className="text-lg md:text-xl font-bold text-[#0C1E46] flex items-center gap-3">
              <Headphones className="w-7 h-7 md:w-8 md:h-8" />
              Audio URL (Optional)
            </Label>
            <Input
              type="url"
              placeholder="https://cdn.example.com/audio/dialogue.mp3"
              value={formData.audio_url}
              onChange={(e) => handleInputChange("audio_url", e.target.value)}
              className="h-12 md:h-14 text-base border-2 rounded-xl"
            />
          </div>
        )}

        {/* MCQ Options — Listening & Reading */}
        {(formData.module === "listening" || formData.module === "reading") && (
          <>
            <div className="space-y-5">
              <Label className="text-lg md:text-xl font-bold text-[#0C1E46]">
                Answer Options
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {(["A", "B", "C", "D"] as const).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-base md:text-lg font-semibold text-[#0C1E46] flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#B0CCFE] text-[#0C1E46] rounded-full flex items-center justify-center font-bold text-sm md:text-base">
                        {key}
                      </div>
                      Option {key}
                    </Label>
                    <Input
                      value={formData.options[key]}
                      onChange={(e) => handleOptionChange(key, e.target.value)}
                      placeholder={`Option ${key}...`}
                      className="h-12 text-base border-2 rounded-xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-lg md:text-xl font-bold text-[#0C1E46]">
                Correct Answer
              </Label>
              <Select value={formData.correct_answer} onValueChange={(v) => handleInputChange("correct_answer", v)}>
                <SelectTrigger className="h-12 md:h-14 text-base md:text-lg border-2 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((opt) => (
                    <SelectItem key={opt} value={opt}>Option {opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Explanation */}
        <div className="space-y-3">
          <Label className="text-lg md:text-xl font-bold text-[#0C1E46]">
            Explanation (Optional)
          </Label>
          <Textarea
            placeholder="Why is this the correct answer? Help students learn!"
            value={formData.explanation}
            onChange={(e) => handleInputChange("explanation", e.target.value)}
            rows={4}
            className="text-base resize-none border-2 rounded-xl focus:border-[#0C1E46]"
          />
        </div>

        {/* Difficulty Level */}
        <div className="space-y-3">
          <Label className="text-lg md:text-xl font-bold text-[#0C1E46]">
            Difficulty Level
          </Label>
          <Select value={formData.difficulty_level} onValueChange={(v) => handleInputChange("difficulty_level", v)}>
            <SelectTrigger className="h-12 md:h-14 text-base md:text-lg border-2 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="p-5 bg-red-50 border-2 border-red-300 rounded-xl text-red-700 font-bold text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="p-5 bg-green-50 border-2 border-green-300 rounded-xl text-green-700 font-bold text-center flex items-center justify-center gap-3">
            <CheckCircle className="w-8 h-8" />
            Question uploaded successfully! Ready for the next one
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-14 text-lg md:text-xl font-bold bg-[#ED4137] hover:bg-red-600 text-white rounded-xl shadow-lg transition-all"
        >
          {loading ? "Uploading Question..." : "Upload Question Now"}
        </Button>
      </form>

      {/* Motivation Footer */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-10 px-8 rounded-2xl shadow-2xl">
          <p className="text-2xl md:text-4xl font-bold">
            Every question you upload
          </p>
          <p className="text-2xl md:text-4xl font-bold mt-3 text-[#B0CCFE]">
            Changes a life in Nigeria
          </p>
          <p className="text-lg md:text-xl mt-6 opacity-90">
            <span className="font-bold text-yellow-300">10,000+</span> students thank you
          </p>
        </div>
      </div>
    </div>
  );
}