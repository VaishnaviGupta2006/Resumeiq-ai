'use client'

import { useEffect, useState } from 'react'
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
  Calendar,
  Award,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScoreGauge } from '@/components/score-gauge'
import { ReportTemplate } from '@/components/report-template'
import { type AnalysisData, type ResumeInfo, getAnalysisById } from '@/lib/api'
import jsPDF from 'jspdf'

interface AnalysisResultsProps {
  analysisId?: string
}

function toneClasses(score: number) {
  if (score >= 90) return 'bg-chart-3'
  if (score >= 70) return 'bg-chart-1'
  if (score >= 50) return 'bg-chart-2'
  return 'bg-chart-4'
}

function toneTextClasses(score: number) {
  if (score >= 90) return 'text-chart-3'
  if (score >= 70) return 'text-chart-1'
  if (score >= 50) return 'text-chart-2'
  return 'text-chart-4'
}

function getScoreLabel(score: number) {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Average'
  return 'Weak'
}

function getRecommendationBadge(recommendation: string) {
  const rec = recommendation.toLowerCase()
  if (rec === 'hire') return 'bg-chart-3/15 text-chart-3 border-chart-3/30'
  if (rec === 'consider') return 'bg-chart-1/15 text-chart-1 border-chart-1/30'
  return 'bg-chart-4/15 text-chart-4 border-chart-4/30'
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

export function AnalysisResults({ analysisId }: AnalysisResultsProps) {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null)
  const [jobDescription, setJobDescription] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    async function loadAnalysis() {
      // First try to use analysisId from URL params
      if (analysisId) {
        try {
          setLoading(true)
          const id = parseInt(analysisId, 10)
          const response = await getAnalysisById(id)
          console.log("API Response:", response)

          setAnalysis(response.analysis)
          setJobDescription(response.job_description || '')
          setResumeInfo({
            filename: response.filename,
            original_filename: response.original_filename,
            file_size: response.file_size,
            characters: response.extracted_text.length,
            preview: response.extracted_text.substring(0, 500),
          })
        } catch (err: any) {
          console.error("Analysis API Error:", err)
          setError(err.message || "Failed to load analysis")
        } finally {
          setLoading(false)
        }
      } else {
        // Fallback to sessionStorage for backward compatibility
        const analysisData = sessionStorage.getItem('analysisData')
        const resumeData = sessionStorage.getItem('resumeInfo')

        if (analysisData && resumeData) {
          try {
            setAnalysis(JSON.parse(analysisData))
            setResumeInfo(JSON.parse(resumeData))
          } catch (e) {
            console.error('Failed to parse analysis data:', e)
          }
        }
        setLoading(false)
      }
    }

    loadAnalysis()
  }, [analysisId])

  const handleExportPDF = async () => {
    if (!analysis || !resumeInfo) return
    
    try {
      setExporting(true)
      
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default
      
      // Create a hidden, CSS-isolated iframe for the report.
      // Using an iframe (instead of a <div> appended to document.body) gives the
      // report its own blank document, so it never inherits the host page's
      // Tailwind v4 stylesheet (whose Preflight layer sets border-color, etc. from
      // OKLCH theme tokens that browsers can serialize as lab()/oklab() — the
      // exact values html2canvas's color parser can't understand). Every color
      // in ReportTemplate is already a plain hex/rgb literal, so once the
      // ambient Tailwind cascade is removed there is nothing left to sanitize.
      const reportFrame = document.createElement('iframe')
      reportFrame.style.position = 'fixed'
      reportFrame.style.top = '-9999px'
      reportFrame.style.left = '-9999px'
      reportFrame.style.width = '210mm'
      reportFrame.style.border = '0'
      document.body.appendChild(reportFrame)

      const frameDoc = reportFrame.contentDocument!
      frameDoc.open()
      frameDoc.write('<!DOCTYPE html><html><head></head><body style="margin:0;background:#ffffff;"></body></html>')
      frameDoc.close()

      const reportContainer = frameDoc.body

      // Render the report template
      const { createRoot } = await import('react-dom/client')
      const root = createRoot(reportContainer)
      root.render(
        <ReportTemplate 
          analysis={analysis} 
          resumeInfo={resumeInfo} 
          jobDescription={jobDescription}
        />
      )
      
      // Wait for the component to render
      await new Promise(resolve => setTimeout(resolve, 1000))

      // The iframe was only given an explicit width, never a height, so it was
      // defaulting to the browser's intrinsic ~150px iframe height. html2canvas
      // uses the iframe document's window/viewport size for its render context,
      // so anything below that 150px cutoff was never painted — only the
      // footer (position: fixed, anchored to the viewport) still showed up.
      // Sizing the iframe to the actual rendered content fixes this.
      reportFrame.style.height = `${reportContainer.scrollHeight}px`
      
      // Clone the container for color sanitization. Appended back into the
      // iframe's own document (not the host document) so it stays isolated
      // from the app's Tailwind stylesheet.
      const clonedContainer = reportContainer.cloneNode(true) as HTMLElement
      clonedContainer.style.position = 'fixed'
      clonedContainer.style.top = '-9999px'
      clonedContainer.style.left = '-9999px'
      frameDoc.body.appendChild(clonedContainer)
      
      // Function to check if a color value uses unsupported functions
      const hasUnsupportedColorFunction = (color: string): boolean => {
        return color.includes('lab(') || 
               color.includes('oklch(') || 
               color.includes('lch(') || 
               color.includes('color-mix(') ||
               color.includes('var(')
      }
      
      // Function to convert color to safe RGB/HEX
      const convertToSafeColor = (element: HTMLElement, property: string): void => {
        const computed = window.getComputedStyle(element)
        const color = computed.getPropertyValue(property)
        
        if (hasUnsupportedColorFunction(color)) {
          // Create a temporary element to get the resolved color
          const temp = document.createElement('div')
          temp.style.color = color
          temp.style.display = 'none'
          document.body.appendChild(temp)
          const resolved = window.getComputedStyle(temp).color
          document.body.removeChild(temp)
          
          // If resolved color is still unsupported, use fallback
          if (hasUnsupportedColorFunction(resolved)) {
            element.style.setProperty(property, '#000000', 'important')
          } else {
            element.style.setProperty(property, resolved, 'important')
          }
        }
      }
      
      // Recursively sanitize all elements
      const sanitizeColors = (element: HTMLElement): void => {
        const colorProperties = [
          'color',
          'backgroundColor',
          'borderColor',
          'outlineColor',
          'textDecorationColor',
          'borderTopColor',
          'borderRightColor',
          'borderBottomColor',
          'borderLeftColor'
        ]
        
        colorProperties.forEach(prop => {
          convertToSafeColor(element, prop)
        })
        
        // Recursively process children
        Array.from(element.children).forEach(child => {
          sanitizeColors(child as HTMLElement)
        })
      }
      
      // Sanitize the cloned container
      sanitizeColors(clonedContainer)
      
      // Capture the sanitized report as canvas
      const canvas = await html2canvas(clonedContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })
      
      // Remove the cloned container
      frameDoc.body.removeChild(clonedContainer)
      
      // Create PDF from canvas
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let heightLeft = imgHeight
      let position = 0
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= 297
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= 297
      }
      
      // Add footer to all pages
      const pageCount = pdf.getNumberOfPages()
      const currentDate = new Date().toLocaleDateString()
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.setFontSize(9)
        pdf.setTextColor(150, 150, 150)
        pdf.text('Generated by ResumeIQ AI', 20, 285)
        pdf.text(`Page ${i} of ${pageCount}`, 150, 285)
        pdf.text(currentDate, 105, 285, { align: 'center' })
      }
      
      // Save the PDF
      pdf.save(`ResumeIQ_Analysis_${resumeInfo.original_filename.replace(/\.[^/.]+$/, "")}.pdf`)
      
      // Cleanup
      root.unmount()
      document.body.removeChild(reportFrame)
      
    } catch (error) {
      console.error('PDF generation failed:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setExporting(false)
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
        <p className="text-muted-foreground">{error}</p>
        <Link href="/history">
          <Button className="mt-4">Go to History</Button>
        </Link>
      </div>
    )
  }

  if (!analysis || !resumeInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground">No analysis data found. Please upload a resume first.</p>
        <Link href="/upload">
          <Button className="mt-4">Go to Upload</Button>
        </Link>
      </div>
    )
  }

  const categories = [
    { label: 'Skills', score: analysis.section_scores?.skills || 0 },
    { label: 'Experience', score: analysis.section_scores?.experience || 0 },
    { label: 'Education', score: analysis.section_scores?.education || 0 },
    { label: 'Projects', score: analysis.section_scores?.projects || 0 },
    { label: 'Keywords', score: analysis.section_scores?.keywords || 0 },
  ]

  // Determine analysis type: Job Match if job description is present, otherwise Resume Analysis
  const isJobMatch = jobDescription && jobDescription.trim().length > 0

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Link href="/upload">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  Dashboard
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <FileText className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
                  {resumeInfo.original_filename}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Uploaded on {formatDate(new Date().toISOString())}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            {isJobMatch && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Recommendation</p>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium capitalize ${getRecommendationBadge(analysis.recommendation)}`}>
                    <Award className="size-3.5" />
                    {analysis.recommendation}
                  </span>
                </div>
              </div>
            )}
            <Button 
              size="lg" 
              className="rounded-full px-6 shadow-sm"
              onClick={handleExportPDF}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="size-4 mr-2" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Score Section */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)] sm:p-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <ScoreGauge score={analysis.ats_score} />
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              {analysis.ats_score}/100
            </h2>
            <p className={`mt-1 text-lg font-semibold ${toneTextClasses(analysis.ats_score)}`}>
              {getScoreLabel(analysis.ats_score)}
            </p>
          </div>
          <p className="max-w-md text-muted-foreground">
            {analysis.overall_match}
          </p>
        </div>
      </div>

      {/* Category Scores */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
        <h2 className="mb-6 text-lg font-semibold text-foreground">Category Scores</h2>
        <div className="space-y-6">
          {categories.map((c) => (
            <div key={c.label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-foreground">{c.label}</span>
                <span className={`font-semibold tabular-nums ${toneTextClasses(c.score)}`}>
                  {c.score}/100
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${toneClasses(c.score)}`}
                  style={{ width: `${Math.max(0, Math.min(100, c.score))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Summary */}
      {analysis.summary && (
        <div className="rounded-3xl border border-border bg-accent/50 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Resume Summary</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {analysis.summary}
          </p>
        </div>
      )}

      {/* Strengths */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-chart-3/15 text-chart-3">
            <CheckCircle2 className="size-5" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Strengths</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {analysis.strengths?.map((s, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-chart-3/5 p-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-chart-3" />
              <span className="text-sm text-foreground">{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weaknesses */}
      {analysis.weaknesses && analysis.weaknesses.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-chart-4/15 text-chart-4">
              <AlertTriangle className="size-5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Areas for Improvement</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {analysis.weaknesses.map((w, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-chart-4/5 p-4">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-chart-4" />
                <span className="text-sm text-foreground">{w}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matching Skills - Only for Job Match */}
      {isJobMatch && analysis.matching_skills && analysis.matching_skills.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Matching Skills</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.matching_skills.map((skill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-chart-3/15 px-3 py-1.5 text-sm font-medium text-chart-3"
              >
                <CheckCircle2 className="size-3.5" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills - Only for Job Match */}
      {isJobMatch && analysis.missing_skills && analysis.missing_skills.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Missing Skills</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_skills.map((skill, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-chart-4/15 px-3 py-1.5 text-sm font-medium text-chart-4"
              >
                <AlertTriangle className="size-3.5" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Matched Keywords - Only for Job Match */}
      {isJobMatch && analysis.matched_keywords && analysis.matched_keywords.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Matched Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.matched_keywords.map((keyword, i) => (
              <span
                key={i}
                className="rounded-lg bg-chart-3/10 px-3 py-1.5 text-sm font-medium text-chart-3"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Keywords - Only for Job Match */}
      {isJobMatch && analysis.missing_keywords && analysis.missing_keywords.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Missing Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_keywords.map((keyword, i) => (
              <span
                key={i}
                className="rounded-lg bg-chart-4/10 px-3 py-1.5 text-sm font-medium text-chart-4"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Suggestions */}
      {analysis.improvement_suggestions && analysis.improvement_suggestions.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <TrendingUp className="size-5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Improvement Suggestions</h2>
          </div>
          <div className="space-y-4">
            {analysis.improvement_suggestions.map((suggestion, i) => (
              <div key={i} className="flex gap-4 rounded-xl bg-accent p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
