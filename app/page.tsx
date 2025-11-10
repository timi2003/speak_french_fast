export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex flex-col font-Coolvetica">
      {/* Navbar */}
      <nav className="bg-[#0C1E46] shadow-sm px-8 pr-10 py-4 flex justify-between items-center">

        <img src="/SFF_page-00021.jpg?height=800&width=1600"
         className="h-15 w-45"/>

        <div className="flex gap-8">
          <a href="/auth/login" className="px-5 py-2 border border-gray-300 rounded hover:bg-[#ED4137]">
            Login
          </a>
          <a href="/auth/sign-up" className="px-5 py-2 bg-[#B0CCFE] text-white rounded hover:bg-blue-700">
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-[url('/hero.jpeg')] bg-cover bg-center bg-no-repeat h-[85vh] w-full px-4 py-20 text-center items-center font-sans-serif justify-center">
      <div className="flex justify-center items-center">
       <img src="/logonobg.png"
         className="h-40 w-100 pt-0"/>
         </div>
        <h2 className="text-5xl font-bold mt-10 mb-4 text-[#0C1E46]">
         Welcome to Speak French Fast Academy <span className="text-[#ED4137]">SFF</span>
        </h2>
        <p className="text-3xl text-gray-600 mt-8 mb-8 max-w-2xl mx-auto">
         We’re super excited to have you on this life-changing journey!</p>


        <a
          href="/auth/sign-up"
          className="inline-block mt-12 px-8 py-5 bg-[#0C1E46] text-white rounded-md hover:bg-blue-700 font-medium text-2xl"
        >
          Start Learning Today
        </a>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto px-4 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Quick Start", desc: "Begin learning immediately with guided lessons" },
            { title: "Comprehensive", desc: "All four skills: listening, reading, writing, speaking" },
            { title: "AI Grading", desc: "Get instant feedback powered by artificial intelligence" },
            { title: "Community", desc: "Learn from examiners and track your progress" },
          ].map((feature, i) => (
            <div key={i} className="p-6 text-center bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#ED4137] text-white px-4 py-16 mt-8">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to start your French journey?</h3>
          <a
            href="/auth/sign-up"
            className="inline-block px-6 py-3 bg-white text-blue-600 rounded hover:bg-gray-100 font-semibold"
          >
            Create Free Account
          </a>
        </div>
      </div>
      <div className="bg-[#0C1E46] px-2 py-2 mt-3 text-white">
        <footer>
          <img src="logonobg2.png" 
          className="w-100 h-50 flex"
          alt="" />
          <h3>Quick Links</h3>   
          <ul>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div className=" text-center">
          <p>Copyright Speakfrenchfast</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
