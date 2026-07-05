import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Everything you need to run your first analysis.",
    cta: "Start free",
    featured: false,
    features: [
      "1 resume analysis per month",
      "Basic ATS score",
      "Top 5 keyword suggestions",
      "1 AI cover letter",
      "PDF export",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    desc: "For serious job seekers running multiple applications.",
    cta: "Upgrade to Pro",
    featured: true,
    features: [
      "Unlimited resume analyses",
      "Advanced ATS scoring & breakdown",
      "Full keyword gap analysis",
      "Unlimited AI rewrites & cover letters",
      "Job-specific tailoring",
      "Version history & comparisons",
      "Priority support",
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold text-primary">Pricing</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Simple pricing that pays for itself
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Start free. Upgrade when you&apos;re ready to run every application at full strength.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={
              plan.featured
                ? "relative rounded-3xl border-2 border-primary bg-card p-8 shadow-xl shadow-primary/10"
                : "relative rounded-3xl border border-border bg-card p-8 shadow-sm"
            }
          >
            {plan.featured && (
              <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
              <span className="text-sm text-muted-foreground">/ {plan.period}</span>
            </div>
            <Button
              className="mt-6 w-full rounded-full"
              variant={plan.featured ? "default" : "outline"}
            >
              {plan.cta}
            </Button>
            <ul className="mt-8 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
