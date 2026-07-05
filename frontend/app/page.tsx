import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { TrustedBy } from "@/components/trusted-by"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { AtsPreview } from "@/components/ats-preview"
import { AnalysisPreview } from "@/components/analysis-preview"
import { CoverLetter } from "@/components/cover-letter"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"
import { Faq } from "@/components/faq"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <AtsPreview />
        <AnalysisPreview />
        <CoverLetter />
        <Testimonials />
        <Pricing />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  )
}
