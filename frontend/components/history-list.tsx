'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getHistory, getAnalysisById, deleteAnalysis, type HistoryItem } from '@/lib/api'

function getScoreColor(score: number) {
  if (score >= 80) return 'text-chart-3'
  if (score >= 60) return 'text-chart-1'
  return 'text-chart-4'
}

function getScoreBg(score: number) {
  if (score >= 80) return 'bg-chart-3/15'
  if (score >= 60) return 'bg-chart-1/15'
  return 'bg-chart-4/15'
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function HistoryList() {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getHistory()
      setHistory(response.history)
    } catch (err: any) {
      setError(err.message || 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (item: HistoryItem) => {
    router.push(`/analysis?id=${item.id}`)
  }

  const handleDelete = async (item: HistoryItem) => {
    if (!confirm(`Are you sure you want to delete "${item.original_filename}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeletingId(item.id)
      await deleteAnalysis(item.id)
      // Refresh history after successful deletion
      await loadHistory()
    } catch (err: any) {
      setError(err.message || 'Failed to delete analysis')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="size-12 text-chart-4 mb-4" />
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadHistory}>Retry</Button>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FileText className="size-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">No analyses yet</h2>
        <p className="text-muted-foreground mb-6">Upload a resume to get started</p>
        <Link href="/upload">
          <Button>Upload Resume</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Analysis History
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {history.length} {history.length === 1 ? 'analysis' : 'analyses'} saved
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)] sm:p-7"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${getScoreBg(item.ats_score)}`}>
                  <TrendingUp className={`size-6 ${getScoreColor(item.ats_score)}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-foreground truncate">
                    {item.original_filename}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {formatDate(item.created_at)}
                    </span>
                    <span className={`font-medium ${getScoreColor(item.ats_score)}`}>
                      {item.ats_score}/100
                    </span>
                    <span className="capitalize">{item.recommendation}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground hover:text-chart-4 hover:bg-chart-4/10"
                >
                  {deletingId === item.id ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4" />
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleViewDetails(item)}
                  disabled={loadingId === item.id}
                  className="shrink-0"
                >
                  {loadingId === item.id ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      View Details
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
