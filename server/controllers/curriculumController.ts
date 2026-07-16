import { Request, Response, NextFunction } from "express";
import * as fs from "fs";
import * as path from "path";

export function getBaseDir() {
  const pathsToTry = [
    path.join(process.cwd(), "public/capaian_pembelajaran"),
    path.join(process.cwd(), "public", "capaian_pembelajaran"),
    path.join(process.cwd(), "capaian_pembelajaran"),
    "/var/task/public/capaian_pembelajaran",
    "/var/task/capaian_pembelajaran"
  ];

  try {
    if (typeof __dirname !== "undefined" && __dirname) {
      pathsToTry.push(
        path.join(__dirname, "../public/capaian_pembelajaran"),
        path.join(__dirname, "public/capaian_pembelajaran"),
        path.join(__dirname, "../capaian_pembelajaran"),
        path.join(__dirname, "capaian_pembelajaran"),
        path.join(__dirname, "../../capaian_pembelajaran"),
        path.join(__dirname, "../../../capaian_pembelajaran")
      );
    }
  } catch (e) {
    // __dirname not defined in ESM
  }

  for (const p of pathsToTry) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  return path.join(process.cwd(), "public/capaian_pembelajaran");
}

async function getFileContent(req: Request, folder: string, fileName: string): Promise<string> {
  const baseDir = getBaseDir();
  const filePath = path.join(baseDir, folder, fileName);
  try {
    if (fs.existsSync(filePath)) {
      return await fs.promises.readFile(filePath, "utf-8");
    }
  } catch (err) {
    console.warn(`Local file read failed for ${filePath}:`, err);
  }

  // Fallback to fetch from the request's host (handles Vercel serverless CDN storage gracefully)
  try {
    const protocol = req.headers["x-forwarded-proto"] || (req.secure ? "https" : "http");
    const host = req.headers.host;
    if (host) {
      const url = `${protocol}://${host}/capaian_pembelajaran/${folder}/${fileName}`;
      console.log(`Vercel CDN Fallback: Fetching from ${url}`);
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        if (text.trim().toLowerCase().startsWith("<!doctype") || text.trim().toLowerCase().startsWith("<html")) {
          console.warn(`Fetch returned HTML instead of markdown for ${url}`);
        } else {
          return text;
        }
      } else {
        console.warn(`Fetch returned status ${res.status} for ${url}`);
      }
    }
  } catch (err) {
    console.warn(`Fetch fallback failed:`, err);
  }

  throw new Error(`File ${folder}/${fileName} could not be loaded.`);
}

import { Type } from "@google/genai";
import { ai, checkApiKey, generateTujuanPembelajaran } from "../config/aiService";
import { trackRequest } from "../utils/statsStore";
import { generateKalenderMingguan } from "../utils/kalenderUtils";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";
import {
  createParagraph,
  createCell,
  createHeaderCell,
  getNoBorders,
  generateDocx,
} from "../utils/docxUtils";

/**
 * Endpoint 1: Analyze CP and extract TPs using Gemini AI
 */
export async function analyzeCp(req: Request, res: Response, next: NextFunction) {
  try {
    trackRequest("analysis");
    const { subject, phase, elements, identity } = req.body;

    if (!elements || !Array.isArray(elements) || elements.length === 0) {
      return res.status(400).json({ error: "Elemen CP wajib dicantumkan dalam bentuk array." });
    }

    if (!checkApiKey()) {
      return res.status(500).json({
        error: "GEMINI_API_KEY tidak terpasang. Tolong tambahkan kunci API Anda di menu Pengaturan.",
      });
    }

    // Helper mapel abbreviation
    const subjectAbbrMap: { [key: string]: string } = {
      "Matematika": "MTK",
      "Pancasila": "PP",
      "Bahasa Indonesia": "IND",
      "Bahasa Inggris": "ING",
      "IPA": "IPA",
      "Informatika": "INF",
      "Fisika": "FIS",
      "Kimia": "KIM",
      "Biologi": "BIO",
    };
    const mapelAbbr = subjectAbbrMap[subject] || subject.substring(0, 3).toUpperCase();

    const tpsList = await generateTujuanPembelajaran(subject, phase, elements, identity, mapelAbbr);

    res.json({ success: true, tps: tpsList });
  } catch (error: any) {
    next(error);
  }
}

/**
 * Endpoint 2: Export Multi-Tab Documents to Microsoft Word (.docx)
 */
export async function exportDocx(req: Request, res: Response, next: NextFunction) {
  try {
    trackRequest("export");
    const { identity, tps, babs, elements, tab = "all" } = req.body;

    if (!identity) {
      return res.status(400).json({ error: "Data identitas petaan guru wajib dicantumkan." });
    }

    // Load templates and render fields dynamically using docxtemplater & pizzip
    const docBuffer = await generateDocx(tab, {
      identity,
      tps,
      babs,
      elements,
    });

    const sanitizedFileName = `administrasi_${tab}_${identity.subject.replace(/\s+/g, "_")}_fase_${identity.phase}.docx`.toLowerCase();

    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename=${encodeURIComponent(sanitizedFileName)}`,
      "Content-Length": docBuffer.length,
    });

    res.send(docBuffer);
  } catch (error: any) {
    next(error);
  }
}

/**
 * Endpoint 3: Fetch CP Preset dynamically from markdown files based on Subject, Phase, and Jenjang
 */
export async function getCPData(req: Request, res: Response, next: NextFunction) {
  try {
    const { subject, phase, jenjang } = req.body;

    if (!subject || !phase) {
      return res.status(400).json({ error: "Mata pelajaran (subject) dan Fase wajib disertakan." });
    }

    // Determine target directory and filename
    const baseDir = getBaseDir();
    const parsedPhase = phase.toUpperCase().trim();
    const isPaud = jenjang === "PAUD" || parsedPhase === "FONDASI" || subject.toLowerCase().includes("paud");
    
    const folder = isPaud ? "Fase_Fondasi" : `Fase_${parsedPhase}`;
    const fileName = isPaud ? "PAUD.md" : `${toFileName(subject)}.md`;
    const targetFilePath = path.join(baseDir, folder, fileName);

    let content = "";
    let isSingleFile = true;

    try {
      // 1. Try reading the single subject file first
      content = await getFileContent(req, folder, fileName);
    } catch {
      // 2. Fallback to the unified file if the single file is not found
      isSingleFile = false;
      const fallbackFileName = isPaud ? "Fase_Fondasi_PAUD.md" : `Fase_${parsedPhase}.md`;
      try {
        content = await getFileContent(req, folder, fallbackFileName);
      } catch (err) {
        return res.status(404).json({
          error: `File Capaian Pembelajaran untuk Fase ${phase} tidak ditemukan. (Tried CDN & local path)`,
          path: fileName,
        });
      }
    }

    let elementsList: Array<{ name: string; cpText: string }> = [];

    if (isSingleFile) {
      // Parse elements directly from the single subject file
      elementsList = parseElementsFromMd(content);
    } else {
      // Parse the file for the specified Phase & Subject from the unified file
      const lines = content.split(/\r?\n/);
      const cleanSubject = subject.toLowerCase().trim();

      // Common abbreviations/aliases to ensure perfect alignment
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

      let inTargetSubjectBlock = false;
      let inCPSection = false;
      let currentElement: { name: string; cpText: string } | null = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith("# Capaian Pembelajaran:")) {
          const headerText = line.substring("# Capaian Pembelajaran:".length).toLowerCase();
          const mainSubjectPart = headerText.split("—")[0].trim();
          
          let isMatch = false;
          const subjText = mainSubjectPart.replace(/[^a-z0-9]/gi, "");
          const searchSubjText = cleanSubject.replace(/[^a-z0-9]/gi, "");

          if (subjText.includes(searchSubjText) || searchSubjText.includes(subjText)) {
            isMatch = true;
          } else {
            // Check aliases
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
              // We moved past our target subject block
              break;
            }
          }
          continue;
        }

        if (inTargetSubjectBlock) {
          if (line === "---") {
            // End of current subject block
            break;
          }

          if (line.startsWith("## Capaian Pembelajaran Fase")) {
            inCPSection = true;
            continue;
          }

          if (line.startsWith("## ") && !line.startsWith("## Capaian Pembelajaran Fase")) {
            // Other sections inside the subject (e.g., Karakteristik, Daftar Elemen)
            inCPSection = false;
            continue;
          }

          if (inCPSection) {
            // Check for bold elements e.g. "**Bilangan**"
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

      // In case of any parsing mismatch/empty result, check for a table fallback
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
    }

    return res.json({
      success: true,
      subject,
      phase,
      jenjang,
      sourceFile: isSingleFile ? fileName : (isPaud ? "Fase_Fondasi_PAUD.md" : `Fase_${parsedPhase}.md`),
      elements: elementsList
    });

  } catch (error: any) {
    next(error);
  }
}

function toFileName(subject: string): string {
  return subject.trim().replace(/[^A-Za-z0-9 ]/g, "").replace(/\s+/g, "_");
}

function parseElementsFromMd(content: string): Array<{ name: string; cpText: string }> {
  const lines = content.split(/\r?\n/);
  const elementsList: Array<{ name: string; cpText: string }> = [];
  let inCPSection = false;
  let currentElement: { name: string; cpText: string } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("## Capaian Pembelajaran Fase")) {
      inCPSection = true;
      continue;
    }

    if (line.startsWith("## ") && !line.startsWith("## Capaian Pembelajaran Fase")) {
      inCPSection = false;
      continue;
    }

    if (inCPSection) {
      // Check for bold elements e.g. "**Bilangan**"
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

  if (currentElement) {
    elementsList.push(currentElement);
  }

  // Fallback to table parser if elementsList is empty
  if (elementsList.length === 0) {
    let insideTable = false;
    for (const line of lines) {
      if (line.includes("|") && (line.toLowerCase().includes("elemen") || line.toLowerCase().includes("capaian"))) {
        insideTable = true;
        continue;
      }
      if (insideTable) {
        if (!line.includes("|")) {
          insideTable = false;
          continue;
        }
        const cells = line.split("|").map(c => c.trim()).filter(c => c !== "");
        if (cells.length >= 2 && !cells[0].includes("---")) {
          const elName = cells[0];
          const elDesc = cells[1];
          // Skip headers
          if (
            elName.toLowerCase() !== "elemen" &&
            elName.toLowerCase() !== "capaian pembelajaran" &&
            elName.toLowerCase() !== "deskripsi" &&
            elName.length > 2
          ) {
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

/**
 * Endpoint 4: Compute Weekly School Calendar and compute effective weeks & JP
 */
export async function computeKalender(req: Request, res: Response, next: NextFunction) {
  try {
    trackRequest("request");
    const { tanggalMulai, tanggalAkhir, jpPerMinggu, rentangNonEfektif } = req.body;

    if (!tanggalMulai || !tanggalAkhir) {
      return res.status(400).json({ error: "Parameter tanggalMulai dan tanggalAkhir harus disertakan." });
    }

    const jp = Number(jpPerMinggu) || 0;
    const nonEfektifList = Array.isArray(rentangNonEfektif) ? rentangNonEfektif : [];

    const hasil = generateKalenderMingguan(tanggalMulai, tanggalAkhir, jp, nonEfektifList);

    return res.json({
      success: true,
      ...hasil
    });
  } catch (error: any) {
    next(error);
  }
}/**
 * Endpoint 5: Get list of subjects for a selected phase
 */
export async function getSubjectsForPhase(req: Request, res: Response, next: NextFunction) {
  try {
    trackRequest("request");
    const { phase, jenjang } = req.body;
    if (!phase) {
      return res.status(400).json({ error: "Fase (phase) wajib disertakan." });
    }

    const baseDir = getBaseDir();
    const parsedPhase = phase.toUpperCase().trim();
    const isPaud = jenjang === "PAUD" || parsedPhase === "FONDASI" || parsedPhase === "PAUD";

    const folder = isPaud ? "Fase_Fondasi" : `Fase_${parsedPhase}`;
    const targetFolder = path.join(baseDir, folder);

    const subjectsSet = new Set<string>();

    try {
      // 1. Check if there are individual subject files in the folder (e.g. Matematika.md)
      const files = await fs.promises.readdir(targetFolder);
      for (const file of files) {
        if (file.endsWith(".md")) {
          // Skip the general unified files and gitkeep
          if (
            file !== `Fase_${parsedPhase}.md` &&
            file !== "Fase_Fondasi_PAUD.md" &&
            file !== "PAUD.md"
          ) {
            // Take the name without .md and replace underscores with space as dynamic subjects
            const subjName = file.substring(0, file.length - 3).replace(/_/g, " ");
            subjectsSet.add(subjName);
          }
        }
      }
    } catch (err) {
      // If folder doesn't exist, just ignore and proceed to unified files standard
    }

    // 2. Read compiled / unified file if it exists, or look for standard unified files
    const unifiedFileName = isPaud ? "Fase_Fondasi_PAUD.md" : `Fase_${parsedPhase}.md`;

    try {
      const content = await getFileContent(req, folder, unifiedFileName);
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
    } catch {
      // If unified file doesn't exist either, check PAUD.md for PAUD fallback
      if (isPaud) {
        try {
          const content = await getFileContent(req, folder, "PAUD.md");
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
            }
          }
        } catch {
          // ignore fallback if fails
        }
      }
    }

    // Standard high-quality Curriculums fallbacks by phase if still empty
    if (subjectsSet.size === 0) {
      const standardFallbackSubjects: { [phase: string]: string[] } = {
        "FONDASI": ["PAUD / Fondasi"],
        "A": ["Matematika", "Pendidikan Pancasila", "Bahasa Indonesia", "Seni Rupa", "Seni Musik", "Seni Teater", "Seni Tari", "Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)"],
        "B": ["Matematika", "Pendidikan Pancasila", "Bahasa Indonesia", "Bahasa Inggris", "Ilmu Pengetahuan Alam dan Sosial (IPAS)", "Seni Rupa", "Seni Musik", "Seni Teater", "Seni Tari", "Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)"],
        "C": ["Matematika", "Pendidikan Pancasila", "Bahasa Indonesia", "Bahasa Inggris", "Ilmu Pengetahuan Alam dan Sosial (IPAS)", "Seni Rupa", "Seni Musik", "Seni Teater", "Seni Tari", "Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)"],
        "D": ["Matematika", "Pendidikan Pancasila", "Bahasa Indonesia", "Bahasa Inggris", "Ilmu Pengetahuan Alam (IPA)", "Ilmu Pengetahuan Sosial (IPS)", "Informatika", "Seni Rupa", "Seni Musik", "Seni Teater", "Seni Tari", "Pendidikan Jasmani Olahraga dan Kesehatan (PJOK)", "Prakarya Kerajinan", "Prakarya Rekayasa", "Prakarya Budi Daya", "Prakarya Pengolahan"],
        "E": ["Matematika", "Pendidikan Pancasila", "Bahasa Indonesia", "Bahasa Inggris", "Fisika", "Kimia", "Biologi", "Sejarah", "Geografi", "Ekonomi", "Sosiologi", "Informatika", "Seni Seni Rupa", "Seni Musik", "Seni Teater", "Seni Tari"],
        "F": ["Matematika", "Pendidikan Pancasila", "Bahasa Indonesia", "Bahasa Inggris", "Fisika", "Kimia", "Biologi", "Matematika Tingkat Lanjut", "Informatika", "Sejarah", "Geografi", "Ekonomi", "Sosiologi", "Antropologi", "Bahasa Arab", "Bahasa Mandarin", "Seni Rupa", "Seni Musik", "Seni Teater", "Seni Tari"]
      };
      const fallbackList = standardFallbackSubjects[parsedPhase] || [];
      for (const f of fallbackList) {
        subjectsSet.add(f);
      }
    }

    // Convert Set to sorted Array
    const subjectsList = Array.from(subjectsSet).sort();

    return res.json({
      success: true,
      phase,
      jenjang,
      subjects: subjectsList,
    });
  } catch (error: any) {
    next(error);
  }
}

