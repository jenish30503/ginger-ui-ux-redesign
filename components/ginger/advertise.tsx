'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Plus, Trash2, Check, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useDemo } from '@/store/ginger'
import { money } from '@/lib/ginger-data'
import { PageHeading, TextField, DemoNotice, Modal, PendingButton } from './shared'
import { FilePreview } from './file-preview'
export function Advertise() {
 const s = useDemo(); const router = useRouter(); const [step,setStep] = useState(0); const [title,setTitle] = useState(''); const [brand,setBrand] = useState(''); const [description,setDescription] = useState(''); const [category,setCategory] = useState('Lifestyle'); const [platforms,setPlatforms] = useState<string[]>(['Instagram','YouTube']); const [location,setLocation] = useState('Pan-India'); const [budget,setBudget] = useState('50000'); const [tiers,setTiers] = useState([{views:'1000',payout:'500'},{views:'10000',payout:'3000'}]); const [contribution,setContribution] = useState('0'); const [error,setError] = useState(''); const [checkout,setCheckout] = useState(false); const [pending,setPending] = useState(false)
 const paise = Math.round(Number(budget)*100); const fee = Math.round(paise*.03); const total = paise+fee; const wallet = Math.round(Number(contribution)*100)
 function validate() { if (step === 0 && (!title.trim() || !brand.trim() || !description.trim())) return 'Add a campaign title, brand, and creative brief.'; if (step === 1 && !platforms.length) return 'Choose at least one platform.'; if (step >= 2 && (!Number.isSafeInteger(paise) || paise<100000 || paise>100000000 || tiers.some((t,i) => !Number.isSafeInteger(Number(t.views)) || Number(t.views)<=0 || !Number.isFinite(Number(t.payout)) || Number(t.payout)<=0 || Number(t.payout)*100>paise || (i>0 && (Number(t.views)<=Number(tiers[i-1].views) || Number(t.payout)<=Number(tiers[i-1].payout)))))) return 'Budget must be ₹1,000–₹10,00,000. Views and payouts must be positive, increasing, and within budget.'; if (step === 3 && (!Number.isSafeInteger(wallet) || wallet<0 || wallet>Math.min(total,s.balance))) return 'Wallet contribution exceeds your balance or the total.'; return '' }
 async function publish() { setPending(true); await new Promise(r=>setTimeout(r,300)); const image = category === 'Food & drinks' ? '/images/drink.png' : category === 'Beauty & skincare' ? '/images/skincare.png' : '/images/headphones.png'; const id=crypto.randomUUID(); const err=s.publish({id,title:title.trim(),brand:brand.trim(),description:description.trim(),category,image,color:'blue',platforms,budget:paise,remaining:paise,days:30,creators:0,location,tiers:tiers.map(t=>({views:Number(t.views),payout:Math.round(Number(t.payout)*100)}))},wallet); setPending(false); if(err){setError(err);setCheckout(false);return} toast.success('Demo campaign published'); router.push(`/manage-campaigns/${id}`) }
 return <div className="form-narrow">
<PageHeading eyebrow="A FRESH WAY TO REACH PEOPLE" title="Let creators tell your story." description="A clear brief. The right voices. A campaign that connects." />
<div className="mb-7 flex justify-between gap-2">{['The brief','Your audience','The rewards','Launch'].map((t,i)=>
<div key={t} className="flex items-center gap-2 text-[11px]">
<span className={`flex size-7 items-center justify-center rounded-full ${i<=step?'bg-primary text-white':'bg-muted text-muted-foreground'}`}>{i<step?<Check className="size-3" />:i+1}</span>
<span className="hide-small">{t}</span>
</div>)}</div>
<section className="panel panel-pad">
<h2 className="mb-6 text-xl font-semibold">{['Start with a good story.','Find your people.','Make every milestone count.','Ready when you are.'][step]}</h2>
<form onSubmit={e=>{e.preventDefault();const err=validate();setError(err);if(!err){if(step===3)setCheckout(true);else setStep(step+1)}}}>
<FieldGroup>{step===0&&<>
<TextField label="Campaign title" value={title} onChange={setTitle} placeholder="A little creativity. A fresh perspective." maxLength={100} required />
<TextField label="Brand name" value={brand} onChange={setBrand} placeholder="Your brand" maxLength={60} required />
<TextField label="The creative brief" value={description} onChange={setDescription} placeholder="What should creators make, and why?" maxLength={1500} required />
<Field>
<FieldLabel htmlFor="category">Category</FieldLabel>
<select id="category" value={category} onChange={e=>setCategory(e.target.value)}>{['Lifestyle','Beauty & skincare','Food & drinks','Tech & gadgets','Travel','Fitness'].map(x=>
<option key={x}>{x}</option>)}</select>
</Field>
<FilePreview />
<p className="demo-note">Published demos use the matching built-in campaign image. Your upload is a temporary reference preview.</p>
</>}{step===1&&<>
<Field>
<FieldLabel>Where should your story live?</FieldLabel>
<ToggleGroup multiple value={platforms} onValueChange={v=>setPlatforms(v.map(String))} aria-label="Campaign platforms">{['YouTube','Instagram','TikTok'].map(p=>
<ToggleGroupItem key={p} value={p}>{p}</ToggleGroupItem>)}</ToggleGroup>
<p className="demo-note">TikTok targeting can be saved; TikTok submissions are not supported in this prototype.</p>
</Field>
<Field>
<FieldLabel htmlFor="location">Campaign location</FieldLabel>
<select id="location" value={location} onChange={e=>setLocation(e.target.value)}>{['Pan-India','Mumbai','Bengaluru','New Delhi','Pune'].map(l=>
<option key={l}>{l}</option>)}</select>
</Field>
<p className="text-xs leading-6 muted">All audience sizes are welcome. Creators will choose your campaign based on its brief, location, and available rewards.</p>
</>}{step===2&&<>
<TextField label="Total campaign budget (₹)" type="number" value={budget} onChange={setBudget} min={1000} max={1000000} required />{tiers.map((t,i)=>
<FieldGroup key={i} className="rounded-xl border p-4">
<div className="flex justify-between">
<strong className="text-xs">Milestone {i+1}</strong>{tiers.length>1&&<Button type="button" variant="ghost" size="icon-sm" aria-label={`Remove milestone ${i+1}`} onClick={()=>setTiers(tiers.filter((_,n)=>n!==i))}>
<Trash2 />
</Button>}</div>
<TextField label="Views required" type="number" value={t.views} onChange={v=>setTiers(tiers.map((x,n)=>n===i?{...x,views:v}:x))} min={1} step="1" required />
<TextField label="Cumulative reward (₹)" type="number" value={t.payout} onChange={v=>setTiers(tiers.map((x,n)=>n===i?{...x,payout:v}:x))} min={1} max={Number(budget)} required />
</FieldGroup>)}<Button type="button" variant="outline" disabled={tiers.length>=5} onClick={()=>setTiers([...tiers,{views:'',payout:''}])}>
<Plus data-icon="inline-start" /> Add milestone</Button>
<p className="demo-note">Payouts are cumulative. A creator receives only the difference between milestones, not the sum of every tier.</p>
</>}{step===3&&<>
<DemoNotice>Simulated checkout. No real charge, payment gateway, or escrow service.</DemoNotice>
<div>
<h3 className="text-lg font-semibold">{title}</h3>
<p className="mt-2 text-xs muted">{brand} · {platforms.join(', ')} · {location}</p>
</div>
<div className="flex flex-col gap-4 rounded-xl bg-background p-5 text-sm">
<div className="flex justify-between">
<span>Creator reward pool</span>
<strong>{money(paise)}</strong>
</div>
<div className="flex justify-between">
<span>Platform fee (3%)</span>
<strong>{money(fee)}</strong>
</div>
<div className="flex justify-between border-t pt-4 font-semibold">
<span>Demo total</span>
<span>{money(total)}</span>
</div>
</div>
<TextField label={`Use your demo wallet (available ${money(s.balance)})`} type="number" value={contribution} onChange={setContribution} min={0} max={Math.min(s.balance,total)/100} step="0.01" />
<p className="text-sm">External demo payment: <strong>{money(Math.max(0,total-wallet))}</strong>
</p>
</>}</FieldGroup>{error&&<p role="alert" className="mt-5 text-xs text-destructive">{error}</p>}<div className="mt-7 flex justify-between gap-3">
<Button type="button" variant="outline" disabled={step===0||pending} onClick={()=>{setStep(step-1);setError('')}}>
<ArrowLeft data-icon="inline-start" /> Back</Button>
<Button type="submit">{step===3?'Review demo payment':'Continue'}<ArrowRight data-icon="inline-end" />
</Button>
</div>
</form>
</section>
<Modal open={checkout} onClose={()=>!pending&&setCheckout(false)} title="Razorpay-style demo checkout" description="This is a visual simulation, not Razorpay or a real payment form. Do not enter payment credentials.">
<div className="rounded-xl bg-secondary p-6 text-center">
<ShieldCheck className="mx-auto mb-3 size-8 text-primary" />
<p className="text-xs muted">Simulated external payment</p>
<p className="mt-2 text-3xl font-semibold">{money(Math.max(0,total-wallet))}</p>
</div>
<p className="text-xs leading-6 muted">Confirming publishes your campaign, updates the demo wallet, and records the reward pool as simulated escrow. No real money moves.</p>
<Button disabled={pending} onClick={publish}>{pending?'Publishing…':'Simulate payment & publish'}</Button>
</Modal>
</div>
}
