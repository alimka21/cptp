// Data Struktur Kurikulum Merdeka - Intrakurikuler berdasarkan Permendikdasmen No 13 Tahun 2025
export interface IntrakurikulerRule {
  jenjang: string;
  kelas: string;
  subjectNormalized: string; // lowercase for easy matching
  jpAnnual: number;
  weeksAssumed: number;
}

export const INTRAKURIKULER_DATA: IntrakurikulerRule[] = [
  // ==========================================
  // SD - KELAS 1 (Fase A, Asumsi 36 Minggu)
  // ==========================================
  { jenjang: "SD", kelas: "1", subjectNormalized: "agama", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "1", subjectNormalized: "pancasila", jpAnnual: 144, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "1", subjectNormalized: "bahasa indonesia", jpAnnual: 252, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "1", subjectNormalized: "matematika", jpAnnual: 144, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "1", subjectNormalized: "pjok", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "1", subjectNormalized: "seni", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "1", subjectNormalized: "bahasa inggris", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "1", subjectNormalized: "muatan lokal", jpAnnual: 72, weeksAssumed: 36 },

  // ==========================================
  // SD - KELAS 2 (Fase A, Asumsi 36 Minggu)
  // ==========================================
  { jenjang: "SD", kelas: "2", subjectNormalized: "agama", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "2", subjectNormalized: "pancasila", jpAnnual: 144, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "2", subjectNormalized: "bahasa indonesia", jpAnnual: 288, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "2", subjectNormalized: "matematika", jpAnnual: 180, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "2", subjectNormalized: "pjok", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "2", subjectNormalized: "seni", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "2", subjectNormalized: "bahasa inggris", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "2", subjectNormalized: "muatan lokal", jpAnnual: 72, weeksAssumed: 36 },

  // ==========================================
  // SD - KELAS 3 (Fase B, Asumsi 36 Minggu)
  // ==========================================
  { jenjang: "SD", kelas: "3", subjectNormalized: "agama", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "3", subjectNormalized: "pancasila", jpAnnual: 144, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "3", subjectNormalized: "bahasa indonesia", jpAnnual: 216, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "3", subjectNormalized: "matematika", jpAnnual: 180, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "3", subjectNormalized: "ipas", jpAnnual: 180, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "3", subjectNormalized: "pjok", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "3", subjectNormalized: "seni", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "3", subjectNormalized: "bahasa inggris", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "3", subjectNormalized: "muatan lokal", jpAnnual: 72, weeksAssumed: 36 },

  // ==========================================
  // SD - KELAS 4 (Fase B, Asumsi 36 Minggu)
  // ==========================================
  { jenjang: "SD", kelas: "4", subjectNormalized: "agama", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "4", subjectNormalized: "pancasila", jpAnnual: 144, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "4", subjectNormalized: "bahasa indonesia", jpAnnual: 216, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "4", subjectNormalized: "matematika", jpAnnual: 180, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "4", subjectNormalized: "ipas", jpAnnual: 180, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "4", subjectNormalized: "pjok", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "4", subjectNormalized: "seni", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "4", subjectNormalized: "bahasa inggris", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "4", subjectNormalized: "muatan lokal", jpAnnual: 72, weeksAssumed: 36 },

  // ==========================================
  // SD - KELAS 5 (Fase C, Asumsi 36 Minggu)
  // ==========================================
  { jenjang: "SD", kelas: "5", subjectNormalized: "agama", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "5", subjectNormalized: "pancasila", jpAnnual: 144, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "5", subjectNormalized: "bahasa indonesia", jpAnnual: 216, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "5", subjectNormalized: "matematika", jpAnnual: 180, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "5", subjectNormalized: "ipas", jpAnnual: 180, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "5", subjectNormalized: "pjok", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "5", subjectNormalized: "seni", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "5", subjectNormalized: "bahasa inggris", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "5", subjectNormalized: "koding dan kecerdasan artifisial", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SD", kelas: "5", subjectNormalized: "muatan lokal", jpAnnual: 72, weeksAssumed: 36 },

  // ==========================================
  // SD - KELAS 6 (Fase C, Asumsi 32 Minggu)
  // ==========================================
  { jenjang: "SD", kelas: "6", subjectNormalized: "agama", jpAnnual: 96, weeksAssumed: 32 },
  { jenjang: "SD", kelas: "6", subjectNormalized: "pancasila", jpAnnual: 128, weeksAssumed: 32 },
  { jenjang: "SD", kelas: "6", subjectNormalized: "bahasa indonesia", jpAnnual: 192, weeksAssumed: 32 },
  { jenjang: "SD", kelas: "6", subjectNormalized: "matematika", jpAnnual: 160, weeksAssumed: 32 },
  { jenjang: "SD", kelas: "6", subjectNormalized: "ipas", jpAnnual: 160, weeksAssumed: 32 },
  { jenjang: "SD", kelas: "6", subjectNormalized: "pjok", jpAnnual: 96, weeksAssumed: 32 },
  { jenjang: "SD", kelas: "6", subjectNormalized: "seni", jpAnnual: 96, weeksAssumed: 32 },
  { jenjang: "SD", kelas: "6", subjectNormalized: "bahasa inggris", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SD", kelas: "6", subjectNormalized: "koding dan kecerdasan artifisial", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SD", kelas: "6", subjectNormalized: "muatan lokal", jpAnnual: 64, weeksAssumed: 32 },

  // ==========================================
  // SMP - KELAS 7 (Fase D, Asumsi 36 Minggu)
  // ==========================================
  { jenjang: "SMP", kelas: "7", subjectNormalized: "agama", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "7", subjectNormalized: "pancasila", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "7", subjectNormalized: "bahasa indonesia", jpAnnual: 180, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "7", subjectNormalized: "matematika", jpAnnual: 144, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "7", subjectNormalized: "ipa", jpAnnual: 144, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "7", subjectNormalized: "ips", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "7", subjectNormalized: "bahasa inggris", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "7", subjectNormalized: "pjok", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "7", subjectNormalized: "informatika", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "7", subjectNormalized: "seni", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "7", subjectNormalized: "koding dan kecerdasan artifisial", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "7", subjectNormalized: "muatan lokal", jpAnnual: 72, weeksAssumed: 36 },

  // ==========================================
  // SMP - KELAS 8 (Fase D, Asumsi 36 Minggu)
  // ==========================================
  { jenjang: "SMP", kelas: "8", subjectNormalized: "agama", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "8", subjectNormalized: "pancasila", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "8", subjectNormalized: "bahasa indonesia", jpAnnual: 180, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "8", subjectNormalized: "matematika", jpAnnual: 144, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "8", subjectNormalized: "ipa", jpAnnual: 144, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "8", subjectNormalized: "ips", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "8", subjectNormalized: "bahasa inggris", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "8", subjectNormalized: "pjok", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "8", subjectNormalized: "informatika", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "8", subjectNormalized: "seni", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "8", subjectNormalized: "koding dan kecerdasan artifisial", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMP", kelas: "8", subjectNormalized: "muatan lokal", jpAnnual: 72, weeksAssumed: 36 },

  // ==========================================
  // SMP - KELAS 9 (Fase D, Asumsi 32 Minggu)
  // ==========================================
  { jenjang: "SMP", kelas: "9", subjectNormalized: "agama", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SMP", kelas: "9", subjectNormalized: "pancasila", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SMP", kelas: "9", subjectNormalized: "bahasa indonesia", jpAnnual: 160, weeksAssumed: 32 },
  { jenjang: "SMP", kelas: "9", subjectNormalized: "matematika", jpAnnual: 128, weeksAssumed: 32 },
  { jenjang: "SMP", kelas: "9", subjectNormalized: "ipa", jpAnnual: 128, weeksAssumed: 32 },
  { jenjang: "SMP", kelas: "9", subjectNormalized: "ips", jpAnnual: 96, weeksAssumed: 32 },
  { jenjang: "SMP", kelas: "9", subjectNormalized: "bahasa inggris", jpAnnual: 96, weeksAssumed: 32 },
  { jenjang: "SMP", kelas: "9", subjectNormalized: "pjok", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SMP", kelas: "9", subjectNormalized: "informatika", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SMP", kelas: "9", subjectNormalized: "seni", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SMP", kelas: "9", subjectNormalized: "koding dan kecerdasan artifisial", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SMP", kelas: "9", subjectNormalized: "muatan lokal", jpAnnual: 64, weeksAssumed: 32 },

  // ==========================================
  // SMA - KELAS 10 (Fase E, Asumsi 36 Minggu)
  // ==========================================
  { jenjang: "SMA", kelas: "10", subjectNormalized: "agama", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "10", subjectNormalized: "pancasila", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "10", subjectNormalized: "bahasa indonesia", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "10", subjectNormalized: "matematika", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "10", subjectNormalized: "ipa", jpAnnual: 216, weeksAssumed: 36 }, // IPA Terpadu (Fisika, Kimia, Biologi)
  { jenjang: "SMA", kelas: "10", subjectNormalized: "ips", jpAnnual: 288, weeksAssumed: 36 }, // IPS Terpadu
  { jenjang: "SMA", kelas: "10", subjectNormalized: "bahasa inggris", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "10", subjectNormalized: "pjok", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "10", subjectNormalized: "informatika", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "10", subjectNormalized: "seni", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "10", subjectNormalized: "koding dan kecerdasan artifisial", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "10", subjectNormalized: "muatan lokal", jpAnnual: 72, weeksAssumed: 36 },

  // ==========================================
  // SMA - KELAS 11 (Fase F, Asumsi 36 Minggu)
  // ==========================================
  { jenjang: "SMA", kelas: "11", subjectNormalized: "agama", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "11", subjectNormalized: "pancasila", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "11", subjectNormalized: "bahasa indonesia", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "11", subjectNormalized: "matematika", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "11", subjectNormalized: "bahasa inggris", jpAnnual: 108, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "11", subjectNormalized: "sejarah", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "11", subjectNormalized: "pjok", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "11", subjectNormalized: "seni", jpAnnual: 72, weeksAssumed: 36 },
  { jenjang: "SMA", kelas: "11", subjectNormalized: "koding dan kecerdasan artifisial", jpAnnual: 180, weeksAssumed: 36 }, // Elective Koding/KA
  { jenjang: "SMA", kelas: "11", subjectNormalized: "pilihan", jpAnnual: 180, weeksAssumed: 36 }, // Electives (each represents 5 JP/week)

  // ==========================================
  // SMA - KELAS 12 (Fase F, Asumsi 32 Minggu)
  // ==========================================
  { jenjang: "SMA", kelas: "12", subjectNormalized: "agama", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SMA", kelas: "12", subjectNormalized: "pancasila", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SMA", kelas: "12", subjectNormalized: "bahasa indonesia", jpAnnual: 96, weeksAssumed: 32 },
  { jenjang: "SMA", kelas: "12", subjectNormalized: "matematika", jpAnnual: 96, weeksAssumed: 32 },
  { jenjang: "SMA", kelas: "12", subjectNormalized: "bahasa inggris", jpAnnual: 96, weeksAssumed: 32 },
  { jenjang: "SMA", kelas: "12", subjectNormalized: "sejarah", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SMA", kelas: "12", subjectNormalized: "pjok", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SMA", kelas: "12", subjectNormalized: "seni", jpAnnual: 64, weeksAssumed: 32 },
  { jenjang: "SMA", kelas: "12", subjectNormalized: "koding dan kecerdasan artifisial", jpAnnual: 160, weeksAssumed: 32 }, // Elective Koding/KA
  { jenjang: "SMA", kelas: "12", subjectNormalized: "pilihan", jpAnnual: 160, weeksAssumed: 32 } // Electives (each represents 5 JP/week)
];

export function getCalculatedIntrakurikulerJP(
  jenjang: string,
  kelas: string,
  subject: string
): { jpAnnual: number; weeksAssumed: number; jpPerWeek: number } {
  const normJenjang = (jenjang || "").toUpperCase();
  const normKelas = String(kelas || "").trim();
  const normSubject = (subject || "").toLowerCase();

  // Try parsing custom subject keywords
  let keyword = "custom";
  if (normSubject.includes("matematika")) keyword = "matematika";
  else if (normSubject.includes("pancasila")) keyword = "pancasila";
  else if (normSubject.includes("indonesia")) keyword = "bahasa indonesia";
  else if (normSubject.includes("inggris")) keyword = "bahasa inggris";
  else if (normSubject.includes("pjok") || normSubject.includes("olahraga") || normSubject.includes("jasmani")) keyword = "pjok";
  else if (normSubject.includes("seni") || normSubject.includes("budaya")) keyword = "seni";
  else if (normSubject.includes("ipas")) keyword = "ipas";
  else if (normSubject.includes("ipa") || normSubject.includes("fisika") || normSubject.includes("kimia") || normSubject.includes("biologi")) {
    if (normJenjang === "SMA" && ["11", "12"].includes(normKelas)) {
      keyword = "pilihan";
    } else {
      keyword = "ipa";
    }
  }
  else if (normSubject.includes("ips") || normSubject.includes("ekonomi") || normSubject.includes("sosiologi") || normSubject.includes("geografi")) {
    if (normJenjang === "SMA" && ["11", "12"].includes(normKelas)) {
      keyword = "pilihan";
    } else {
      keyword = "ips";
    }
  }
  else if (normSubject.includes("informatika") || normSubject.includes("komputer")) {
    if (normJenjang === "SMA" && ["11", "12"].includes(normKelas)) {
      keyword = "pilihan";
    } else {
      keyword = "informatika";
    }
  }
  else if (normSubject.includes("sejarah")) {
    if (normJenjang === "SMA" && ["11", "12"].includes(normKelas)) {
      keyword = normSubject.includes("lanjut") ? "pilihan" : "sejarah";
    } else {
      keyword = "sejarah";
    }
  }
  else if (normSubject.includes("agama") || normSubject.includes("budi pekerti")) keyword = "agama";
  else if (normSubject.includes("koding") || normSubject.includes("artifisial") || normSubject.includes("ai")) keyword = "koding dan kecerdasan artifisial";
  else if (normSubject.includes("pilihan")) keyword = "pilihan";
  else if (normSubject.includes("lokal") || normSubject.includes("mulo")) keyword = "muatan lokal";

  // Find exact rule
  const found = INTRAKURIKULER_DATA.find(
    (rule) =>
      rule.jenjang === normJenjang &&
      rule.kelas === normKelas &&
      rule.subjectNormalized === keyword
  );

  if (found) {
    return {
      jpAnnual: found.jpAnnual,
      weeksAssumed: found.weeksAssumed,
      jpPerWeek: Math.round(found.jpAnnual / found.weeksAssumed)
    };
  }

  // Sensible default fallback based on level and subject
  let defaultJp = 4;
  let defaultWeeks = 36;
  if (["6", "9", "12"].includes(normKelas)) {
    defaultWeeks = 32;
  }

  if (normSubject.includes("indonesia")) defaultJp = 5;
  else if (normSubject.includes("inggris") || normSubject.includes("pancasila") || normSubject.includes("agama")) defaultJp = 2;
  else if (normSubject.includes("mulo") || normSubject.includes("lokal")) defaultJp = 2;

  return {
    jpAnnual: defaultJp * defaultWeeks,
    weeksAssumed: defaultWeeks,
    jpPerWeek: defaultJp
  };
}

/**
 * Get valid JP for a Tujuan Pembelajaran based on weekly JP workload rules.
 * Minimal meeting JP is 2, maximum meeting JP is 3.
 * 
 * - If jpPerWeek is 2, meetings are 2 JP (valid JPs are multiples of 2)
 * - If jpPerWeek is 3, meetings are 3 JP (valid JPs are multiples of 3)
 * - If jpPerWeek is 4, meetings are 2 + 2 JP (valid JPs are multiples of 2)
 * - If jpPerWeek is 5, meetings are alternating 3 JP and 2 JP.
 *   Valid cumulative JP values are: 2, 3, 5, 7, 8, 10, 12, 13, 15, 17, 18, 20, 22, 23, 25, 27, 28, 30...
 */
export function getValidJpForTp(desiredJp: number, jpPerWeek: number): number {
  desiredJp = Math.max(2, desiredJp); // Minimal 2 JP per meeting
  
  if (jpPerWeek === 2 || jpPerWeek === 4) {
    return Math.max(2, Math.round(desiredJp / 2) * 2);
  }
  
  if (jpPerWeek === 3) {
    return Math.max(3, Math.round(desiredJp / 3) * 3);
  }
  
  if (jpPerWeek === 5) {
    // Alternating sequence of meetings (3, 2, 3, 2, ...) and (2, 3, 2, 3, ...)
    // Let's generate valid sums up to 100 JP
    const validSums = new Set<number>([2]);
    let sumA = 0;
    for (let i = 1; i <= 40; i++) {
      sumA += (i % 2 === 1) ? 3 : 2;
      validSums.add(sumA);
    }
    let sumB = 0;
    for (let i = 1; i <= 40; i++) {
      sumB += (i % 2 === 1) ? 2 : 3;
      validSums.add(sumB);
    }
    
    let closest = 5;
    let minDiff = Infinity;
    for (const val of validSums) {
      const diff = Math.abs(val - desiredJp);
      if (diff < minDiff) {
        minDiff = diff;
        closest = val;
      }
    }
    return closest;
  }
  
  // Default fallback based on parity
  if (jpPerWeek % 2 === 0) {
    return Math.max(2, Math.round(desiredJp / 2) * 2);
  }
  if (jpPerWeek % 3 === 0) {
    return Math.max(3, Math.round(desiredJp / 3) * 3);
  }
  
  return Math.max(2, Math.round(desiredJp / 2) * 2);
}

