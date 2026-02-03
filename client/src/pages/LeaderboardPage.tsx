import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../app/api/http'

type LeaderboardEntry = {
  rank: number
  id: string
  name: string
  department: string
  year: number
  contributionCount: number
  likesReceived: number
}

export function LeaderboardPage() {
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get<{ entries: LeaderboardEntry[] }>('/api/leaderboard')
      .then((r) => {
        if (mounted) setEntries(r.data.entries ?? [])
      })
      .catch(() => {
        if (mounted) setEntries([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-600">Loading leaderboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Leaderboard</h1>
        <p className="text-slate-600">
          Ranked by likes and contributions — from top contributors to low.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {entries.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No contributors yet.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {entries.map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                  #{e.rank}
                </div>
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0 cursor-pointer hover:opacity-90"
                  onClick={() => navigate(`/profile/${e.id}`)}
                  title="View profile"
                >
                  {e.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => navigate(`/profile/${e.id}`)}
                    className="font-semibold text-slate-900 hover:text-blue-600 text-left truncate block w-full"
                  >
                    {e.name}
                  </button>
                  <p className="text-sm text-slate-500 truncate">
                    {e.department} · Year {e.year}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-800">
                    {e.contributionCount} contributions
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-100 text-rose-800">
                    ♥ {e.likesReceived} likes
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
