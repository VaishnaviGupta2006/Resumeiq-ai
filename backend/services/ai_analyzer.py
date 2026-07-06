import os
import json
import re
import google.generativeai as genai
from typing import Dict, Any

class AIAnalysisError(Exception):
    """Raised when AI analysis fails."""
    pass

class JSONParseError(Exception):
    """Raised when JSON parsing fails."""
    pass

def analyze_resume(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    Analyze resume text against job description using Google Gemini AI as an ATS system.
    
    Args:
        resume_text: Extracted text from the resume
        job_description: Job description text to match against
        
    Returns:
        Dictionary containing analysis results with the schema:
        {
            "ats_score": int,
            "overall_match": str,
            "summary": str,
            "matching_skills": list[str],
            "missing_skills": list[str],
            "matched_keywords": list[str],
            "missing_keywords": list[str],
            "strengths": list[str],
            "weaknesses": list[str],
            "improvement_suggestions": list[str],
            "section_scores": dict,
            "recommendation": str
        }
        
    Raises:
        AIAnalysisError: If AI analysis fails
        JSONParseError: If JSON parsing fails
    """
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise AIAnalysisError("GEMINI_API_KEY not found in environment variables")
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        prompt = f"""You are an ATS (Applicant Tracking System). Compare the resume against the job description and return ONLY valid JSON with this exact schema:
{{
  "ats_score": 0-100,
  "overall_match": "Brief description of how well the resume matches the job",
  "summary": "Brief 2-3 sentence summary of the candidate's fit for this role",
  "matching_skills": ["skill1", "skill2", ...],
  "missing_skills": ["skill1", "skill2", ...],
  "matched_keywords": ["keyword1", "keyword2", ...],
  "missing_keywords": ["keyword1", "keyword2", ...],
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "improvement_suggestions": ["suggestion1", "suggestion2", ...],
  "section_scores": {{
    "skills": 0-100,
    "experience": 0-100,
    "education": 0-100,
    "projects": 0-100,
    "keywords": 0-100
  }},
  "recommendation": "hire/consider/reject"
}}

ATS SCORING RULES - BE CONSERVATIVE:
The ATS score MUST depend on:
- Keyword overlap between resume and job description
- Required skills match
- Years of experience alignment
- Education requirements
- Technology stack match
- Project relevance to job requirements
- Missing critical requirements

SCORING GUIDE:
- 90-100: Outstanding (near-perfect match with all requirements)
- 80-89: Strong (good match with minor gaps)
- 70-79: Good (acceptable match but needs improvements)
- 60-69: Average (significant skill or experience gaps)
- Below 60: Weak (major gaps, poor fit)

DO NOT inflate scores. Only resumes closely matching the job description should receive scores above 85.

Job Description:
{job_description}

Resume:
{resume_text}

Return ONLY the JSON, no other text or markdown formatting."""

        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Remove markdown code fences if present
        response_text = re.sub(r'^```json\s*', '', response_text)
        response_text = re.sub(r'^```\s*', '', response_text)
        response_text = re.sub(r'\s*```$', '', response_text)
        
        # Parse JSON
        try:
            analysis = json.loads(response_text)
        except json.JSONDecodeError as e:
            raise JSONParseError(f"Failed to parse AI response as JSON: {str(e)}")
        
        # Validate required fields
        required_fields = [
            'ats_score', 'overall_match', 'summary', 'matching_skills',
            'missing_skills', 'matched_keywords', 'missing_keywords',
            'strengths', 'weaknesses', 'improvement_suggestions',
            'section_scores', 'recommendation'
        ]
        
        for field in required_fields:
            if field not in analysis:
                raise JSONParseError(f"Missing required field in AI response: {field}")
        
        # Validate types
        if not isinstance(analysis['ats_score'], int):
            raise JSONParseError("ats_score must be an integer")
        
        if not isinstance(analysis['overall_match'], str):
            raise JSONParseError("overall_match must be a string")
        
        if not isinstance(analysis['summary'], str):
            raise JSONParseError("summary must be a string")
        
        if not isinstance(analysis['recommendation'], str):
            raise JSONParseError("recommendation must be a string")
        
        list_fields = ['matching_skills', 'missing_skills', 'matched_keywords', 'missing_keywords', 'strengths', 'weaknesses', 'improvement_suggestions']
        for field in list_fields:
            if not isinstance(analysis[field], list):
                raise JSONParseError(f"{field} must be a list")
        
        # Validate section_scores is a dict with required keys
        if not isinstance(analysis['section_scores'], dict):
            raise JSONParseError("section_scores must be a dictionary")
        
        section_score_fields = ['skills', 'experience', 'education', 'projects', 'keywords']
        for field in section_score_fields:
            if field not in analysis['section_scores']:
                raise JSONParseError(f"Missing section_scores field: {field}")
            if not isinstance(analysis['section_scores'][field], int):
                raise JSONParseError(f"section_scores.{field} must be an integer")
        
        return analysis
        
    except Exception as e:
        if isinstance(e, (AIAnalysisError, JSONParseError)):
            raise
        raise AIAnalysisError(f"Unexpected error during AI analysis: {str(e)}")

