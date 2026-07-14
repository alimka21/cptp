export interface SesiIdentitas {
  sekolah: string;
  npsn: string;
  guru: string;
  nip: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  tahunPelajaran: string;
  jenjang: string;
  kelas: string[];
  fase: string;
  mapel: string;
  schoolName?: string; // support legacy
  author?: string; // support legacy
  academicYear?: string; // support legacy
  schoolAddress?: string; // support legacy
  curriculumName?: string; // support legacy
  jpPerWeek?: number; // support legacy
  weeksSemester1?: number; // support legacy
  weeksSemester2?: number; // support legacy
  tpPerBab?: number; // support legacy
  jpSumatifPerBab?: number; // support legacy
  subject?: string; // support legacy
  phase?: string; // support legacy
  grades?: string[]; // support legacy
}

export interface SesiKalender {
  bulanList: Array<{ bulan: string; jmlMinggu: number }>;
  mingguTidakEfektif: Array<{ kegiatan: string; jmlMinggu: number; bulan: string }>;
  jpPerMinggu: number;
  mingguEfektifTerhitung: number; // computed
  jpEfektifTerhitung: number; // computed
}

export interface SesiBab {
  id: string; // compatibility
  code?: string; // compatibility (noBab)
  name?: string; // compatibility (judul)
  semester?: number; // compatibility
  jpEstimation?: number; // compatibility (jpAlokasi)
  noBab: string;
  judul: string;
  elemenCP: string;
  subMateri: string[];
  rasioTeoriPraktik: number;
  jpAlokasi: number;
}

export interface SesiCp {
  fase: string;
  elemen: Array<{ name: string; cpText: string }>;
}

export interface SesiTp {
  id: string;
  babRef: string;
  elemenRef: string;
  kalimatTP: string;
  kko: string;
  jpAlokasi: number;
  urutan: number;
  // compatibility with legacy LearningObjective
  code?: string;
  element?: string;
  competency?: string;
  content?: string;
  text?: string;
  grade?: string;
  semester?: number;
  jp?: number;
  materiPokok?: string;
  babCode?: string;
}

export interface SesiAtp {
  tpRef: string;
  urutanKronologis: number;
  pertemuanKe: number;
}

export interface SesiKktp {
  tpRef: string;
  kriteria: string[]; // 4-level
}

export interface SesiKurikulum {
  identitas: SesiIdentitas;
  kalender: SesiKalender;
  bab: SesiBab[];
  cp: SesiCp;
  tp: SesiTp[];
  atp: SesiAtp[];
  kktp: SesiKktp[];
}
