import { AppHeader } from '@/components/app-header'
import { AnalysisResults } from '@/components/analysis-results'

export default function AnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <AnalysisResults />
      </main>
    </div>
  )
}
