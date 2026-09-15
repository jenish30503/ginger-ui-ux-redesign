'use client'
import { useState } from 'react'
import { ShieldAlert, CheckCircle, Wallet, Flag, Sparkles, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDemo } from '@/store/ginger'
import { money } from '@/lib/ginger-data'
import { PageHeading, DemoNotice } from './shared'

export function AdminView() {
  const state = useDemo()
  const [bannerInput, setBannerInput] = useState(state.banners[0] || '')

  const pendingWithdrawals = state.transactions.filter(
    t => t.type === 'Withdrawals' && t.status === 'Pending'
  )
  const flaggedSubmissions = state.submissions.filter(s => s.flagged)

  const handleApproveAllWithdrawals = () => {
    const ids = pendingWithdrawals.map(t => t.id)
    if (!ids.length) return
    state.approveWithdrawals(ids)
    toast.success(`Approved ${ids.length} pending withdrawals`)
  }

  const handleClearAllFlags = () => {
    const ids = flaggedSubmissions.map(s => s.id)
    if (!ids.length) return
    state.moderate(ids)
    toast.success(`Unflagged ${ids.length} submissions`)
  }

  const handleUpdateBanners = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bannerInput.trim()) return
    state.setBanners([bannerInput.trim()])
    toast.success('Announcement banner updated')
  }

  return (
    <>
      <PageHeading
        eyebrow="DEMO SYSTEM CONTROL"
        title="Demo Administration"
        description="Simulated platform stats, batch moderation, and withdrawal approvals."
      />

      <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 mb-6 flex gap-3 text-xs">
        <ShieldAlert className="size-5 text-warning shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block">Public Demo Administration</strong>
          <p className="muted mt-0.5">
            This dashboard is an unauthenticated simulation intended for testing prototype behaviors and demo state manipulation.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="panel p-5">
          <p className="text-xs muted mb-1">Total Demo Wallet Pools</p>
          <p className="text-2xl font-bold tracking-tight text-primary">{money(state.balance + state.escrow)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs muted mb-1">Active Campaigns</p>
          <p className="text-2xl font-bold tracking-tight">{state.campaigns.length}</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs muted mb-1">Pending Withdrawals</p>
          <p className="text-2xl font-bold tracking-tight text-warning">{pendingWithdrawals.length}</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs muted mb-1">Flagged Submissions</p>
          <p className="text-2xl font-bold tracking-tight text-destructive">{flaggedSubmissions.length}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Withdrawals Batch Action */}
        <div className="panel panel-pad flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Wallet className="size-4 text-primary" /> Pending Withdrawals
            </h2>
            <Button
              size="sm"
              disabled={!pendingWithdrawals.length}
              onClick={handleApproveAllWithdrawals}
            >
              Approve All ({pendingWithdrawals.length})
            </Button>
          </div>

          <div className="divide-y text-xs">
            {pendingWithdrawals.map(t => (
              <div key={t.id} className="py-3 flex justify-between items-center">
                <div>
                  <strong className="block font-semibold">{t.title}</strong>
                  <span className="muted">{t.date}</span>
                </div>
                <span className="font-bold text-foreground">{money(t.amount)}</span>
              </div>
            ))}
            {!pendingWithdrawals.length && (
              <p className="py-4 text-center muted">No pending withdrawal requests.</p>
            )}
          </div>
        </div>

        {/* Flagged Submissions Moderation */}
        <div className="panel panel-pad flex flex-col gap-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Flag className="size-4 text-destructive" /> Flagged Submissions
            </h2>
            <Button
              variant="outline"
              size="sm"
              disabled={!flaggedSubmissions.length}
              onClick={handleClearAllFlags}
            >
              Unflag All ({flaggedSubmissions.length})
            </Button>
          </div>

          <div className="divide-y text-xs">
            {flaggedSubmissions.map(s => (
              <div key={s.id} className="py-3 flex justify-between items-center">
                <div>
                  <strong className="block font-semibold">{s.platform} Video #{s.videoId}</strong>
                  <span className="muted">{s.views.toLocaleString()} views</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => state.moderate([s.id])}>
                  Unflag
                </Button>
              </div>
            ))}
            {!flaggedSubmissions.length && (
              <p className="py-4 text-center muted">No flagged submissions requiring moderation.</p>
            )}
          </div>
        </div>
      </div>

      {/* Announcement Banner Manager & Reset */}
      <div className="panel panel-pad mt-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold">Platform Announcement Banner</h2>
        <form onSubmit={handleUpdateBanners} className="flex gap-3">
          <Input
            value={bannerInput}
            onChange={e => setBannerInput(e.target.value)}
            placeholder="Enter announcement text..."
            className="text-xs flex-1"
          />
          <Button type="submit">Update Banner</Button>
        </form>

        <div className="border-t pt-4 flex justify-between items-center">
          <div>
            <h3 className="text-xs font-semibold">Reset Demo Environment</h3>
            <p className="muted text-xs">Restore all seed campaigns, transactions, and user data to default state.</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              state.reset()
              toast.success('Demo environment reset successfully')
            }}
          >
            <RefreshCw className="mr-2 size-3.5" /> Reset Demo
          </Button>
        </div>
      </div>
    </>
  )
}
