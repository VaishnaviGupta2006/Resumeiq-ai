import { FileText, MoreHorizontal } from "lucide-react"
import { recentAnalyses, type Analysis } from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

function statusStyle(status: Analysis["status"]) {
  switch (status) {
    case "Excellent":
      return "bg-primary/10 text-primary"
    case "Good":
      return "bg-accent text-accent-foreground"
    case "Needs work":
      return "bg-muted text-muted-foreground"
  }
}

function scoreColor(score: number) {
  if (score >= 85) return "text-primary"
  if (score >= 70) return "text-accent-foreground"
  return "text-muted-foreground"
}

export function RecentAnalyses() {
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
        <button className="text-xs font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <ul className="divide-y divide-border">
        {recentAnalyses.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/50"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {item.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {item.role} · {item.date}
              </p>
            </div>
            <span
              className={cn(
                "hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline-block",
                statusStyle(item.status),
              )}
            >
              {item.status}
            </span>
            <div className="w-12 text-right">
              <span
                className={cn(
                  "text-sm font-semibold tabular-nums",
                  scoreColor(item.score),
                )}
              >
                {item.score}
              </span>
            </div>
            <button
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label={`Options for ${item.name}`}
            >
              <MoreHorizontal className="size-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
