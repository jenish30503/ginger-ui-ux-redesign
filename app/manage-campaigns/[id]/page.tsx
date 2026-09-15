import { ManageCampaigns } from '@/components/ginger/manage-campaigns'

export default async function ManageCampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ManageCampaigns id={id} />
}
