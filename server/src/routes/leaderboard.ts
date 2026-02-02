import { Router } from 'express'
import { authRequired } from '../middleware/authRequired'
import { Answer } from '../models/Answer'
import { User } from '../models/User'

const router = Router()

router.get('/', authRequired, async (_req, res, next) => {
  try {
    // Total likes received per user (sum of Answer.likesCount by authorId)
    const likesByAuthor = await Answer.aggregate<{ _id: unknown; totalLikes: number }>([
      { $group: { _id: '$authorId', totalLikes: { $sum: '$likesCount' } } },
    ])

    const likesMap = new Map<string, number>()
    for (const row of likesByAuthor) {
      likesMap.set(String(row._id), row.totalLikes)
    }

    const users = await User.find()
      .select('name department year contributionCount')
      .lean()

    type LeaderboardEntry = {
      rank: number
      id: string
      name: string
      department: string
      year: number
      contributionCount: number
      likesReceived: number
    }

    const entries: LeaderboardEntry[] = users.map((u) => ({
      rank: 0,
      id: u._id.toString(),
      name: u.name,
      department: u.department,
      year: u.year,
      contributionCount: u.contributionCount,
      likesReceived: likesMap.get(u._id.toString()) ?? 0,
    }))

    // Sort by likes (desc), then contribution (desc) — top to low
    entries.sort((a, b) => {
      if (b.likesReceived !== a.likesReceived) return b.likesReceived - a.likesReceived
      return b.contributionCount - a.contributionCount
    })

    entries.forEach((e, i) => {
      e.rank = i + 1
    })

    return res.json({ entries })
  } catch (err) {
    return next(err)
  }
})

export default router
