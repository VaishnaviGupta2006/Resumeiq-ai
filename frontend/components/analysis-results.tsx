import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Target,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScoreGauge } from '@/components/score-gauge'

const categories = [
  { label: 'ATS Compatibility', score: 91, tone: 'good' },
  { label: 'Impact & Achievements', score: 78, tone: 'ok' },
  { label: 'Keyword Match', score: 64, tone: 'warn' },
  { label: 'Formatting & Clarity', score: 88, tone: 'good' },
  { label: 'Skills Coverage', score: 72, tone: 'ok' },
] as const

const strengths = [
  'Strong quantified achievements in 4 of 5 roles',
  'Clean, single-column layout parses perfectly with ATS',
  'Consistent, action-led verb usage throughout',
]

const improvements = [
  {
    title: 'Add 6 missing keywords',
    detail:
      'Terms like "design systems", "A/B testing" and "roadmap" appear in the target role but not your resume.',
  },
  {
    title: 'Strengthen your summary',
    detail:
      'Your opening statement is generic. Lead with your specialization and a headline metric.',
  },
  {
    title: 'Trim the 2018 role',
    detail:
      'Older experience takes up 22% of page one. Condense to 2 bullet points to prioritize recent impact.',
  },
]

const keywords = [
  { term: 'Product Design', matched: true },
  { term: 'Figma', matched: true },
  { term: 'User Research', matched: true },
  { term: 'Design Systems', matched: false },
  { term: 'A/B Testing', matched: false },
  { term: 'Prototyping', matched: true },
  { term: 'Roadmap', matched: false },
  { term: 'Accessibility', matched: true },
]

function toneClasses(tone: 'good' | 'ok' | 'warn') {
  if (tone === 'good') return 'bg-chart-3'
  if (tone === 'ok') return 'bg-chart-1'
  return 'bg-chart-4'
}

export function AnalysisResults() {
  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            className="mb-3 -ml-2 text-muted-foreground"
            render={
              <Link href="/upload">
                <ArrowLeft className="size-4" />
                Back to upload
              </Link>
            }
          />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Analysis results
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="size-4" />
            alex-morgan-resume.pdf
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Target className="size-4" />
              Senior Product Designer
            </span>
          </p>
        </div>
        <Button size="lg" className="rounded-full px-5 shadow-sm">
          <Download className="size-4" />
          Export report
        </Button>
      </div>

      {/* Score + summary */}
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)]">
          <ScoreGauge score={82} />
          <p className="mt-5 text-lg font-semibold text-foreground">
            Strong resume
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            You&apos;re in the top 18% for this role. A few focused tweaks will
            push you into the top tier.
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7">
          <h2 className="text-sm font-semibold text-foreground">
            Category breakdown
          </h2>
          <div className="mt-5 space-y-5">
            {categories.map((c) => (
              <div key={c.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{c.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {c.score}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${toneClasses(c.tone)}`}
                    style={{ width: `${c.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths + improvements */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-chart-3/15 text-chart-3">
              <CheckCircle2 className="size-4.5" />
            </span>
            <h2 className="text-sm font-semibold text-foreground">
              What&apos;s working
            </h2>
          </div>
          <ul className="space-y-3">
            {strengths.map((s) => (
              <li key={s} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-chart-3" />
                <span className="text-muted-foreground">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-chart-4/15 text-chart-4">
              <TrendingUp className="size-4.5" />
            </span>
            <h2 className="text-sm font-semibold text-foreground">
              Priority improvements
            </h2>
          </div>
          <ul className="space-y-4">
            {improvements.map((item, i) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Keyword match */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Keyword match
          </h2>
          <span className="text-sm text-muted-foreground">
            5 of 8 matched
          </span>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Keywords extracted from the target role description.
        </p>
        <div className="flex flex-wrap gap-2">
          {keywords.map((k) => (
            <span
              key={k.term}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
                k.matched
                  ? 'bg-chart-3/12 text-chart-3'
                  : 'border border-dashed border-chart-4/50 bg-chart-4/10 text-chart-4'
              }`}
            >
              {k.matched ? (
                <CheckCircle2 className="size-3.5" />
              ) : (
                <AlertTriangle className="size-3.5" />
              )}
              {k.term}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-accent/60 p-6 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Let AI rewrite your weak sections
            </p>
            <p className="text-sm text-accent-foreground">
              Generate optimized bullet points tailored to your target role.
            </p>
          </div>
        </div>
        <Button size="lg" className="rounded-full px-5 shadow-sm">
          Rewrite with AI
        </Button>
      </div>
    </div>
  )
}
