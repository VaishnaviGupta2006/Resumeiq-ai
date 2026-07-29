'use client'

import type { CSSProperties } from 'react'
import { CheckCircle2, AlertTriangle, TrendingUp, FileText, Award, Target, BarChart3 } from 'lucide-react'

interface SectionScores {
  skills: number
  experience: number
  education: number
  projects: number
  keywords: number
}

interface AnalysisData {
  ats_score: number
  overall_match: string
  summary: string
  matching_skills: string[]
  missing_skills: string[]
  matched_keywords: string[]
  missing_keywords: string[]
  strengths: string[]
  weaknesses: string[]
  improvement_suggestions: string[]
  section_scores: SectionScores
  recommendation: string
}

interface ResumeInfo {
  filename: string
  original_filename: string
  file_size: number
  characters: number
  preview: string
}

interface ReportTemplateProps {
  analysis: AnalysisData
  resumeInfo: ResumeInfo
  jobDescription: string
}

// ---------------------------------------------------------------------------
// Design tokens — solid HEX/RGB only. No Tailwind classes, no CSS variables,
// no OKLCH/LAB, no gradients, no alpha-transparency. Everything here is safe
// for html2canvas to rasterize inside the isolated PDF-export iframe.
// ---------------------------------------------------------------------------
const colors = {
  ink: '#111827',
  body: '#374151',
  muted: '#6b7280',
  faint: '#9ca3af',
  border: '#e5e7eb',
  borderStrong: '#d1d5db',
  panel: '#f9fafb',
  white: '#ffffff',
  brand: '#1d4ed8',
  brandDark: '#1e3a5f',

  green: '#16a34a',
  greenBg: '#ecfdf5',
  greenBorder: '#a7f3d0',
  greenText: '#065f46',

  blue: '#2563eb',
  blueBg: '#eff6ff',
  blueBorder: '#bfdbfe',
  blueText: '#1e40af',

  amber: '#d97706',
  amberBg: '#fffbeb',
  amberBorder: '#fde68a',
  amberText: '#92400e',

  red: '#dc2626',
  redBg: '#fef2f2',
  redBorder: '#fecaca',
  redText: '#991b1b',
}

const fontStack = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 KB'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// 4-tier scoring system, consistent across the overall score and every
// category score card.
function getScoreTier(score: number) {
  if (score >= 90) return { label: 'Excellent', color: colors.green, bg: colors.greenBg, border: colors.greenBorder, text: colors.greenText }
  if (score >= 70) return { label: 'Good', color: colors.blue, bg: colors.blueBg, border: colors.blueBorder, text: colors.blueText }
  if (score >= 50) return { label: 'Average', color: colors.amber, bg: colors.amberBg, border: colors.amberBorder, text: colors.amberText }
  return { label: 'Weak', color: colors.red, bg: colors.redBg, border: colors.redBorder, text: colors.redText }
}

function getRecommendationTier(recommendation: string) {
  const rec = recommendation?.toLowerCase() || ''
  if (rec === 'hire') return { bg: colors.greenBg, text: colors.greenText, border: colors.greenBorder }
  if (rec === 'consider') return { bg: colors.amberBg, text: colors.amberText, border: colors.amberBorder }
  return { bg: colors.redBg, text: colors.redText, border: colors.redBorder }
}

export function ReportTemplate({ analysis, resumeInfo, jobDescription }: ReportTemplateProps) {
  const isJobMatch = Boolean(jobDescription && jobDescription.trim().length > 0)

  const getCategoryExplanation = (category: string, score: number) => {
    type ScoreLevel = 'high' | 'medium' | 'low'

    const explanations: Record<string, Record<ScoreLevel, string>> = {
      skills: {
        high: 'Strong technical skills section detected with relevant technologies.',
        medium: 'Skills section present but could benefit from more industry-specific keywords.',
        low: 'Skills section needs significant improvement with more relevant technical skills.'
      },
      experience: {
        high: 'Comprehensive professional experience with measurable achievements.',
        medium: 'Experience section exists but lacks quantifiable accomplishments.',
        low: 'Experience section needs more detail and measurable impact.'
      },
      education: {
        high: 'Well-structured education section with relevant qualifications.',
        medium: 'Education section present but could highlight more relevant coursework.',
        low: 'Education section needs more detail and relevance to target roles.'
      },
      projects: {
        high: 'Impressive project portfolio demonstrating practical skills.',
        medium: 'Projects section exists but could show more depth and impact.',
        low: 'Projects section needs more substantial and relevant examples.'
      },
      keywords: {
        high: 'Excellent keyword optimization for ATS systems.',
        medium: 'Good keyword presence but could be more targeted.',
        low: 'Keyword optimization needs significant improvement for ATS compatibility.'
      }
    }

    const level: ScoreLevel = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low'
    return explanations[category]?.[level] || ''
  }

  const groupRecommendations = () => {
    const high: string[] = []
    const medium: string[] = []
    const low: string[] = []

    analysis.improvement_suggestions?.forEach((suggestion) => {
      const lower = suggestion.toLowerCase()
      if (lower.includes('critical') || lower.includes('urgent') || lower.includes('must') || lower.includes('essential')) {
        high.push(suggestion)
      } else if (lower.includes('should') || lower.includes('recommend') || lower.includes('consider')) {
        medium.push(suggestion)
      } else {
        low.push(suggestion)
      }
    })

    return { high, medium, low }
  }

  const { high: highPriority, medium: mediumPriority, low: lowPriority } = groupRecommendations()
  const scoreTier = getScoreTier(analysis.ats_score)
  const recTier = getRecommendationTier(analysis.recommendation)

  const categories = [
    { label: 'Skills', score: analysis.section_scores?.skills || 0, key: 'skills' },
    { label: 'Experience', score: analysis.section_scores?.experience || 0, key: 'experience' },
    { label: 'Education', score: analysis.section_scores?.education || 0, key: 'education' },
    { label: 'Projects', score: analysis.section_scores?.projects || 0, key: 'projects' },
    { label: 'Keywords', score: analysis.section_scores?.keywords || 0, key: 'keywords' },
  ]

  // Builds paired rows for a two-column comparison table from two arrays of
  // possibly different lengths (used for Skills / Keywords comparisons).
  // Limits to top 8 items per column to keep the PDF concise.
  const buildComparisonRows = (left: string[] = [], right: string[] = []) => {
    const MAX_ITEMS = 8
    const leftLimited = left.slice(0, MAX_ITEMS)
    const rightLimited = right.slice(0, MAX_ITEMS)
    const rowCount = Math.max(leftLimited.length, rightLimited.length)
    return Array.from({ length: rowCount }, (_, i) => ({
      left: leftLimited[i] ?? null,
      right: rightLimited[i] ?? null,
    }))
  }

  // ---- shared inline style fragments -------------------------------------
  const sectionTitleStyle: CSSProperties = {
    fontSize: '15px',
    fontWeight: 700,
    color: colors.ink,
    marginBottom: '14px',
    paddingBottom: '8px',
    borderBottom: `2px solid ${colors.border}`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }

  const cardStyle: CSSProperties = {
    backgroundColor: colors.white,
    border: `1px solid ${colors.border}`,
    borderRadius: '10px',
    padding: '20px',
  }

  const sectionWrapStyle: CSSProperties = {
    marginBottom: '28px',
    breakInside: 'avoid',
  }

  const thStyle: CSSProperties = {
    padding: '10px 14px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: 700,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: `1px solid ${colors.borderStrong}`,
  }

  const tdStyle: CSSProperties = {
    padding: '10px 14px',
    fontSize: '13px',
    color: colors.body,
    borderBottom: `1px solid ${colors.border}`,
    verticalAlign: 'top',
  }

  return (
    <div style={{ backgroundColor: colors.white, width: '210mm', padding: '16mm 16mm 24mm', fontFamily: fontStack, color: colors.body }}>

      {/* ---------------- Header ---------------- */}
      <div style={{ marginBottom: '24px', paddingBottom: '18px', borderBottom: `3px solid ${colors.brandDark}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: colors.brandDark, letterSpacing: '-0.02em' }}>ResumeIQ AI</div>
          <div style={{ fontSize: '12px', color: colors.muted, marginTop: '2px' }}>AI-Powered ATS Resume Analysis Report</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '11px', color: colors.muted, lineHeight: 1.6 }}>
          <div>{isJobMatch ? 'Job Match Analysis' : 'Resume Review'}</div>
          <div>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      {/* ---------------- Resume Information ---------------- */}
      <div style={sectionWrapStyle}>
        <div style={sectionTitleStyle}>
          <FileText style={{ width: '16px', height: '16px', color: colors.brand }} />
          Resume Information
        </div>
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ ...tdStyle, width: '30%', fontWeight: 600, color: colors.ink, backgroundColor: colors.panel, borderBottom: `1px solid ${colors.border}` }}>File Name</td>
                <td style={{ ...tdStyle, borderBottom: `1px solid ${colors.border}` }}>{resumeInfo.original_filename}</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, fontWeight: 600, color: colors.ink, backgroundColor: colors.panel }}>File Size</td>
                <td style={tdStyle}>{formatFileSize(resumeInfo.file_size)}</td>
              </tr>
              <tr>
                <td style={{ ...tdStyle, fontWeight: 600, color: colors.ink, backgroundColor: colors.panel, borderBottom: 'none' }}>Characters Extracted</td>
                <td style={{ ...tdStyle, borderBottom: 'none' }}>{resumeInfo.characters.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- Executive Summary + Score ---------------- */}
      <div style={sectionWrapStyle}>
        <div style={sectionTitleStyle}>
          <TrendingUp style={{ width: '16px', height: '16px', color: colors.brand }} />
          Executive Summary
        </div>
        <div style={{ ...cardStyle, display: 'flex', gap: '20px', alignItems: 'stretch' }}>

          {/* Large ATS score card */}
          <div style={{
            flexShrink: 0,
            width: '150px',
            backgroundColor: scoreTier.bg,
            border: `1px solid ${scoreTier.border}`,
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 10px',
          }}>
            <div style={{ fontSize: '42px', fontWeight: 800, color: scoreTier.color, lineHeight: 1 }}>{analysis.ats_score}</div>
            <div style={{ fontSize: '11px', color: scoreTier.text, marginTop: '2px' }}>out of 100</div>
            <div style={{
              marginTop: '10px',
              fontSize: '12px',
              fontWeight: 700,
              color: colors.white,
              backgroundColor: scoreTier.color,
              padding: '3px 12px',
              borderRadius: '999px',
            }}>
              {scoreTier.label}
            </div>
          </div>

          {/* Summary text + recommendation */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isJobMatch && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: colors.muted, fontWeight: 600 }}>RECOMMENDATION</span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: recTier.bg,
                  color: recTier.text,
                  border: `1px solid ${recTier.border}`,
                }}>
                  <Award style={{ width: '12px', height: '12px' }} />
                  {analysis.recommendation?.toUpperCase()}
                </span>
              </div>
            )}
            <div style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: colors.body, lineHeight: 1.6 }}>{analysis.overall_match}</p>
            </div>
            {analysis.summary && (
              <div style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: colors.muted, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Detailed Summary</div>
                <p style={{ margin: 0, fontSize: '13px', color: colors.body, lineHeight: 1.6 }}>{analysis.summary}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- Category Scores ---------------- */}
      <div style={sectionWrapStyle}>
        <div style={sectionTitleStyle}>
          <BarChart3 style={{ width: '16px', height: '16px', color: colors.brand }} />
          Category Scores
        </div>
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: colors.panel }}>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Score</th>
                <th style={{ ...thStyle, width: '150px' }}>Progress</th>
                <th style={thStyle}>Insight</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => {
                const tier = getScoreTier(cat.score)
                const isLast = index === categories.length - 1
                return (
                  <tr key={cat.key} style={{ backgroundColor: index % 2 === 0 ? colors.white : colors.panel }}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: colors.ink, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>{cat.label}</td>
                    <td style={{ ...tdStyle, fontWeight: 700, color: tier.color, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>{cat.score}%</td>
                    <td style={{ ...tdStyle, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>
                      <div style={{ width: '100%', backgroundColor: colors.border, borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
                        <div style={{ height: '8px', borderRadius: '999px', backgroundColor: tier.color, width: `${Math.max(0, Math.min(100, cat.score))}%` }} />
                      </div>
                    </td>
                    <td style={{ ...tdStyle, fontSize: '12px', color: colors.muted, borderBottom: isLast ? 'none' : tdStyle.borderBottom }}>{getCategoryExplanation(cat.key, cat.score)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- Strengths & Weaknesses ---------------- */}
      {((analysis.strengths && analysis.strengths.length > 0) || (analysis.weaknesses && analysis.weaknesses.length > 0)) && (
        <div style={sectionWrapStyle}>
          <div style={{ display: 'flex', gap: '16px' }}>
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div style={{ flex: 1 }}>
                <div style={sectionTitleStyle}>
                  <CheckCircle2 style={{ width: '16px', height: '16px', color: colors.green }} />
                  Strengths
                </div>
                <div style={{ backgroundColor: colors.greenBg, border: `1px solid ${colors.greenBorder}`, borderRadius: '10px', padding: '14px' }}>
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: index === analysis.strengths.length - 1 ? 0 : '10px' }}>
                      <CheckCircle2 style={{ width: '15px', height: '15px', color: colors.green, flexShrink: 0, marginTop: '1px' }} />
                      <span style={{ fontSize: '13px', color: colors.body, lineHeight: 1.5 }}>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.weaknesses && analysis.weaknesses.length > 0 && (
              <div style={{ flex: 1 }}>
                <div style={sectionTitleStyle}>
                  <AlertTriangle style={{ width: '16px', height: '16px', color: colors.red }} />
                  Areas for Improvement
                </div>
                <div style={{ backgroundColor: colors.redBg, border: `1px solid ${colors.redBorder}`, borderRadius: '10px', padding: '14px' }}>
                  {analysis.weaknesses.map((weakness, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: index === analysis.weaknesses.length - 1 ? 0 : '10px' }}>
                      <AlertTriangle style={{ width: '15px', height: '15px', color: colors.red, flexShrink: 0, marginTop: '1px' }} />
                      <span style={{ fontSize: '13px', color: colors.body, lineHeight: 1.5 }}>{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- Job Match Only: Skills & Keywords Comparison Tables ---------------- */}
      {isJobMatch && (
        <>
          {(analysis.matching_skills?.length > 0 || analysis.missing_skills?.length > 0) && (
            <div style={sectionWrapStyle}>
              <div style={sectionTitleStyle}>
                <Target style={{ width: '16px', height: '16px', color: colors.brand }} />
                Skills Comparison
              </div>
              <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: colors.panel }}>
                      <th style={{ ...thStyle, color: colors.greenText, width: '50%' }}>Matching Skills</th>
                      <th style={{ ...thStyle, color: colors.redText, width: '50%' }}>Missing Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildComparisonRows(analysis.matching_skills, analysis.missing_skills).map((row, i, arr) => {
                      const isLast = i === arr.length - 1
                      const cellBorder = isLast ? 'none' : `1px solid ${colors.border}`
                      return (
                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? colors.white : colors.panel }}>
                          <td style={{ ...tdStyle, borderBottom: cellBorder }}>
                            {row.left && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <CheckCircle2 style={{ width: '13px', height: '13px', color: colors.green, flexShrink: 0 }} />
                                {row.left}
                              </span>
                            )}
                          </td>
                          <td style={{ ...tdStyle, borderBottom: cellBorder }}>
                            {row.right && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <AlertTriangle style={{ width: '13px', height: '13px', color: colors.red, flexShrink: 0 }} />
                                {row.right}
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(analysis.matched_keywords?.length > 0 || analysis.missing_keywords?.length > 0) && (
            <div style={sectionWrapStyle}>
              <div style={sectionTitleStyle}>
                <Target style={{ width: '16px', height: '16px', color: colors.brand }} />
                Keyword Comparison
              </div>
              <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: colors.panel }}>
                      <th style={{ ...thStyle, color: colors.greenText, width: '50%' }}>Matched Keywords</th>
                      <th style={{ ...thStyle, color: colors.redText, width: '50%' }}>Missing Keywords</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildComparisonRows(analysis.matched_keywords, analysis.missing_keywords).map((row, i, arr) => {
                      const isLast = i === arr.length - 1
                      const cellBorder = isLast ? 'none' : `1px solid ${colors.border}`
                      return (
                        <tr key={i} style={{ backgroundColor: i % 2 === 0 ? colors.white : colors.panel }}>
                          <td style={{ ...tdStyle, borderBottom: cellBorder }}>{row.left || ''}</td>
                          <td style={{ ...tdStyle, borderBottom: cellBorder }}>{row.right || ''}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ---------------- Recommendations Grouped by Priority ---------------- */}
      {analysis.improvement_suggestions && analysis.improvement_suggestions.length > 0 && (
        <div style={sectionWrapStyle}>
          <div style={sectionTitleStyle}>
            <TrendingUp style={{ width: '16px', height: '16px', color: colors.brand }} />
            Recommended Improvements
          </div>
          <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: colors.panel }}>
                  <th style={{ ...thStyle, width: '130px' }}>Priority</th>
                  <th style={thStyle}>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ...highPriority.map((rec) => ({ rec, tier: 'High', color: colors.red, bg: colors.redBg, text: colors.redText })),
                  ...mediumPriority.map((rec) => ({ rec, tier: 'Medium', color: colors.amber, bg: colors.amberBg, text: colors.amberText })),
                  ...lowPriority.map((rec) => ({ rec, tier: 'Optional', color: colors.blue, bg: colors.blueBg, text: colors.blueText })),
                ].map((item, index, arr) => {
                  const isLast = index === arr.length - 1
                  const cellBorder = isLast ? 'none' : `1px solid ${colors.border}`
                  return (
                    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? colors.white : colors.panel }}>
                      <td style={{ ...tdStyle, borderBottom: cellBorder }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: item.text,
                          backgroundColor: item.bg,
                          border: `1px solid ${item.color}`,
                          borderRadius: '999px',
                          padding: '2px 10px',
                        }}>
                          {item.tier}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, borderBottom: cellBorder }}>{item.rec}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- Footer ---------------- */}
      <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: colors.faint }}>
        <span>Generated by ResumeIQ AI</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  )
}
