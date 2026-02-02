import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../app/api/http'
import { useAuth } from '../app/auth/AuthContext'

type Conversation = {
  id: string
  name: string
  department: string
  year: number
  skills: string[]
  unreadCount: number
  lastMessage: {
    content: string
    createdAt: string
  } | null
}

export function MessagesListPage() {
  const { state } = useAuth()
  const user = state.status === 'authenticated' ? state.user : null
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchConversations = async () => {
      try {
        setLoading(true)
        const response = await api.get('/api/messages/conversations')
        setConversations(response.data.conversations)
      } catch (error) {
        console.error('Error fetching conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600">Your conversations with community members</p>
        </div>
      </div>

      {/* Conversations List */}
      <div className="space-y-4">
        {conversations.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No conversations yet</h3>
            <p className="text-slate-600 mb-4">
              Start a conversation by messaging contributors from the contributors page.
            </p>
            <Link
              to="/contributors"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a1 1 0 001-1V9a1 1 0 00-1-1h-4a1 1 0 00-1 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Browse Contributors
            </Link>
          </div>
        ) : (
          conversations.map((conversation) => (
            <Link
              key={conversation.id}
              to={`/messages/${conversation.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {conversation.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">{conversation.name}</h3>
                    {conversation.lastMessage && (
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-2">
                    {conversation.department} · Year {conversation.year}
                  </p>
                  
                  {conversation.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {conversation.skills.slice(0, 3).map((skill) => (
                        <span 
                          key={skill} 
                          className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {conversation.skills.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                          +{conversation.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {conversation.lastMessage ? (
                    <p className="text-sm text-slate-700 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500 italic">
                      No messages yet
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}