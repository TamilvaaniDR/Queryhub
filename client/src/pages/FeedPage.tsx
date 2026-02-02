import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../app/api/http'
import { useAuth } from '../app/auth/AuthContext'

const categories = [
  { id: 'subjects', name: 'Subjects', icon: '📚', color: 'bg-blue-100 text-blue-800' },
  { id: 'placements', name: 'Placements', icon: '💼', color: 'bg-green-100 text-green-800' },
  { id: 'exams', name: 'Exams', icon: '📝', color: 'bg-purple-100 text-purple-800' },
  { id: 'labs', name: 'Labs', icon: '🔬', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'projects', name: 'Projects', icon: '🚀', color: 'bg-indigo-100 text-indigo-800' },
  { id: 'nss', name: 'NSS / Activities', icon: '🎯', color: 'bg-pink-100 text-pink-800' },
]

type FeedQuestion = {
  id: string
  title: string
  descriptionPreview: string
  category: string
  tags: string[]
  createdAt: string
  answersCount: number
  hasAcceptedAnswer: boolean
  likesCount: number
  author: { id: string; name: string; year: number } | null
}

export function FeedPage() {
  const [params] = useSearchParams()
  const category = params.get('category') ?? ''
  const [selectedCategory, setSelectedCategory] = useState(category)

  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<FeedQuestion[]>([])
  const [hashtags, setHashtags] = useState<string[]>([])
  
  // Extract hashtags from search query
  useEffect(() => {
    const extractedHashtags = (q.match(/#[\w]+/g) || []).map(tag => tag.substring(1))
    setHashtags(extractedHashtags)
  }, [q])
  
  const query = useMemo(() => ({ 
    q: q.replace(/#[\w]+/g, '').trim(), 
    category: selectedCategory,
    tags: hashtags.length > 0 ? hashtags : undefined
  }), [q, selectedCategory, hashtags])
  const { state, refreshMe } = useAuth()
  const me = state.status === 'authenticated' ? state.user : null
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api
      .get<{ questions: FeedQuestion[] }>('/api/questions', { params: query })
      .then((r) => {
        if (!mounted) return
        setItems(r.data.questions)
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [query])

  const joinCommunity = async () => {
    try {
      setJoining(true)
      await api.post('/api/membership/join')
      await refreshMe()
    } finally {
      setJoining(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Community Feed</h1>
            <p className="text-slate-600 mt-1">Ask questions, share knowledge, and grow your reputation</p>
          </div>
          <Link
            to="/ask"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            + Ask Question
          </Link>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search questions, use #hashtags for tags..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Hashtag Display */}
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-slate-600 font-medium">Searching tags:</span>
              {hashtags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  #{tag}
                  <button 
                    onClick={() => setQ(q.replace(`#${tag}`, '').replace(/\s+/g, ' ').trim())}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCategory === '' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Topics
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? `${cat.color.replace('100', '600').replace('800', '50')} shadow-md`
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Community Join Banner */}
      {me && !me.joinedCommunity && (
        <div className="rounded-2xl border border-dashed border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-5 shadow-sm flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-indigo-700">Join the Community</div>
              <div className="text-xs text-slate-600 mt-1">
                Welcome {me.name}! Confirm your membership to start asking questions and sharing knowledge.
              </div>
            </div>
          </div>
          <button
            disabled={joining}
            onClick={joinCommunity}
            className="mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60 md:mt-0"
          >
            {joining ? 'Joining…' : 'Join Community'}
          </button>
        </div>
      )}

      {/* Questions Feed */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">Loading questions...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No questions found</h3>
          <p className="text-slate-600 mb-4">
            {q || selectedCategory || hashtags.length > 0 
              ? 'Try adjusting your search or filters' 
              : 'Be the first to ask a question in this community!'}
          </p>
          <Link
            to="/ask"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ask Your First Question
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-slate-600 px-2">
            <span>{items.length} questions found</span>
            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <select className="rounded-lg border border-slate-200 px-2 py-1 text-xs">
                <option>Newest</option>
                <option>Most Answers</option>
                <option>Most Liked</option>
              </select>
            </div>
          </div>
          
          {items.map((x) => (
            <Link
              key={x.id}
              to={`/q/${x.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-200 group"
            >
              <div className="flex items-start gap-4">
                {/* Vote/Stats Section */}
                <div className="flex flex-col items-center gap-2 pt-1">
                  <div className="flex flex-col items-center text-slate-500">
                    <svg className="w-5 h-5 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-900">{x.likesCount || 0}</span>
                    <svg className="w-5 h-5 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-slate-900">{x.answersCount}</div>
                    <div className="text-xs text-slate-500">answers</div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 flex-1">
                      {x.title}
                    </h3>
                    {x.hasAcceptedAnswer && (
                      <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Accepted
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {x.descriptionPreview}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {x.tags.map((t) => (
                      <span 
                        key={t} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>
                        {x.author ? (
                          <span className="font-medium text-slate-700">{x.author.name}</span>
                        ) : 'Anonymous'}
                        {x.author && (
                          <span className="ml-1">· Year {x.author.year}</span>
                        )}
                      </span>
                      <span>·</span>
                      <span>{new Date(x.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <span>{categories.find(c => c.id === x.category.toLowerCase())?.icon || '📌'}</span>
                        {categories.find(c => c.id === x.category.toLowerCase())?.name || x.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

