"use client";

import type React from "react";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 font-Coolvetica">
      {/* Subtle hero background */}
      <div className="absolute inset-0 bg-[url('/hero.jpeg')] opacity-10 bg-cover bg-center -z-10" />

      <div className="w-full max-w-md space-y-8">
        {/* Logo + Header */}
        <div className="text-center">
          <img
            src="/logonobg.png"
            alt="Speak French Fast Academy"
            className="mx-auto h-20 sm:h-24 md:h-28 lg:h-32 mb-6"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0C1E46]">
            Set New Password
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-gray-700">
            You’re almost there — secure your account now!
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-3 text-center pb-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-[#0C1E46]">
              Create a Strong Password
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-gray-600">
              Enter your new password below
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {success ? (
              /* ────── SUCCESS STATE ────── */
              <div className="text-center py-10 space-y-6">
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-14 h-14 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0C1E46]">All Done!</h3>
                  <p className="text-gray-600 mt-2">
                    Your password has been updated successfully.
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    Redirecting you to login in 3 seconds...
                  </p>
                </div>
                <Link href="/auth/login" className="block">
                  <Button className="w-full h-14 text-xl font-bold bg-[#ED4137] hover:bg-red-600 text-white">
                    Go to Login Now
                  </Button>
                </Link>
              </div>
            ) : (
              /* ────── FORM STATE ────── */
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-medium text-[#0C1E46]">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 sm:h-14 text-base border-gray-300 focus:border-[#0C1E46] focus:ring-[#0C1E46]"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="repeat-password" className="text-base font-medium text-[#0C1E46]">
                    Confirm New Password
                  </Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    placeholder="Confirm your password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="h-12 sm:h-14 text-base border-gray-300 focus:border-[#0C1E46] focus:ring-[#0C1E46]"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-14 text-lg sm:text-xl font-bold bg-[#0C1E46] hover:bg-[#0a1838] text-white transition-all shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating Password..." : "Reset Password"}
                </Button>
              </form>
            )}

            {/* Bottom Links */}
            <div className="text-center pt-6 space-y-4">
              <Link
                href="/auth/login"
                className="text-sm text-[#0C1E46] hover:text-[#ED4137] underline underline-offset-4"
              >
                ← Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trust Badge */}
        <p className="text-center text-gray-600 text-sm sm:text-base mt-10">
          Trusted by{" "}
          <span className="font-bold text-[#ED4137]">10,000+</span> Nigerian students
          <br className="sm:hidden" /> passing French exams with SFF
        </p>
      </div>
    </div>
  );
}