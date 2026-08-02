export function buildResumeExtractionPrompt(rawText: string, filename: string): string {
  const MAX_RAW = 15000;
  const text = rawText.length > MAX_RAW ? rawText.slice(0, MAX_RAW) : rawText;
  return `You are a Senior Resume Intelligence Parser. Extract a COMPLETE structured Resume JSON object from the raw text of a LinkedIn resume PDF.

FILENAME: ${filename}

RAW PDF TEXT:
==============================
${text}
==============================

EXTRACTION RULES (CRITICAL):
1. NEVER lose information. Every name, date, company, skill, project, achievement, certification, and detail present in the raw text MUST appear in the output.
2. NEVER invent, add, or fabricate any information that is not in the raw text.
3. NEVER replace original names — keep company names, degrees, and titles EXACTLY as written.
4. If a field is not present, use an empty string "" or empty array [] — never guess.
5. Preserve bullet points and descriptions as separate "highlights" items where available.
6. Keep dates in the exact original format (e.g. "Jan 2020", "2021", "March 2020 - Present").

Return ONLY a valid JSON object with this EXACT structure (no markdown, no code fences):
{
  "personal": {
    "name": "string",
    "headline": "string",
    "role": "string",
    "location": "string",
    "email": "string",
    "phone": "string",
    "linkedin": "string",
    "github": "string",
    "website": "string",
    "summary": "string"
  },
  "experience": [
    { "company": "string", "title": "string", "location": "string", "startDate": "string", "endDate": "string", "current": boolean, "description": "string", "highlights": ["string"] }
  ],
  "education": [
    { "institution": "string", "degree": "string", "field": "string", "startDate": "string", "endDate": "string", "score": "string", "description": "string" }
  ],
  "projects": [
    { "name": "string", "description": "string", "link": "string", "technologies": ["string"], "highlights": ["string"] }
  ],
  "skills": [
    { "name": "category or 'Skills'", "skills": ["string"] }
  ],
  "technologies": ["string"],
  "languages": [ { "language": "string", "proficiency": "string" } ],
  "certifications": [ { "name": "string", "issuer": "string", "date": "string", "link": "string" } ],
  "achievements": [ { "title": "string", "description": "string", "date": "string" } ],
  "awards": [ { "title": "string", "organization": "string", "date": "string", "description": "string" } ],
  "organizations": [ { "name": "string", "role": "string", "startDate": "string", "endDate": "string", "description": "string" } ],
  "volunteerExperience": [ { "organization": "string", "role": "string", "startDate": "string", "endDate": "string", "description": "string" } ],
  "publications": [ { "title": "string", "publisher": "string", "date": "string", "link": "string" } ],
  "courses": ["string"],
  "interests": ["string"]
}

RULES:
- Group skills by their category if labeled (e.g. "Programming Languages", "Frameworks", "Tools"), otherwise use a single group named "Skills".
- Also list every skill/technology/tool mentioned anywhere in the resume under "technologies".
- The "summary" is the "About"/"Summary"/"Profile" section at the top of the resume. Copy it VERBATIM.
- Role = current or most prominent job title. Headline = the headline/subtitle next to the name if present.
- Extract EVERYTHING. Long resumes must produce large arrays — do not truncate.`;
}

export function buildLinkedInDetectionPrompt(filename: string, head: string): string {
  return `Is the following document a LinkedIn Resume (a resume exported from LinkedIn as PDF)? 
FILENAME: ${filename}
DOCUMENT HEAD:
${head.slice(0, 1500)}

Answer ONLY with a JSON object: {"detectedAsLinkedIn": true|false, "confidence": 0-100}`;
}
