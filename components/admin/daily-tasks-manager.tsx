"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarCheck, Trash2, Plus, CheckCircle } from "lucide-react";

export default function DailyTasksManager() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

  const [formData, setFormData] = useState({
    day_number: 1,
    task_type: "listening",
    instructions: "",
    question_id: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("daily_tasks")
        .select("*")
        .order("day_number");

      setTasks(data || []);
      // Auto-set next day number
      const nextDay = Math.max(...(data || []).map((t: any) => t.day_number), 0) + 1;
      setFormData((prev) => ({ ...prev, day_number: nextDay }));
    } catch (error) {
      console.error("[SFF] Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("daily_tasks").insert({
        day_number: formData.day_number,
        task_type: formData.task_type,
        instructions: formData.instructions,
        question_id: formData.question_id || null,
      });

      if (error) throw error;

      setJustCreated(true);
      setTimeout(() => setJustCreated(false), 2000);

      setFormData((prev) => ({
        ...prev,
        instructions: "",
        question_id: "",
        day_number: prev.day_number + 1,
      }));

      fetchTasks();
    } catch (error) {
      console.error("[SFF] Error creating task:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Delete this task permanently?")) return;

    try {
      const supabase = createClient();
      await supabase.from("daily_tasks").delete().eq("id", taskId);
      fetchTasks();
    } catch (error) {
      console.error("[SFF] Error deleting task:", error);
    }
  };

  return (
    <div className="space-y-10 font-Coolvetica">
      {/* ────── CREATE NEW TASK ────── */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <CalendarCheck className="w-9 h-9 text-[#ED4137]" />
          <h3 className="text-2xl md:text-3xl font-bold text-[#0C1E46]">
            Create New Daily Task
          </h3>
        </div>

        <form onSubmit={handleCreateTask} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Day Number */}
            <div className="space-y-2">
              <Label htmlFor="day" className="text-base font-medium text-[#0C1E46]">
                Day Number
              </Label>
              <Input
                id="day"
                type="number"
                min="1"
                max="30"
                value={formData.day_number}
                onChange={(e) =>
                  setFormData({ ...formData, day_number: Number.parseInt(e.target.value) })
                }
                required
                className="h-14 text-lg border-gray-300 focus:border-[#0C1E46]"
              />
            </div>

            {/* Task Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-base font-medium text-[#0C1E46]">
                Task Type
              </Label>
              <Select
                value={formData.task_type}
                onValueChange={(value) => setFormData({ ...formData, task_type: value })}
              >
                <SelectTrigger className="h-14 text-lg border-gray-300">
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
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-base font-medium text-[#0C1E46]">
              Instructions / Speaking Prompt
            </Label>
            <Textarea
              id="instructions"
              placeholder="e.g., Listen to the audio and answer the questions below... OR Record yourself talking about your family for 1 minute."
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              required
              className="min-h-32 text-base resize-none border-gray-300 focus:border-[#0C1E46]"
            />
          </div>

          {/* Success feedback */}
          {justCreated && (
            <div className="flex items-center gap-3 text-green-600 bg-green-50 px-5 py-3 rounded-lg">
              <CheckCircle className="w-6 h-6" />
              <span className="font-medium">Task created successfully!</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={creating}
            className="w-full md:w-auto px-12 h-14 text-xl font-bold bg-[#ED4137] hover:bg-red-600 text-white shadow-lg transition-all"
          >
            <Plus className="w-6 h-6 mr-2" />
            {creating ? "Creating Task..." : "Create Task"}
          </Button>
        </form>
      </div>

      {/* ────── CURRENT TASKS LIST ────── */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] px-8 py-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            Current Daily Tasks ({tasks.length})
          </h3>
          <p className="text-blue-100 mt-1">Students see these every day</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 text-lg">
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-lg">
            No tasks created yet. Create your first one above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#B0CCFE]/20">
                  <TableHead className="text-[#0C1E46] font-bold">Day</TableHead>
                  <TableHead className="text-[#0C1E46] font-bold">Type</TableHead>
                  <TableHead className="text-[#0C1E46] font-bold">Instructions</TableHead>
                  <TableHead className="text-[#0C1E46] font-bold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-[#B0CCFE]/5 transition">
                    <TableCell className="font-bold text-[#0C1E46]">
                      Day {task.day_number}
                    </TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-[#B0CCFE] text-[#0C1E46] text-sm font-bold rounded-full capitalize">
                        {task.task_type}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-md text-gray-700">
                      {task.instructions}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}