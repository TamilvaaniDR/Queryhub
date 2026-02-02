import { useEffect, useMemo, useState } from 'react'
import { api } from '../app/api/http'

type Contributor = {
  id: string
  name: string
  department: string
  year: number
  skills: string[]
  experience: string
  reputationScore: number
  contributionCount: number
  acceptedAnswersCount: number
  rating: number
  isOnline: boolean
  lastSeen: string
  unreadNotifications: number
  liked: boolean
}

export function ContributorsPage() {
  const [sortBy, setSortBy] = useState<'reputation' | 'accepted' | 'contributions'>('reputation')
  const [year, setYear] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Contributor[]>([])
  
  const toggleLike = (userId: string) => {
    setItems(prevItems => 
      prevItems.map(user => 
        user.id === userId ? { ...user, liked: !user.liked } : user
      )
    )
  }
  
  const sendMessage = (userId: string) => {
    // In a real app, this would open a chat modal or navigate to a message page
    alert(`Opening message thread with user ${userId}`)
  }

  const params = useMemo(() => ({ sortBy, year: year || undefined }), [sortBy, year])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get<{ users: Contributor[] }>('/api/contributors', { params })
      .then((r) => {
        if (mounted) {
          // Add default values for new fields that might not be in the API response yet
          const enrichedUsers = r.data.users.map(user => ({
            ...user,
            rating: user.rating || Math.floor(Math.random() * 3) + 2, // Random rating between 2-5
            isOnline: user.isOnline !== undefined ? user.isOnline : Math.random() > 0.5, // Random online status
            lastSeen: user.lastSeen || `${Math.floor(Math.random() * 5) + 1}h ago`,
            unreadNotifications: user.unreadNotifications || Math.floor(Math.random() * 5),
            liked: user.liked || false
          }))
          setItems(enrichedUsers)
        }
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [params])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Top Contributors</h1>
            <p className="text-slate-600">Meet our community experts ranked by reputation and impact</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="reputation">Rank by Reputation</option>
              <option value="accepted">Rank by Accepted Answers</option>
              <option value="contributions">Rank by Contributions</option>
            </select>
            <select 
              value={year} 
              onChange={(e) => setYear(e.target.value)} 
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">Loading contributors...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No contributors found</h3>
          <p className="text-slate-600">There are no contributors matching your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {items.map((u) => (
            <div key={u.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-5 border-b border-slate-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      {u.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{u.name}</h3>
                        {u.isOnline ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            <span className="w-2 h-2 rounded-full bg-slate-500 mr-1"></span>
                            {u.lastSeen}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm">{u.department} · Year {u.year}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Like Button */}
                    <button 
                      onClick={() => toggleLike(u.id)}
                      className="p-2 rounded-full hover:bg-slate-200 transition-colors"
                    >
                      {u.liked ? (
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                    
                    {/* Notification Badge */}
                    {u.unreadNotifications > 0 && (
                      <div className="relative">
                        <button className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                        </button>
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                          {u.unreadNotifications}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-5">
                {/* Rating */}
                <div className="mb-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < Math.round(u.rating) ? 'text-amber-400' : 'text-slate-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461c.969 0 1.371-1.24.588-1.81l-1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-slate-600">Rating: {u.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <div className="text-lg font-bold text-indigo-600">{u.contributionCount}</div>
                    <div className="text-xs text-slate-500">Questions</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <div className="text-lg font-bold text-emerald-600">{u.acceptedAnswersCount}</div>
                    <div className="text-xs text-slate-500">Accepted</div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <div className="text-lg font-bold text-purple-600">{u.reputationScore}</div>
                    <div className="text-xs text-slate-500">Reputation</div>
                  </div>
                </div>
                
                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Skills</h4>
                  {u.skills?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {u.skills.slice(0, 6).map((s) => (
                        <span key={s} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No skills added yet</p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => sendMessage(u.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Direct Message
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

