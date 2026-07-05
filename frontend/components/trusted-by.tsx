const companies = [
  { name: "Google", slug: "google" },
  { name: "Microsoft", slug: "microsoft" },
  { name: "Amazon", slug: "amazon" },
  { name: "Meta", slug: "meta" },
  { name: "IBM", slug: "ibm" },
  { name: "Salesforce", slug: "salesforce" },
]

export function TrustedBy() {
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Optimized for the ATS platforms used by leading employers
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {companies.map((c) => (
            <img
              key={c.slug}
              src={`https://thesvg.org/icons/${c.slug}/default.svg`}
              alt={`${c.name} logo`}
              width={104}
              height={28}
              loading="lazy"
              className="h-6 w-auto opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 dark:opacity-80 dark:invert dark:hover:opacity-100"
            />
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-balance text-center text-xs leading-relaxed text-muted-foreground/70">
          Logos indicate applicant tracking system compatibility only. ResumeIQ AI is not affiliated with,
          endorsed by, or sponsored by these companies. All trademarks are the property of their respective owners.
        </p>
      </div>
    </section>
  )
}
