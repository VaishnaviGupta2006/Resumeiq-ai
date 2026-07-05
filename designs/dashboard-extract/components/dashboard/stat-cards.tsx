import {
  Gauge,
  FileCheck2,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Stat = {
  label: string
  value: string
  sub: string
  delta: string
  trend: "up" | "down"
  icon: LucideIcon
}

const stats: Stat[] = [
  {
    label: "ATS Score",
    value: "92",
    sub: "out of 100",
    delta: "+9 pts",
    trend: "up",
    icon: Gauge,
  },
  {
    label: "Total Resume Analyses",
    value: "148",
    sub: "this month",
    delta: "+23",
    trend: "up",
    icon: FileCheck2,
  },
  {
    label: "Job Match Score",
    value: "87%",
    sub: "avg. across saved jobs",
    delta: "+4%",
    trend: "up",
    icon: Target,
  },
  {
    label: "AI Credits Remaining",
    value: "320",
    sub: "of 500 credits",
    delta: "-38",
    trend: "down",
    icon: Zap,
  },
]

export function StatCards() {
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
