import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Shell } from '@/components/ginger/shell'
import './globals.css'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
export const metadata: Metadata = { title: { default: 'GINGER — Your creativity. Your next payday.', template: '%s · GINGER' }, description: 'Find your next creative opportunity. Explore brand campaigns, create short-form videos, and discover view-based rewards in the GINGER interactive demo.' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f8fafc', width: 'device-width', initialScale: 1 }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="light"><body className={`${inter.variable} font-sans antialiased`}><Shell>{children}</Shell></body></html> }
