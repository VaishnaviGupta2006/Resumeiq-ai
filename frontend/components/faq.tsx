"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "What is an ATS score and why does it matter?",
    a: "An ATS (Applicant Tracking System) score estimates how well your resume will be parsed and ranked by the automated software most companies use to filter applications. A higher score means you're more likely to reach a human recruiter.",
  },
  {
    q: "Which file formats can I upload?",
    a: "You can upload PDF and DOCX files. For the most accurate analysis we recommend a single-column, text-based resume rather than a scanned image.",
  },
  {
    q: "Is my resume data private?",
    a: "Yes. Your documents are encrypted in transit and at rest, never sold, and never used to train third-party models. You can permanently delete your data at any time.",
  },
  {
    q: "How accurate are the AI rewrite suggestions?",
    a: "Our suggestions are grounded in your real experience and the target job description. You always review and approve every change before it's applied — nothing is edited automatically.",
  },
  {
    q: "Can I cancel my Pro plan anytime?",
    a: "Absolutely. You can cancel from your account settings in a couple of clicks and keep Pro features until the end of your billing period. No questions asked.",
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="text-center">
        <p className="text-sm font-semibold text-primary">FAQ</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
      </div>

      <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
        {faqs.map((item, i) => {
          const isOpen = open === i
          return (
            <div key={i}>
              <button
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span className="text-base font-medium">{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 sm:px-6">
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
