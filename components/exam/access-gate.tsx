"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, Lock, Crown, Flame, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AccessGateProps {
  children: React.ReactNode;
  requiredPlan?: "1-month" | "3-month" | "free";
}

export default function AccessGate({ children, requiredPlan = "free" }: AccessGateProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessInfo, setAccessInfo] = useState<any>(null);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const response = await fetch("/api/subscription/check-access", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setAccessInfo(data);

        const planHierarchy = { free: 0, "1-month": 1, "3-month": 2 };
        const userPlanLevel = planHierarchy[data.plan as keyof typeof planHierarchy] || 0;
        const requiredLevel = planHierarchy[requiredPlan];

        setHasAccess(data.hasAccess && userPlanLevel >= requiredLevel);
      }
    } catch (error) {
      console.error("[SFF] Access check error:", error);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center">
        <p className="text-4xl font-Coolvetica text-[#0C1E46] animate-pulse">
          Verifying your French destiny...
        </p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex items-center justify-center p-4 font-Coolvetica">
        <div className="max-w-4xl w-full">

          {/* HERO LOCKED MESSAGE */}
          <Card className="border-0 shadow-4xl overflow-hidden bg-white/95 backdrop-blur-2xl">
            <CardHeader className="bg-gradient-to-r from-[#ED4137] to-red-700 text-white py-20 text-center">
              <Lock className="w-32 h-32 mx-auto mb-8 animate-pulse" />
              <h1 className="text-6xl md:text-8xl font-black tracking-wider">
                ACCESS LOCKED
              </h1>
              <p className="text-3xl md:text-5xl mt-8 opacity-90">
                This French level is reserved for champions
              </p>
            </CardHeader>

            <CardContent className="pt-16 pb-20 px-10 space-y-16">

              {/* CURRENT STATUS */}
              <div className="text-center">
                <div className="inline-block bg-gradient-to-r from-gray-600 to-gray-800 text-white px-12 py-8 rounded-3xl shadow-2xl">
                  <p className="text-3xl font-bold">Your Current Plan</p>
                  <p className="text-6xl md:text-7xl font-black mt-4">
                    {accessInfo?.plan?.toUpperCase() || "FREE"}
                  </p>
                  {accessInfo?.daysLeft > 0 && (
                    <p className="text-2xl mt-6 opacity-90">
                      Expires in <span className="text-yellow-400 font-black">{accessInfo.daysLeft}</span> days
                    </p>
                  )}
                </div>
              </div>

              {/* REQUIRED PLAN */}
              <div className="bg-gradient-to-r from-[#0C1E46] to-[#0a1838] text-white p-12 rounded-3xl shadow-3xl text-center">
                <Crown className="w-20 h-20 mx-auto mb-6 text-yellow-400" />
                <p className="text-4xl md:text-6xl font-black">
                  Required: PREMIUM ACCESS
                </p>
                <p className="text-2xl md:text-4xl mt-8 opacity-90">
                  Only {requiredPlan === "3-month" ? "3-Month Warriors" : "1-Month Legends"} can enter here
                </p>
              </div>

              {/* EMOTIONAL MESSAGE */}
              <div className="text-center">
                <p className="text-4xl md:text-6xl font-bold text-[#0C1E46] leading-tight">
                  You’re so close to speaking French like a native
                </p>
                <p className="text-3xl md:text-5xl mt-10 text-[#ED4137] font-black">
                  One upgrade = Paris opens its doors
                </p>
              </div>

              {/* ACTION BUTTONS — IMPOSSIBLE TO IGNORE */}
              <div className="space-y-8">
                <Link href="/pricing" className="block">
                  <Button className="w-full h-24 text-4xl md:text-5xl font-black bg-[#ED4137] hover:bg-red-600 shadow-4xl transform hover:scale-105 transition-all rounded-full">
                    UNLOCK PREMIUM NOW <ArrowRight className="w-12 h-12 ml-6 inline" />
                  </Button>
                </Link>

                <Link href="/dashboard" className="block">
                  <Button variant="outline" className="w-full h-20 text-3xl border-4 border-[#0C1E46] hover:bg-[#0C1E46] hover:text-white font-bold">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>

              {/* FINAL MOTIVATION */}
              <div className="bg-gradient-to-r from-[#0C1E46] via-[#ED4137] to-purple-700 text-white py-16 px-12 rounded-3xl shadow-4xl text-center">
                <Flame className="w-24 h-24 mx-auto mb-8 animate-pulse" />
                <p className="text-5xl md:text-7xl font-black">
                  Free users learn French
                </p>
                <p className="text-5xl md:text-7xl font-black mt-8 text-[#B0CCFE]">
                  Premium users LIVE in French
                </p>
                <p className="text-4xl mt-12 opacity-90">
                  Nigeria to Paris — The door is locked.<br />
                  But you hold the key.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}