'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Settings, MapPin, Sparkles, Check, Edit2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { useDemo } from '@/store/ginger'
import { PageHeading, Avatar, TextField, DemoNotice } from './shared'

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
          <Button variant="outline" className="gap-2">
            <Settings className="size-4" /> Account Settings
          </Button>
        </Link>
      </PageHeading>

      <div className="two-col">
        <div className="flex flex-col gap-6">
          {/* Profile Card */}
          <div className="panel panel-pad flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar name={p.name} large />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{p.name}</h2>
                  <p className="text-xs font-semibold text-sky-600">{p.handle}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="size-3" /> {p.location}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditing(!editing)} className="gap-1.5">
                <Edit2 className="size-3.5" /> {editing ? 'Cancel' : 'Edit profile'}
              </Button>
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="flex flex-col gap-4 border-t border-border pt-4">
                <FieldGroup>
                  <TextField label="Full Name" value={name} onChange={setName} required />
                  <TextField label="Social Handle" value={handle} onChange={setHandle} required />
                  <TextField label="Location" value={location} onChange={setLocation} required />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="rounded-xl border border-border bg-slate-50/50 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                      rows={3}
                      placeholder="Tell brands about your content..."
                    />
                  </div>
                </FieldGroup>
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white w-fit">
                  Save changes
                </Button>
              </form>
            ) : (
              <div className="border-t border-border pt-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</h3>
                <p className="text-sm leading-relaxed text-slate-700">{p.bio || 'No bio provided yet.'}</p>
              </div>
            )}
          </div>

          {/* Portfolio Highlights */}
          <div className="panel panel-pad">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Portfolio & Content Highlights</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { id: 1, title: 'Demo Video #1', views: '45.2k views' },
                { id: 2, title: 'Brand UGC Reel', views: '82.0k views' },
                { id: 3, title: 'Product Review', views: '128.4k views' },
              ].map((video) => (
                <div
                  key={video.id}
                  className="aspect-[9/16] rounded-xl bg-slate-50 flex flex-col items-center justify-center p-4 border border-border text-center relative group hover:border-sky-300 hover:bg-sky-50/30 transition-all"
                >
                  <div className="size-10 rounded-full bg-sky-100/70 text-sky-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <Sparkles className="size-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-900">{video.title}</p>
                  <p className="text-[11px] text-muted-foreground font-mono mt-1">{video.views}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="panel panel-pad flex flex-col gap-5 h-fit">
          <h3 className="text-sm font-semibold border-b border-border pb-3 text-slate-900">Creator Overview</h3>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Role</span>
            <span className="font-medium bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">{p.role}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Primary Niche</span>
            <span className="font-medium bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md">{p.niche}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Verification Status</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Check className="size-3 stroke-[2.5]" /> Verified Demo
            </span>
          </div>
          <div className="border-t border-border pt-4">
            <Link href="/profile/payments" className="link-blue text-xs font-medium inline-flex items-center gap-1 hover:underline">
              Manage Payment Destinations →
            </Link>
          </div>
          <DemoNotice>Profile information is saved locally in browser state.</DemoNotice>
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
