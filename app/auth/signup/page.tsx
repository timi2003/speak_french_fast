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

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name");
      setIsLoading(false);
      return;
    }
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      // Redirect to success page
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-6 font-Coolvetica">
      {/* Subtle Hero Background */}
      <div className="absolute inset-0 bg-[url('/hero.jpeg')] opacity-10 bg-cover bg-center -z-10" />

      <div className="w-full max-w-md">
        {/* Logo & Welcome */}
        <div className="text-center mb-10">
          <img
            src="/logonobg.png"
            alt="Speak French Fast Academy"
            className="h-22 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-[#0C1E46]">
            Join <span className="text-[#ED4137]">SFF</span> Today
          </h1>
          <p className="text-xl text-gray-700 mt-3">
            Start mastering TEF & TCF in minutes
          </p>
        </div>

        {/* Sign-Up Card */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-bold text-[#0C1E46]">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Get instant access to practice exams & AI grading
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full-name" className="text-base font-medium text-[#0C1E46]">
                  Full Name
                </Label>
                <Input
                  id="full-name"
                  placeholder="e.g., Chukwuemeka Okonkwo"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 text-base text-[#0C1E46] focus:border-[#0C1E46]"
                />
              </div>

              {/* Email */}
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
                  className="h-12 text-base text-[#0C1E46] focus:border-[#0C1E46]"
                />
              </div>

              {/* Password */}
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
                  className="h-12 text-base text-[#0C1E46] focus:border-[#0C1E46]"
                />
              </div>

              {/* Repeat Password */}
              <div className="space-y-2">
                <Label htmlFor="repeat-password" className="text-base font-medium text-[#0C1E46]">
                  Confirm Password
                </Label>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="h-12 text-base text-[#0C1E46] focus:border-[#0C1E46]"
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
                className="w-full h-14 text-xl font-semibold bg-[#ED4137] hover:bg-red-600 text-white transition-all shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Start Learning Free"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-bold text-[#0C1E46] hover:text-[#ED4137] underline underline-offset-4"
                >
                  Login here
                </Link>
              </p>
            </div>

            {/* Trust & Links */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-3">
              <p className="text-sm text-gray-500">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-[#0C1E46] hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#0C1E46] hover:underline">
                  Privacy Policy
                </Link>
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <Link href="/" className="text-[#0C1E46] hover:text-[#ED4137]">
                  Home
                </Link>
                <Link href="/contact" className="text-[#0C1E46] hover:text-[#ED4137]">
                  Support
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Badge */}
        <p className="text-center mt-8 text-gray-600">
          Join <span className="font-bold text-[#ED4137]">10,000+</span> Nigerians passing French exams with SFF
        </p>
      </div>
    </div>
  );
}