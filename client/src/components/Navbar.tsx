import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../app/auth/AuthContext'

interface NavbarProps {
  isAuthenticated?: boolean
}

export function Navbar({ isAuthenticated = false }: NavbarProps) {
  const { state, logout } = useAuth()
  const user = state.status === 'authenticated' ? state.user : null

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to={isAuthenticated ? "/community" : "/"} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white grid place-items-center text-base font-bold shadow-lg">
            DC
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            DoubtConnect
          </span>
        </Link>

        {/* Navigation Links - Only for authenticated users */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/community"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              Community
            </NavLink>
            <NavLink
              to="/ask"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              Ask Question
            </NavLink>
            <NavLink
              to="/contributors"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              Contributors
            </NavLink>
          </nav>
        )}

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Mobile menu button for authenticated users */}
              <div className="md:hidden">
                <button className="p-2 rounded-lg text-slate-600 hover:bg-slate-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 px-3 py-2 hover:bg-slate-50 transition-all"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white grid place-items-center text-sm font-bold">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-slate-900">{user.name.split(' ')[0]}</div>
                    <div className="text-xs text-slate-500">Rep {user.reputationScore}</div>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Landing page actions */}
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu for authenticated users */}
      {isAuthenticated && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <nav className="flex flex-col py-2">
            <NavLink
              to="/community"
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              Community
            </NavLink>
            <NavLink
              to="/ask"
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              Ask Question
            </NavLink>
            <NavLink
              to="/contributors"
              className={({ isActive }) =>
                `px-4 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              Contributors
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  )
}