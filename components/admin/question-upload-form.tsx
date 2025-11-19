"use client";

import type React from "react";
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

  const handleOptionChange = (key: string, value: string) => {
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

      // Reset form
      setFormData({
        module: formData.module,
        skill_type: "",
        question_text: "",
        audio_url: "",
        options: { A: "", B: "", C: "", D: "" },
        correct_answer: "A",
        explanation: "",
        difficulty_level: "intermediate",
      });
    } catch (err: any) {
      setError(err.message || "Failed to upload question");
    } finally {
      setLoading(false);
    }
  };

  const getModuleIcon = () => {
    switch (formData.module) {
      case "listening":
        return <Headphones className="w-7 h-7" />;
      case "reading":
        return <FileText className="w-7 h-7" />;
      case "writing":
        return <PenTool className="w-7 h-7" />;
      case "speaking":
        return <Mic className="w-7 h-7" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto font-Coolvetica">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-8 py-6 rounded-3xl shadow-2xl">
          <Upload className="w-12 h-12" />
          <div>
            <h2 className="text-4xl md:text-5xl font-bold">Upload New Question</h2>
            <p className="text-blue-100 text-lg mt-2">
              Every question helps a Nigerian student speak French confidently
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12">

        {/* Module & Skill Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Label className="text-xl font-bold text-[#0C1E46] flex items-center gap-3">
              {getModuleIcon()}
              Module
            </Label>
            <Select value={formData.module} onValueChange={(v) => handleInputChange("module", v)}>
              <SelectTrigger className="h-16 text-lg border-2 border-gray-300 focus:border-[#0C1E46]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="listening" className="text-lg">Listening</SelectItem>
                <SelectItem value="reading" className="text-lg">Reading</SelectItem>
                <SelectItem value="writing" className="text-lg">Writing</SelectItem>
                <SelectItem value="speaking" className="text-lg">Speaking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-xl font-bold text-[#0C1E46]">Skill Focus</Label>
            <Input
              placeholder="e.g., Comprehension, Grammar, Vocabulary,"
              value={formData.skill_type}
              onChange={(e) => handleInputChange("skill_type", e.target.value)}
              required
              className="h-16 text-lg border-2 border-gray-300 focus:border-[#0C1E46]"
            />
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-4">
          <Label className="text-xl font-bold text-[#0C1E46]">Question / Prompt</Label>
          <Textarea
            placeholder="Write the full question or listening/reading passage here..."
            value={formData.question_text}
            onChange={(e) => handleInputChange("question_text", e.target.value)}
            required
            rows={6}
            className="text-lg resize-none border-2 border-gray-300 focus:border-[#0C1E46]"
          />
        </div>

        {/* Audio URL (Listening only) */}
        {formData.module === "listening" && (
          <div className="space-y-4">
            <Label className="text-xl font-bold text-[#0C1E46] flex items-center gap-3">
              <Headphones className="w-7 h-7" />
              Audio URL
            </Label>
            <Input
              type="url"
              placeholder="https://your-cdn.com/audio/french-dialogue.mp3"
              value={formData.audio_url}
              onChange={(e) => handleInputChange("audio_url", e.target.value)}
              className="h-16 text-lg border-2 border-gray-300 focus:border-[#0C1E46]"
            />
          </div>
        )}

        {/* MCQ Options */}
        {(formData.module === "listening" || formData.module === "reading") && (
          <>
            <div className="space-y-6">
              <Label className="text-xl font-bold text-[#0C1E46]">Answer Options</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(formData.options).map(([key, value]) => (
                  <div key={key} className="space-y-3">
                    <Label className="text-lg font-semibold text-[#0C1E46] flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#B0CCFE] text-[#0C1E46] rounded-full flex items-center justify-center font-bold">
                        {key}
                      </div>
                      Option {key}
                    </Label>
                    <Input
                      value={value as string}
                      onChange={(e) => handleOptionChange(key, e.target.value)}
                      placeholder={`Enter option ${key}...`}
                      className="h-14 text-lg border-2 border-gray-300 focus:border-[#0C1E46]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xl font-bold text-[#0C1E46]">Correct Answer</Label>
              <Select value={formData.correct_answer} onValueChange={(v) => handleInputChange("correct_answer", v)}>
                <SelectTrigger className="h-16 text-xl border-2 border-gray-300 focus:border-[#0C1E46]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((opt) => (
                    <SelectItem key={opt} value={opt} className="text-lg">
                      Option {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Explanation */}
        <div className="space-y-4">
          <Label className="text-xl font-bold text-[#0C1E46]">Explanation (Optional)</Label>
          <Textarea
            placeholder="Explain why this answer is correct (great for student learning!)"
            value={formData.explanation}
            onChange={(e) => handleInputChange("explanation", e.target.value)}
            rows={5}
            className="text-lg resize-none border-2 border-gray-300 focus:border-[#0C1E46]"
          />
        </div>

        {/* Difficulty */}
        <div className="space-y-4">
          <Label className="text-xl font-bold text-[#0C1E46]">Difficulty Level</Label>
          <Select value={formData.difficulty_level} onValueChange={(v) => handleInputChange("difficulty_level", v)}>
            <SelectTrigger className="h-16 text-lg border-2 border-gray-300 focus:border-[#0C1E46]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Feedback */}
        {error && (
          <div className="p-6 bg-red-50 border-2 border-red-300 rounded-2xl text-red-700 text-lg font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="p-6 bg-green-50 border-2 border-green-300 rounded-2xl text-green-700 flex items-center gap-4 text-lg font-bold">
            <CheckCircle className="w-10 h-10" />
            Question uploaded successfully! Ready for the next one
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-20 text-2xl md:text-3xl font-bold bg-[#ED4137] hover:bg-red-600 text-white shadow-2xl transition-all"
        >
          {loading ? "Uploading Question..." : "Upload Question Now"}
        </Button>
      </form>

      {/* Motivation */}
      <div className="text-center mt-16 bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white py-12 px-8 rounded-3xl shadow-2xl">
        <p className="text-3xl md:text-4xl font-bold">
          Every question you upload
        </p>
        <p className="text-3xl md:text-4xl font-bold text-[#ED4137] mt-4">
          Changes a life in Nigeria
        </p>
        <p className="text-xl text-blue-100 mt-8">
          <span className="font-bold text-[#B0CCFE]">10,000+</span> students thank you
        </p>
      </div>
    </div>
  );
}