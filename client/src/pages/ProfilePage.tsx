import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { api } from '../app/api/http'
import { useAuth } from '../app/auth/AuthContext'
import { FormField } from '../components/FormField'

const schema = z.object({
  skillsInput: z.string().optional(),
  experience: z.string().max(2000, 'Keep it under 2000 characters'),
  githubUrl: z.string().url('Enter a valid URL').max(200).or(z.literal('')).optional(),
  linkedinUrl: z.string().url('Enter a valid URL').max(200).or(z.literal('')).optional(),
})

type Values = z.infer<typeof schema>

export function ProfilePage() {
  const { state, refreshMe } = useAuth()
  const me = state.status === 'authenticated' ? state.user : null

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      skillsInput: me?.skills.join(', ') ?? '',
      experience: me?.experience ?? '',
      githubUrl: me?.githubUrl ?? '',
      linkedinUrl: me?.linkedinUrl ?? '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const skills =
        values.skillsInput
          ?.split(',')
          .map((s) => s.trim())
          .filter(Boolean) ?? []

      await api.patch('/api/profile/me', {
        skills,
        experience: values.experience,
        githubUrl: values.githubUrl,
        linkedinUrl: values.linkedinUrl,
      })
      await refreshMe()
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Failed to update profile'
      setError('root', { message: msg })
    }
  })

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">My Profile</h1>
            <p className="text-slate-600">
              Update your skills and experience to appear as a stronger mentor on the Top Contributors page.
            </p>
          </div>
          {me && (
            <div className="bg-white rounded-xl px-4 py-3 text-sm shadow-sm">
              <div className="font-semibold text-slate-900">{me.name}</div>
              <div>
                {me.department} · Year {me.year}
              </div>
              <div>Rep {me.reputationScore}</div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form className="space-y-6" onSubmit={onSubmit}>
          <FormField label="Skills (comma separated)" error={errors.skillsInput?.message}>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="react, mongodb, data structures"
              {...register('skillsInput')}
            />
          </FormField>

          <FormField label="Experience / About you" error={errors.experience?.message}>
            <textarea
              rows={6}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Share what you've worked on, subjects you're confident in, or how you like to help others."
              {...register('experience')}
            />
          </FormField>

          <FormField label="GitHub URL" error={errors.githubUrl?.message}>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://github.com/username"
              {...register('githubUrl')}
            />
          </FormField>

          <FormField label="LinkedIn URL" error={errors.linkedinUrl?.message}>
            <input
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://www.linkedin.com/in/username"
              {...register('linkedinUrl')}
            />
          </FormField>

          {errors.root?.message && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.root.message}
            </div>
          )}

          <div className="pt-4">
            <button
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {me && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-lg font-semibold text-slate-900 mb-4">Account Overview</div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4 border border-indigo-100">
              <div className="text-indigo-600 font-medium mb-1">Reputation</div>
              <div className="text-2xl font-bold text-slate-900">{me.reputationScore}</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4 border border-blue-100">
              <div className="text-blue-600 font-medium mb-1">Contributions</div>
              <div className="text-2xl font-bold text-slate-900">{me.contributionCount}</div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 p-4 border border-emerald-100">
              <div className="text-emerald-600 font-medium mb-1">Accepted Answers</div>
              <div className="text-2xl font-bold text-slate-900">{me.acceptedAnswersCount}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

