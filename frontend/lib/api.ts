const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export interface SectionScores {
  skills: number
  experience: number
  education: number
  projects: number
  keywords: number
}

export interface AnalysisData {
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

export interface ResumeInfo {
  filename: string
  original_filename: string
  file_size: number
  characters: number
  preview: string
}

export interface UploadResponse {
  success: boolean
  filename?: string
  original_filename?: string
  file_size?: number
  characters?: number
  preview?: string
  analysis?: AnalysisData
  message?: string
  error?: string
}

class CustomApiError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function uploadResume(
  file: File,
  jobDescription: string
): Promise<UploadResponse> {
  if (!file) {
    throw new CustomApiError('Please select a resume file', 'NO_FILE')
  }

  if (!jobDescription.trim()) {
    throw new CustomApiError('Please paste a job description', 'NO_JOB_DESCRIPTION')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('job_description', jobDescription)

  try {
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    })

    const data: UploadResponse = await response.json()

    if (!response.ok) {
      throw new CustomApiError(data.error || 'Upload failed', response.status.toString())
    }

    if (!data.success) {
      throw new CustomApiError(data.error || 'Upload failed', 'UPLOAD_FAILED')
    }

    return data
  } catch (error) {
    if (error instanceof CustomApiError) {
      throw error
    }

    if (error instanceof TypeError) {
      throw new CustomApiError('Unable to connect to the server. Please make sure the backend is running.', 'NETWORK_ERROR')
    }

    throw new CustomApiError('An unexpected error occurred', 'UNKNOWN_ERROR')
  }
}

export function getApiUrl(): string {
  return API_URL
}
