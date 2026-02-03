import { Router } from 'express'
import mongoose from 'mongoose'
import { z } from 'zod'
import { authRequired, type AuthedRequest } from '../middleware/authRequired'
import { Question } from '../models/Question'
import { Answer } from '../models/Answer'
import { Tag } from '../models/Tag'
import { User } from '../models/User'
import { AnswerLike } from '../models/AnswerLike'
import { HttpError } from '../utils/httpError'

const router = Router()

const categoryEnum = z.enum(['Subjects', 'Placements', 'Exams', 'Labs', 'Projects', 'NSS / Activities'])

const askSchema = z.object({
  title: z.string().trim().min(10).max(160),
  description: z.string().trim().min(30).max(20000),
  category: categoryEnum,
  tags: z.array(z.string().trim().min(2).max(24)).max(8).default([]),
})

router.get('/', authRequired, async (req, res, next) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
    const category = typeof req.query.category === 'string' ? req.query.category : undefined
    const unanswered = req.query.unanswered === 'true'

    const filter: Record<string, unknown> = {}
    if (category && categoryEnum.safeParse(category).success) filter.category = category
    if (q) filter.$text = { $search: q }
    if (unanswered) filter.answersCount = 0

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    const authorIds = [...new Set(questions.map((x) => x.authorId.toString()))]
    const authors = await User.find({ _id: { $in: authorIds } }).select('name year').lean()
    const authorMap = new Map(authors.map((a) => [a._id.toString(), a]))

    return res.json({
      questions: questions.map((qq) => ({
        id: qq._id.toString(),
        title: qq.title,
        descriptionPreview: qq.description.slice(0, 160),
        category: qq.category,
        tags: qq.tags,
        createdAt: qq.createdAt,
        answersCount: qq.answersCount,
        hasAcceptedAnswer: Boolean(qq.acceptedAnswerId),
        likesCount: qq.likesCount,
        author: (() => {
          const a = authorMap.get(qq.authorId.toString())
          return a ? { id: a._id.toString(), name: a.name, year: a.year } : null
        })(),
      })),
    })
  } catch (err) {
    return next(err)
  }
})

router.post('/', authRequired, async (req: AuthedRequest, res, next) => {
  try {
    const data = askSchema.parse(req.body)
    const tags = [...new Set(data.tags.map((t) => t.toLowerCase()))]

    const user = await User.findById(req.userId)
    if (!user?.joinedCommunity) throw new HttpError(403, 'Join the community before posting')

    const question = await Question.create({
      title: data.title,
      description: data.description,
      category: data.category,
      tags,
      authorId: new mongoose.Types.ObjectId(req.userId),
    })

    if (tags.length) {
      await Promise.all(
        tags.map((t) =>
          Tag.updateOne({ name: t }, { $inc: { usageCount: 1 } }, { upsert: true }).exec(),
        ),
      )
    }

    // Contribution count is for answers only; reputation still rewards asking
    await User.findByIdAndUpdate(req.userId, { $inc: { reputationScore: 2 } })

    return res.status(201).json({ id: question._id.toString() })
  } catch (err) {
    return next(err)
  }
})

router.get('/:id', authRequired, async (req, res, next) => {
  try {
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'Invalid question id')

    const question = await Question.findById(id).lean()
    if (!question) throw new HttpError(404, 'Question not found')

    const author = await User.findById(question.authorId).select('name year').lean()
    const answers = await Answer.find({ questionId: question._id })
      .sort({ isAccepted: -1, createdAt: 1 })
      .lean()

    const answerAuthorIds = [...new Set(answers.map((a) => a.authorId.toString()))]
    const answerAuthors = await User.find({ _id: { $in: answerAuthorIds } }).select('name year reputationScore').lean()
    const answerAuthorMap = new Map(answerAuthors.map((a) => [a._id.toString(), a]))

    return res.json({
      question: {
        id: question._id.toString(),
        title: question.title,
        description: question.description,
        category: question.category,
        tags: question.tags,
        createdAt: question.createdAt,
        answersCount: question.answersCount,
        hasAcceptedAnswer: Boolean(question.acceptedAnswerId),
        likesCount: question.likesCount,
        author: author ? { id: author._id.toString(), name: author.name, year: author.year } : null,
      },
      answers: answers.map((a) => {
        const u = answerAuthorMap.get(a.authorId.toString())
        return {
          id: a._id.toString(),
          body: a.body,
          isAccepted: a.isAccepted,
          likesCount: a.likesCount,
          createdAt: a.createdAt,
          author: u ? { id: u._id.toString(), name: u.name, year: u.year, reputationScore: u.reputationScore } : null,
        }
      }),
    })
  } catch (err) {
    return next(err)
  }
})

const answerSchema = z.object({ body: z.string().trim().min(10).max(20000) })

router.post('/:id/answers', authRequired, async (req: AuthedRequest, res, next) => {
  try {
    const questionId = req.params.id
    if (!mongoose.isValidObjectId(questionId)) throw new HttpError(400, 'Invalid question id')
    const data = answerSchema.parse(req.body)

    const q = await Question.findById(questionId)
    if (!q) throw new HttpError(404, 'Question not found')

    const user = await User.findById(req.userId)
    if (!user?.joinedCommunity) throw new HttpError(403, 'Join the community before answering')

    const created = await Answer.create({
      questionId: q._id,
      authorId: new mongoose.Types.ObjectId(req.userId),
      body: data.body,
    })

    await Question.updateOne({ _id: q._id }, { $inc: { answersCount: 1 } })
    await User.updateOne({ _id: req.userId }, { $inc: { contributionCount: 1, reputationScore: 5 } })

    return res.status(201).json({ id: created._id.toString() })
  } catch (err) {
    return next(err)
  }
})

router.post('/:questionId/answers/:answerId/accept', authRequired, async (req: AuthedRequest, res, next) => {
  try {
    const { questionId, answerId } = req.params
    if (!mongoose.isValidObjectId(questionId) || !mongoose.isValidObjectId(answerId)) throw new HttpError(400, 'Invalid id')

    const q = await Question.findById(questionId)
    if (!q) throw new HttpError(404, 'Question not found')
    if (q.authorId.toString() !== req.userId) throw new HttpError(403, 'Only the question owner can accept an answer')

    const a = await Answer.findById(answerId)
    if (!a || a.questionId.toString() !== questionId) throw new HttpError(404, 'Answer not found')

    if (q.acceptedAnswerId?.toString() === answerId) return res.json({ ok: true })

    // unaccept old accepted answer if exists
    if (q.acceptedAnswerId) {
      const old = await Answer.findById(q.acceptedAnswerId)
      if (old) {
        old.isAccepted = false
        await old.save()
        await User.updateOne({ _id: old.authorId }, { $inc: { reputationScore: -15, acceptedAnswersCount: -1 } })
      }
    }

    a.isAccepted = true
    await a.save()

    q.acceptedAnswerId = a._id
    await q.save()

    await User.updateOne({ _id: a.authorId }, { $inc: { reputationScore: 15, acceptedAnswersCount: 1 } })

    return res.json({ ok: true })
  } catch (err) {
    return next(err)
  }
})

router.post('/:questionId/answers/:answerId/like', authRequired, async (req: AuthedRequest, res, next) => {
  try {
    const { questionId, answerId } = req.params
    if (!mongoose.isValidObjectId(questionId) || !mongoose.isValidObjectId(answerId)) throw new HttpError(400, 'Invalid id')

    const a = await Answer.findById(answerId)
    if (!a || a.questionId.toString() !== questionId) throw new HttpError(404, 'Answer not found')

    const user = await User.findById(req.userId)
    if (!user?.joinedCommunity) throw new HttpError(403, 'Join the community before liking answers')

    // toggle like
    const existing = await AnswerLike.findOne({ answerId: a._id, userId: new mongoose.Types.ObjectId(req.userId) })
    if (existing) {
      await AnswerLike.deleteOne({ _id: existing._id })
      await Answer.updateOne({ _id: a._id }, { $inc: { likesCount: -1 } })
      await User.updateOne({ _id: a.authorId }, { $inc: { reputationScore: -2 } })
      return res.json({ ok: true })
    }

    await AnswerLike.create({ answerId: a._id, userId: new mongoose.Types.ObjectId(req.userId) })
    await Answer.updateOne({ _id: a._id }, { $inc: { likesCount: 1 } })
    await User.updateOne({ _id: a.authorId }, { $inc: { reputationScore: 2 } })

    return res.json({ ok: true })
  } catch (err) {
    return next(err)
  }
})

export default router

