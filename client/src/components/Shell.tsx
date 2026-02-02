import { NavLink, Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

const categories = [
  { id: 'subjects', name: 'Subjects', icon: '📚' },
  { id: 'placements', name: 'Placements', icon: '💼' },
  { id: 'exams', name: 'Exams', icon: '📝' },
  { id: 'labs', name: 'Labs', icon: '🔬' },
  { id: 'projects', name: 'Projects', icon: '🚀' },
  { id: 'nss', name: 'NSS / Activities', icon: '🎯' },
] as const

export function Shell() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      <Navbar isAuthenticated={true} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-[80px] lg:h-[calc(100vh-100px)]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="px-2 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Categories</div>
            <nav className="flex flex-col gap-1">
              {categories.map((c) => (
                <NavLink
                  key={c.id}
                  to={`/community?category=${c.id}`}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2.5 text-sm font-medium transition-all flex items-center gap-3 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-l-4 border-blue-500 shadow-sm' 
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                  end
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          
          {/* Quick Stats Sidebar */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="px-2 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Community Stats</div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Active Users</span>
                <span className="font-semibold text-blue-600">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Questions Today</span>
                <span className="font-semibold text-cyan-600">89</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Answers Given</span>
                <span className="font-semibold text-teal-600">256</span>
              </div>
            </div>
          </div>
        </aside>

        <main>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[calc(100vh-200px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

