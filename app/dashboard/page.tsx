// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import DashboardContent from "@/components/dashboard/dashboard-content";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// export const revalidate = 0; // always fresh

// export default async function DashboardPage() {
//   const supabase = await createClient();

//   // ────── 1. AUTH ──────
//   const {
//     data: { user },
//     error: authError,
//   } = await supabase.auth.getUser();

//   if (authError || !user) {
//     redirect("/auth/login");
//   }

//   // ────── 2. USER DATA ──────
//   const { data: userProfile } = await supabase
//     .from("users")
//     .select("*")
//     .eq("id", user.id)
//     .single();

//   const { data: progress } = await supabase
//     .from("progress")
//     .select("*")
//     .eq("user_id", user.id)
//     .single();

//   const { data: dailyTasks } = await supabase
//     .from("daily_tasks")
//     .select("*")
//     .limit(5)
//     .order("day_number");

//   // ────── 3. RENDER BRANDED UI ──────
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 font-Coolvetica">
//       {/* Subtle hero background */}
//       <div className="absolute inset-0 bg-[url('/hero.jpeg')] opacity-10 bg-cover bg-center -z-10" />

//       {/* ────── NAVBAR ────── */}
//       <nav className="bg-[#0C1E46] shadow-md px-6 py-4 flex justify-between items-center">
//         <Link href="/" className="flex items-center gap-3">
//           <img src="/logonobg.png" alt="SFF Logo" className="h-12" />
//           <span className="text-2xl font-bold text-white hidden sm:inline">
//             Speak <span className="text-[#ED4137]">French</span> Fast
//           </span>
//         </Link>

//         <div className="flex items-center gap-4">
//           <span className="text-white hidden md:block">
//             Welcome, <span className="font-semibold">{userProfile?.full_name?.split(" ")[0] || "Learner"}</span>
//           </span>

//           <form
//             action={async () => {
//               "use server";
//               const supabase = await createClient();
//               await supabase.auth.signOut();
//               redirect("/auth/login");
//             }}
//           >
//             <Button
//               type="submit"
//               variant="outline"
//               className="border-white text-white hover:bg-[#ED4137] hover:border-[#ED4137] transition"
//             >
//               Logout
//             </Button>
//           </form>
//         </div>
//       </nav>

//       {/* ────── MAIN CONTENT ────── */}
//       <main className="max-w-7xl mx-auto px-4 py-10">
//         {/* Page Title */}
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold text-[#0C1E46]">
//             Your <span className="text-[#ED4137]">SFF</span> Dashboard
//           </h1>
//           <p className="text-xl text-gray-700 mt-3">
//             Track progress, practice exams, and master French – all in one place.
//           </p>
//         </div>

//         {/* Pass data to your existing component */}
//         <DashboardContent
//           user={user}
//           userProfile={userProfile}
//           progress={progress}
//           dailyTasks={dailyTasks}
//         />

//         {/* ────── QUICK ACTIONS ────── */}
//         <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           <ActionCard
//             title="Practice Exam"
//             desc="Jump into a full DELF/TEF mock test"
//             href="/exam"
//             color="bg-[#ED4137]"
//           />
//           <ActionCard
//             title="AI Speaking Coach"
//             desc="Record & get instant pronunciation feedback"
//             href="/speak"
//             color="bg-[#0C1E46]"
//           />
//           <ActionCard
//             title="Leaderboard"
//             desc="See how you rank among Nigerian learners"
//             href="/leaderboard"
//             color="bg-[#B0CCFE]"
//           />
//           <ActionCard
//             title="Upgrade Plan"
//             desc="Unlock unlimited exams & certificates"
//             href="/pricing"
//             color="bg-gradient-to-r from-[#ED4137] to-red-600"
//           />
//         </div>

//         {/* ────── MOTIVATION FOOTER ────── */}
//         <div className="mt-20 text-center">
//           <p className="text-lg text-gray-700">
//             <span className="font-bold text-[#ED4137]">10,000+</span> Nigerians have passed their French exams with SFF.
//             <br />
//             <span className="text-[#0C1E46] font-medium">Your success story starts here.</span>
//           </p>
//         </div>
//       </main>

//       {/* ────── FOOTER ────── */}
//       <footer className="bg-[#0C1E46] text-white py-8 mt-20">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <img src="/logonobg2.png" alt="SFF Footer" className="h-12 mx-auto mb-4" />
//           <p className="text-sm">
//             © {new Date().getFullYear()} Speak French Fast Academy. All rights reserved.
//           </p>
//           <div className="flex justify-center gap-6 mt-4 text-sm">
//             <Link href="/privacy" className="hover:text-[#B0CCFE]">Privacy</Link>
//             <Link href="/terms" className="hover:text-[#B0CCFE]">Terms</Link>
//             <Link href="/contact" className="hover:text-[#B0CCFE]">Support</Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// /* ────── REUSABLE ACTION CARD ────── */
// function ActionCard({
//   title,
//   desc,
//   href,
//   color,
// }: {
//   title: string;
//   desc: string;
//   href: string;
//   color: string;
// }) {
//   return (
//     <Link href={href}>
//       <div className="group p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all border border-gray-100">
//         <div
//           className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
//         >
//           <span className="text-white text-2xl">→</span>
//         </div>
//         <h3 className="font-bold text-lg text-[#0C1E46] mb-2">{title}</h3>
//         <p className="text-sm text-gray-600">{desc}</p>
//       </div>
//     </Link>
//   );
// }