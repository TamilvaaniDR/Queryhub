import mongoose from 'mongoose'
import { Router } from 'express'
import { z } from 'zod'
import { authRequired, type AuthedRequest } from '../middleware/authRequired'
import { User } from '../models/User'
import { Question } from '../models/Question'
import { Answer } from '../models/Answer'

const router = Router()

const ONLINE_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

function formatLastSeen(lastActiveAt: Date | null | undefined): string {
  if (!lastActiveAt) return 'Not seen recently'
  const ms = Date.now() - new Date(lastActiveAt).getTime()
  if (ms < 60_000) return 'Just now'
  if (ms < 3600_000) return `${Math.floor(ms / 60_000)}m ago`
  if (ms < 86400_000) return `${Math.floor(ms / 3600_000)}h ago`
  return `${Math.floor(ms / 86400_000)}d ago`
}

router.get('/', authRequired, async (req: AuthedRequest, res, next) => {
  try {
    const sortBy = z.enum(['reputation', 'accepted', 'contributions']).catch('reputation').parse(req.query.sortBy)
    const year = typeof req.query.year === 'string' ? Number(req.query.year) : undefined
    const skills = typeof req.query.skills === 'string' ? req.query.skills.split(',').map(s => s.trim()).filter(Boolean) : undefined

    const filter: Record<string, unknown> = {}
    if (year && [1, 2, 3, 4].includes(year)) filter.year = year

    if (skills && skills.length > 0) {
      filter.skills = { $in: skills }
    }

    const sort =
      sortBy === 'accepted'
        ? ({ acceptedAnswersCount: -1, reputationScore: -1 } as Record<string, 1 | -1>)
        : sortBy === 'contributions'
          ? ({ contributionCount: -1, reputationScore: -1 } as Record<string, 1 | -1>)
          : ({ reputationScore: -1, acceptedAnswersCount: -1 } as Record<string, 1 | -1>)

    const users = await User.find(filter).sort(sort).limit(50).select('name department year skills experience reputationScore contributionCount acceptedAnswersCount lastActiveAt').lean()

    // Count how many of the logged-in user's questions each contributor has answered
    const myQuestionIds = await Question.find({ authorId: new mongoose.Types.ObjectId(req.userId) }).select('_id').lean()
    const myQuestionIdSet = myQuestionIds.map((q) => q._id)
    const answersToMyQuestions = await Answer.find({ questionId: { $in: myQuestionIdSet } })
      .select('authorId')
      .lean()

    const answeredMyQuestionsByAuthor = new Map<string, number>()
    for (const a of answersToMyQuestions) {
      const id = a.authorId.toString()
      answeredMyQuestionsByAuthor.set(id, (answeredMyQuestionsByAuthor.get(id) ?? 0) + 1)
    }

    const now = Date.now()
    return res.json({
      users: users.map((u) => {
        const lastActiveAt = u.lastActiveAt ? new Date(u.lastActiveAt).getTime() : 0
        const isOnline = lastActiveAt > 0 && now - lastActiveAt < ONLINE_WINDOW_MS
        return {
          id: u._id.toString(),
          name: u.name,
          department: u.department,
          year: u.year,
          skills: u.skills,
          experience: u.experience,
          reputationScore: u.reputationScore,
          contributionCount: u.contributionCount,
          acceptedAnswersCount: u.acceptedAnswersCount,
          answeredMyQuestionsCount: answeredMyQuestionsByAuthor.get(u._id.toString()) ?? 0,
          isOnline,
          lastSeen: formatLastSeen(u.lastActiveAt ?? null),
        }
      }),
    })
  } catch (err) {
    return next(err)
  }
})

export default router

