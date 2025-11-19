"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, FileQuestion, CheckCircle, Sparkles } from "lucide-react";

interface QuestionManagerProps {
  exams: any[];
}

export default function QuestionManager({ exams }: QuestionManagerProps) {
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [sections, setSections] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

  // Form state for new question
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("");

  const handleExamSelect = async (examId: string) => {
    setSelectedExam(examId);
    setSelectedSection("");
    setSections([]);

    if (!examId) return;

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("exam_sections")
        .select("*")
        .eq("exam_id", examId)
        .order("order_index");

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error("[SFF] Failed to fetch sections:", error);
    }
  };

  const handleCreateQuestion = async () => {
    if (!questionText.trim()) {
      alert("Please enter question text");
      return;
    }
    if (!questionType) {
      alert("Please select a question type");
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.from("questions").insert({
        exam_section_id: selectedSection,
        question_text: questionText,
        question_type: questionType,
        // Add options, correct_answer, etc. later
      });

      if (error) throw error;

      setJustCreated(true);
      setTimeout(() => setJustCreated(false), 2500);

      // Reset form
      setQuestionText("");
      setQuestionType("");
      setIsCreating(false);
    } catch (error) {
      console.error("[SFF] Failed to create question:", error);
      alert("Failed to save question");
    }
  };

  return (
    <div className="space-y-10 font-Coolvetica">
      {/* ────── HEADER CARD ────── */}
      <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-bold flex items-center gap-4">
                <FileQuestion className="w-12 h-12" />
                Question Manager
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg mt-4">
                Add powerful questions that help Nigerian students master TEF/TCF
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* ────── EXAM & SECTION SELECTOR ────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Select Exam */}
        <Card className="bg-white/95 backdrop-blur shadow-xl border border-gray-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-[#0C1E46]">1. Choose Exam</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedExam} onValueChange={handleExamSelect}>
              <SelectTrigger className="h-16 text-lg border-gray-300">
                <SelectValue placeholder="Select an exam to manage..." />
              </SelectTrigger>
              <SelectContent>
                {exams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.id} className="text-base">
                    <span className="font-medium">{exam.title}</span>
                    <p className="text-xs text-gray-500">{exam.description || "No description"}</p>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Select Section */}
        {selectedExam && sections.length > 0 && (
          <Card className="bg-white/95 backdrop-blur shadow-xl border border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-[#0C1E46]">2. Choose Section</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="h-16 text-lg border-gray-300">
                  <SelectValue placeholder="Select a section..." />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id} className="text-base">
                      <span className="font-medium">{section.title}</span>
                      {section.instructions && (
                        <p className="text-xs text-gray-500">{section.instructions}</p>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ────── ADD QUESTION BUTTON ────── */}
      {selectedSection && (
        <div className="flex justify-center">
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="h-20 px-12 text-2xl font-bold bg-[#ED4137] hover:bg-red-600 text-white shadow-2xl transition-all">
                <Plus className="w-10 h-10 mr-4" />
                Add New Question
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-3xl font-Coolvetica">
              <DialogHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white -m-6 p-10 rounded-t-2xl">
                <DialogTitle className="text-3xl md:text-4xl font-bold flex items-center gap-4">
                  <Sparkles className="w-10 h-10" />
                  Create New Question
                </DialogTitle>
                <DialogDescription className="text-blue-100 text-lg mt-4">
                  Craft a question that challenges and teaches
                </DialogDescription>
              </DialogHeader>

              <div className="mt-10 space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="qtext" className="text-xl font-medium text-[#0C1E46]">
                    Question Text
                  </Label>
                  <Textarea
                    id="qtext"
                    placeholder="e.g., Écoutez l'enregistrement et répondez à la question suivante..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={6}
                    className="text-lg resize-none border-gray-300 focus:border-[#0C1E46]"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="qtype" className="text-xl font-medium text-[#0C1E46]">
                    Question Type
                  </Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger className="h-16 text-lg border-gray-300">
                      <SelectValue placeholder="Select question format..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice (MCQ)</SelectItem>
                      <SelectItem value="short_answer">Short Answer</SelectItem>
                      <SelectItem value="essay">Essay / Long Answer</SelectItem>
                      <SelectItem value="true_false">True / False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {justCreated && (
                  <div className="flex items-center gap-4 text-green-600 bg-green-50 px-6 py-4 rounded-xl">
                    <CheckCircle className="w-8 h-8" />
                    <span className="text-xl font-bold">Question saved successfully!</span>
                  </div>
                )}

                <Button
                  onClick={handleCreateQuestion}
                  className="w-full h-16 text-2xl font-bold bg-[#ED4137] hover:bg-red-600 text-white shadow-xl"
                >
                  Save Question
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* ────── EMPTY STATE ────── */}
      {!selectedExam && (
        <div className="text-center py-20 bg-white/80 backdrop-blur rounded-3xl shadow-xl">
          <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
            <FileQuestion className="w-16 h-16 text-gray-400" />
          </div>
          <p className="text-2xl text-gray-600 font-medium">
            Select an exam to start adding questions
          </p>
          <p className="text-gray-500 mt-3">
            Every great question helps a student pass TEF/TCF
          </p>
        </div>
      )}

      {/* ────── MOTIVATION ────── */}
      <div className="mt-20 text-center bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white py-12 px-8 rounded-3xl shadow-2xl">
        <p className="text-3xl md:text-4xl font-bold">
          Every question you write
        </p>
        <p className="text-3xl md:text-4xl font-bold text-[#ED4137] mt-4">
          Changes a Nigerian student’s future
        </p>
        <p className="text-xl text-blue-100 mt-8">
          Over <span className="font-bold text-[#B0CCFE]">10,000+</span> learners are counting on you
        </p>
      </div>
    </div>
  );
}