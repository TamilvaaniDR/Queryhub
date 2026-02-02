import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        {/* Hero */}
        <section className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            About <span className="text-blue-600">DoubtConnect</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Student-first Q&A and knowledge sharing for academic communities
          </p>
        </section>

        {/* Dashboard-style overview */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">Community</div>
            <p className="text-sm text-slate-500">Ask & answer with peers</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="text-2xl font-bold text-cyan-600 mb-1">Contributors</div>
            <p className="text-sm text-slate-500">Reputation & leaderboard</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600 mb-1">Categories</div>
            <p className="text-sm text-slate-500">Subjects, placements, labs</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="text-2xl font-bold text-violet-600 mb-1">Messages</div>
            <p className="text-sm text-slate-500">Direct peer collaboration</p>
          </div>
        </section>

        {/* Content card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-14">
          <div className="p-8 md:p-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Our mission</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              DoubtConnect is built so students learn by helping each other. We focus on a clear,
              organized space for questions and answers, with reputation and recognition for
              contributors—so expertise is visible and collaboration is encouraged.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 mb-4 mt-8">What we offer</h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-slate-600 mb-0">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Subject and category-based Q&A
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Search and filters
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Reputation and leaderboard
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Direct messaging
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Contributor profiles
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Accepted answers and likes
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 mb-4 mt-8">Values</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <h3 className="font-medium text-slate-900 mb-2">Student-centered</h3>
                <p className="text-sm text-slate-600">
                  The product and guidelines are designed around the student experience.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <h3 className="font-medium text-slate-900 mb-2">Recognition & growth</h3>
                <p className="text-sm text-slate-600">
                  Reputation and leaderboards reward helpful contributors and encourage sharing.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <h3 className="font-medium text-slate-900 mb-2">Knowledge sharing</h3>
                <p className="text-sm text-slate-600">
                  Collaborative learning is at the core—ask, answer, and learn together.
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <h3 className="font-medium text-slate-900 mb-2">Safe learning space</h3>
                <p className="text-sm text-slate-600">
                  A respectful environment so everyone can ask and contribute comfortably.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer strip - no login/signup */}
        <footer className="text-center py-8 border-t border-slate-200">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-xl bg-blue-600 text-white grid place-items-center text-sm font-bold">
              DC
            </div>
            <span className="font-semibold text-slate-800">DoubtConnect</span>
          </div>
          <div className="flex justify-center gap-6 text-sm text-slate-500">
            <Link to="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-slate-800 transition-colors">About</Link>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            © {new Date().getFullYear()} DoubtConnect
          </p>
        </footer>
      </main>
    </div>
  )
}
