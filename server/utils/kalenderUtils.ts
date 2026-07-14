import { SesiKurikulum } from "../../src/types/sesiKurikulum";
import { getCalculatedIntrakurikulerJP } from "../../src/data/intrakurikulerJP";

export interface RentangNonEfektif {
  namaKegiatan: string;
  tanggalMulai: string; // Format: "YYYY-MM-DD"
  tanggalAkhir: string; // Format: "YYYY-MM-DD"
}

export interface MingguKalender {
  noMingguSemester: number;
  bulan: string;
  mingguKeBulan: number;
  tanggalMulai: string; // Format: "YYYY-MM-DD"
  tanggalAkhir: string; // Format: "YYYY-MM-DD"
  statusEfektif: boolean;
  keterangan: string;
}

export interface HasilKalender {
  mingguList: MingguKalender[];
  totalMingguEfektif: number;
  totalJpEfektif: number;
}

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function parseUTCDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function toISODateString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Generates weekly calendar details from start to end date,
 * mapping out month, week number of the month, and effective status.
 *
 * @param tanggalMulai Starting date of the semester "YYYY-MM-DD"
 * @param tanggalAkhir Closing date of the semester "YYYY-MM-DD"
 * @param jpPerMinggu Target hours of teaching per week
 * @param rentangNonEfektif Non-effective periods/holidays
 */
export function generateKalenderMingguan(
  tanggalMulai: string,
  tanggalAkhir: string,
  jpPerMinggu: number,
  rentangNonEfektif: RentangNonEfektif[]
): HasilKalender {
  const startLimit = parseUTCDate(tanggalMulai);
  const endLimit = parseUTCDate(tanggalAkhir);

  if (startLimit > endLimit) {
    return {
      mingguList: [],
      totalMingguEfektif: 0,
      totalJpEfektif: 0,
    };
  }

  // Align to first Monday
  const tempDate = new Date(startLimit);
  const day = tempDate.getUTCDay();
  const subtractDays = day === 0 ? 6 : day - 1;
  tempDate.setUTCDate(tempDate.getUTCDate() - subtractDays);
  let currentMonday = tempDate;

  const mingguList: MingguKalender[] = [];
  const monthWeekCounter: Record<string, number> = {};
  let noMingguSemester = 0;

  while (currentMonday <= endLimit) {
    const currentSunday = new Date(currentMonday);
    currentSunday.setUTCDate(currentSunday.getUTCDate() + 6);

    let isEffective = true;
    const activities: string[] = [];

    for (const range of rentangNonEfektif) {
      const nonEffStart = parseUTCDate(range.tanggalMulai);
      const nonEffEnd = parseUTCDate(range.tanggalAkhir);

      // Check overlap
      const overlapStart = currentMonday > nonEffStart ? currentMonday : nonEffStart;
      const overlapEnd = currentSunday < nonEffEnd ? currentSunday : nonEffEnd;

      if (overlapStart <= overlapEnd) {
        isEffective = false;
        if (!activities.includes(range.namaKegiatan)) {
          activities.push(range.namaKegiatan);
        }
      }
    }

    // Midpoint to find month name (Thursday)
    const midWeek = new Date(currentMonday);
    midWeek.setUTCDate(midWeek.getUTCDate() + 3);
    const monthName = MONTH_NAMES[midWeek.getUTCMonth()];

    monthWeekCounter[monthName] = (monthWeekCounter[monthName] || 0) + 1;
    const mingguKeBulan = monthWeekCounter[monthName];

    noMingguSemester++;

    mingguList.push({
      noMingguSemester,
      bulan: monthName,
      mingguKeBulan,
      tanggalMulai: toISODateString(currentMonday),
      tanggalAkhir: toISODateString(currentSunday),
      statusEfektif: isEffective,
      keterangan: activities.join(", "),
    });

    currentMonday = new Date(currentMonday);
    currentMonday.setUTCDate(currentMonday.getUTCDate() + 7);
  }

  const totalMingguEfektif = mingguList.filter((m) => m.statusEfektif).length;
  const totalJpEfektif = totalMingguEfektif * jpPerMinggu;

  return {
    mingguList,
    totalMingguEfektif,
    totalJpEfektif,
  };
}

export interface ValidasiAlokasiJP {
  totalJpEfektif: number;
  totalJpBab: number;
  totalJpTp: number;
  targetJpRegulasi: number;
  selisihBab: number; // Sisa Kuota Bab: totalJpEfektif - totalJpBab
  selisihTp: number;  // Sisa Kuota Tp: totalJpEfektif - totalJpTp
  statusValid: boolean; // selisihTp >= 0 (Sisa Kuota must be positive or zero)
}

export function validateAlokasiJP(sesi: SesiKurikulum): ValidasiAlokasiJP {
  const weeksS1 = sesi.identitas?.weeksSemester1 !== undefined ? Number(sesi.identitas.weeksSemester1) : 18;
  const weeksS2 = sesi.identitas?.weeksSemester2 !== undefined ? Number(sesi.identitas.weeksSemester2) : 18;
  const jpPerWeek = sesi.identitas?.jpPerWeek !== undefined ? Number(sesi.identitas.jpPerWeek) : 4;
  
  // Total Anggaran JP Tersedia = Jumlah Minggu Kerja x JP Tatap Muka Per Pekan
  const totalJpEfektif = (weeksS1 + weeksS2) * jpPerWeek;

  const grades = sesi.identitas?.grades || sesi.identitas?.kelas || ["7"];
  const jenjang = sesi.identitas?.jenjang || "SMP";
  const subject = sesi.identitas?.subject || sesi.identitas?.mapel || "Matematika";

  let targetJpRegulasi = 0;
  for (const grade of grades) {
    const rule = getCalculatedIntrakurikulerJP(jenjang, grade, subject);
    targetJpRegulasi += rule.jpAnnual;
  }

  const totalJpBab = (sesi.bab || []).reduce((sum, b) => {
    const jp = b.jpAlokasi !== undefined ? b.jpAlokasi : (b.jpEstimation || 0);
    return sum + Number(jp || 0);
  }, 0);

  const totalJpTp = (sesi.tp || []).reduce((sum, t) => {
    const jp = t.jpAlokasi !== undefined ? t.jpAlokasi : (t.jp || 0);
    return sum + Number(jp || 0);
  }, 0);

  // Sisa Kuota = Total Anggaran JP Tersedia - Jumlah Jam Terpakai
  const selisihBab = totalJpEfektif - totalJpBab;
  const selisihTp = totalJpEfektif - totalJpTp;
  
  // Sisa Kuota must be positive or zero, as required by the regulations
  const statusValid = selisihTp >= 0;

  return {
    totalJpEfektif,
    totalJpBab,
    totalJpTp,
    targetJpRegulasi,
    selisihBab,
    selisihTp,
    statusValid,
  };
}

