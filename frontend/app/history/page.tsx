import { AppHeader } from '@/components/app-header'
import { HistoryList } from '@/components/history-list'

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-10">
        <HistoryList />
      </main>
    </div>
  )
}
