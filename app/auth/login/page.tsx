"use client";

import type React from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-6 font-Coolvetica">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/hero.jpeg')] opacity-10 bg-cover bg-center -z-10" />

      <div className="w-full max-w-md">
        {/* Logo + Title */}
        <div className="text-center mb-10">
          <img
            src="/logonobg.png"
            alt="Speak French Fast Academy"
            className="h-22 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-[#0C1E46]">
            Welcome back to <span className="text-[#ED4137]">SFF</span>
          </h1>
          <p className="text-xl text-gray-700 mt-3">
            Master TEF • TCF with confidence
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-bold text-[#0C1E46]">
              Login to Your Account
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Continue your French journey right where you left off
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
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
                  className="h-12 text-[#0C1E46] border-gray-300 focus:border-[#0C1E46]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium text-[#0C1E46]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-[#0C1E46] border-gray-300 focus:border-[#0C1E46]"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 text-xl font-semibold bg-[#0C1E46] hover:bg-[#0a1838] text-white transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Signing you in..." : "Login Now"}
              </Button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-gray-600">
                New to SFF?{" "}
                <Link
                  href="/auth/signup"
                  className="font-bold text-[#ED4137] hover:underline underline-offset-4"
                >
                  Create Free Account
                </Link>
              </p>

              <div className="flex justify-center gap-6 mt-6">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#0C1E46] hover:text-[#ED4137] underline underline-offset-4"
                >
                  Forgot password?
                </Link>
                <Link
                  href="/"
                  className="text-sm text-[#0C1E46] hover:text-[#ED4137] underline underline-offset-4"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust badge */}
        <p className="text-center mt-8 text-gray-600">
          Trusted by <span className="font-bold text-[#ED4137]">5,000+</span> Nigerian students preparing for French exams
        </p>
      </div>
    </div>
  );
}