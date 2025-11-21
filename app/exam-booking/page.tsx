"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Slot {
  id: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked_count: number;
  examiner_id: string;
  examiner_name?: string;
  available: boolean;
}

export default function ExamBookingPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push("/auth/login");
        return;
      }
      setUser(authUser);

      try {
        const [{ data: examsData }, { data: bookingsData }] = await Promise.all([
          supabase
            .from("exams")
            .select("*")
            .eq("exam_type", "end_of_cycle")
            .order("created_at", { ascending: false }),
          supabase.from("exam_bookings").select("*").eq("student_id", authUser.id),
        ]);

        setExams(examsData || []);
        setBookings(bookingsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [router]);

  const loadSlots = async (examId: string) => {
    setSelectedExam(examId);
    setSelectedSlot(null);

    const supabase = createClient();
    try {
      const { data } = await supabase
        .from("exam_slot_availability")
        .select(`
          id,
          start_time,
          end_time,
          capacity,
          booked_count,
          examiner_id,
          profiles:first_name,
          profiles:last_name
        `)
        .gt("capacity", -1)
        .order("start_time");

      if (data) {
        const slots = data.map((s: any) => ({
          ...s,
          examiner_name:
            `${s.profiles?.first_name || ""} ${s.profiles?.last_name || ""}`.trim() ||
            "TBD",
          available: s.booked_count < s.capacity,
        }));
        setAvailableSlots(slots);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const bookSlot = async (slotId: string) => {
    if (!selectedExam || !user) return;

    setBookingInProgress(true);
    const supabase = createClient();

    try {
      // 1. Create the booking
      const { data: newBooking, error: bookingError } = await supabase
        .from("exam_bookings")
        .insert({
          student_id: user.id,
          exam_id: selectedExam,
          slot_id: slotId,
          status: "confirmed",
          confirmed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 2. Atomically increment booked_count
      const { error: incError } = await supabase
        .from("exam_slot_availability")
        .increment("booked_count", 1) // ← Fixed: modern Supabase v2 syntax
        .eq("id", slotId);

      if (incError) throw incError;

      alert("Exam booked successfully! Check your email for details.");
      setBookings([...bookings, newBooking]);
      setSelectedSlot(null);
      setAvailableSlots([]);
      setSelectedExam(null);
    } catch (err: any) {
      console.error("Booking error:", err);
      alert("Failed to book the slot. It might have just been taken. Please try again.");
    } finally {
      setBookingInProgress(false);
    }
  };

  const cancelBooking = async (bookingId: string, slotId: string) => {
    setBookingInProgress(true);
    const supabase = createClient();

    try {
      // Update booking status + decrement count in parallel
      const [updateBookingRes, decrementRes] = await Promise.all([
        supabase
          .from("exam_bookings")
          .update({ status: "cancelled" })
          .eq("id", bookingId),
        supabase
          .from("exam_slot_availability")
          .decrement("booked_count", 1) // ← Fixed: modern Supabase v2 syntax
          .eq("id", slotId),
      ]);

      if (updateBookingRes.error) throw updateBookingRes.error;
      if (decrementRes.error) throw decrementRes.error;

      setBookings(bookings.filter((b) => b.id !== bookingId));
      alert("Booking cancelled successfully.");
    } catch (err: any) {
      console.error("Cancel error:", err);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-xl font-Coolvetica text-[#0C1E46]">
          Loading your exam schedule...
        </p>
      </div>
    );
  }

  const activeBooking = bookings.find((b) => b.status === "confirmed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-Coolvetica px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* HERO */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white px-8 py-8 rounded-2xl shadow-xl">
            <Calendar className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4" />
            <h1 className="text-3xl md:text-5xl font-bold">Book Your Final Exam</h1>
            <p className="text-blue-100 text-base md:text-xl mt-3">
              Your gateway to France starts here
            </p>
          </div>
        </div>

        {/* ACTIVE BOOKING CARD */}
        {activeBooking && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg">
            <CardContent className="pt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-800">Exam Confirmed!</p>
                    <p className="text-lg text-green-700 mt-1">
                      {new Date(
                        availableSlots.find((s) => s.id === activeBooking.slot_id)?.start_time || ""
                      ).toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => cancelBooking(activeBooking.id, activeBooking.slot_id)}
                  disabled={bookingInProgress}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* EXAM SELECTION */}
        {!selectedExam && exams.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0C1E46] mb-6 text-center">
              Choose Your End-of-Cycle Exam
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {exams.map((exam) => (
                <Card
                  key={exam.id}
                  className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-[#ED4137]"
                  onClick={() => loadSlots(exam.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-xl text-[#0C1E46]">{exam.title}</CardTitle>
                    <CardDescription>{exam.description || "Final assessment exam"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-[#ED4137] hover:bg-red-600 h-12 text-lg font-bold">
                      Select This Exam
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SLOT SELECTION */}
        {selectedExam && availableSlots.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0C1E46]">
                Available Slots
              </h2>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedExam(null);
                  setSelectedSlot(null);
                  setAvailableSlots([]);
                }}
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableSlots
                .filter((s) => s.available)
                .map((slot) => (
                  <Card
                    key={slot.id}
                    className={`cursor-pointer transition-all ${
                      selectedSlot === slot.id
                        ? "ring-4 ring-[#ED4137] ring-offset-2 bg-red-50"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => setSelectedSlot(slot.id)}
                  >
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-[#ED4137]" />
                        <div>
                          <p className="font-bold text-lg">
                            {new Date(slot.start_time).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(slot.start_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(slot.end_time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm space-y-1">
                        <p className="text-gray-700">
                          Examiner: <span className="font-medium">{slot.examiner_name}</span>
                        </p>
                        <p className="text-gray-600">
                          {slot.capacity - slot.booked_count} of {slot.capacity} spots left
                        </p>
                      </div>

                      <Button
                        className={`w-full h-12 text-lg font-bold ${
                          selectedSlot === slot.id
                            ? "bg-[#ED4137] hover:bg-red-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          bookSlot(slot.id);
                        }}
                        disabled={bookingInProgress}
                      >
                        {selectedSlot === slot.id ? "Confirm Booking" : "Select This Slot"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* ALL SLOTS FULL */}
        {selectedExam && availableSlots.length > 0 && availableSlots.every((s) => !s.available) && (
          <Card className="bg-amber-50 border-2 border-amber-300">
            <CardContent className="pt-8 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-amber-600" />
              <p className="text-xl font-bold text-amber-900">All slots are fully booked</p>
              <p className="text-amber-800 mt-2">New slots open every week — check back soon!</p>
            </CardContent>
          </Card>
        )}

        {/* NO EXAMS */}
        {exams.length === 0 && !selectedExam && (
          <Card className="bg-gray-50 border-2 border-gray-300">
            <CardContent className="pt-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-bold text-gray-600">No exams available yet</p>
              <p className="text-gray-500 mt-2">End-of-cycle exams will be announced soon</p>
            </CardContent>
          </Card>
        )}

        {/* MOTIVATIONAL CLOSE */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-12 px-8 rounded-2xl shadow-2xl">
            <p className="text-3xl md:text-5xl font-bold">One exam. One step.</p>
            <p className="text-3xl md:text-5xl font-bold mt-4 text-[#B0CCFE]">
              From Nigeria to France
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}