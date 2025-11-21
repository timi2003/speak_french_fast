"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from "lucide-react";

interface ExamSlot {
  id: string;
  exam_date: string;
  exam_time: string;
  total_slots: number;
  booked_count: number;
  module_type: string;
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ExamBooking() {
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const { data, error } = await supabase
        .from("exam_slot_availability")
        .select("*")
        .gt("total_slots", 0)
        .order("exam_date", { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error("Error fetching exam slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const bookSlot = async (slotId: string) => {
    setBookingSlotId(slotId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please log in to book an exam");

      const { data: existing } = await supabase
        .from("exam_bookings")
        .select("id")
        .eq("user_id", user.id)
        .eq("slot_id", slotId)
        .maybeSingle();

      if (existing) {
        alert("You've already booked this slot!");
        return;
      }

      const { error: bookError } = await supabase
        .from("exam_bookings")
        .insert({ user_id: user.id, slot_id: slotId, booking_status: "confirmed" });

      if (bookError) throw bookError;

      const { error: updateError } = await supabase
        .rpc("increment_booked_count", { slot_id: slotId });

      if (updateError) throw updateError;

      alert("Exam booked successfully! Check your email for confirmation.");
      fetchSlots();
    } catch (error: any) {
      alert(error.message || "Failed to book. Please try again.");
    } finally {
      setBookingSlotId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#B0CCFE]/10 to-indigo-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-[#0C1E46]">Loading available slots...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#B0CCFE]/10 to-indigo-50">
      {/* Subtle Pattern */}
      <div className="fixed inset-0 bg-[url('/pattern.png')] opacity-5 -z-10" />
      <div className="fixed inset-0 bg-gradient-to-tr from-[#0C1E46]/5 to-[#ED4137]/5 -z-10" />

      <div className="container mx-auto px-4 py-12 md:py-20 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#0C1E46] mb-4">
            Book Your <span className="text-[#ED4137]">French Exam</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Choose your preferred date and time. Your journey from <strong>Naija to Paris</strong> begins here.
          </p>
        </div>

        {slots.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-16 text-center border border-white/50">
            <AlertCircle className="w-20 h-20 text-orange-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#0C1E46] mb-4">No Slots Available Yet</h2>
            <p className="text-lg text-gray-600">New exam dates are added regularly. Please check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {slots.map((slot) => {
              const available = slot.total_slots - slot.booked_count;
              const percentage = (slot.booked_count / slot.total_slots) * 100;
              const isFull = available <= 0;

              return (
                <div
                  key={slot.id}
                  className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden hover:shadow-3xl transition-all duration-300"
                >
                  {/* Module Header */}
                  <div className={`px-8 py-6 text-white text-center ${
                    slot.module_type === "writing" ? "bg-gradient-to-r from-[#ED4137] to-red-700" :
                    "bg-gradient-to-r from-[#0C1E46] to-[#0a1838]"
                  }`}>
                    <h3 className="text-2xl font-bold capitalize">{slot.module_type} Exam</h3>
                  </div>

                  <div className="p-8 space-y-6">
                    {/* Date & Time */}
                    <div className="space-y-4 text-center">
                      <div className="flex items-center justify-center gap-3 text-[#0C1E46]">
                        <Calendar className="w-6 h-6" />
                        <span className="text-xl font-semibold">
                          {new Date(slot.exam_date).toLocaleDateString("en-GB", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-[#0C1E46]">
                        <Clock className="w-6 h-6" />
                        <span className="text-xl font-semibold">{slot.exam_time}</span>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 flex items-center gap-2">
                          <Users className="w-5 h-5" /> Available Slots
                        </span>
                        <span className={`text-2xl font-bold ${isFull ? "text-red-600" : "text-green-600"}`}>
                          {available}
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ${
                            percentage > 80 ? "bg-red-500" : percentage > 50 ? "bg-orange-500" : "bg-green-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {slot.booked_count} of {slot.total_slots} booked
                      </p>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => bookSlot(slot.id)}
                      disabled={isFull || bookingSlotId === slot.id}
                      className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                        isFull
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : bookingSlotId === slot.id
                            ? "bg-orange-500 text-white"
                            : "bg-[#ED4137] hover:bg-red-600 text-white shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {bookingSlotId === slot.id ? (
                        <>Booking...</>
                      ) : isFull ? (
                        <>Fully Booked</>
                      ) : (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          Book This Slot
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="text-center mt-20 pb-10">
        <p className="text-gray-600 text-lg">
          Need help? Contact us at <strong>support@speakfrenchfast.academy</strong>
        </p>
      </div>
    </div>
  );
}