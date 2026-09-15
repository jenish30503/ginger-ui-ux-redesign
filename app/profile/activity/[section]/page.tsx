import { ActivityView } from '@/components/ginger/activity'

export default async function ActivityPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  return <ActivityView defaultTab={section} />
}
