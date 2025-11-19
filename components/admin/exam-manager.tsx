"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Plus, Edit2, Trash2, CheckCircle, Sparkles } from "lucide-react";

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
    if (!confirm("Are you sure? This will delete the exam and all its questions.")) return;

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
    <div className="space-y-10 font-Coolvetica">
      {/* ────── HEADER CARD ────── */}
      <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <CardTitle className="text-3xl md:text-4xl font-bold flex items-center gap-4">
                <Sparkles className="w-10 h-10" />
                Manage Exams
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg mt-3">
                Create practice exams that power student progress across Nigeria
              </CardDescription>
            </div>

            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="bg-[#ED4137] hover:bg-red-600 text-white font-bold text-lg h-14 px-8 shadow-xl">
                  <Plus className="w-6 h-6 mr-3" />
                  New Exam
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-2xl font-Coolvetica">
                <DialogHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white -m-6 p-8 rounded-t-2xl">
                  <DialogTitle className="text-3xl font-bold flex items-center gap-3">
                    <Sparkles className="w-8 h-8" />
                    Create New Exam
                  </DialogTitle>
                  <DialogDescription className="text-blue-100 text-lg mt-2">
                    Build a new practice exam for your students
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-lg font-medium text-[#0C1E46]">
                      Exam Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., TEF Listening Practice – Week 3"
                      value={newExam.title}
                      onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                      className="h-14 text-lg border-gray-300 focus:border-[#0C1E46]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-lg font-medium text-[#0C1E46]">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="What will students learn from this exam?"
                      value={newExam.description}
                      onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                      rows={4}
                      className="text-base resize-none border-gray-300 focus:border-[#0C1E46]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-lg font-medium text-[#0C1E46]">
                      Exam Type
                    </Label>
                    <Select
                      value={newExam.exam_type}
                      onValueChange={(val) => setNewExam({ ...newExam, exam_type: val })}
                    >
                      <SelectTrigger className="h-14 text-lg border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Practice</SelectItem>
                        <SelectItem value="end_of_cycle">End of Cycle Test</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {justCreated && (
                    <div className="flex items-center gap-3 text-green-600 bg-green-50 px-5 py-4 rounded-lg">
                      <CheckCircle className="w-7 h-7" />
                      <span className="font-bold text-lg">Exam created successfully!</span>
                    </div>
                  )}

                  <Button
                    onClick={handleCreateExam}
                    disabled={isLoading}
                    className="w-full h-16 text-xl font-bold bg-[#ED4137] hover:bg-red-600 text-white shadow-xl"
                  >
                    {isLoading ? "Creating Exam..." : "Create Exam Now"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* ────── EXAM LIST ────── */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#ED4137] to-red-600 px-8 py-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            Current Exams ({exams.length})
          </h3>
          <p className="text-red-100 mt-1">Students access these in their dashboard</p>
        </div>

        {exams.length === 0 ? (
          <div className="p-16 text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-xl text-gray-600">No exams created yet</p>
            <p className="text-gray-500 mt-2">Click "New Exam" to get started!</p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl border border-gray-200 hover:border-[#B0CCFE] hover:bg-[#B0CCFE]/5 transition-all"
              >
                <div className="flex-1 mb-4 sm:mb-0">
                  <h3 className="text-2xl font-bold text-[#0C1E46]">{exam.title}</h3>
                  <p className="text-gray-700 mt-2">{exam.description || "No description"}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="px-4 py-1.5 bg-[#B0CCFE] text-[#0C1E46] font-bold rounded-full text-sm">
                      {exam.exam_type === "daily" ? "Daily Practice" : "End of Cycle"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[#0C1E46] text-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold"
                  >
                    <Edit2 className="w-5 h-5 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={() => handleDeleteExam(exam.id)}
                    className="bg-red-600 hover:bg-red-700 font-bold"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ────── MOTIVATION ────── */}
      <div className="text-center mt-16 bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white py-10 px-8 rounded-3xl shadow-2xl">
        <p className="text-2xl md:text-3xl font-bold">
          Every exam you create
        </p>
        <p className="text-2xl md:text-3xl font-bold text-[#ED4137] mt-3">
          Helps a Nigerian student get one step closer to France
        </p>
        <p className="text-lg text-blue-100 mt-6">
          <span className="font-bold text-[#B0CCFE]">{exams.length}</span> exams created so far — keep going!
        </p>
      </div>
    </div>
  );
}