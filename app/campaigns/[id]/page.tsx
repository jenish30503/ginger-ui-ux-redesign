import { CampaignDetail } from '@/components/ginger/campaign-detail'

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CampaignDetail id={id} />
}
