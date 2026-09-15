'use client'
import { useState } from 'react'
import { ShieldCheck, Check, Upload, Building2, AlertTriangle, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { useDemo } from '@/store/ginger'
import { PageHeading, TextField, PendingButton, DemoNotice } from './shared'

export function PaymentVerificationView() {
  const state = useDemo()
  const [accountHolder, setAccountHolder] = useState('John Doe')
  const [upi, setUpi] = useState('john@ok')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate UPI ID
    if (!upi.includes('@')) {
      setError('Please enter a valid UPI handle')
      return
    }
    
    setError('')
    setPending(true)
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500))
    
    state.updateProfile({ destination: upi })
    setPending(false)
    toast.success('Payment settings updated successfully!')
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-xl rounded-3xl bg-white p-8 sm:p-12 shadow-sm border border-slate-100">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Payment Settings</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
              Configure your primary payout details below. These credentials are used for automatically processing brand sponsorships.
            </p>
          </div>

          <div className="flex flex-col gap-5 mt-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="holderName" className="text-xs font-bold text-slate-700">Account Holder Name</label>
              <input
                id="holderName"
                type="text"
                value={accountHolder}
                onChange={e => setAccountHolder(e.target.value)}
                placeholder="John Doe"
                className="h-12 rounded-xl border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="upiId" className="text-xs font-bold text-slate-700">UPI ID</label>
              <input
                id="upiId"
                type="text"
                value={upi}
                onChange={e => {
                  setUpi(e.target.value)
                  if (error) setError('')
                }}
                placeholder="e.g. name@bank"
                className={`h-12 rounded-xl border px-4 text-sm transition focus:outline-none focus:ring-1 ${
                  error 
                    ? 'border-red-300 bg-red-50/30 text-slate-900 focus:border-red-400 focus:ring-red-400' 
                    : 'border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:ring-sky-500'
                }`}
                required
              />
              {error && (
                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-red-500">
                  <AlertTriangle className="size-3.5" />
                  {error}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className={`mt-4 flex h-12 w-full items-center justify-center rounded-xl font-semibold text-white transition-all ${
              pending ? 'bg-sky-400' : 'bg-sky-600 hover:bg-sky-700'
            }`}
          >
            {pending ? (
              <>
                <svg className="mr-2 size-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
