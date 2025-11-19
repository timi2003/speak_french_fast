"use client";

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
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Trash2, Plus, CheckCircle, Flame } from "lucide-react";

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
        .from("daily Ctasks")
        .select("*")
        .order("day_number");

      setTasks(data || []);
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
    <div className="space-y-8 font-Coolvetica">

      {/* CREATE NEW TASK — Mobile-First */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 p-5 md:p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-[#ED4137]/10 rounded-xl">
            <CalendarCheck className="w-7 h-7 md:w-8 md:h-8 text-[#ED4137]" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[#0C1E46]">
            Create Daily Task
          </h3>
        </div>

        <form onSubmit={handleCreateTask} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Day Number */}
            <div className="space-y-2">
              <Label className="text-sm md:text-base font-semibold text-[#0C1E46]">
                Day Number
              </Label>
              <Input
                type="number"
                min="1"
                max="30"
                value={formData.day_number}
                onChange={(e) =>
                  setFormData({ ...formData, day_number: Number(e.target.value) })
                }
                required
                className="h-12 text-[#0C1E46] border-2 focus:border-[#0C1E46] rounded-xl"
                placeholder="e.g. 5"
              />
            </div>

            {/* Task Type */}
            <div className="space-y-2">
              <Label className="text-sm md:text-base font-semibold text-[#0C1E46]">
                Task Type
              </Label>
              <Select
                value={formData.task_type}
                onValueChange={(value) => setFormData({ ...formData, task_type: value })}
              >
                <SelectTrigger className="h-12 text-[#0C1E46] border-2 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-[#0C1E46]">
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
            <Label className="text-sm md:text-base font-semibold text-[#0C1E46]">
              Instructions / Prompt
            </Label>
            <Textarea
              placeholder="e.g. Record yourself describing your daily routine in French..."
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              required
              className="min-h-28 md:min-h-32 text-[#0C1E46] resize-none border-2 focus:border-[#0C1E46] rounded-xl"
            />
          </div>

          {/* Success Message */}
          {justCreated && (
            <div className="flex items-center gap-3 bg-green-50 text-green-700 px-5 py-3 rounded-xl border border-green-200">
              <CheckCircle className="w-6 h-6" />
              <span className="font-bold">Task created successfully!</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={creating}
            className="w-full h-14 text-lg font-bold bg-[#ED4137] hover:bg-red-600 text-white rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-6 h-6 mr-2" />
            {creating ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </div>

      {/* CURRENT TASKS LIST — Responsive Table */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] px-6 py-5 md:px-8 md:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                <Flame className="w-7 h-7 md:w-8 md:h-8" />
                Current Daily Tasks
              </h3>
              <p className="text-blue-100 text-sm md:text-base mt-1">
                {tasks.length} active tasks
              </p>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-[#B0CCFE]">
              {tasks.length}/30
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">No tasks yet</div>
            <p className="text-gray-500">Create your first daily task above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#B0CCFE]/20">
                  <TableHead className="text-[#0C1E46] font-bold text-sm md:text-base">Day</TableHead>
                  <TableHead className="text-[#0C1E46] font-bold text-sm md:text-base">Type</TableHead>
                  <TableHead className="text-[#0C1E46] font-bold text-sm md:text-base">Instructions</TableHead>
                  <TableHead className="text-right text-sm md:text-[#0C1E46]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-[#B0CCFE]/5 transition">
                    <TableCell className="font-bold text-[#0C1E46] text-lg">
                      Day {task.day_number}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize font-bold ${
                          task.task_type === "speaking"
                            ? "bg-red-100 text-red-700"
                            : task.task_type === "listening"
                            ? "bg-blue-100 text-blue-700"
                            : task.task_type === "reading"
                            ? "bg-green-100 text-green-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {task.task_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm md:text-base max-w-xs md:max-w-md">
                      {task.instructions}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="h-9 px-3 text-sm bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
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