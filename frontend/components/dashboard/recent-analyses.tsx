import { FileText, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface RecentUpload {
  filename: string
  ats_score: number
  recommendation: string
  created_at: string | null
}

interface RecentAnalysesProps {
  data: RecentUpload[]
}

function statusStyle(recommendation: string) {
  switch (recommendation.toLowerCase()) {
    case "hire":
      return "bg-primary/10 text-primary"
    case "consider":
      return "bg-accent text-accent-foreground"
    case "reject":
      return "bg-muted text-muted-foreground"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function scoreColor(score: number) {
  if (score >= 85) return "text-primary"
  if (score >= 70) return "text-accent-foreground"
  return "text-muted-foreground"
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function RecentAnalyses({ data }: RecentAnalysesProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Recent Analyses
          </h3>
          <p className="text-xs text-muted-foreground">
            Your latest resume evaluations
          </p>
        </div>
        <Link href="/history" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          No analyses yet
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {data.map((item, index) => (
            <Link
              key={index}
              href="/history"
              className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.filename}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {formatDate(item.created_at)}
                </p>
              </div>
              <span
                className={cn(
                  "hidden rounded-full px-2.5 py-1 text-xs font-medium capitalize sm:inline-block",
                  statusStyle(item.recommendation),
                )}
              >
                {item.recommendation}
              </span>
              <div className="w-12 text-right">
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    scoreColor(item.ats_score),
                  )}
                >
                  {item.ats_score}
                </span>
              </div>
              <button
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label={`Options for ${item.filename}`}
              >
                <MoreHorizontal className="size-4" />
              </button>
            </Link>
          ))}
        </ul>
      )}
    </div>
  )
}
