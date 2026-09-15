'use client'
import { useState } from 'react'
import Link from 'next/link'
import { User, Settings, MapPin, Sparkles, Check, Edit2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldGroup } from '@/components/ui/field'
import { useDemo } from '@/store/ginger'
import { PageHeading, Avatar, TextField, PendingButton, DemoNotice } from './shared'

export function ProfileView() {
  const state = useDemo()
  const p = state.profile
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(p.name)
  const [handle, setHandle] = useState(p.handle)
  const [bio, setBio] = useState(p.bio)
  const [location, setLocation] = useState(p.location)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    state.updateProfile({ name, handle, bio, location })
    setEditing(false)
    toast.success('Profile updated successfully')
  }

  return (
    <>
      <PageHeading
        eyebrow="CREATOR IDENTITY"
        title={p.name}
        description={`${p.role} · ${p.niche} creator based in ${p.location}`}
      >
        <Link href="/profile/account">
          <Button variant="outline"><Settings className="size-4" /> Account Settings</Button>
        </Link>
      </PageHeading>

      <div className="two-col">
        <div className="flex flex-col gap-6">
          <div className="panel panel-pad flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar name={p.name} className="size-16 text-lg font-bold" />
                <div>
                  <h2 className="text-xl font-bold">{p.name}</h2>
                  <p className="text-xs text-primary font-medium">{p.handle}</p>
                  <p className="text-xs muted flex items-center gap-1 mt-1"><MapPin className="size-3" /> {p.location}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
                <Edit2 className="size-3.5" /> {editing ? 'Cancel' : 'Edit profile'}
              </Button>
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="flex flex-col gap-4 border-t pt-4">
                <FieldGroup>
                  <TextField label="Full Name" value={name} onChange={setName} required />
                  <TextField label="Social Handle" value={handle} onChange={setHandle} required />
                  <TextField label="Location" value={location} onChange={setLocation} required />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold">Bio</label>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="rounded-xl border p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  </div>
                </FieldGroup>
                <Button type="submit">Save changes</Button>
              </form>
            ) : (
              <div className="border-t pt-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</h3>
                <p className="text-sm leading-relaxed">{p.bio}</p>
              </div>
            )}
          </div>

          <div className="panel panel-pad">
            <h3 className="text-base font-semibold mb-4">Portfolio & Content Highlights</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[9/16] rounded-xl bg-slate-100 flex flex-col items-center justify-center p-4 border text-center">
                  <Sparkles className="size-6 text-primary mb-2" />
                  <p className="text-xs font-semibold">Demo Video #{i}</p>
                  <p className="text-[10px] muted mt-1">45.2k views</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="panel panel-pad flex flex-col gap-5">
          <h3 className="text-sm font-semibold border-b pb-3">Creator Overview</h3>
          <div className="flex justify-between text-xs">
            <span className="muted">Role</span>
            <span className="font-medium">{p.role}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="muted">Primary Niche</span>
            <span className="font-medium">{p.niche}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="muted">Verification Status</span>
            <span className="text-success font-medium flex items-center gap-1"><Check className="size-3" /> Verified Demo</span>
          </div>
          <div className="border-t pt-4">
            <Link href="/profile/payments" className="link-blue text-xs font-medium">
              Manage Payment Destinations →
            </Link>
          </div>
          <DemoNotice message="Profile information is saved locally in browser state." />
        </aside>
      </div>
    </>
  )
}

export function AccountSettingsView() {
  const state = useDemo()
  const p = state.profile
  const [notifications, setNotifications] = useState(p.notifications)
  const [discoverable, setDiscoverable] = useState(p.discoverable)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    state.updateProfile({ notifications, discoverable })
    toast.success('Account preferences saved')
  }

  return (
    <>
      <PageHeading
        eyebrow="SETTINGS & PREFERENCES"
        title="Account Settings"
        description="Manage notifications, demo roles, and privacy preferences."
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSave} className="panel panel-pad flex flex-col gap-6">
          <div>
            <h2 className="text-base font-semibold mb-1">Role Switcher (Demo Only)</h2>
            <p className="muted text-xs mb-3">Switch between Creator and Brand views to test features.</p>
            <div className="flex gap-3">
              {['Creator', 'Brand'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    state.setRole(r)
                    toast.success(`Active role set to ${r}`)
                  }}
                  className={`rounded-xl border px-4 py-2 text-xs font-semibold transition ${
                    p.role === r ? 'border-primary bg-secondary text-primary' : 'border-border bg-white hover:bg-muted'
                  }`}
                >
                  {r} Mode
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-5">
            <h2 className="text-base font-semibold mb-3">Notification Preferences</h2>
            <label className="flex items-center gap-3 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={e => setNotifications(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>Receive email alerts for milestone payouts and new campaign briefs</span>
            </label>
          </div>

          <div className="border-t pt-5">
            <h2 className="text-base font-semibold mb-3">Discovery & Privacy</h2>
            <label className="flex items-center gap-3 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={discoverable}
                onChange={e => setDiscoverable(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span>Allow brands to find my creator profile in the marketplace</span>
            </label>
          </div>

          <div className="border-t pt-5 flex justify-between items-center">
            <Button type="submit">Save preferences</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                state.reset()
                toast.success('Demo state reset to defaults')
              }}
            >
              Reset Demo Data
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
