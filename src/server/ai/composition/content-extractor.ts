import type { PortfolioData } from "@/server/types";

export function extractName(prompt: string): string | null {
  const m = prompt.match(/(?:my\s+)?name\s+(?:is|id|:|=)\s*["""]?([A-Za-z\s.]+?)["""]?(?:\s*[,.]|\s+I\s+|\s*$)/i);
  if (m) return m[1].trim();
  const m2 = prompt.match(/I'm\s+([A-Za-z\s.]+?)(?:\s*[,.]|\s+a\s+|\s+and\s+|\s*$)/i);
  if (m2) return m2[1].trim();
  return null;
}

export function extractEmail(prompt: string): string | null {
  const m = prompt.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : null;
}

export function extractRole(prompt: string): string | null {
  const m = prompt.match(/(?:i\s+am\s+an?\s+|role\s*(?::|=|is)\s*["""]?)([A-Za-z\s/&,+-]+?)(?:\s*[.。]|\s+with\s+|\s+and\s+|\s+at\s+|\s*$)/i);
  if (m) return m[1].trim();
  const m2 = prompt.match(/([A-Za-z\s/&,+-]+?)(?:\s+Developer|\s+Engineer|\s+Designer|\s+Analyst)/i);
  if (m2) return m2[0].trim();
  return null;
}

export function extractSkills(prompt: string): string[] {
  const m = prompt.match(/(?:skills?|technologies?|tech\s*stack|technical\s*skills?)\s*(?::|=|is|are)\s*([\s\S]+?)(?:\n|\r|projects?|experience?|education|\.\s|$)/i);
  if (m) {
    return m[1]
      .split(/[,;]\s*/)
      .map(s => s.trim().replace(/^\.\.\.$/, "").replace(/^and\s+/i, "").trim())
      .filter(s => s.length > 0 && !s.match(/^(etc|and|like)$/i));
  }
  return [];
}

export function extractExperience(prompt: string): Array<{ company: string; role: string; description: string }> {
  const results: Array<{ company: string; role: string; description: string }> = [];
  const sec = prompt.match(/(?:experience|work\s*history|employment)\s*(?::|=)?\s*([\s\S]+?)(?:\n\s*(?:projects?|education|skills?|email|$))/i);
  if (sec) {
    const lines = sec[1].split(/[。\n]/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      const m = line.match(/(\d+\s*(?:month|year|yr)s?(?:\s+of)?\s*(?:real\s+world\s+)?)?(?:experience\s+)?(?:at|in)\s+([A-Za-z0-9\s&.]+?)(?:\s*[,.]|\s+as\s+(.+?))?\s*$/i);
      if (m) {
        results.push({
          company: m[2].trim().replace(/^in\s+/i, ""),
          role: m[3]?.trim() || "Developer",
          description: line,
        });
      }
    }
    if (results.length === 0) {
      const pattern = /(\d+)\s+(month|year|yr)s?\s+(?:of\s+)?(?:real\s+world\s+)?experience\s+(?:at|in)\s+([A-Za-z0-9&. ]+)/i;
      const simple = sec[1].match(pattern);
      if (simple) {
        results.push({ company: simple[3].trim(), role: "Developer", description: sec[1].trim() });
      }
    }
  }
  return results;
}

export function extractEducation(prompt: string): Array<{ institution: string; degree: string; field: string; startDate: string; endDate: string }> {
  const results: Array<{ institution: string; degree: string; field: string; startDate: string; endDate: string }> = [];
  const sec = prompt.match(/(?:education|qualification|academic)\s*(?::|=)?\s*([\s\S]+?)(?:\n\s*(?:projects?|experience|skills?|email|$))/i);
  if (sec) {
    const parts = sec[1].split(/[,;]\s*/).map(s => s.trim()).filter(Boolean);
    for (const part of parts) {
      const m = part.match(/(MCA|BCA|B\.?Sc|M\.?Sc|B\.?Tech|M\.?Tech|MBA|BBA|BA|MA|B\.?Com|M\.?Com|PhD|Diploma|Higher\s*Secondary|12th|10th|SSC|HSC|Bachelor|Master|Graduation)\s*(?:in\s+)?([A-Za-z\s]+?)?\s*(?:(\d{4})\s*[-–to]+\s*(\d{4})|complement\s+(\d{4})|(\d{4}))/i);
      if (m) {
        const degree = m[1];
        const field = m[2]?.trim() || "";
        const startYear = m[3] || "";
        const endYear = m[4] || m[5] || m[6] || "";
        let institution = "";
        const instM = part.match(/(?:at|from|in)\s+([A-Za-z\s&.]+?)(?:\s*[,.]|\s+\d{4}|\s*$)/i);
        if (instM) institution = instM[1].trim();
        results.push({ institution, degree, field, startDate: startYear, endDate: endYear });
      }
    }
    if (results.length === 0) {
      const simple = sec[1].match(/([A-Za-z\s]+)\s+(\d{4})\s*[-–]+\s*(\d{4})/);
      if (simple) {
        results.push({ institution: simple[1].trim(), degree: "", field: "", startDate: simple[2], endDate: simple[3] });
      }
    }
  }
  return results;
}

export function extractProjects(prompt: string): Array<{ title: string; description: string; tags: string[] }> {
  const results: Array<{ title: string; description: string; tags: string[] }> = [];
  const sec = prompt.match(/(?:projects?|portfolio)\s*(?::|=|are)?\s*([\s\S]+?)(?:\n\s*(?:experience|education|skills?|email|contact|$))/i);
  if (sec) {
    const parts = sec[1].split(/(?:\n|\r)(?=\s*[A-Z][A-Za-z\s]+?(?:\s*:|=|is\s))/);
    for (const part of parts) {
      const lines = part.split("\n").map(l => l.trim()).filter(Boolean);
      for (const line of lines) {
        const m = line.match(/([A-Za-z][A-Za-z\s&.]+?)\s*(?::|=|is|–|—)\s*(.+?)(?:\n|$)/);
        if (m) {
          const title = m[1].trim();
          const desc = m[2].trim().replace(/\.\.\.$/, "").replace(/^a\s+/i, "").trim();
          const techTags: string[] = [];
          const techM = desc.match(/(?:using|with|built\s+(?:with|using))\s+([A-Za-z0-9#,.\s]+)/i);
          if (techM) {
            techTags.push(...techM[1].split(/[,#]\s*/).map(t => t.trim()).filter(Boolean));
          }
          results.push({ title, description: desc, tags: techTags });
        }
      }
    }
    if (results.length === 0) {
      const parts2 = sec[1].split(/[。\n]/).map(l => l.trim()).filter(Boolean);
      for (const part of parts2) {
        const m = part.match(/([A-Za-z][A-Za-z\s&]+?)\s*(?::|=|is)\s*(.+)/);
        if (m) {
          results.push({ title: m[1].trim(), description: m[2].trim(), tags: [] });
        }
      }
    }
  }
  return results;
}

export function extractUserDetails(prompt: string): PortfolioData {
  const details: PortfolioData = {
    personalInfo: {},
    sections: {},
  };

  const name = extractName(prompt);
  if (name) details.personalInfo!.name = name;

  const email = extractEmail(prompt);
  if (email) {
    details.personalInfo!.email = email;
    if (!details.sections!.contact) details.sections!.contact = {} as Record<string, unknown>;
    (details.sections!.contact as Record<string, unknown>).email = email;
  }

  const role = extractRole(prompt);
  if (role) details.personalInfo!.role = role;

  const skills = extractSkills(prompt);
  if (skills.length > 0) {
    details.sections!.skills = skills.map(s => ({ name: s, level: "intermediate", category: "Technology" }));
  }

  const experience = extractExperience(prompt);
  if (experience.length > 0) {
    details.sections!.experience = experience.map(e => ({
      company: e.company,
      role: e.role,
      description: e.description,
      startDate: "",
      endDate: "",
    }));
  }

  const education = extractEducation(prompt);
  if (education.length > 0) {
    details.sections!.education = education.map(e => ({
      institution: e.institution,
      degree: e.degree,
      field: e.field,
      startDate: e.startDate,
      endDate: e.endDate,
    }));
  }

  const projects = extractProjects(prompt);
  if (projects.length > 0) {
    details.sections!.projects = projects.map(p => ({
      title: p.title,
      description: p.description,
      tags: p.tags,
      link: "",
    }));
  }

  return details;
}

export function injectUserDetails(target: PortfolioData, source: PortfolioData): PortfolioData {
  const result: PortfolioData = {
    personalInfo: { ...(target.personalInfo || {}) },
    sections: { ...(target.sections || {}) },
    theme: target.theme,
    layout: target.layout,
    navigation: target.navigation,
    seo: target.seo,
  };

  const src = source.personalInfo || {};
  if (src.name) result.personalInfo!.name = src.name;
  if (src.email) result.personalInfo!.email = src.email;
  if (src.role) result.personalInfo!.role = src.role;
  if (src.bio) result.personalInfo!.bio = src.bio;

  const srcSections = source.sections || {};

  if (Array.isArray(srcSections.skills) && (srcSections.skills as Array<unknown>).length > 0) {
    result.sections!.skills = srcSections.skills;
  }

  if (Array.isArray(srcSections.projects) && (srcSections.projects as Array<unknown>).length > 0) {
    result.sections!.projects = srcSections.projects;
  }

  if (Array.isArray(srcSections.experience) && (srcSections.experience as Array<unknown>).length > 0) {
    result.sections!.experience = srcSections.experience;
  }

  if (Array.isArray(srcSections.education) && (srcSections.education as Array<unknown>).length > 0) {
    result.sections!.education = srcSections.education;
  }

  if (srcSections.contact && typeof srcSections.contact === "object") {
    const existingContact = result.sections!.contact as Record<string, unknown> || {};
    result.sections!.contact = { ...existingContact, ...(srcSections.contact as Record<string, unknown>) };
  }

  return result;
}
