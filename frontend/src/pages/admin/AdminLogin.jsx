import { useId, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { loginRequest } from '@/api/client'
import { TextLink } from '@/components/ui/TextLink'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'

export function AdminLogin() {
  const id = useId()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionExpired = searchParams.get('session') === 'expired'
  const setAuth = useAuthStore((s) => s.setAuth)
  const [email, setEmail] = useState('admin@blivrmvmt.local')
  const [password, setPassword] = useState('password')
  const [err, setErr] = useState(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setErr(null)
    setPending(true)
    try {
      const res = await loginRequest(email, password)
      setAuth(res.token, res.user)
      navigate('/admin', { replace: true })
    } catch (ex) {
      setErr(
        ex.response?.data?.message || ex.message || 'Login failed',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <TextLink
          to="/"
          className="font-display text-lg no-underline hover:underline"
        >
          ← BLiVR
        </TextLink>
        <ThemeToggle />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-20">
        <Card className="w-full max-w-md overflow-hidden p-0">
          <CardHeader className="pb-2">
            <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 dark:text-zinc-50">
              Admin
            </h1>
            <p className="text-sm font-normal text-slate-500 dark:text-zinc-400">
              Sign in to edit homepage content.
            </p>
          </CardHeader>
          <CardContent>
            {sessionExpired && !err && (
              <Alert variant="error" className="mb-4" role="alert">
                Your session expired. Please sign in again.
              </Alert>
            )}
            {err && (
              <Alert variant="error" className="mb-4" role="alert">
                {err}
              </Alert>
            )}
            <form onSubmit={onSubmit} className="space-y-4">
              <TextField
                id={`${id}-email`}
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <TextField
                id={`${id}-pass`}
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={pending}
              >
                {pending ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
