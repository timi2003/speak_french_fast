"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Flame, CalendarDays, Trash2, Plus } from "lucide-react";

const CYCLES = [1, 2, 3, 4, 5];
const TASK_TYPES = ["listening", "reading", "writing", "speaking"] as const;

export default function CycleTaskManager() {
  const [selectedCycle, setSelectedCycle] = useState(1);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState({
    day_number: 1,
    task_type: "listening" as typeof TASK_TYPES[number],
    instructions: "",
  });

  useEffect(() => {
    fetchTasks();
  }, [selectedCycle]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("daily_tasks")
        .select("*")
        .eq("cycle_number", selectedCycle)
        .order("day_number", { ascending: true });

      setTasks(data || []);
    } catch (error) {
      console.error("Error loading cycle tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.instructions.trim()) return;

    setCreating(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("daily_tasks").insert({
        cycle_number: selectedCycle,
        day_number: formData.day_number,
        task_type: formData.task_type,
        instructions: formData.instructions.trim(),
      });

      if (error) throw error;

      setFormData({
        day_number: formData.day_number >= 30 ? 1 : formData.day_number + 1,
        task_type: formData.task_type,
        instructions: "",
      });

      fetchTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this daily task permanently?")) return;

    try {
      const supabase = createClient();
      await supabase.from("daily_tasks").delete().eq("id", id);
      fetchTasks();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const duplicateCycle = async () => {
    if (selectedCycle >= 5) {
      alert("Maximum 5 cycles allowed");
      return;
    }

    if (tasks.length < 30) {
      if (!confirm("Current cycle is incomplete. Duplicate anyway?")) return;
    }

    try {
      const supabase = createClient();
      const duplicated = tasks.map(t => ({
        cycle_number: selectedCycle + 1,
        day_number: t.day_number,
        task_type: t.task_type,
        instructions: t.instructions,
      }));

      const { error } = await supabase.from("daily_tasks").insert(duplicated);
      if (error) throw error;

      setSelectedCycle(selectedCycle + 1);
      fetchTasks();
    } catch (error) {
      console.error("Duplication failed:", error);
    }
  };

  const progress = tasks.length >= 30 ? 100 : Math.round((tasks.length / 30) * 100);

  return (
    <div className="space-y-10">
      {/* Cycle Selector */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white rounded-t-xl py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Flame className="w-12 h-12 text-[#ED4137]" />
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold">
                  30-Day Transformation Cycles
                </CardTitle>
                <p className="text-lg opacity-90">Build unbreakable French habits</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black">{selectedCycle}</p>
              <p className="text-sm opacity-80">Current Cycle</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <Tabs value={selectedCycle.toString()} onValueChange={(v) => setSelectedCycle(Number(v))}>
            <TabsList className="grid grid-cols-5 w-full h-16 bg-white shadow-md rounded-xl border">
              {CYCLES.map((c) => (
                <TabsTrigger
                  key={c}
                  value={c.toString()}
                  className="text-sm font-bold data-[state=active]:bg-[#0C1E46] data-[state=active]:text-white"
                >
                  Cycle {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-4xl font-bold text-[#0C1E46] mt-2">{tasks.length}/30</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{progress}%</p>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <p className="text-sm text-gray-600">Days Left</p>
              <p className="text-4xl font-bold text-[#ED4137] mt-2">{30 - tasks.length}</p>
            </div>
          </div>

          {selectedCycle < 5 && tasks.length === 30 && (
            <Button
              onClick={duplicateCycle}
              className="w-full mt-8 h-14 text-xl font-bold bg-[#ED4137] hover:bg-red-600 rounded-xl shadow-lg"
            >
              <Copy className="w-6 h-6 mr-3" />
              Duplicate to Cycle {selectedCycle + 1}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Add Task Form */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            <Plus className="w-8 h-8" />
            Add Daily Task
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleCreate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Day Number (1–30)</Label>
                <Input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.day_number}
                  onChange={(e) => setFormData({ ...formData, day_number: +e.target.value })}
                  required
                  className="h-14 text-lg border-2 focus:border-[#0C1E46] rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Task Type</Label>
                <Select value={formData.task_type} onValueChange={(v) => setFormData({ ...formData, task_type: v as any })}>
                  <SelectTrigger className="h-14 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={creating || !formData.instructions.trim()}
                  className="w-full h-14 text-xl font-bold bg-[#ED4137] hover:bg-red-600 rounded-xl shadow-lg"
                >
                  <CalendarDays className="w-6 h-6 mr-3" />
                  {creating ? "Adding..." : "Add Task"}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Instructions / Prompt</Label>
              <Textarea
                placeholder="e.g., Listen to the dialogue and answer the questions / Record yourself describing your daily routine..."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                required
                rows={5}
                className="text-base resize-none border-2 focus:border-[#0C1E46] rounded-xl"
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-2xl font-bold">
            Cycle {selectedCycle} Tasks ({tasks.length}/30)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <CalendarDays className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No tasks yet. Start building this cycle!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">Day</TableHead>
                    <TableHead className="font-bold">Type</TableHead>
                    <TableHead className="font-bold">Instructions</TableHead>
                    <TableHead className="font-bold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-gray-50">
                      <TableCell className="font-bold text-lg">Day {task.day_number}</TableCell>
                      <TableCell className="capitalize font-medium">{task.task_type}</TableCell>
                      <TableCell className="max-w-md truncate">{task.instructions}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(task.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}