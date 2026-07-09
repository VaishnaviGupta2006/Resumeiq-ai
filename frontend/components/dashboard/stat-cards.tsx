import {
  FileCheck2,
  Target,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { DashboardStats } from "@/lib/api"

interface StatCardsProps {
  data: DashboardStats
}

export function StatCards({ data }: StatCardsProps) {
  const stats = [
    {
      label: "Total Resume Uploads",
      value: data.total_resumes.toString(),
      sub: "total uploads",
      delta: "",
      trend: "up" as const,
      icon: FileCheck2,
    },
    {
      label: "Total Analyses",
      value: data.total_analyses.toString(),
      sub: "completed analyses",
      delta: "",
      trend: "up" as const,
      icon: Target,
    },
    {
      label: "Average ATS Score",
      value: data.average_ats_score.toString(),
      sub: "out of 100",
      delta: "",
      trend: "up" as const,
      icon: TrendingUp,
    },
    {
      label: "Highest ATS Score",
      value: data.highest_ats_score.toString(),
      sub: "out of 100",
      delta: "",
      trend: "up" as const,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <stat.icon className="size-5" />
            </div>
            {stat.delta && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  stat.trend === "up"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {stat.delta}
              </span>
            )}
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            {stat.label}
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
