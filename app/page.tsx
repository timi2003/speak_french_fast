"use client"
import { useEffect, useState } from "react";

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
          <a
            href="/auth/login"
            className="px-5 py-2 border border-gray-300 rounded hover:bg-[#ED4137] text-white transition"
          >
            Login
          </a>
          <a
            href="/auth/signup"
            className="px-5 py-2 bg-[#B0CCFE] text-[#0C1E46] font-semibold rounded hover:bg-blue-300 transition"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-[url('/hero.jpeg')] bg-cover bg-center bg-no-repeat h-[85vh] w-full px-4 py-20 text-center flex flex-col justify-center items-center">
        <img src="/logonobg.png" alt="SFF Logo" className="h-40 w-auto" />
        <h2 className="text-5xl font-bold mt-10 mb-4 text-[#0C1E46]">
          Welcome to Speak French Fast Academy <span className="text-[#ED4137]">SFF</span>
        </h2>
        <p className="text-3xl text-gray-700 mt-8 mb-8 max-w-2xl mx-auto">
          We’re super excited to have you on this life-changing journey!
        </p>
        <a
          href="/auth/sign-up"
          className="inline-block mt-12 px-8 py-5 bg-[#0C1E46] text-white rounded-md hover:bg-blue-900 font-medium text-2xl transition"
        >
          Start Learning Today
        </a>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols- gap-8">
          {[
          { title: "Quick Start",
          desc: "No waiting, no complicated setup. Jump straight into your first French lesson the moment you sign up. Our carefully structured guided lessons walk you step-by-step from “Bonjour” to full conversations — perfect for busy Nigerians who want results fast!"},
          { title: "Comprehensive",
          desc: "Master ALL four language skills exactly how the DELF/DALF exams test them: Listening, Reading, Writing, and Speaking. Every lesson is designed by certified French examiners to mirror real exam formats, so you’re not just learning French — you’re learning exam-winning French."},
          { title: "Effective Grading",
          desc: "Get instant, accurate feedback on your writing and speaking 24/7. Our advanced AI (trained on thousands of real DELF/DALF answers) scores your responses like a human examiner would, highlights your mistakes, and shows you exactly how to improve — no more waiting days for corrections!"},
          { title: "Community & Progress Tracking",
          desc: "Join thousands of Nigerian students preparing for DELF, TEF, or travel. Learn directly from certified examiners in live Q&A sessions, compare your progress with peers, celebrate milestones, and stay motivated with detailed dashboards that show how close you are to fluency."},
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