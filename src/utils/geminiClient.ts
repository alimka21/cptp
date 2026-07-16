import { GoogleGenAI } from "@google/genai";
import { getCalculatedIntrakurikulerJP, getValidJpForTp } from "../data/intrakurikulerJP";
import { jsonrepair } from "jsonrepair";

export interface TujuanPembelajaran {
  element: string;
  competency: string;
  content: string;
  context?: string;
  text: string;
  code: string;
  jp: number;
  materiPokok: string;
  kelas: number;
}

export const FASE_KELAS_MAP: Record<string, number[]> = {
  A: [1, 2], B: [3, 4], C: [5, 6],
  D: [7, 8, 9], E: [10], F: [11, 12],
};

/**
 * Test the Gemini API connection
 */
export async function testGeminiConnection(apiKey: string): Promise<boolean> {
  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build-client",
        },
      },
    });
    
    // Attempt a very simple generation using the robust gemini-2.5-flash model
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello, just testing the connection. Reply with 'OK'.",
    });
    return true;
  } catch (error) {
    console.error("Gemini API Connection Test Failed:", error);
    return false;
  }
}

/**
 * Client-side helper to call the Gemini API with automatic retries and fallback
 */
async function generateContentClientSide(apiKey: string, params: {
  contents: string;
  systemInstruction: string;
  responseSchema: any;
}): Promise<any> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build-client",
      },
    },
  });

  const modelsToTry = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    let delay = 1000;
    const maxRetries = 2;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Client Gemini] Requesting ${modelName} (Attempt ${attempt}/${maxRetries})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: params.contents,
          config: {
            systemInstruction: params.systemInstruction,
            responseMimeType: "application/json",
            temperature: 0.3,
            maxOutputTokens: 8192,
            responseSchema: params.responseSchema,
          },
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || "";
        const errString = typeof err === "object" ? JSON.stringify(err) : String(err);
        console.error(`[Client Gemini] Error on ${modelName} (Attempt ${attempt}): ${errMsg || errString}`);
        
        const isTransient = 
          errMsg.includes("503") || 
          errMsg.includes("UNAVAILABLE") || 
          errMsg.includes("429") ||
          errMsg.includes("RESOURCE_EXHAUSTED") ||
          errString.includes("503") ||
          errString.includes("UNAVAILABLE") ||
          errString.includes("429") ||
          errString.includes("RESOURCE_EXHAUSTED") ||
          err?.status === 503 ||
          err?.status === 429 ||
          err?.statusCode === 503 ||
          err?.statusCode === 429;
        
        if (isTransient && attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content from Gemini Client API.");
}

export async function generateTpsClientSide(
  subject: string,
  phase: string,
  elements: Array<{ name: string; cpText: string }>,
  identity: any,
  apiKey: string
): Promise<TujuanPembelajaran[]> {
  const parsedPhase = phase.toUpperCase().trim();
  const schoolJenjang = identity?.jenjang || "SMP";
  const weeksS1 = Number(identity?.weeksSemester1 || 18);
  const weeksS2 = Number(identity?.weeksSemester2 || 18);

  // Determine classes
  let kelasList: string[] = [];
  if (identity?.grades && Array.isArray(identity.grades) && identity.grades.length > 0) {
    kelasList = identity.grades.map((g: any) => String(g).trim());
  } else {
    if (parsedPhase === "FONDASI" || subject.toLowerCase().includes("paud")) {
      kelasList = ["TK A", "TK B"];
    } else {
      const numericGrades = FASE_KELAS_MAP[parsedPhase] || [];
      kelasList = numericGrades.map(n => String(n));
    }
  }

  if (kelasList.length === 0) {
    kelasList = ["7", "8", "9"];
  }

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

  let jpGuideline = "\n=== PERSYARATAN TARGET ALOKASI JP (JAM PELAJARAN) TIAP KELAS BERDASARKAN PERMENDIKDASMEN NO 13 TAHUN 2025 ===";
  
  kelasList.forEach(K => {
    const calcK = getCalculatedIntrakurikulerJP(schoolJenjang, K, subject);
    const targetKTotal = calcK.jpAnnual;
    const targetKS1 = calcK.jpPerWeek * weeksS1;
    const targetKS2 = calcK.jpPerWeek * weeksS2;
    const isKelipatan3 = (calcK.jpPerWeek === 3);
    
    jpGuideline += `\n   * KELAS ${K} (Target JP Efektif Tahunan: ${targetKTotal} JP, S1: ${targetKS1} JP, S2: ${targetKS2} JP, JP Mingguan: ${calcK.jpPerWeek} JP):`;
    if (isKelipatan3) {
      jpGuideline += `\n     - Karena jumlah JP mingguan adalah 3 JP, gunakan alokasi JP per TP berupa kelipatan 3 seperti 3, 6, atau 9 JP. Alokasi 9 JP per TP sangat wajar untuk materi luas (setara 3 pertemuan). DILARANG KERAS menggunakan alokasi 4 JP atau angka yang tidak sinkron secara mingguan dengan 3 JP.`;
    } else {
      jpGuideline += `\n     - Gunakan alokasi JP per TP yang selaras dengan jpPerWeek = ${calcK.jpPerWeek} JP (misalnya: ${calcK.jpPerWeek} JP, ${calcK.jpPerWeek * 2} JP, atau ${calcK.jpPerWeek * 3} JP per TP untuk materi luas).`;
    }
    jpGuideline += `\n     - SANGAT PENTING & WAJIB DIPENUHI: Akumulasi total seluruh JP dari TP yang Anda rancang untuk Kelas ${K} haruslah berkisar antara 90% hingga 105% dari target tahunan (${targetKTotal} JP) yang tersebar seimbang (S1: sekitar ${targetKS1} JP, S2: sekitar ${targetKS2} JP). Jika total JP dari TP yang Anda hasilkan masih kurang dari target tersebut, Anda dianggap GAGAL. Solusinya, pecahlah materi CP menjadi lebih banyak TP yang sangat detail dan granular sehingga total akumulasi JP tahunan benar-benar menyentuh ${targetKTotal} JP secara utuh dan proporsional!`;
  });

  const schemaJpDescription = `Estimasi alokasi waktu default (dalam Jam Pelajaran). Sesuaikan secara ketat dengan target JP mingguan dan target semesteran tiap kelas yang dijelaskan di jpGuideline di atas.`;

  const systemPrompt = `Anda adalah seorang Konsultan Ahli Kurikulum Merdeka Kemdikbudristek dan Pengawas Sekolah Senior di Indonesia yang memiliki spesialisasi dalam menyusun dokumen Alur Tujuan Pembelajaran (ATP).

Tugas Anda adalah merumuskan Tujuan Pembelajaran (TP) yang SANGAT DETAIL, GRANULAR, KONKRET, SPESIFIK (TIDAK BOLEH UMUM/TIDAK BOLEH GENERIK), dan mendistribusikannya secara LOGIS BERJENJANG ke tiap kelas dalam Fase ${phase}.

ATURAN UTAMA PENYUSUNAN DAN DISTRIBUSI TP (WAJIB DIPATUHI):

1. PENGURAIAN CP SECARA GRANULAR (DEBUNDLING CP SECARA DETAIL):
   - Jangan membuat TP yang terlalu umum atau mengulang keseluruhan teks elemen (misal: "Peserta didik mampu memahami Sistem Komputer"). Itu sangat tidak berguna bagi guru. Anda harus memecah setiap elemen CP menjadi minimal 5 - 8 TP yang sangat granular, fungsional, dan operasional.
   - Analisis mendalam teks CP (cpText) dari tiap elemen masukan. Temukan setiap sub-topik, sub-konsep, keterampilan, atau sikap yang tertulis di dalam paragraf CP tersebut.
   - Contoh terbaik (Informatika Fase D) dari cara mendebundle paragraf CP menjadi TP granular yang benar-benar detail per kelas:
     * KELAS 7:
       - memahami konsep himpunan data terstruktur dalam kehidupan sehari-hari
       - memahami konsep lembar kerja pengolah data
       - membedakan fakta, opini, dan hoaks
       - memahami cara kerja dan penggunaan mesin pencari di internet
       - mengetahui kualitas informasi dan kredibilitas sumber informasi digital
       - mengenal ekosistem media pers digital
       - memahami pemanfaatan perangkat teknologi pengolah dokumen, lembar kerja, dan presentasi
     * KELAS 8:
       - menerapkan berpikir komputasional dalam menyelesaikan persoalan yang mengandung himpunan data berstruktur sederhana dengan volume kecil
       - menuliskan sekumpulan instruksi dengan menggunakan sekumpulan kosakata terbatas atau simbol dalam format pseudocode
       - mendeskripsikan komponen, fungsi, dan cara kerja komputer
       - Memahami konsep dan penerapan konektivitas jaringan lokal dan internet baik kabel maupun nirkabel
       - Memahami dampak perundungan digital
       - Memahami pentingnya menjaga rekam jejak digital
     * KELAS 9:
       - menerapkan berpikir komputasional untuk problem dalam kehidupan sehari-hari maupun dalam menghadapi masalah komputasi
       - memahami pemanfaatan perangkat teknologi digital untuk produksi dan diseminasi konten
       - Mengetahui jenis ruang publik virtual
       - Memahami pengamanan perangkat dari berbagai jenis malware
       - Melindungi data pribadi dan identitas digital
       - Membuat kata sandi yang aman
       - Memilah informasi yang bersifat privat dan publik
       - Memiliki kesadaran penuh (mindfulness) dalam dunia digital

   Gunakan logika pembagian di atas sebagai dasar berfikir metodologis dan pola pembagian kelas untuk semua mata pelajaran, jenjang, dan fase lainnya secara konsisten dan detail!

2. GRADASI DAN DISTRIBUSI KELAS LOGIS (LEARNING PROGRESSION):
   - Fase ${phase} mencakup kelas-kelas: ${kelasList.join(", ")}.
   - Distribusikan TP secara bergradasi kognitif dan urutan materi logis dari kelas pertama ke kelas akhir:
     * KELAS AWAL dalam Fase: Berfokus pada fondasi, pemahaman konsep dasar, literasi awal, pembedaan fakta dasar, pengenalan antarmuka/alat dasar, dan navigasi sederhana.
     * KELAS TENGAH dalam Fase: Berfokus pada penerapan tingkat menengah (apply), analisis kerja komponen fisik/sistem, deskripsi fungsionalitas, penulisan instruksi prosedural/simbol/pseudocode, serta kolaborasi kelompok sedang.
     * KELAS AKHIR dalam Fase: Berfokus pada pemecahan masalah kompleks, kreasi/produksi karya mandiri, diseminasi konten, perlindungan data pribadi dan keamanan siber (keamanan sandi, malware), pencegahan risiko digital lanjut, memilah informasi privat vs publik, serta kesadaran mental penuh (mindfulness digital) dan etika sosial tingkat lanjut.
   - Seluruh kelas (${kelasList.join(", ")}) harus mendapatkan alokasi rumusan TP yang relevan secara merata dan logis, tidak boleh menumpuk di satu kelas saja.

3. STRUKTUR FORMAT KALIMAT TP (LANGSUNG DIAWALI KKO):
   - Setiap rumusan TP bagian "text" harus langsung diawali oleh Kata Kerja Operasional (KKO) aktif yang tertulis dalam huruf kecil (tidak diawali 'Peserta didik mampu' atau kata pembuka generik), agar praktis dan presisi.

4. SATU KATA KERJA OPERASIONAL (KKO) UTAMA:
   Setiap TP harus mendefinisikan persis satu KKO tingkat kognitif Bloom di bidang "competency" (misalnya: memahami, menerapkan, membedakan, menuliskan, mendeskripsikan, membuat, dsb).

5. ESTIMASI JP DAN KODE TP:
   - Alokasikan JP yang wajar dan realistis untuk mengajarkan sub-materi tersebut.${jpGuideline}
   - Format kode TP: [MapelAbbr].[Phase].[Kelas].[SingkatanElemen].[NoUrut], contoh: ${mapelAbbr}.${phase}.7.BIL.01

Format Output: Harus berupa JSON Array terstruktur yang sesuai dengan skema JSON yang diberikan.`;

  const userPrompt = `Rincian Identitas dan Lembar Elemen CP Sumber Context Grounding:
Mata Pelajaran: ${subject}
Fase: ${phase} (mencakup kelas ${kelasList.join(", ")})
Kop/Profil: Guru/Satuan Pendidikan ${identity?.schoolName || "Sekolah"}, Penyusun ${identity?.author || "Guru"}

Daftar Elemen dan Teks CP Sumber Grounding (SETIAP TP HARUS GROUNDING KE TEKS CP INI):
${elements
  .map(
    (el, idx) =>
      `\n👉 Elemen ${idx + 1}: ${el.name}\nTeks CP Grounding Context: "${el.cpText}"`
  )
  .join("\n")}

Harap rumuskan Tujuan Pembelajaran (TP) yang terperinci secara profesional berdasarkan instruksi di atas. JANGAN mengarang materi di luar teks CP Sumber Grounding tersebut.`;

  const responseSchema = {
    type: "ARRAY",
    description: "Daftar rumusan Tujuan Pembelajaran (TP) yang dihasilkan.",
    items: {
      type: "OBJECT",
      properties: {
        element: {
          type: "STRING",
          description: "Nama elemen asal dari TP ini (harus persis sama dengan nama elemen masukan). No double quotes.",
        },
        kelas: {
          type: "STRING",
          description: `Kelas tujuan TP ini. HARUS salah satu dari: ${kelasList.join(", ")}.`,
        },
        competency: {
          type: "STRING",
          description: "Satu kata kerja operasional (KKO) utama.",
        },
        content: {
          type: "STRING",
          description: "Lingkup materi / konten utama.",
        },
        context: {
          type: "STRING",
          description: "Konteks penerapan praktis.",
        },
        text: {
          type: "STRING",
          description: "Kalimat lengkap TP (dimulai langsung dengan KKO, huruf kecil). No double quotes.",
        },
        code: {
          type: "STRING",
          description: `Kode TP unik, format: ${mapelAbbr}.${phase}.[Kelas].[SingkatanElemen].[NoUrut]`,
        },
        jp: {
          type: "INTEGER",
          description: schemaJpDescription,
        },
        materiPokok: {
          type: "STRING",
          description: "Materi pokok / topik utama.",
        },
      },
      required: ["element", "kelas", "competency", "content", "text", "code", "jp", "materiPokok"],
    },
  };

  const response = await generateContentClientSide(apiKey, {
    contents: userPrompt,
    systemInstruction: systemPrompt,
    responseSchema,
  });

  const rawOutput = response.text || "[]";
  let textOutput = rawOutput.trim();

  const firstBracket = textOutput.indexOf("[");
  const lastBracket = textOutput.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    textOutput = textOutput.substring(firstBracket, lastBracket + 1);
  } else if (textOutput.startsWith("```")) {
    textOutput = textOutput.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  let tps: TujuanPembelajaran[] = [];
  try {
    tps = JSON.parse(textOutput);
  } catch (err) {
    try {
      const repaired = jsonrepair(textOutput);
      tps = JSON.parse(repaired);
    } catch (repairErr) {
      console.error("Format JSON tidak valid client-side. Raw response:", rawOutput);
      throw new Error(`Gagal mengurai respon JSON dari Gemini API Client.`);
    }
  }

  const elementCounts: Record<string, number> = {};
  tps = tps.map((tp) => {
    let tpKelas = String(tp.kelas || identity?.grades?.[0] || "7").trim();
    if (!tpKelas) tpKelas = "7";

    const rawElement = (tp.element || "ELE").trim();
    const eleAbbr = rawElement.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, "");
    const key = `${tpKelas}_${eleAbbr}`;
    elementCounts[key] = (elementCounts[key] || 0) + 1;
    const noUrut = String(elementCounts[key]).padStart(2, "0");

    let code = (tp.code || "").trim();
    if (!code) {
      code = `${mapelAbbr}.${phase}.${tpKelas}.${eleAbbr}.${noUrut}`;
    }

    const calcK = getCalculatedIntrakurikulerJP(schoolJenjang, tpKelas, subject);
    const validJp = getValidJpForTp(tp.jp || 4, calcK.jpPerWeek);

    return {
      ...tp,
      kelas: Number(tpKelas) || 7,
      code,
      jp: validJp,
    };
  });

  if (identity?.grades && Array.isArray(identity.grades) && identity.grades.length > 0) {
    const targetGrades = identity.grades.map((g: any) => String(g).trim().toLowerCase());
    return tps.filter(tp => {
      const tpKelas = String(tp.kelas).trim().toLowerCase();
      return targetGrades.some(g => tpKelas === g || tpKelas.replace(/\s+/g, "") === `kelas${g}`);
    });
  }

  return tps;
}
