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
import { FileQuestion, Plus, CheckCircle, Sparkles } from "lucide-react";

interface QuestionManagerProps {
  exams: any[];
}

export default function QuestionManager({ exams }: QuestionManagerProps) {
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [sections, setSections] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

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
      });

      if (error) throw error;

      setJustCreated(true);
      setTimeout(() => setJustCreated(false), 2500);

      setQuestionText("");
      setQuestionType("");
      setIsCreating(false);
    } catch (error) {
      console.error("[SFF] Failed to create question:", error);
      alert("Failed to save question");
    }
  };

  return (
    <div className="space-y-8 font-Coolvetica">

      {/* HERO HEADER */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0C1E46] flex items-center gap-3">
              <FileQuestion className="w-8 h-8 md:w-10 md:h-10 text-[#ED4137]" />
              Question Manager
            </h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Add powerful questions that help students master TEF/TCF
            </p>
          </div>
        </div>
      </div>

      {/* EXAM & SECTION SELECTOR — Mobile Stacked */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Select Exam */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-5">
          <Label className="text-base md:text-lg font-bold text-[#0C1E46] mb-3 block">
            1. Choose Exam
          </Label>
          <Select value={selectedExam} onValueChange={handleExamSelect}>
            <SelectTrigger className="h-12 md:h-14 text-base border-2 rounded-xl">
              <SelectValue placeholder="Select an exam..." />
            </SelectTrigger>
            <SelectContent>
              {exams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  <div className="py-1">
                    <p className="font-medium">{exam.title}</p>
                    {exam.description && (
                      <p className="text-xs text-gray-500 mt-1">{exam.description}</p>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Select Section — Only show when exam is selected */}
        {selectedExam && sections.length > 0 && (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-5">
            <Label className="text-base md:text-lg font-bold text-[#0C1E46] mb-3 block">
              2. Choose Section
            </Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="h-12 md:h-14 text-base border-2 rounded-xl">
                <SelectValue placeholder="Select a section..." />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    <div className="py-1">
                      <p className="font-medium">{section.title}</p>
                      {section.instructions && (
                        <p className="text-xs text-gray-500 mt-1">{section.instructions}</p>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* ADD QUESTION BUTTON — Only when section selected */}
      {selectedSection && (
        <div className="flex justify-center">
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 text-lg font-bold bg-[#ED4137] hover:bg-red-600 shadow-lg rounded-xl flex items-center gap-3">
                <Plus className="w-6 h-6" />
                Add New Question
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md md:max-w-3xl font-Coolvetica">
              <DialogHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white -m-6 p-6 md:p-8 rounded-t-2xl">
                <DialogTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                  <Sparkles className="w-8 h-8" />
                  Create New Question
                </DialogTitle>
                <DialogDescription className="text-blue-100 text-base md:text-lg mt-2">
                  Craft a question that challenges and teaches
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <Label className="text-base md:text-lg font-semibold text-[#0C1E46]">
                    Question Text
                  </Label>
                  <Textarea
                    placeholder="e.g. Écoutez l'enregistrement et répondez..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={5}
                    className="text-base resize-none border-2 rounded-xl focus:border-[#0C1E46]"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base md:text-lg font-semibold text-[#0C1E46]">
                    Question Type
                  </Label>
                  <Select value={questionType} onValueChange={setQuestionType}>
                    <SelectTrigger className="h-12 md:h-14 text-base border-2 rounded-xl">
                      <SelectValue placeholder="Choose format..." />
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
                  <div className="flex items-center gap-3 bg-green-50 text-green-700 px-5 py-3 rounded-xl border border-green-200">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-bold">Question saved successfully!</span>
                  </div>
                )}

                <Button
                  onClick={handleCreateQuestion}
                  className="w-full h-14 text-lg font-bold bg-[#ED4137] hover:bg-red-600 rounded-xl shadow-lg"
                >
                  Save Question
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* EMPTY STATE — When no exam selected */}
      {!selectedExam && (
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-xl md:text-2xl font-bold text-gray-600">
            Select an exam to start adding questions
          </p>
          <p className="text-gray-500 mt-3 text-sm md:text-base">
            Every great question helps a student pass TEF/TCF
          </p>
        </div>
      )}

      {/* MOTIVATION BLOCK */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-12 px-8 rounded-2xl shadow-2xl">
          <p className="text-2xl md:text-4xl font-bold">
            Every question you write
          </p>
          <p className="text-2xl md:text-4xl font-bold mt-4 text-[#B0CCFE]">
            Changes a Nigerian student’s future
          </p>
          <p className="text-lg md:text-xl mt-6 opacity-90">
            Over <span className="font-bold text-yellow-300">10,000+</span> learners are counting on you
          </p>
        </div>
      </div>
    </div>
  );
}