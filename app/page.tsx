"use client"
import { useEffect, useState } from "react";
import Link from 'next/link'

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

  // Fetch exam modules from backend (no auth required)
  useEffect(() => {
    const fetchExamModules = async () => {
      try {
        const res = await fetch("/api/public/exam-modules"); // Adjust endpoint as needed
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
      <nav className="bg-[#0C1E46] shadow-sm px-8 py-4 flex justify-between items-center">
        <img
          src="/SFF_page-00021.jpg"
          alt="SFF Logo"
          className="h-15 w-45"
        />
        <div className="flex gap-8">
          <Link
            href="/auth/login"
            className="px-5 py-2 border border-gray-300 rounded hover:bg-[#ED4137] text-white transition"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="px-5 py-2 bg-[#B0CCFE] text-[#0C1E46] font-semibold rounded hover:bg-blue-300 transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-[url('/hero.jpeg')] bg-cover bg-center bg-no-repeat h-[85vh] w-full px-4 py-20 text-center flex flex-col justify-center items-center">
        <img src="/logonobg.png" alt="SFF Logo" className="h-40 w-auto" />
        <h2 className="text-4xl font-bold mt-10 mb-4 text-[#0C1E46]">
          Speak French Fast The No. 1 TEF & TCF Exam Prep Platform in Africa.
        </h2>
        <p className="text-2xl text-gray-700 mt-8 mb-8 max-w-2xl mx-auto">
          Practice real TEF/TCF exams, get instant AI corrections, and track your daily progress.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block mt-8 px-8 py-5 bg-[#0C1E46] text-white rounded-md hover:bg-blue-900 font-medium text-md transition"
        >
          Start Free Trial
        </Link>
        <Link
          href="/auth/login"
          className="inline-block mt-5 px-8 py-5 bg-[#0C1E46] text-white rounded-md hover:bg-blue-900 font-medium text-md transition"
        >
          Already a student? Login
        </Link>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols- gap-8">
          {[
          { title: "Real Exam Practice",
          desc: "Simulate real TEF and TCF exams designed to mirror official test conditions."},
          { title: "AI Writing Correction",
          desc: "Get instant grammar and expression feedback powered by AI."},
          { title: "Progress Dashboard",
          desc: "Track your daily performance and learning streaks as you improve."},
          { title: "Join Our Global Learners",
          desc: "Become part of Africa’s fastest-growing French learning community."},
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 text-center bg-white rounded-lg shadow hover:shadow-xl transition-shadow border border-gray-100"
            >
              <h3 className="text-4xl font-bold mb-2 text-[#0C1E46]">{feature.title}</h3>
              <p className="text-4x1 text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Modules Section - Public (No Login Required) */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#0C1E46]">
            Practice Exams Available Now
          </h2>

          {loading && (
            <p className="text-center text-gray-600">Loading exam modules...</p>
          )}

          {error && (
            <p className="text-center text-red-600 bg-red-50 py-3 rounded-lg">{error}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {examModules.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-shadow p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-[#0C1E46]">{exam.title}</h3>
                  <span className="px-3 py-1 bg-[#B0CCFE] text-[#0C1E46] text-sm rounded-full font-medium">
                    {exam.level}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{exam.description}</p>
                <p className="text-sm text-gray-500 mb-6">
                  {exam.questionCount} questions
                </p>
                <a
                  href={`/exam/${exam.id}`} // Adjust route as needed
                  className="block text-center w-full py-3 bg-[#ED4137] text-white font-semibold rounded-lg hover:bg-red-600 transition"
                >
                  Start Practice →
                </a>
              </div>
            ))}
          </div>

          {examModules.length === 0 && !loading && !error && (
            <p className="text-center text-gray-500">No exam modules available yet.</p>
          )}
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-[#0C1E46] text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Get Full Access with Premium
          </h2>
          <p className="text-xl mb-10 text-blue-100">
            Unlock all lessons, unlimited practice exams, speaking coach, progress tracking, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="bg-white text-[#0C1E46] p-8 rounded-xl shadow-xl w-full sm:w-80">
              <h3 className="text-2xl font-bold mb-4">Free Plan</h3>
              <p className="text-4xl font-bold mb-6">₦0</p>
              <ul className="text-left mb-8 space-y-3">
                <li>✓ Limited practice exams</li>
                <li>✓ Basic lessons</li>
                <li>✓ No Community access</li>
              </ul>
              <a
                href="/auth/sign-up"
                className="block py-3 bg-gray-200 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Current Plan
              </a>
            </div>

            <div className="bg-gradient-to-br from-[#ED4137] to-red-600 p-8 rounded-xl shadow-xl w-full sm:w-80 transform scale-105">
              <div className="bg-yellow-400 text-[#0C1E46] px-4 py-1 rounded-full text-sm font-bold inline-block mb-4">
                PREMIUM PLAN
              </div>
              <h3 className="text-2xl font-bold mb-4">Premium Monthly</h3>
              <p className="text-5xl font-bold mb-6">₦40,000</p>
              <ul className="text-left mb-8 space-y-3 text-white">
                <li>✓ Unlimited exams & lessons</li>
                <li>✓ Close Mentorship</li>
                <li>✓ Daily task cycle </li>
                <li>✓ Priority and community support</li>
              </ul>
              <a
                href="/auth/sign-up?plan=premium"
                className="block py-3 bg-white text-[#ED4137] rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Upgrade Now
              </a>
            </div>
          </div>
        </div>
      </div>

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