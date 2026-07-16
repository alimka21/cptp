// Utility to statically import and parse Capaian Pembelajaran (.md) files at build-time using Vite's import.meta.glob.
// This completely resolves Vercel filesystem access issues by bundling the data with the client application.

const mdModules = (import.meta as any).glob('../capaian_pembelajaran/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Standard high-quality Curriculums fallbacks by phase if parsing yields empty results
const standardFallbackSubjects: { [phase: string]: string[] } = {
  "FONDASI": ["PAUD / Fondasi"],
  "A": ["Matematika", "Pendidikan Pancasila", "Bahasa Indonesia", "Seni Rupa", "Seni Musik", "Seni Teater", "Seni Tari", "Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)"],
  "B": ["Matematika", "Pendidikan Pancasila", "Bahasa Indonesia", "Bahasa Inggris", "Ilmu Pengetahuan Alam dan Sosial (IPAS)", "Seni Rupa", "Seni Musik", "Seni Teater", "Seni Tari", "Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)"],
  "C": ["Matematika", "Pendidikan Pancasila", "Bahasa Indonesia", "Bahasa Inggris", "Ilmu Pengetahuan Alam dan Sosial (IPAS)", "Seni Rupa", "Seni Musik", "Seni Teater", "Seni Tari", "Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)"],
  "D": ["Matematika", "Pendidikan Pancasila", "Bahasa Indonesia", "Bahasa Inggris", "Ilmu Pengetahuan Alam (IPA)", "Ilmu Pengetahuan Sosial (IPS)", "Informatika", "Seni Rupa", "Seni Musik", "Seni Teater", "Seni Tari", "Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)", "Prakarya Kerajinan", "Prakarya Rekayasa", "Prakarya Budi Daya", "Prakarya Pengolahan"],
  "E": ["Matematika", "Pendidikan Pancasila", "Bahasa Indonesia", "Bahasa Inggris", "Fisika", "Kimia", "Biologi", "Sejarah", "Geografi", "Ekonomi", "Sosiologi", "Informatika", "Seni Rupa", "Seni Musik", "Seni Teater", "Seni Tari"],
  "F": ["Matematika", "Pendidikan Pancasila", "Bahasa Indonesia", "Bahasa Inggris", "Fisika", "Kimia", "Biologi", "Matematika Tingkat Lanjut", "Informatika", "Sejarah", "Geografi", "Ekonomi", "Sosiologi", "Antropologi", "Bahasa Arab", "Bahasa Mandarin", "Seni Rupa", "Seni Musik", "Seni Teater", "Seni Tari"]
};

const aliases: { [key: string]: string[] } = {
  "ipa": ["ilmu pengetahuan alam", "ipa"],
  "ips": ["ilmu pengetahuan sosial", "ips"],
  "pancasila": ["pendidikan pancasila", "pancasila"],
  "islam": ["pendidikan agama islam", "islam", "paibp"],
  "kristen": ["pendidikan agama kristen", "kristen"],
  "katolik": ["pendidikan agama katolik", "katolik"],
  "hindu": ["pendidikan agama hindu", "hindu"],
  "buddha": ["pendidikan agama buddha", "buddha", "budha"],
  "khonghucu": ["pendidikan agama khonghucu", "khonghucu"],
  "koding": ["koding", "kecerdasan", "artificial"],
  "olahraga": ["pendidikan jasmani", "pjok", "olahraga", "kesehatan"],
  "pjok": ["pendidikan jasmani", "pjok", "olahraga", "kesehatan"]
};

function getFileContent(folder: string, fileName: string): string | null {
  // Try matching by the filename in our bundled modules
  const searchKey = `${folder}/${fileName}`.toLowerCase();
  for (const [key, content] of Object.entries(mdModules)) {
    if (key.toLowerCase().endsWith(searchKey)) {
      return content;
    }
  }
  return null;
}

export function getLocalSubjects(phase: string, jenjang: string): string[] {
  const parsedPhase = phase.toUpperCase().trim();
  const isPaud = jenjang === "PAUD" || parsedPhase === "FONDASI" || parsedPhase === "PAUD";
  const folder = isPaud ? "Fase_Fondasi" : `Fase_${parsedPhase}`;
  const unifiedFileName = isPaud ? "Fase_Fondasi_PAUD.md" : `Fase_${parsedPhase}.md`;

  const subjectsSet = new Set<string>();

  const content = getFileContent(folder, unifiedFileName);
  if (content) {
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().includes("mata pelajaran:")) {
        const searchKey = "mata pelajaran:";
        const idx = trimmed.toLowerCase().indexOf(searchKey);
        if (idx !== -1) {
          let rest = trimmed.substring(idx + searchKey.length).trim();
          rest = rest.replace(/\*\*|^\s*:\s*|^\s*|\s*$/g, "").trim();
          if (rest) {
            subjectsSet.add(rest);
          }
        }
      } else if (trimmed.startsWith("# Capaian Pembelajaran:")) {
        let rest = trimmed.substring("# Capaian Pembelajaran:".length).trim();
        const parts = rest.split(/[\u2014\u2013-]/);
        const subjName = parts[0].trim();
        if (subjName) {
          subjectsSet.add(subjName);
        }
      }
    }
  }

  // Fallback to standard subjects if set is empty
  if (subjectsSet.size === 0) {
    const fallbackList = standardFallbackSubjects[parsedPhase] || [];
    for (const f of fallbackList) {
      subjectsSet.add(f);
    }
  }

  return Array.from(subjectsSet).sort();
}

export function getLocalCP(subject: string, phase: string, jenjang: string): Array<{ name: string; cpText: string }> {
  const parsedPhase = phase.toUpperCase().trim();
  const isPaud = jenjang === "PAUD" || parsedPhase === "FONDASI" || subject.toLowerCase().includes("paud");
  const folder = isPaud ? "Fase_Fondasi" : `Fase_${parsedPhase}`;
  const fileName = isPaud ? "Fase_Fondasi_PAUD.md" : `Fase_${parsedPhase}.md`;

  const content = getFileContent(folder, fileName);
  if (!content) {
    return [];
  }

  const elementsList: Array<{ name: string; cpText: string }> = [];
  const lines = content.split(/\r?\n/);
  const cleanSubject = subject.toLowerCase().trim();

  let inTargetSubjectBlock = false;
  let inCPSection = false;
  let currentElement: { name: string; cpText: string } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("# Capaian Pembelajaran:")) {
      const headerText = line.substring("# Capaian Pembelajaran:".length).toLowerCase();
      const mainSubjectPart = headerText.split(/[\u2014\u2013-]/)[0].trim();
      
      let isMatch = false;
      const subjText = mainSubjectPart.replace(/[^a-z0-9]/gi, "");
      const searchSubjText = cleanSubject.replace(/[^a-z0-9]/gi, "");

      if (subjText === searchSubjText || subjText.includes(searchSubjText) || searchSubjText.includes(subjText)) {
        isMatch = true;
      } else {
        for (const [key, keywords] of Object.entries(aliases)) {
          const hasKeywordInSearch = keywords.some(kw => cleanSubject.includes(kw));
          const hasKeywordInHeader = keywords.some(kw => mainSubjectPart.includes(kw));
          if (hasKeywordInSearch && hasKeywordInHeader) {
            isMatch = true;
            break;
          }
        }
      }

      if (isMatch) {
        inTargetSubjectBlock = true;
        inCPSection = false;
        currentElement = null;
      } else {
        if (inTargetSubjectBlock) {
          break;
        }
      }
      continue;
    }

    if (inTargetSubjectBlock) {
      if (line === "---") {
        break;
      }

      if (line.startsWith("## Capaian Pembelajaran Fase")) {
        inCPSection = true;
        continue;
      }

      if (line.startsWith("## ") && !line.startsWith("## Capaian Pembelajaran Fase")) {
        inCPSection = false;
        continue;
      }

      if (inCPSection) {
        const elementHeaderRegex = /^\*\*(.+?)\*\*$/;
        const matchHeader = line.match(elementHeaderRegex);

        if (matchHeader) {
          if (currentElement) {
            elementsList.push(currentElement);
          }
          const elName = matchHeader[1].trim();
          currentElement = { name: elName, cpText: "" };
        } else if (currentElement && line.length > 0) {
          if (currentElement.cpText) {
            currentElement.cpText += "\n" + line;
          } else {
            currentElement.cpText = line;
          }
        }
      }
    }
  }

  if (currentElement) {
    elementsList.push(currentElement);
  }

  // Table fallback if elementsList is empty
  if (elementsList.length === 0) {
    let insideTable = false;
    for (const line of lines) {
      if (line.includes("|") && line.toLowerCase().includes("elemen") && line.toLowerCase().includes("deskripsi")) {
        insideTable = true;
        continue;
      }
      if (insideTable) {
        if (!line.includes("|")) {
          insideTable = false;
          continue;
        }
        const cells = line.split("|").map(c => c.trim()).filter(Boolean);
        if (cells.length >= 2 && !cells[0].includes("---")) {
          const elName = cells[0];
          const elDesc = cells[1];
          if (elName !== "Elemen" && elName !== "Deskripsi" && elName.length > 2) {
            elementsList.push({
              name: elName,
              cpText: elDesc
            });
          }
        }
      }
    }
  }

  return elementsList;
}
