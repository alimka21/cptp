export interface SchoolIdentity {
  schoolName: string;
  academicYear: string;
  author: string;
  nip: string;          // NIP Guru
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  curriculumName: string; // e.g. "Kurikulum Merdeka 2024" or standard
  schoolAddress: string;  // Alamat Sekolah
  jenjang: string;       // PAUD, SD, SMP, SMA, SMK
  subject: string;
  phase: string;         // Fondasi, A, B, C, D, E, F
  grades: string[];      // e.g. ["7", "8"]
  jpPerWeek: number;
  weeksSemester1: number;
  weeksSemester2: number;
  tpPerBab: number;      // jumlah TP per BAB
  jpSumatifPerBab: number; // jumlah JP penilaian Sumatif per bab
}

export interface BabMateri {
  id: string;
  code: string;       // e.g. "BAB 1"
  name: string;       // Nama Bab / Materi
  semester: number;   // 1 or 2
  jpEstimation: number; // Estimasi JP
  grade?: string;     // Target kelas
}

export interface LearningObjective {
  id: string;
  code: string;
  element: string;
  competency: string;
  content: string;
  context?: string;
  text: string;
  grade: string;
  semester: number;
  jp: number;
  materiPokok: string;
  babCode?: string;    // Reference to Bab
}

export interface CurriculumElement {
  name: string;
  cpText: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model" | "system";
  content: string;
}

export interface CurriculumState {
  identity: SchoolIdentity;
  elements: CurriculumElement[];
  tps: LearningObjective[];
  babs: BabMateri[];
  activeStep: number;
}

