import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <section className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm mb-6 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-medium text-slate-700">Student-first community</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 animate-slide-up">
              Get unstuck
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                faster.
              </span>
              Grow your
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                reputation.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 animate-fade-in delay-100">
              Join thousands of students in a private Q&A community where knowledge sharing leads to real growth. 
              Ask questions, share insights, and build your academic reputation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16 animate-fade-in delay-200">
              <Link
                to="/signup"
                className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:-translate-y-1 text-center"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all text-center"
              >
                I have an account
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0 animate-fade-in delay-300">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">10K+</div>
                <div className="text-sm text-slate-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">50K+</div>
                <div className="text-sm text-slate-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">98%</div>
                <div className="text-sm text-slate-600">Satisfaction</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Preview Card */}
          <div className="animate-fade-in delay-300">
            <div className="rounded-3xl bg-white/70 backdrop-blur border border-slate-200 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Recent Questions</h3>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  Live feed
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="font-medium text-slate-900 mb-2">
                    How to implement JWT authentication in MERN stack?
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>4 answers · 2 accepted</span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">Placements</span>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-200 transition-colors">
                  <div className="font-medium text-slate-900 mb-2">
                    Best resources for DBMS theory before internals?
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>3 answers · 12 likes</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Exams</span>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-pink-200 transition-colors">
                  <div className="font-medium text-slate-900 mb-2">
                    How to balance NSS activities with academics?
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>2 answers · 8 likes</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full">NSS</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Join to see more questions</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why students love <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">DoubtConnect</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built by students, for students. A platform designed to make learning collaborative and rewarding.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Safe & Private</h3>
              <p className="text-slate-600">
                JWT-based authentication and moderated community ensure a safe learning environment.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Reputation System</h3>
              <p className="text-slate-600">
                Earn points for helpful answers and accepted solutions. Your expertise gets recognized.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Student Focused</h3>
              <p className="text-slate-600">
                Dedicated categories for subjects, placements, exams, labs, and campus activities.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to join the community?
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Start asking questions, sharing knowledge, and building your academic reputation today.
          </p>
          <Link
            to="/signup"
            className="inline-block rounded-2xl bg-white px-8 py-4 text-base font-semibold text-indigo-600 shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all transform hover:-translate-y-1"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-2xl bg-indigo-600 text-white grid place-items-center text-sm font-bold">
                DC
              </div>
              <span className="text-lg font-semibold text-white">DoubtConnect</span>
            </div>
            <p className="mb-6 max-w-md mx-auto">
              A student-first Q&A community for collaborative learning and knowledge sharing.
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-800 text-xs text-slate-500">
              © {new Date().getFullYear()} DoubtConnect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

