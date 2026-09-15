'use client'
import { useEffect, useId, useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
export function FilePreview({ label = 'Reference image', allowPdf = false }: { label?: string; allowPdf?: boolean }) {
 const id = useId(); const [file,setFile] = useState<File|null>(null); const [url,setUrl] = useState(''); const [error,setError] = useState('')
 useEffect(() => { if (!file) { setUrl(''); return } const objectUrl = URL.createObjectURL(file); setUrl(objectUrl); return () => URL.revokeObjectURL(objectUrl) }, [file])
 return <Field data-invalid={!!error}><FieldLabel htmlFor={id}>{label}</FieldLabel><Input id={id} type="file" accept={allowPdf ? 'image/jpeg,image/png,image/webp,application/pdf' : 'image/jpeg,image/png,image/webp'} aria-invalid={!!error} onChange={e => { const f = e.target.files?.[0]; setFile(null); setError(''); if (!f) return; if (!['image/jpeg','image/png','image/webp',...(allowPdf ? ['application/pdf'] : [])].includes(f.type) || f.size>5*1024*1024) { setError('Choose a JPG, PNG, WebP'+(allowPdf ? ', or PDF' : '')+' under 5 MB.'); e.target.value=''; return } setFile(f) }} />{error && <FieldError>{error}</FieldError>}{file && url && <div className="rounded-lg border p-3">{file.type.startsWith('image/') ? <img src={url} alt="Temporary local preview" className="max-h-40 rounded-lg object-contain" /> : <FileText className="size-8 text-primary" />}<p className="mt-2 truncate text-xs">{file.name}</p></div>}<p className="demo-note">Temporary browser preview only. Nothing is uploaded or stored. Use fictional, non-sensitive files.</p></Field>
}
