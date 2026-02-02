import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  const loc = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values.identifier, values.password)
      // Always redirect to community after login
      nav('/community', { replace: true })
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? 'Login failed'
      setError('root', { message: msg })
    }
  })

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <div className="text-xl font-semibold tracking-tight">Welcome back</div>
          <div className="text-sm text-slate-600">Log in to access the community.</div>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <FormField label="Email or Roll Number" error={errors.identifier?.message}>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-300"
              placeholder="example@college.edu or 22CS123"
              {...register('identifier')}
            />
          </FormField>

          <FormField label="Password" error={errors.password?.message}>
            <input
              type="password"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-300"
              {...register('password')}
            />
          </FormField>

          {errors.root?.message && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errors.root.message}
            </div>
          )}

          <button
            disabled={isSubmitting}
            className="w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isSubmitting ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600">
          New here?{' '}
          <Link className="font-semibold text-blue-700 hover:underline" to="/signup">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}

