'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Film, Wallet, Bookmark, ShieldAlert, Check, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useDemo } from '@/store/ginger'
import { money } from '@/lib/ginger-data'
import { PageHeading, Avatar, EmptyState } from './shared'

export function ActivityView({ defaultTab = 'submissions' }: { defaultTab?: string }) {
  const state = useDemo()
  const [tab, setTab] = useState(defaultTab)

  return (
    <>
      <PageHeading
        eyebrow="CREATOR LOGS"
        title="Activity & History"
        description="Review your demo submissions, payouts, saved campaigns, and blocked users."
      />

      <div className="mb-6 flex border-b gap-4">
        {[
          { id: 'submissions', label: 'Submissions', count: state.submissions.length },
          { id: 'transactions', label: 'Transactions', count: state.transactions.length },
          { id: 'saved', label: 'Saved Campaigns', count: state.saved.length },
          { id: 'blocked', label: 'Blocked Accounts', count: state.blocked.length }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-3 text-xs font-semibold border-b-2 transition ${
              tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {tab === 'submissions' && (
        <div className="panel divide-y">
          {state.submissions.map(s => {
            const campaign = state.campaigns.find(c => c.id === s.campaignId)
            return (
              <div key={s.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold">{campaign?.title || s.campaignId}</h3>
                  <p className="text-xs muted">{s.platform} · Video ID: {s.videoId}</p>
                  <p className="text-xs font-medium text-primary mt-1">{s.views.toLocaleString()} views accumulated</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-success">{money(s.paid)} paid</span>
                  <Link href="/joined">
                    <Button variant="outline" size="sm">Manage <ArrowRight className="size-3" /></Button>
                  </Link>
                </div>
              </div>
            )
          })}
          {!state.submissions.length && <EmptyState title="No submissions yet" href="/campaigns" />}
        </div>
      )}

      {tab === 'transactions' && (
        <div className="panel divide-y">
          {state.transactions.map(t => (
            <div key={t.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">{t.title}</h3>
                <p className="text-xs muted">{t.date} · {t.type}</p>
              </div>
              <strong className={`text-sm ${t.amount >= 0 ? 'text-success' : 'text-foreground'}`}>
                {t.amount >= 0 ? '+' : ''}{money(t.amount)}
              </strong>
            </div>
          ))}
          {!state.transactions.length && <p className="p-6 text-center text-xs muted">No transactions recorded.</p>}
        </div>
      )}

      {tab === 'saved' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {state.saved.map(id => {
            const c = state.campaigns.find(x => x.id === id)
            if (!c) return null
            return (
              <div key={c.id} className="panel p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{c.title}</h3>
                  <p className="text-xs muted">{c.brand} · {money(c.budget)} pool</p>
                </div>
                <Link href={`/campaigns/${c.id}`}>
                  <Button size="sm">View brief</Button>
                </Link>
              </div>
            )
          })}
          {!state.saved.length && <EmptyState title="No saved campaigns" href="/campaigns" />}
        </div>
      )}

      {tab === 'blocked' && (
        <div className="panel divide-y max-w-lg">
          {state.blocked.map(handle => (
            <div key={handle} className="p-4 flex items-center justify-between">
              <span className="text-xs font-semibold">{handle}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  state.unblock(handle)
                  toast.success(`Unblocked ${handle}`)
                }}
              >
                Unblock
              </Button>
            </div>
          ))}
          {!state.blocked.length && <p className="p-6 text-center text-xs muted">No blocked users.</p>}
        </div>
      )}
    </>
  )
}
