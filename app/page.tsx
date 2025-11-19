"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ExamModule {
  id: string;
  title: string;
  description: string;
  level: string;
  questionCount: number;
}

export default function HomePage() {
  const [examModules, setExamModules] = useState<ExamModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExamModules = async () => {
      try {
        const res = await fetch("/api/public/exam-modules");
        if (!res.ok) throw new Error("Failed to load exams");
        const data = await res.json();
        setExamModules(data);
      } catch (err) {
        setError("Could not load exam modules. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchExamModules();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col font-Coolvetica">
      {/* Navbar */}
      <nav className="bg-[#0C1E46] shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <img src="/SFF_page-00021.jpg" alt="SFF Logo" className="h-12 md:h-16" />
        <div className="flex gap-4">
          <Link
            href="/auth/login"
            className="px-5 py-2.5 border border-white/30 text-white rounded-lg hover:bg-[#ED4137] hover:border-[#ED4137] transition font-medium text-sm md:text-base"
          >
            Login
          </Link>
          <Link
            href="/auth/sign-up"
            className="px-5 py-2.5 bg-[#B0CCFE] text-[#0C1E46] font-bold rounded-lg hover:bg-blue-300 transition text-sm md:text-base"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section - Fully Responsive */}
      <section className="relative bg-[url('/hero.jpeg')] bg-cover bg-center bg-no-repeat h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <img src="/logonobg.png" alt="SFF Logo" className="h-25 md:h-40 mx-auto mb-6" />

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Speak French Fast
            <br />
            <span className="text-[#ED4137]">The No. 1 TEF & TCF Exam Prep Platform in Africa</span>
          </h1>

          <p className="text-lg md:text-2xl text-white/90 mt-6 max-w-3xl mx-auto font-light">
            Practice real TEF/TCF exams, get instant AI corrections, and track your daily progress.
          </p>

          {/* Buttons - Always fit, never overflow */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-10 py-4 bg-[#0C1E46] text-white text-lg md:text-xl font-bold rounded-xl hover:bg-[#0a1838] transition shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-10 py-4 bg-white/20 backdrop-blur-md text-white border-2 border-white/50 text-lg md:text-xl font-bold rounded-xl hover:bg-white/30 transition"
            >
              Already a Student? Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Real Exam Practice",
                desc: "Simulate real TEF and TCF exams designed to mirror official test conditions.",
              },
              {
                title: "AI Writing Correction",
                desc: "Get instant grammar and expression feedback powered by AI.",
              },
              {
                title: "Progress Dashboard",
                desc: "Track your daily performance and learning streaks as you improve.",
              },
              {
                title: "Join Our Global Learners",
                desc: "Become part of Africa’s fastest-growing French learning community.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="text-center p-8 bg-gradient-to-b from-white to-[#B0CCFE]/5 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all border border-gray-100"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-[#0C1E46] mb-4">
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Public Exam Modules */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#0C1E46]">
            Practice Exams Available Now
          </h2>

          {loading && <p className="text-center text-gray-600 text-lg">Loading exams...</p>}
          {error && <p className="text-center text-red-600 bg-red-50 py-4 rounded-lg">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {examModules.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 border border-gray-200 hover:border-[#B0CCFE]"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#0C1E46]">{exam.title}</h3>
                  <span className="px-4 py-1.5 bg-[#B0CCFE] text-[#0C1E46] text-sm font-bold rounded-full">
                    {exam.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{exam.description}</p>
                <p className="text-sm text-gray-500 mb-6">{exam.questionCount} questions</p>
                <Link
                  href={`/exam/${exam.id}`}
                  className="block text-center py-3.5 bg-[#ED4137] text-white font-bold rounded-xl hover:bg-red-600 transition"
                >
                  Start Practice →
                </Link>
              </div>
            ))}
          </div>

          {!loading && examModules.length === 0 && !error && (
            <p className="text-center text-gray-500 text-lg">No exam modules available yet.</p>
          )}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 bg-[#0C1E46] text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get Full Access with Premium</h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Unlock all lessons, unlimited practice exams, speaking coach, progress tracking, and more.
          </p>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white text-[#0C1E46] rounded-2xl shadow-2xl p-10">
              <h3 className="text-3xl font-bold mb-4">Free Plan</h3>
              <p className="text-5xl font-bold mb-8">₦0</p>
              <ul className="text-left space-y-4 mb-10 text-lg">
                <li>Limited practice exams</li>
                <li>Basic lessons</li>
                <li>No Community access</li>
              </ul>
              <Link
                href="/auth/sign-up"
                className="block py-4 bg-gray-200 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                Current Plan
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-[#ED4137] to-red-700 rounded-2xl shadow-2xl p-10 transform md:scale-105 border-4 border-yellow-400">
              <div className="bg-yellow-400 text-[#0C1E46] px-5 py-2 rounded-full text-sm font-bold inline-block mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-3xl font-bold mb-4">Premium Monthly</h3>
              <p className="text-6xl font-bold mb-8">₦40,000</p>
              <ul className="text-left space-y-4 mb-10 text-white text-lg">
                <li>Unlimited exams & lessons</li>
                <li>Close Mentorship</li>
                <li>Daily task cycle</li>
                <li>Priority and community support</li>
              </ul>
              <Link
                href="/auth/sign-up?plan=premium"
                className="block py-4 bg-white text-[#ED4137] rounded-xl font-bold hover:bg-gray-100 transition shadow-lg"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </section>

     {/* Footer */}
      <footer className="bg-[#B0CCFE] text-[#0C1E46] py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
         
          <p className="text-sm text-[#0C1E46]">
            © {new Date().getFullYear()} Speak French Fast Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}