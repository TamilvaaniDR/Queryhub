import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '../app/auth/AuthContext'
import { FormField } from '../components/FormField'

const schema = z.object({
  identifier: z.string().min(1, 'Email or Roll Number is required'),
  password: z.string().min(1, 'Password is required'),
})

type Values = z.infer<typeof schema>

export function LoginPage() {
  const { login } = useAuth()
  const nav = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values.identifier, values.password)
      nav('/community', { replace: true })
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Login failed'
      setError('root', { message: msg })
    }
  })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-slate-900">Log in</h1>
            <p className="mt-1 text-sm text-slate-500">Use your email or roll number and password.</p>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <FormField label="Email or Roll Number" error={errors.identifier?.message}>
              <input
                type="text"
                autoComplete="username"
                placeholder="e.g. you@college.edu or 22CS123"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                {...register('identifier')}
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message}>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                {...register('password')}
              />
            </FormField>

            {errors.root?.message && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            New here?{' '}
            <Link className="font-medium text-blue-600 hover:text-blue-700 hover:underline" to="/signup">
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-4 text-center">
          <Link className="text-sm text-slate-500 hover:text-slate-700" to="/">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}
