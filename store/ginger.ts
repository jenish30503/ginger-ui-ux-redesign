'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { campaigns, initialProfile, initialTransactions, initialConversations, type Campaign, type Submission, type Transaction, type Conversation, type Profile } from '@/lib/ginger-data'
import { inspectVideo } from '@/lib/videoHelpers'
const id = () => crypto.randomUUID()
const transaction = (title: string, amount: number, type: Transaction['type'], status: Transaction['status'] = 'Completed'): Transaction => ({ id: id(), title, amount, type, status, date: new Date().toISOString().slice(0, 10) })
const seed = () => ({ campaigns: structuredClone(campaigns), profile: { ...initialProfile }, balance: 2450000, escrow: 420000, lifetime: 11200000, saved: ['daily-glow'], submissions: [{ id: 's1', campaignId: 'daily-glow', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoId: 'dQw4w9WgXcQ', platform: 'YouTube', views: 14820, paid: 0, flagged: false }] as Submission[], transactions: structuredClone(initialTransactions), conversations: structuredClone(initialConversations), blocked: ['@spam_account'], banners: ['Create something that pays off.'], readNotifications: false })
type Demo = ReturnType<typeof seed> & {
  toggleSaved: (id: string) => void
  updateProfile: (data: Partial<Profile>) => void
  submit: (campaignId: string, url: string) => string | null
  advance: (id: string) => void
  settle: (id: string) => string | null
  flag: (id: string) => void
  transfer: (amount: number, type: 'Deposits' | 'Withdrawals') => string | null
  publish: (campaign: Campaign, contribution: number) => string | null
  offer: (name: string, context: string, text: string) => string
  send: (conversationId: string, text: string, mine?: boolean) => void
  readConversation: (id: string) => void
  moderate: (ids: string[]) => void
  approveWithdrawals: (ids: string[]) => void
  unblock: (handle: string) => void
  setBanners: (banners: string[]) => void
  readAlerts: () => void
  signIn: (email: string, role?: string) => void
  completeOnboarding: (details: { role: string; handle: string; niche: string }) => void
  setRole: (role: string) => void
  reset: () => void
}
export const useDemo = create<Demo>()(persist((set, get) => ({
  ...seed(),
  toggleSaved: (id) => set(s => ({ saved: s.saved.includes(id) ? s.saved.filter(x => x !== id) : [...s.saved, id] })),
  updateProfile: (data) => set(s => ({ profile: { ...s.profile, ...data } })),
  submit: (campaignId, url) => {
    const video = inspectVideo(url); const c = get().campaigns.find(x => x.id === campaignId)
    if (!video || !c) return 'Please use a valid YouTube or Instagram Reel URL.'
    if (!c.platforms.includes(video.platform)) return 'This platform is not accepted by the campaign.'
    if (get().submissions.some(x => x.videoId === video.id && x.platform === video.platform)) return 'This video has already been submitted.'
    set(s => ({ submissions: [{ id: id(), campaignId, url: video.url, videoId: video.id, platform: video.platform, views: 0, paid: 0, flagged: false }, ...s.submissions] })); return null
  },
  advance: (sid) => set(s => ({ submissions: s.submissions.map(x => x.id === sid && !x.flagged ? { ...x, views: Math.min(1000000, x.views + 10000) } : x) })),
  settle: (sid) => {
    const s = get(); const sub = s.submissions.find(x => x.id === sid); const c = s.campaigns.find(x => x.id === sub?.campaignId)
    if (!sub || !c || sub.flagged) return 'This submission is not eligible for settlement.'
    const earned = Math.max(0, ...c.tiers.filter(t => t.views <= sub.views).map(t => t.payout)); const payable = earned - sub.paid
    if (payable <= 0) return 'There is no new milestone payout to claim.'
    if (payable > c.remaining) return 'The campaign does not have enough remaining budget.'
    set({ balance: s.balance + payable, lifetime: s.lifetime + payable, submissions: s.submissions.map(x => x.id === sid ? { ...x, paid: earned } : x), campaigns: s.campaigns.map(x => x.id === c.id ? { ...x, remaining: x.remaining - payable } : x), transactions: [transaction(`${c.brand} · Milestone payout`, payable, 'Earnings'), ...s.transactions] }); return null
  },
  flag: (sid) => set(s => ({ submissions: s.submissions.map(x => x.id === sid ? { ...x, flagged: !x.flagged } : x) })),
  transfer: (amount, type) => {
    const s = get(); if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 100000000) return 'Enter an amount between ₹1 and ₹10,00,000.'
    if (type === 'Withdrawals' && amount > s.balance) return 'Your available balance is too low.'
    if (type === 'Withdrawals' && !s.profile.destination) return 'Add a demo payout destination first.'
    set({ balance: s.balance + (type === 'Withdrawals' ? -amount : amount), transactions: [transaction(type === 'Withdrawals' ? `Withdrawal · ${s.profile.destination}` : 'Demo wallet top-up', type === 'Withdrawals' ? -amount : amount, type, type === 'Withdrawals' ? 'Pending' : 'Completed'), ...s.transactions] }); return null
  },
  publish: (campaign, contribution) => {
    const s = get(); const total = Math.round(campaign.budget * 1.03)
    if (!campaign.title.trim() || !campaign.brand.trim() || !Number.isSafeInteger(campaign.budget) || campaign.budget < 100000 || campaign.budget > 100000000) return 'Enter campaign details and a budget from ₹1,000 to ₹10,00,000.'
    if (!campaign.platforms.length || !campaign.tiers.length || campaign.tiers.some((t,i) => !Number.isSafeInteger(t.views) || t.views <= 0 || !Number.isSafeInteger(t.payout) || t.payout <= 0 || t.payout > campaign.budget || (i > 0 && (t.views <= campaign.tiers[i-1].views || t.payout <= campaign.tiers[i-1].payout)))) return 'Tiers must have increasing views and payouts within your budget.'
    if (!Number.isSafeInteger(contribution) || contribution < 0 || contribution > Math.min(s.balance,total)) return 'Wallet contribution exceeds the available balance or total.'
    if (s.campaigns.some(c => c.id === campaign.id)) return 'This campaign is already published.'
    set({ campaigns: [{ ...campaign, owned: true }, ...s.campaigns], balance: s.balance - contribution, escrow: s.escrow + campaign.budget, transactions: [transaction(`${campaign.brand} · Campaign escrow (external demo payment ${((total-contribution)/100).toFixed(2)})`, -contribution, 'Escrow', 'In escrow'), ...s.transactions] }); return null
  },
  offer: (name, context, text) => {
    const existing = get().conversations.find(c => c.name === name); const cid = existing?.id ?? id()
    if (existing) get().send(cid, text)
    else set(s => ({ conversations: [{ id: cid, name, context, unread: false, messages: [{ id: id(), text, mine: true }] }, ...s.conversations] }))
    return cid
  },
  send: (cid, text, mine = true) => { if (!text.trim()) return; set(s => ({ conversations: s.conversations.map(c => c.id === cid ? { ...c, messages: [...c.messages, { id: id(), text: text.trim().slice(0,2000), mine }] } : c) })) },
  readConversation: (cid) => set(s => ({ conversations: s.conversations.map(c => c.id === cid ? { ...c, unread: false } : c) })),
  moderate: (ids) => set(s => ({ submissions: s.submissions.map(x => ids.includes(x.id) ? { ...x, flagged: false } : x) })),
  approveWithdrawals: (ids) => set(s => ({ transactions: s.transactions.map(x => ids.includes(x.id) && x.type === 'Withdrawals' ? { ...x, status: 'Completed' } : x) })),
  unblock: (handle) => set(s => ({ blocked: s.blocked.filter(x => x !== handle) })),
  setBanners: (banners) => set({ banners }), readAlerts: () => set({ readNotifications: true }),
  signIn: (email, role = 'Creator') => set(s => ({ profile: { ...s.profile, role } })),
  completeOnboarding: ({ role, handle, niche }) => set(s => ({ profile: { ...s.profile, role, handle, niche } })),
  setRole: (role) => set(s => ({ profile: { ...s.profile, role } })),
  reset: () => set(seed()),
}), { name: 'ginger-demo-v1', version: 1, skipHydration: true }))
