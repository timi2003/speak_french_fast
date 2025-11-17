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
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          window.location.origin
        }/auth/reset-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-6 font-Coolvetica">
      {/* Subtle hero background */}
      <div className="absolute inset-0 bg-[url('/hero.jpeg')] opacity-10 bg-cover bg-center -z-10" />

      <div className="w-full max-w-md">
        {/* Logo + Header */}
        <div className="text-center mb-10">
          <img
            src="/logonobg.png"
            alt="Speak French Fast Academy"
            className="h-32 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-[#0C1E46]">
            Reset Your Password
          </h1>
          <p className="text-xl text-gray-700 mt-3">
            No worries — we’ll help you get back in!
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-bold text-[#0C1E46]">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Enter your email and we’ll send you a reset link
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              /* ────── SUCCESS STATE ────── */
              <div className="text-center space-y-6 py-8">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#0C1E46] mb-2">
                    Check Your Email!
                  </h3>
                  <p className="text-gray-600">
                    We’ve sent a password reset link to
                  </p>
                  <p className="font-semibold text-[#0C1E46] mt-1">{email}</p>
                </div>
                <div className="bg-blue-50 border border-[#B0CCFE] rounded-lg p-4 text-sm text-[#0C1E46]">
                  <p>Can’t find it? Check your <strong>Spam/Promotions</strong> folder</p>
                </div>
                <Link href="/auth/login" className="block">
                  <Button className="w-full h-14 text-xl font-semibold bg-[#ED4137] hover:bg-red-600 text-white">
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              /* ────── FORM STATE ────── */
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium text-[#0C1E46]">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-[#0C1E46] border-gray-300 focus:border-[#0C1E46] focus:ring-[#0C1E46]"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 text-xl font-semibold bg-[#0C1E46] hover:bg-[#0a1838] text-white transition-all shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending Link..." : "Send Reset Link"}
                </Button>
              </form>
            )}

            {/* Bottom Links */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-gray-600">
                Remembered your password?{" "}
                <Link
                  href="/auth/login"
                  className="font-bold text-[#ED4137] hover:underline underline-offset-4"
                >
                  Login here
                </Link>
              </p>
              <Link
                href="/"
                className="text-sm text-[#0C1E46] hover:text-[#ED4137] underline underline-offset-4"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trust Badge */}
        <p className="text-center mt-8 text-gray-600">
          Trusted by <span className="font-bold text-[#ED4137]">10,000+</span> Nigerian students passing French exams
        </p>
      </div>
    </div>
  );
}