import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar />
      
      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            About <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">DoubtConnect</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Building the future of student collaboration and knowledge sharing
          </p>
        </section>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm mb-16">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
            <p className="text-slate-700 mb-6">
              DoubtConnect was born from a simple observation: students learn best when they help each other. 
              Traditional Q&A platforms often felt intimidating or disconnected from the real academic experience. 
              We set out to create a space that's specifically designed for students, by students.
            </p>
            
            <p className="text-slate-700 mb-8">
              Our mission is to foster a supportive learning environment where knowledge flows freely between peers, 
              questions are welcomed, and expertise is recognized and rewarded.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="font-semibold text-lg text-blue-800 mb-3">Student-Centered</h3>
                <p className="text-slate-700">
                  Everything we build prioritizes the student experience. From our intuitive interface to our 
                  thoughtful community guidelines, we put students first.
                </p>
              </div>
              <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-100">
                <h3 className="font-semibold text-lg text-cyan-800 mb-3">Knowledge Sharing</h3>
                <p className="text-slate-700">
                  We believe that learning is most effective when it's collaborative. Our platform encourages 
                  students to share insights and help one another succeed.
                </p>
              </div>
              <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                <h3 className="font-semibold text-lg text-teal-800 mb-3">Recognition & Growth</h3>
                <p className="text-slate-700">
                  Our reputation system ensures that helpful contributors are recognized for their efforts, 
                  creating positive incentives for knowledge sharing.
                </p>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="font-semibold text-lg text-indigo-800 mb-3">Safe Learning Space</h3>
                <p className="text-slate-700">
                  We maintain a respectful, moderated environment where students feel comfortable asking 
                  questions without judgment or fear.
                </p>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Our Platform</h2>
            <p className="text-slate-700 mb-6">
              DoubtConnect offers a comprehensive suite of tools designed specifically for academic communities:
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-2 mb-8">
              <li>Subject-specific categories for organized discussions</li>
              <li>Advanced search and filtering capabilities</li>
              <li>Reputation and recognition systems</li>
              <li>Direct messaging for peer-to-peer collaboration</li>
              <li>Real-time notifications and activity feeds</li>
              <li>Secure, private community spaces</li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Join Our Mission</h2>
            <p className="text-slate-700">
              Whether you're looking for help with coursework, wanting to share your expertise, 
              or simply seeking to connect with fellow learners, DoubtConnect welcomes you. 
              Together, we're building a brighter future for collaborative learning.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/signup"
            className="inline-block rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:-translate-y-1"
          >
            Join Our Community
          </Link>
        </div>
      </main>

      <footer className="py-12 bg-slate-900 text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-2xl bg-blue-600 text-white grid place-items-center text-sm font-bold">
                DC
              </div>
              <span className="text-lg font-semibold text-white">DoubtConnect</span>
            </div>
            <p className="mb-6 max-w-md mx-auto">
              A student-first Q&A community for collaborative learning and knowledge sharing.
            </p>
            <div className="flex justify-center gap-6 text-sm">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <Link to="/login" className="hover:text-white transition-colors">Login</Link>
              <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
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