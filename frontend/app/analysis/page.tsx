import { AppHeader } from '@/components/app-header'
import { AnalysisResults } from '@/components/analysis-results'

export default async function AnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <AnalysisResults analysisId={params.id} />
      </main>
    </div>
  )
}