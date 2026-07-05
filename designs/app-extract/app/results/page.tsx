import { SiteHeader } from '@/components/site-header'
import { AnalysisResults } from '@/components/analysis-results'

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <AnalysisResults />
      </main>
    </div>
  )
}
