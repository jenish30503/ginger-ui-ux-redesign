'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Check, Sparkles, User, Briefcase, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/ui/field'
import { useDemo } from '@/store/ginger'
import { PageHeading, TextField, PendingButton, DemoNotice } from './shared'

export function LoginView() {
  const router = useRouter()
  const signIn = useDemo(s => s.signIn)
  const [email, setEmail] = useState('creator@demo.ginger.app')
  const [role, setRole] = useState<'Creator' | 'Brand'>('Creator')
  const [pending, setPending] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    await new Promise(r => setTimeout(r, 400))
    signIn(email, role)
    setPending(false)
    toast.success(`Signed in as ${role} demo account`)
    router.push(role === 'Brand' ? '/manage-campaigns' : '/campaigns')
  }

  const handleGoogleSimulated = async () => {
    setPending(true)
    await new Promise(r => setTimeout(r, 500))
    signIn('google.demo@ginger.app', role)
    setPending(false)
    toast.success('Simulated Google Sign-in successful')
    router.push('/onboarding')
  }

  return (
    <div className="container-main max-w-md py-12">
      <div className="panel panel-pad flex flex-col gap-6">
        <div className="text-center">
          <p className="eyebrow mb-2">DEMO SIGN IN</p>
          <h1 className="text-2xl font-bold tracking-tight">Welcome to GINGER</h1>
          <p className="muted mt-2 text-xs">Enter a demo email or use simulated Google sign-in to explore.</p>
        </div>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <FieldGroup>
            <TextField
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              required
            />
          </FieldGroup>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Select demo role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('Creator')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                  role === 'Creator'
                    ? 'border-primary bg-secondary text-primary'
                    : 'border-border bg-white text-muted-foreground hover:border-foreground/20'
                }`}
              >
                <User className="size-4" /> Creator
              </button>
              <button
                type="button"
                onClick={() => setRole('Brand')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                  role === 'Brand'
                    ? 'border-primary bg-secondary text-primary'
                    : 'border-border bg-white text-muted-foreground hover:border-foreground/20'
                }`}
              >
                <Briefcase className="size-4" /> Brand
              </button>
            </div>
          </div>

          <PendingButton pending={pending}>Continue with email</PendingButton>

          <div className="relative my-2 text-center text-xs text-muted-foreground">
            <span className="bg-white px-2">OR</span>
            <div className="absolute inset-x-0 top-1/2 -z-10 border-t" />
          </div>

          <Button type="button" variant="outline" onClick={handleGoogleSimulated} disabled={pending}>
            <svg className="mr-2 size-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Simulate Google Sign-in
          </Button>
        </form>

        <DemoNotice>This is a simulated authentication screen for prototyping. No password or real account required.</DemoNotice>
      </div>
    </div>
  )
}

export function OnboardingView() {
  const router = useRouter()
  const state = useDemo()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(state.profile.role || 'Creator')
  const [handle, setHandle] = useState(state.profile.handle || '@alex.creates')
  const [niche, setNiche] = useState(state.profile.niche || 'Lifestyle')
  const [pending, setPending] = useState(false)

  const handleComplete = async () => {
    setPending(true)
    await new Promise(r => setTimeout(r, 400))
    state.completeOnboarding({ role, handle, niche })
    setPending(false)
    toast.success('Onboarding complete! Welcome to GINGER.')
    router.push('/campaigns')
  }

  return (
    <div className="container-main max-w-xl py-12">
      <div className="panel panel-pad flex flex-col gap-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <p className="eyebrow">STEP {step} OF 3</p>
            <h1 className="text-xl font-bold">Welcome setup</h1>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map(s => (
              <span
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step ? 'w-6 bg-primary' : s < step ? 'w-2 bg-success' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-base font-semibold">How do you plan to use GINGER?</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole('Creator')}
                className={`flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition ${
                  role === 'Creator'
                    ? 'border-primary bg-secondary text-primary'
                    : 'border-border bg-white text-foreground hover:border-foreground/20'
                }`}
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  <User className="size-5 text-primary" />
                </span>
                <div>
                  <strong className="block text-sm font-semibold">I&apos;m a Creator</strong>
                  <p className="mt-1 text-xs muted">I want to create short videos for brands and earn payouts.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('Brand')}
                className={`flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition ${
                  role === 'Brand'
                    ? 'border-primary bg-secondary text-primary'
                    : 'border-border bg-white text-foreground hover:border-foreground/20'
                }`}
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Briefcase className="size-5 text-primary" />
                </span>
                <div>
                  <strong className="block text-sm font-semibold">I&apos;m a Brand</strong>
                  <p className="mt-1 text-xs muted">I want to launch video campaigns and engage top creators.</p>
                </div>
              </button>
            </div>
            <Button className="mt-2" onClick={() => setStep(2)}>
              Next step <ArrowRight className="size-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-base font-semibold">Set your handle & identity</h2>
            <FieldGroup>
              <TextField
                label="Social handle"
                value={handle}
                onChange={setHandle}
                placeholder="@yourhandle"
                required
              />
            </FieldGroup>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                Next step <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-base font-semibold">Pick your primary niche</h2>
            <div className="flex flex-wrap gap-2">
              {['Beauty & skincare', 'Tech & gadgets', 'Lifestyle', 'Food & drinks', 'Fitness', 'Travel', 'Fashion', 'Gaming'].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNiche(n)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                    niche === n ? 'border-primary bg-primary text-white' : 'border-border bg-white hover:bg-muted'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleComplete} disabled={pending}>
                Complete setup <Check className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
