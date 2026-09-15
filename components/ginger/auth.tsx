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
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 sm:p-12 shadow-sm border border-slate-100">
        <div className="flex flex-col gap-1 mb-8">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-blue-600">
            <span>STEP {step} OF 3</span>
            <span className="text-slate-500">{Math.round((step/3)*100)}% Completed</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
             <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${(step/3)*100}%` }} />
          </div>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-8">
            <div>
               <h2 className="text-2xl font-bold text-slate-900">Welcome setup</h2>
               <p className="mt-2.5 text-sm leading-relaxed text-slate-500">Choose your profile type to begin. We will customize your dashboard, tools, and recommendations based on your choice.</p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole('Creator')}
                className={`flex flex-col items-start gap-5 rounded-2xl border p-6 text-left transition-all ${
                  role === 'Creator'
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className={`flex size-12 items-center justify-center rounded-xl shadow-sm ${role === 'Creator' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <User className="size-5" />
                </span>
                <div>
                  <strong className="block text-sm font-bold text-slate-900">I'm a Creator</strong>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">Monetize your content, collaborate with world-class brands, and track campaign performance.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('Brand')}
                className={`flex flex-col items-start gap-5 rounded-2xl border p-6 text-left transition-all ${
                  role === 'Brand'
                    ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className={`flex size-12 items-center justify-center rounded-xl shadow-sm ${role === 'Brand' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Briefcase className="size-5" />
                </span>
                <div>
                  <strong className="block text-sm font-bold text-slate-900">I'm a Brand</strong>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">Discover top tier creators, initiate partnership campaigns, and manage contract agreements.</p>
                </div>
              </button>
            </div>
            <Button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white h-12 rounded-xl font-semibold" onClick={() => setStep(2)}>
              Next step <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
               <h2 className="text-2xl font-bold text-slate-900">Set your handle & identity</h2>
               <p className="mt-2 text-sm text-slate-500">Pick a unique handle that brands can use to find you.</p>
            </div>
            <FieldGroup>
              <TextField
                label="Social handle"
                value={handle}
                onChange={setHandle}
                placeholder="@yourhandle"
                required
              />
            </FieldGroup>
            <div className="flex gap-3 mt-2">
              <Button variant="outline" className="h-12 rounded-xl px-6" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1 bg-[#2563eb] hover:bg-blue-700 text-white h-12 rounded-xl font-semibold" onClick={() => setStep(3)}>
                Next step <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
               <h2 className="text-2xl font-bold text-slate-900">Pick your primary niche</h2>
               <p className="mt-2 text-sm text-slate-500">Select the category that best fits your content style.</p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {['Beauty & skincare', 'Tech & gadgets', 'Lifestyle', 'Food & drinks', 'Fitness', 'Travel', 'Fashion', 'Gaming'].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNiche(n)}
                  className={`rounded-full border px-5 py-2.5 text-xs font-semibold transition ${
                    niche === n ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="h-12 rounded-xl px-6" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1 bg-[#2563eb] hover:bg-blue-700 text-white h-12 rounded-xl font-semibold" onClick={handleComplete} disabled={pending}>
                Complete setup <Check className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
