'use client'
import { useState } from 'react'
import { Search, Send, Paperclip, Check, Film, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDemo } from '@/store/ginger'
import { PageHeading, Avatar } from './shared'
import { MessageScroller } from '@/components/ui/message-scroller'
import { Message } from '@/components/ui/message'
import { Bubble } from '@/components/ui/bubble'
import { Attachment } from '@/components/ui/attachment'
import { Marker } from '@/components/ui/marker'

export function Inbox() {
  const state = useDemo()
  const [activeId, setActiveId] = useState(state.conversations[0]?.id || '')
  const [query, setQuery] = useState('')
  const [input, setInput] = useState('')

  const active = state.conversations.find(c => c.id === activeId) || state.conversations[0]

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !active) return
    state.send(active.id, input, true)
    setInput('')
    
    // Simulate automated reply after 1.5s
    setTimeout(() => {
      state.send(active.id, 'Thanks for your message! This is an automated demo response from the brand.', false)
    }, 1200)
  }

  const filtered = state.conversations.filter(c =>
    `${c.name} ${c.context}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <PageHeading
        eyebrow="CREATOR & BRAND MESSAGING"
        title="Inbox & Conversations"
        description="Direct communication with brands, offer discussions, and campaign coordination."
      />

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Sidebar Conversation List */}
        <div className="panel overflow-hidden">
          <div className="border-b p-3">
            <Input
              placeholder="Search conversations..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="text-xs"
            />
          </div>
          <div className="divide-y">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveId(c.id)
                  state.readConversation(c.id)
                }}
                className={`flex w-full items-start gap-3 p-4 text-left transition hover:bg-muted ${
                  c.id === active?.id ? 'bg-secondary/60' : ''
                }`}
              >
                <Avatar name={c.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-semibold truncate">{c.name}</strong>
                    {c.unread && <span className="size-2 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-1 text-xs muted truncate">{c.context}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground truncate">
                    {c.messages.at(-1)?.text || 'No messages yet'}
                  </p>
                </div>
              </button>
            ))}
            {!filtered.length && (
              <p className="p-4 text-xs muted text-center">No conversations found.</p>
            )}
          </div>
        </div>

        {/* Chat Thread */}
        {active ? (
          <div className="panel flex flex-col h-[560px] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4 bg-white">
              <div className="flex items-center gap-3">
                <Avatar name={active.name} />
                <div>
                  <h2 className="text-sm font-semibold">{active.name}</h2>
                  <p className="text-xs muted">{active.context}</p>
                </div>
              </div>
              <Marker variant="secondary">Demo Chat</Marker>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <MessageScroller>
                {active.messages.map(m => (
                  <Message key={m.id} align={m.mine ? 'right' : 'left'}>
                    <Bubble variant={m.mine ? 'default' : 'secondary'}>
                      {m.text}
                    </Bubble>
                  </Message>
                ))}
              </MessageScroller>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="flex items-center gap-3 border-t p-4 bg-white">
              <Button type="button" variant="ghost" size="icon" title="Simulate attachment">
                <Paperclip className="size-4 text-muted-foreground" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                className="flex-1 text-xs"
              />
              <Button type="submit" size="icon">
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        ) : (
          <div className="panel flex h-[560px] items-center justify-center">
            <p className="muted text-xs">Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </>
  )
}
