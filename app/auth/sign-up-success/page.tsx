import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-6 font-Coolvetica">
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-[url('/hero.jpeg')] opacity-10 bg-cover bg-center -z-10" />

      <div className="w-full max-w-md">
        {/* Logo + Success Header */}
        <div className="text-center mb-10">
          <img
            src="/logonobg.png"
            alt="Speak French Fast Academy"
            className="h-32 mx-auto mb-6"
          />
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg
              className="w-14 h-14 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-[#0C1E46]">
            You're All Set, <span className="text-[#ED4137]">Almost!</span>
          </h1>
          <p className="text-xl text-gray-700 mt-4">
            We just sent a confirmation email to you
          </p>
        </div>

        {/* Success Card */}
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="text-center space-y-3">
            <CardTitle className="text-2xl font-bold text-[#0C1E46]">
              Check Your Inbox
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Click the link in the email to activate your SFF account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-[#B0CCFE] rounded-lg p-5 text-center">
              <p className="text-sm text-[#0C1E46] font-medium">
                Can't find the email?
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Check your <strong>Spam/Promotions</strong> folder or search for{" "}
                <span className="font-mono bg-gray-200 px-1 rounded">no-reply@speakfrenchfast.com</span>
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/auth/login" className="block w-full">
                <Button
                  className="w-full h-14 text-xl font-semibold bg-[#ED4137] hover:bg-red-600 text-white transition-all shadow-md"
                >
                  Go to Login
                </Button>
              </Link>

              <Link href="/" className="block w-full">
                <Button
                  variant="outline"
                  className="w-full h-12 border-[#0C1E46] text-white hover:bg-[#0C1E46] hover:text-white transition-all"
                >
                  Back to Home
                </Button>
              </Link>
            </div>

            <p className="text-center text-sm text-gray-500">
              Need help?{" "}
              <Link href="/contact" className="text-[#ED4137] hover:underline font-medium">
                Contact Support
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Trust & Motivation */}
        <p className="text-center mt-8 text-gray-600">
          <span className="font-bold text-[#ED4137]">10,000+</span> Nigerians are already practicing with SFF —{" "}
          <span className="text-[#0C1E46] font-medium">your turn!</span>
        </p>
      </div>
    </div>
  );
}