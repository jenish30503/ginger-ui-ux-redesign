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
  const [accountHolder, setAccountHolder] = useState('Alex Morgan')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifsc, setIfsc] = useState('')
  const [upi, setUpi] = useState('alex@demoupi')
  const [branchLookup, setBranchLookup] = useState<string | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState('')
  const [pending, setPending] = useState(false)

  const handleIfscChange = (val: string) => {
    const uppercase = val.toUpperCase()
    setIfsc(uppercase)
    if (uppercase.length === 11) {
      setBranchLookup('HDFC Bank Ltd · Bandra West Branch, Mumbai')
    } else {
      setBranchLookup(null)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError('')
    if (!file) return

    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setFileError('File must be JPG, PNG, or PDF.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size must be under 5MB.')
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setFilePreview(previewUrl)
    toast.success('Temporary ID document loaded in memory')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    await new Promise(r => setTimeout(r, 400))
    
    // Mask sensitive details before saving to demo store
    const masked = accountNumber.length >= 4 
      ? `Demo Bank •••• ${accountNumber.slice(-4)}`
      : upi || 'Verified Demo Payout Destination'
      
    state.updateProfile({ destination: masked })
    setPending(false)
    toast.success('Payout destination verified and updated!')
  }

  return (
    <>
      <PageHeading
        eyebrow="VERIFICATION & PAYOUTS"
        title="Payment Destinations"
        description="Verify your bank details or UPI ID for milestone payouts."
      />

      <div className="two-col">
        <form onSubmit={handleSubmit} className="panel panel-pad flex flex-col gap-6">
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 flex gap-3 text-xs text-foreground">
            <AlertTriangle className="size-5 shrink-0 text-warning mt-0.5" />
            <div>
              <strong className="font-semibold block">Demo Security Warning</strong>
              <p className="mt-1 muted">
                Please enter fictional demo information only. Do not input real bank account numbers, PAN, or real identity documents.
              </p>
            </div>
          </div>

          <FieldGroup>
            <TextField
              label="Account Holder Name"
              value={accountHolder}
              onChange={setAccountHolder}
              placeholder="Full name as on bank record"
              required
            />
            <TextField
              label="Bank Account Number (Fictional)"
              type="password"
              value={accountNumber}
              onChange={setAccountNumber}
              placeholder="e.g. 987654321012"
              required
            />
            <TextField
              label="IFSC Code (11 characters)"
              value={ifsc}
              onChange={handleIfscChange}
              placeholder="e.g. HDFC0001234"
              maxLength={11}
              required
            />
            {branchLookup && (
              <div className="rounded-lg bg-secondary p-3 text-xs flex items-center gap-2 text-primary font-medium">
                <Building2 className="size-4" /> {branchLookup}
              </div>
            )}
            <TextField
              label="UPI ID (Optional)"
              value={upi}
              onChange={setUpi}
              placeholder="e.g. name@upi"
            />
          </FieldGroup>

          <div className="border-t pt-5">
            <label className="text-xs font-semibold block mb-2">Simulated ID Verification Document</label>
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition">
              <input
                type="file"
                id="id-upload"
                onChange={handleFileUpload}
                accept="image/jpeg,image/png,application/pdf"
                className="hidden"
              />
              <label htmlFor="id-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="size-6 text-muted-foreground" />
                <span className="text-xs font-semibold text-primary">Click to select demo ID image</span>
                <span className="text-[10px] muted">Supports JPG, PNG, PDF up to 5MB</span>
              </label>
            </div>
            {fileError && <p className="text-xs text-destructive mt-2">{fileError}</p>}
            {filePreview && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border p-2 bg-slate-50">
                <span className="text-xs font-medium text-success flex items-center gap-1">
                  <Check className="size-4" /> ID document loaded (temporary memory)
                </span>
              </div>
            )}
          </div>

          <PendingButton pending={pending}>Verify & Save Destination</PendingButton>
        </form>

        <aside className="panel panel-pad flex flex-col gap-5">
          <h3 className="text-sm font-semibold border-b pb-3">Active Destination</h3>
          <div className="rounded-xl border bg-background p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-success">
              <ShieldCheck className="size-4" /> Current Verified Account
            </div>
            <p className="mt-2 text-sm font-semibold">{state.profile.destination || 'No destination set'}</p>
            <p className="mt-1 text-[10px] muted">Milestone earnings are credited directly to this demo destination.</p>
          </div>

          <div className="flex gap-2 text-[10px] leading-relaxed muted">
            <Lock className="size-4 shrink-0 text-primary mt-0.5" />
            Raw bank details and uploaded file objects are never persisted or uploaded to any server.
          </div>
          <DemoNotice message="Only masked demo status is stored in browser state." />
        </aside>
      </div>
    </>
  )
}
