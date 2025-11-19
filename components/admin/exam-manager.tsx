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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CheckCircle, Sparkles, Edit2, FileText } from "lucide-react";

interface ExamManagerProps {
  exams: any[];
}

export default function ExamManager({ exams: initialExams }: ExamManagerProps) {
  const [exams, setExams] = useState(initialExams);
  const [isCreating, setIsCreating] = useState(false);
  const [justCreated, setJustCreated] = useState(false);
  const [newExam, setNewExam] = useState({
    title: "",
    description: "",
    exam_type: "daily",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateExam = async () => {
    if (!newExam.title.trim()) {
      alert("Please enter an exam title");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: exam, error } = await supabase
        .from("exams")
        .insert(newExam)
        .select()
        .single();

      if (error) throw error;

      setExams([exam, ...exams]);
      setNewExam({ title: "", description: "", exam_type: "daily" });
      setJustCreated(true);
      setTimeout(() => setJustCreated(false), 2500);
      setIsCreating(false);
    } catch (error) {
      console.error("[SFF] Failed to create exam:", error);
      alert("Failed to create exam");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm("Delete this exam and all its questions permanently?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("exams").delete().eq("id", examId);
      if (error) throw error;

      setExams(exams.filter((e) => e.id !== examId));
    } catch (error) {
      console.error("[SFF] Failed to delete exam:", error);
      alert("Failed to delete exam");
    }
  };

  return (
    <div className="space-y-8 font-Coolvetica">

      {/* HEADER + CREATE BUTTON */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0C1E46] flex items-center gap-3">
              <FileText className="w-8 h-8 md:w-10 md:h-10 text-[#ED4137]" />
              Manage Exams
            </h2>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Create practice exams that power fluency across Nigeria
            </p>
          </div>

          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold bg-[#ED4137] hover:bg-red-600 shadow-lg rounded-xl">
                <Plus className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                New Exam
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md md:max-w-2xl font-Coolvetica">
              <DialogHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white -m-6 p-6 md:p-8 rounded-t-2xl">
                <DialogTitle className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                  <Sparkles className="w-8 h-8" />
                  Create New Exam
                </DialogTitle>
                <DialogDescription className="text-blue-100 text-base md:text-lg mt-2">
                  Build a powerful practice exam for your students
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 md:mt-8 space-y-5">
                <div className="space-y-2">
                  <Label className="text-base md:text-lg font-semibold text-[#0C1E46]">
                    Exam Title
                  </Label>
                  <Input
                    placeholder="e.g. TEF Listening – Week 5"
                    value={newExam.title}
                    onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                    className="h-12 md:h-14 text-base border-2 rounded-xl focus:border-[#0C1E46]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base md:text-lg font-semibold text-[#0C1E46]">
                    Description (Optional)
                  </Label>
                  <Textarea
                    placeholder="What will students gain from this exam?"
                    value={newExam.description}
                    onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                    rows={3}
                    className="text-base resize-none border-2 rounded-xl focus:border-[#0C1E46]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base md:text-lg font-semibold text-[#0C1E46]">
                    Exam Type
                  </Label>
                  <Select
                    value={newExam.exam_type}
                    onValueChange={(val) => setNewExam({ ...newExam, exam_type: val })}
                  >
                    <SelectTrigger className="h-12 md:h-14 text-base border-2 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily Practice</SelectItem>
                      <SelectItem value="end_of_cycle">End of Cycle Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {justCreated && (
                  <div className="flex items-center gap-3 bg-green-50 text-green-700 px-5 py-3 rounded-xl border border-green-200">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-bold">Exam created successfully!</span>
                  </div>
                )}

                <Button
                  onClick={handleCreateExam}
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-bold bg-[#ED4137] hover:bg-red-600 rounded-xl shadow-lg"
                >
                  {isLoading ? "Creating..." : "Create Exam"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* EXAM LIST — Mobile Cards */}
      <div className="space-y-5">
        {exams.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-xl font-bold text-gray-600">No exams yet</p>
            <p className="text-gray-500 mt-2">Click "New Exam" to create your first one</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 p-5 md:p-6 hover:border-[#B0CCFE] transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between gap-5">
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-[#0C1E46]">
                    {exam.title}
                  </h3>
                  {exam.description && (
                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                      {exam.description}
                    </p>
                  )}
                  <div className="mt-4">
                    <Badge
                      className={`font-bold text-sm md:text-base ${
                        exam.exam_type === "daily"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {exam.exam_type === "daily" ? "Daily Practice" : "End of Cycle"}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 px-4 border-[#0C1E46] text-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold rounded-xl"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteExam(exam.id)}
                    className="h-11 px-4 bg-red-600 hover:bg-red-700 font-bold rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MOTIVATION */}
      {exams.length > 0 && (
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-10 px-8 rounded-2xl shadow-2xl">
            <p className="text-2xl md:text-4xl font-bold">
              {exams.length} exams created
            </p>
            <p className="text-2xl md:text-4xl font-bold mt-3 text-[#B0CCFE]">
              {exams.length * 250}+ students impacted
            </p>
            <p className="text-lg md:text-xl mt-6 opacity-90">
              Every exam = one step closer to France
            </p>
          </div>
        </div>
      )}
    </div>
  );
}