import React, { useState } from "react";
import {
  IdCard,
  BookOpen,
  ArrowRight,
  Plus,
  Trash2,
  Sparkles,
  Edit,
  ArrowUp,
  ArrowDown,
  Calendar,
  AlertCircle,
  FileCheck,
  Check,
  Clipboard,
  FileText,
  Clock,
  RotateCcw
} from "lucide-react";
import { SchoolIdentity, CurriculumElement, LearningObjective } from "../types";
import { subjectOptions, getPresetElements } from "../data/curriculumData";
import { useSesiKurikulum } from "../context/SesiKurikulumContext";
import { getCalculatedIntrakurikulerJP } from "../data/intrakurikulerJP";

// ==========================================
// STEP 0: ONBOARDING COMPONENT
// ==========================================
interface OnboardingProps {
  identity?: SchoolIdentity;
  setIdentity?: React.Dispatch<React.SetStateAction<SchoolIdentity>>;
  onNext: () => void;
  onSubjectChange?: (subj: string, ph: string) => void;
}

export function OnboardingStep({ onNext, onSubjectChange }: OnboardingProps) {
  const { state, updateIdentitas } = useSesiKurikulum();
  const identity = state.identitas;
  const [formErrors, setFormErrors] = useState<string | null>(null);

  const [fetchedSubjects, setFetchedSubjects] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  React.useEffect(() => {
    if (identity.jenjang && identity.phase) {
      setLoadingSubjects(true);
      fetch("/api/curriculum/get-subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: identity.phase, jenjang: identity.jenjang })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.subjects) && data.subjects.length > 0) {
            setFetchedSubjects(data.subjects);
            
            // Sync selected subject if not present in the loaded list
            const matched = data.subjects.find((s: string) => s.toLowerCase() === identity.subject?.toLowerCase());
            if (matched) {
              if (matched !== identity.subject) {
                updateIdentitas({ subject: matched });
                if (onSubjectChange) onSubjectChange(matched, identity.phase);
              }
            } else {
              const firstSubj = data.subjects[0];
              updateIdentitas({ subject: firstSubj });
              if (onSubjectChange) onSubjectChange(firstSubj, identity.phase);
            }
          }
        })
        .catch(err => console.error("Error loading onboarding subjects:", err))
        .finally(() => setLoadingSubjects(false));
    } else {
      setFetchedSubjects([]);
    }
  }, [identity.jenjang, identity.phase]);

  const handleFieldChange = (field: keyof SchoolIdentity, value: any) => {
    updateIdentitas({ [field]: value });
  };

  const handleLevelChangeOnboard = (level: string) => {
    let nextPhase = "D";
    let nextGrades = ["7", "8", "9"];
    let nextJp = 4;

    if (level === "PAUD") {
      nextPhase = "Fondasi";
      nextGrades = ["TK A", "TK B"];
      nextJp = 15;
    } else if (level === "SD") {
      nextPhase = "A";
      nextGrades = ["1", "2"];
      nextJp = getCalculatedIntrakurikulerJP("SD", "1", identity.subject || "Matematika").jpPerWeek;
    } else if (level === "SMP") {
      nextPhase = "D";
      nextGrades = ["7", "8", "9"];
      nextJp = getCalculatedIntrakurikulerJP("SMP", "7", identity.subject || "Matematika").jpPerWeek;
    } else if (level === "SMA") {
      nextPhase = "E";
      nextGrades = ["10"];
      nextJp = getCalculatedIntrakurikulerJP("SMA", "10", identity.subject || "Matematika").jpPerWeek;
    } else if (level === "SMK") {
      nextPhase = "E";
      nextGrades = ["10"];
      nextJp = 18;
    }

    const nextId = {
      ...identity,
      jenjang: level,
      phase: nextPhase,
      grades: nextGrades,
      jpPerWeek: nextJp
    };

    updateIdentitas(nextId);
    if (onSubjectChange) {
      onSubjectChange(identity.subject, nextPhase);
    }
  };

  const handleSubjectOrPhaseChange = (field: "subject" | "phase", val: string) => {
    const nextIdentity = { ...identity, [field]: val };
    // Find active grades for phase
    if (field === "phase") {
      let matchingGrades: string[] = [];
      if (nextIdentity.subject === "Matematika") {
        matchingGrades = ["7", "8", "9"]; // default
      }
      if (val === "Fondasi") matchingGrades = ["TK A", "TK B"];
      if (val === "A") matchingGrades = ["1", "2"];
      if (val === "B") matchingGrades = ["3", "4"];
      if (val === "C") matchingGrades = ["5", "6"];
      if (val === "D") matchingGrades = ["7", "8", "9"];
      if (val === "E") matchingGrades = ["10"];
      if (val === "F") matchingGrades = ["11", "12"];
      nextIdentity.grades = matchingGrades;
    }
    updateIdentitas(nextIdentity);
    if (onSubjectChange) {
      onSubjectChange(nextIdentity.subject || "Matematika", nextIdentity.phase || "F");
    }
  };

  const validateAndSubmit = () => {
    if (!identity.jenjang) {
      setFormErrors("Pilih Jenjang Pendidikan terlebih dahulu.");
      return;
    }
    if (!identity.phase) {
      setFormErrors("Pilih Target Fase terlebih dahulu.");
      return;
    }
    if (!identity.schoolName.trim()) {
      setFormErrors("Nama Satuan Pendidikan wajib diisi.");
      return;
    }
    if (!identity.author.trim()) {
      setFormErrors("Nama Penyusun wajib diisi.");
      return;
    }
    if (identity.grades.length === 0) {
      setFormErrors("Pilih minimal satu tingkat kelas untuk Fase ini.");
      return;
    }
    if (identity.jpPerWeek <= 0) {
      setFormErrors("Jam Pelajaran (JP) per minggu harus lebih dari 0.");
      return;
    }
    setFormErrors(null);
    onNext();
  };

  const availableGrades = (): string[] => {
    switch (identity.phase) {
      case "Fondasi": return ["TK A", "TK B"];
      case "A": return ["1", "2"];
      case "B": return ["3", "4"];
      case "C": return ["5", "6"];
      case "D": return ["7", "8", "9"];
      case "E": return ["10"];
      case "F": return ["11", "12"];
      default: return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    }
  };

  const handleGradeToggle = (g: string) => {
    if (identity.grades.includes(g)) {
      handleFieldChange("grades", identity.grades.filter((gr) => gr !== g));
    } else {
      handleFieldChange("grades", [...identity.grades, g]);
    }
  };

  const computedJpSemester1 = identity.jpPerWeek * identity.weeksSemester1;
  const computedJpSemester2 = identity.jpPerWeek * identity.weeksSemester2;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <IdCard className="text-indigo-600 w-6 h-6" />
          Langkah 0: Onboarding & Identitas Dokumen
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Lengkapi data administrasi satuan pendidikan Anda. AI akan menyelaraskan ATP dengan ketersediaan Jam Pelajaran (JP).
        </p>
      </div>

      {formErrors && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formErrors}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Satuan Pendidikan (Sekolah)</label>
            <input
              type="text"
              placeholder="Contoh: SMP Negeri 1 Jakarta"
              value={identity.schoolName}
              onChange={(e) => handleFieldChange("schoolName", e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Ajaran</label>
              <input
                type="text"
                placeholder="2026/2027"
                value={identity.academicYear}
                onChange={(e) => handleFieldChange("academicYear", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Penyusun (Nama Guru)</label>
              <input
                type="text"
                placeholder="Contoh: Budi Utomo, S.Pd."
                value={identity.author}
                onChange={(e) => handleFieldChange("author", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Sequential Selection: 1. Jenjang Pendidikan */}
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">1. Jenjang Pendidikan <span className="text-red-500 font-bold">*</span></label>
              <div className="grid grid-cols-5 gap-1.5">
                {["PAUD", "SD", "SMP", "SMA", "SMK"].map((level) => {
                  const isActive = identity.jenjang === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleLevelChangeOnboard(level)}
                      className={`py-2 text-center text-xs font-extrabold rounded-xl border transition ${
                        isActive
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Target Fase */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  2. Target Fase {!identity.jenjang && <span className="text-red-500 font-normal text-[10px]">(Pilih Jenjang Dulu)</span>}
                </label>
                <select
                  value={identity.phase || ""}
                  onChange={(e) => handleSubjectOrPhaseChange("phase", e.target.value)}
                  disabled={!identity.jenjang}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-505 transition disabled:bg-slate-50 disabled:text-slate-400"
                >
                  {!identity.jenjang && <option value="">-- Pilih Jenjang Dulu --</option>}
                  {identity.jenjang === "PAUD" && <option value="Fondasi">Fase Fondasi</option>}
                  {identity.jenjang === "SD" && (
                    <>
                      <option value="A">Fase A (Kelas 1–2)</option>
                      <option value="B">Fase B (Kelas 3–4)</option>
                      <option value="C">Fase C (Kelas 5–6)</option>
                    </>
                  )}
                  {identity.jenjang === "SMP" && <option value="D">Fase D (Kelas 7–9)</option>}
                  {(identity.jenjang === "SMA" || identity.jenjang === "SMK") && (
                    <>
                      <option value="E">Fase E (Kelas 10)</option>
                      <option value="F">Fase F (Kelas 11–12)</option>
                    </>
                  )}
                </select>
              </div>

              {/* 3. Mata Pelajaran */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  3. Mata Pelajaran {loadingSubjects && <span className="text-[10px] text-indigo-500 font-normal animate-pulse">(Memuat...)</span>}
                  {!identity.phase && <span className="text-red-500 font-normal text-[10px]">(Pilih Fase Dulu)</span>}
                </label>
                <select
                  value={identity.subject || ""}
                  onChange={(e) => handleSubjectOrPhaseChange("subject", e.target.value)}
                  disabled={!identity.phase || loadingSubjects}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-505 transition disabled:bg-slate-50 disabled:text-slate-400"
                >
                  {!identity.phase && <option value="">-- Pilih Fase Dulu --</option>}
                  {identity.phase && fetchedSubjects.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 mb-1.5">Pilih Tingkat Kelas yang Ingin Dibuatkan ATP</span>
            <div className="flex gap-2">
              {availableGrades().map((g) => {
                const isActive = identity.grades.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleGradeToggle(g)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold text-center transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Kelas {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Time & JP Calculations */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Perhitungan Waktu Efektif KBM
            </h3>

            {/* Larger and wider weekly JP workload input container */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Beban JP per Minggu</label>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleFieldChange("jpPerWeek", Math.max(1, identity.jpPerWeek - 1))}
                  className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition active:scale-95 shadow-sm"
                >
                  <ArrowDown className="w-5 h-5 font-bold" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={identity.jpPerWeek}
                  onChange={(e) => handleFieldChange("jpPerWeek", parseInt(e.target.value) || 0)}
                  className="w-28 text-center bg-white border border-slate-200 rounded-xl py-3 px-4 text-xl font-black text-indigo-600 tracking-tight font-mono focus:outline-none focus:border-indigo-600 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => handleFieldChange("jpPerWeek", Math.min(40, identity.jpPerWeek + 1))}
                  className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition active:scale-95 shadow-sm"
                >
                  <ArrowUp className="w-5 h-5 font-bold" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Minggu Efektif Smt 1 (Ganjil)</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={identity.weeksSemester1}
                  onChange={(e) => handleFieldChange("weeksSemester1", parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Minggu Efektif Smt 2 (Genap)</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={identity.weeksSemester2}
                  onChange={(e) => handleFieldChange("weeksSemester2", parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <hr className="border-slate-200/60 my-2" />

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Estimasi JP Semester 1:</span>
                <span className="font-semibold font-mono text-slate-800">{computedJpSemester1} JP</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Estimasi JP Semester 2:</span>
                <span className="font-semibold font-mono text-slate-800">{computedJpSemester2} JP</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold border-t border-slate-200/80 pt-2 text-indigo-700">
                <span>Total Alokasi Setahun:</span>
                <span className="font-mono">{computedJpSemester1 + computedJpSemester2} JP</span>
              </div>
            </div>
          </div>

          <div className="mt-5 text-[10px] text-slate-400 leading-snug">
            *Asumsi default adalah 18 minggu efektif per semester. Silakan ubah angka di atas jika satuan pendidikan Anda memiliki kalender akademik yang berbeda.
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="button"
          onClick={validateAndSubmit}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          Lanjut ke CP Elemen
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


// ==========================================
// STEP 1: CP ELEMENTS COMPONENT
// ==========================================
interface CpStepProps {
  elements?: CurriculumElement[];
  setElements?: React.Dispatch<React.SetStateAction<CurriculumElement[]>>;
  identity?: SchoolIdentity;
  onNext: () => void;
  onPrev: () => void;
  onResetToPresets?: () => void;
}

export function CpStep({ onNext, onPrev, onResetToPresets }: CpStepProps) {
  const { state, setElements } = useSesiKurikulum();
  const identity = state.identitas;
  const elements = state.cp.elemen;

  const handleElementChange = (index: number, key: keyof CurriculumElement, value: string) => {
    const copy = [...elements];
    copy[index] = { ...copy[index], [key]: value };
    setElements(copy);
  };

  const addElement = () => {
    setElements([...elements, { name: "", cpText: "" }]);
  };

  const deleteElement = (index: number) => {
    if (elements.length <= 1) {
      alert("Minimal harus ada 1 elemen Capaian Pembelajaran.");
      return;
    }
    setElements(elements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4 flex justify-between items-start flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-indigo-600 w-6 h-6" />
            Langkah 1: Ekstraksi &amp; Validasi CP
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sesuaikan teks Capaian Pembelajaran (CP) per elemen untuk mapel <strong>{identity.subject} (Fase {identity.phase})</strong>. Anda dapat mengedit teks di bawah secara bebas.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetToPresets}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 bg-indigo-50 hover:bg-indigo-100/60 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Riset ke Default
        </button>
      </div>

      <div className="space-y-4">
        {elements.map((el, index) => (
          <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative group">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                  Nama Elemen #{index + 1}
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bilangan, Aljabar, Menyimak, Pancasila"
                  value={el.name}
                  onChange={(e) => handleElementChange(index, "name", e.target.value)}
                  className="w-full md:w-1/2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <button
                type="button"
                onClick={() => deleteElement(index)}
                className="text-red-500 hover:text-red-650 p-1.5 rounded-lg hover:bg-red-50 transition border border-transparent hover:border-red-200"
                title="Hapus Elemen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                Deskripsi Capaian Pembelajaran (CP) Resmi per Elemen
              </label>
              <textarea
                placeholder="Paste deskripsi teks CP resmi dari elemen ini..."
                rows={3}
                value={el.cpText}
                onChange={(e) => handleElementChange(index, "cpText", e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 leading-relaxed focus:outline-none focus:border-indigo-500 transition font-sans"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addElement}
          className="w-full border border-dashed border-slate-300 hover:border-indigo-400 text-slate-600 hover:text-indigo-600 py-3 rounded-xl transition flex items-center justify-center gap-1.5 text-xs font-semibold bg-slate-50/50 hover:bg-indigo-50/10"
        >
          <Plus className="w-4 h-4" />
          Tambah Elemen Kurikulum Baru
        </button>
      </div>

      <div className="pt-4 flex justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onPrev}
          className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs px-4 py-2.5 rounded-xl transition"
        >
          Kembali
        </button>

        <button
          type="button"
          onClick={onNext}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          Lanjut Formulasikan TP
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


// ==========================================
// STEP 2: TP FORMULATION COMPONENT
// ==========================================
interface TpStepProps {
  tps?: LearningObjective[];
  setTps?: React.Dispatch<React.SetStateAction<LearningObjective[]>>;
  identity?: SchoolIdentity;
  elements?: CurriculumElement[];
  onNext: () => void;
  onPrev: () => void;
}

export function TpStep({ onNext, onPrev }: TpStepProps) {
  const { state, setTps } = useSesiKurikulum();
  const identity = state.identitas;
  const elements = state.cp.elemen;
  const tps = state.tp;

  const [analyzing, setAnalyzing] = useState(false);
  const [pedagogicalMsg, setPedagogicalMsg] = useState("");
  const [manualAddMode, setManualAddMode] = useState(false);

  // Manual Add Form State
  const [newTp, setNewTp] = useState<Partial<LearningObjective>>(() => ({
    element: elements[0]?.name || "",
    competency: "",
    content: "",
    context: "",
    text: "",
    code: "",
    jp: 4,
    materiPokok: ""
  }));

  const runAiFormulation = async () => {
    setAnalyzing(true);
    setPedagogicalMsg("Menganalisis kata kerja operasional (KKO) Taksonomi Bloom...");

    const intervals = [
      "Mengidentifikasi Kompetensi Pokok & Struktur Kalimat CP...",
      "Memisahkan Lingkup Materi dan Variabel Konteks...",
      "Merumuskan Tujuan Pembelajaran (TP) fungsional & terukur...",
      "Mengalokasikan waktu (JP) berdasarkan bobot kompleksitas materi...",
      "Menyusun kode dokumentasi unik (Singkatan Mapel + Fase)..."
    ];

    let msgIdx = 0;
    const timer = setInterval(() => {
      if (msgIdx < intervals.length) {
        setPedagogicalMsg(intervals[msgIdx]);
        msgIdx++;
      }
    }, 1500);

    try {
      const response = await fetch("/api/curriculum/analyze-cp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: identity.subject,
          phase: identity.phase,
          elements,
          identity
        })
      });

      if (!response.ok) {
        throw new Error("Gagal memformulasikan TP. Pastikan server aktif.");
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.tps)) {
        // Map default class & semester proportionally
        const formattedTps = data.tps.map((tpOrign: any, i: number) => {
          return {
            id: `tp-${Date.now()}-${i}`,
            code: tpOrign.code,
            element: tpOrign.element,
            competency: tpOrign.competency,
            content: tpOrign.content,
            context: tpOrign.context || "",
            text: tpOrign.text,
            grade: (tpOrign.kelas && identity.grades.includes(String(tpOrign.kelas)))
              ? String(tpOrign.kelas)
              : (identity.grades[0] || String(tpOrign.kelas) || "7"),
            semester: (i % 2 === 0) ? 1 : 2, // split evenly as default start
            jp: tpOrign.jp || 4,
            materiPokok: tpOrign.materiPokok || ""
          };
        });
        setTps(formattedTps);
      } else {
        alert(data.error || "Gagal mendapatkan TP dari AI.");
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan Kunci API: ${err.message || "Gagal mengurai TP"}. Anda dapat menambahkan TP secara manual.`);
    } finally {
      clearInterval(timer);
      setAnalyzing(false);
    }
  };

  const handleSaveManualTp = () => {
    if (!newTp.competency || !newTp.content || !newTp.text) {
      alert("Harap lengkapi Kompetensi, Konten, dan Kalimat TP.");
      return;
    }

    const mapelAbbr = identity.subject.substring(0, 3).toUpperCase();
    const cleanCode = newTp.code || `${mapelAbbr}.${identity.phase}.${(newTp.element || "EL").substring(0, 3).toUpperCase()}.${String(tps.length + 1).padStart(2, "0")}`;

    const tpObject: LearningObjective = {
      id: `tp-manual-${Date.now()}`,
      code: cleanCode,
      element: newTp.element || elements[0]?.name || "Elemen",
      competency: newTp.competency,
      content: newTp.content,
      context: newTp.context || "",
      text: newTp.text,
      grade: identity.grades[0] || "7",
      semester: 1,
      jp: newTp.jp || 4,
      materiPokok: newTp.materiPokok || newTp.content
    };

    setTps((prev) => [...prev, tpObject]);
    setManualAddMode(false);
    // Reset Form
    setNewTp({
      element: elements[0]?.name || "",
      competency: "",
      content: "",
      context: "",
      text: "",
      code: "",
      jp: 4,
      materiPokok: ""
    });
  };

  const deleteTp = (id: string) => {
    setTps((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Sparkles className="text-indigo-600 w-6 h-6" />
            Langkah 2: Perumusan Tujuan Pembelajaran (TP)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Uraikan teks CP per elemen menjadi kompetensi operasional (Taksonomi Bloom) dan lingkup materi esensial secara otomatis melalui AI atau manual.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setManualAddMode(!manualAddMode)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Manual Tambah TP
          </button>

          <button
            type="button"
            disabled={analyzing}
            onClick={runAiFormulation}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-white" />
            Formulasikan TP secara Otomatis
          </button>
        </div>
      </div>

      {analyzing && (
        <div className="p-8 bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-3xl text-center space-y-4 animate-pulse">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mx-auto text-white">
            <Sparkles className="w-5 h-5 text-white animate-spin" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-slate-800 text-sm">Menyusun Analisis Kurikulum Nasional...</p>
            <p className="text-xs text-slate-500">{pedagogicalMsg}</p>
          </div>
          <div className="w-48 bg-slate-200 h-1.5 rounded-full overflow-hidden mx-auto">
            <div className="bg-indigo-600 h-full animate-[progress_3s_ease-in-out_infinite]" style={{ width: "65%" }}></div>
          </div>
        </div>
      )}

      {/* Manual Add Form Drawer */}
      {manualAddMode && (
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 transition">
          <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-indigo-600" />
            Tambah Tujuan Pembelajaran (TP) secara Manual
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Elemen Terkait</label>
              <select
                value={newTp.element}
                onChange={(e) => setNewTp({ ...newTp, element: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition"
              >
                {elements.map((el) => (
                  <option key={el.name} value={el.name}>{el.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pilih Kompetensi (Bloom Verb)</label>
              <input
                type="text"
                placeholder="Contoh: mengindentifikasi, menganalisis"
                value={newTp.competency}
                onChange={(e) => {
                  const comp = e.target.value;
                  const sentence = `Peserta didik mampu ${comp} ${newTp.content || ""} ${newTp.context || ""}`.trim().replace(/\s+/g, " ");
                  setNewTp({ ...newTp, competency: comp, text: sentence });
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Materi Pokok / Konten</label>
              <input
                type="text"
                placeholder="Contoh: struktur bilangan cacah 100"
                value={newTp.content}
                onChange={(e) => {
                  const cont = e.target.value;
                  const sentence = `Peserta didik mampu ${newTp.competency || ""} ${cont} ${newTp.context || ""}`.trim().replace(/\s+/g, " ");
                  setNewTp({ ...newTp, content: cont, text: sentence });
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Konteks / Media (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: menggunakan media konkret"
                value={newTp.context}
                onChange={(e) => {
                  const ctx = e.target.value;
                  const sentence = `Peserta didik mampu ${newTp.competency || ""} ${newTp.content || ""} ${ctx}`.trim().replace(/\s+/g, " ");
                  setNewTp({ ...newTp, context: ctx, text: sentence });
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kalimat Rumusan TP (Otomatis Tersusun)</label>
              <input
                type="text"
                value={newTp.text}
                onChange={(e) => setNewTp({ ...newTp, text: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-semibold focus:border-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setManualAddMode(false)}
              className="text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 border border-slate-250 px-3.5 py-1.5 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSaveManualTp}
              className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg transition shadow-sm"
            >
              Simpan TP Baru
            </button>
          </div>
        </div>
      )}

      {/* Generated TPs List */}
      <div className="space-y-3">
        {tps.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">Belum ada Tujuan Pembelajaran (TP) yang terumuskan.</p>
            <p className="text-xs max-w-sm mx-auto leading-relaxed">
              Formulasikan secara instan menggunakan tombol AI otomatis di kanan atas, atau masukkan Tujuan Pembelajaran (TP) kustom Anda secara manual.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-indigo-650" />
              Selesai Diformulasikan: {tps.length} Tujuan Pembelajaran (TP)
            </p>

            <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-slate-700 text-xs">
                <thead className="bg-slate-50 font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left w-24">Kode</th>
                    <th className="px-4 py-3 text-left w-36">Elemen</th>
                    <th className="px-4 py-3 text-left">Rumusan Kalimat Tujuan Pembelajaran (TP)</th>
                    <th className="px-4 py-3 text-center w-24">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tps.map((tp) => (
                    <tr key={tp.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3 font-mono font-bold text-indigo-700 whitespace-nowrap">{tp.code}</td>
                      <td className="px-4 py-3 font-semibold text-slate-650">{tp.element}</td>
                      <td className="px-4 py-3 text-slate-800 leading-relaxed font-sans">{tp.text}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => deleteTp(tp.id)}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-650 transition"
                          title="Hapus TP"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onPrev}
          className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs px-4 py-2.5 rounded-xl transition"
        >
          Kembali
        </button>

        <button
          type="button"
          disabled={tps.length === 0}
          onClick={onNext}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          Lanjut Pemetaan ATP &amp; JP
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


// ==========================================
// STEP 3: ATP SEQUENCING & TIME ALLOCATION COMPONENT
// ==========================================
interface AtpStepProps {
  tps: LearningObjective[];
  setTps: React.Dispatch<React.SetStateAction<LearningObjective[]>>;
  identity: SchoolIdentity;
  onNext: () => void;
  onPrev: () => void;
}

export function AtpStep({ tps, setTps, identity, onNext, onPrev }: AtpStepProps) {
  const [editingTpId, setEditingTpId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LearningObjective>>({});

  // Calculation parameters
  const targetGradeOptions = identity.grades;
  const totalJpAvailableS1 = identity.jpPerWeek * identity.weeksSemester1;
  const totalJpAvailableS2 = identity.jpPerWeek * identity.weeksSemester2;

  // Real-time sums
  const totalJpAllocatedS1 = tps.filter((t) => t.semester === 1).reduce((acc, curr) => acc + curr.jp, 0);
  const totalJpAllocatedS2 = tps.filter((t) => t.semester === 2).reduce((acc, curr) => acc + curr.jp, 0);

  const moveTp = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === tps.length - 1) return;

    const copy = [...tps];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    setTps(copy);
  };

  const handleUpdateField = (id: string, field: keyof LearningObjective, val: any) => {
    setTps((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  const startEditModal = (tp: LearningObjective) => {
    setEditingTpId(tp.id);
    setEditForm(tp);
  };

  const saveEditModal = () => {
    if (!editingTpId) return;
    setTps((prev) =>
      prev.map((t) => (t.id === editingTpId ? { ...t, ...editForm } as LearningObjective : t))
    );
    setEditingTpId(null);
  };

  const getStatusBadge = (allocated: number, available: number) => {
    const diff = available - allocated;
    if (allocated === available) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] bg-green-100 text-green-700 font-bold border border-green-200 flex items-center gap-1">
          <Check className="w-3 h-3" /> Balanced
        </span>
      );
    } else if (diff > 0) {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] bg-amber-50 text-amber-700 font-semibold border border-amber-200">
          Sisa {diff} JP
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 rounded-full text-[10px] bg-red-100 text-red-700 font-bold border border-red-200">
          Over {Math.abs(diff)} JP!
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Clock className="text-indigo-600 w-6 h-6" />
          Langkah 3 &amp; 4: Alur Tujuan Pembelajaran &amp; Pembagian Kelas/Semester
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Urutkan tujuan pembelajaran secara logis. Alokasikan KBM ke tingkat kelas pilihan, semester 1 atau 2, serta distribusikan alokasi waktu jam pelajaran (JP) secara presisi.
        </p>
      </div>

      {/* Real-time JP Allocation Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-100 rounded-2xl">
        {/* Semester 1 */}
        <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 shadow-sm">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total KBM Semester 1</p>
            <p className="text-xl font-bold font-mono text-slate-850 mt-1">
              {totalJpAllocatedS1} <span className="text-xs font-semibold text-slate-400">/ {totalJpAvailableS1} JP</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Assigned to: Smt 1</p>
          </div>
          {getStatusBadge(totalJpAllocatedS1, totalJpAvailableS1)}
        </div>

        {/* Semester 2 */}
        <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 shadow-sm">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total KBM Semester 2</p>
            <p className="text-xl font-bold font-mono text-slate-850 mt-1">
              {totalJpAllocatedS2} <span className="text-xs font-semibold text-slate-400">/ {totalJpAvailableS2} JP</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Assigned to: Smt 2</p>
          </div>
          {getStatusBadge(totalJpAllocatedS2, totalJpAvailableS2)}
        </div>
      </div>

      <div className="space-y-3">
        {tps.map((tp, index) => (
          <div
            key={tp.id}
            className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:border-indigo-150 transition"
          >
            {/* Left side actions (Reorder) */}
            <div className="flex flex-col gap-1 flex-shrink-0">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveTp(index, "up")}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600 transition"
                title="Pindahkan Ke Atas"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-bold font-mono text-center text-slate-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <button
                type="button"
                disabled={index === tps.length - 1}
                onClick={() => moveTp(index, "down")}
                className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600 transition"
                title="Pindahkan Ke Bawah"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Core Info */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200/50">
                  {tp.code}
                </span>
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono">
                  {tp.element}
                </span>
              </div>
              <p className="text-slate-800 text-xs leading-relaxed font-medium">{tp.text}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400">Materi Pokok:</span>
                <span className="text-[10px] font-semibold text-slate-650 bg-slate-100/60 px-2 py-0.5 rounded">
                  {tp.materiPokok || tp.content}
                </span>
              </div>
            </div>

            {/* Config Fields */}
            <div className="flex items-center gap-3 flex-wrap md:flex-nowrap flex-shrink-0 border-l border-slate-100 pl-4">
              {/* Class Select */}
              <div className="w-20">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Kelas</label>
                <select
                  value={tp.grade}
                  onChange={(e) => handleUpdateField(tp.id, "grade", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-indigo-400"
                >
                  {targetGradeOptions.map((g) => (
                    <option key={g} value={g}>Kl {g}</option>
                  ))}
                </select>
              </div>

              {/* Semester Select */}
              <div className="w-24">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Semester</label>
                <select
                  value={tp.semester}
                  onChange={(e) => handleUpdateField(tp.id, "semester", parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-indigo-400"
                >
                  <option value={1}>Semester I</option>
                  <option value={2}>Semester II</option>
                </select>
              </div>

              {/* JP Input */}
              <div className="w-16">
                <label className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">JP</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={tp.jp}
                  onChange={(e) => handleUpdateField(tp.id, "jp", parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-705 font-mono text-center font-bold focus:outline-none focus:border-indigo-400"
                />
              </div>

              {/* Edit Modal Trigger */}
              <button
                type="button"
                onClick={() => startEditModal(tp)}
                className="p-2 rounded-xl text-slate-500 hover:text-indigo-650 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition mt-3"
                title="Edit Suku Kalimat / Detail"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Editing Dialog Modal */}
      {editingTpId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-semibold text-base text-slate-800 flex items-center gap-1.5">
              <Edit className="w-4 h-4 text-indigo-600" />
              Sesuaikan Kalimat &amp; Materi Pokok
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Kode TP</label>
                <input
                  type="text"
                  value={editForm.code || ""}
                  onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Rumusan Kalimat Kegiatan Belajar (TP)</label>
                <textarea
                  rows={3}
                  value={editForm.text || ""}
                  onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-800 leading-normal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Materi Pokok / Pokok Pembelajaran</label>
                <input
                  type="text"
                  value={editForm.materiPokok || ""}
                  onChange={(e) => setEditForm({ ...editForm, materiPokok: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-250 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTpId(null)}
                className="text-xs font-semibold text-slate-500 bg-white hover:bg-slate-50 border border-slate-250 px-3.5 py-1.5 rounded-lg transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveEditModal}
                className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-lg transition shadow-sm"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 flex justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onPrev}
          className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs px-4 py-2.5 rounded-xl transition"
        >
          Kembali
        </button>

        <button
          type="button"
          onClick={onNext}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          Pratinjau &amp; Export Dokumen
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


// ==========================================
// STEP 4: PREVIEW & EXPORT COMPONENT
// ==========================================
interface TableStepProps {
  identity?: SchoolIdentity;
  tps?: LearningObjective[];
  elements?: CurriculumElement[];
  onPrev: () => void;
  onResetAll?: () => void;
}

export function TableStep({ onPrev, onResetAll }: TableStepProps) {
  const { state } = useSesiKurikulum();
  const identity = state.identitas;
  const tps = state.tp;
  const elements = state.cp.elemen;

  const [exporting, setExporting] = useState(false);
  const [coping, setCoping] = useState(false);

  const handleExportDocx = async () => {
    setExporting(true);
    try {
      const response = await fetch("/api/curriculum/export-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, tps }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengunduh file DOCX.");
      }

      // Stream the response back to user
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `atp_${identity.subject.toLowerCase().replace(/\s+/g, "_")}_fase_${identity.phase}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert(`Terjadi hambatan pengunduhan: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleCopyHtml = async () => {
    setCoping(true);
    const tableEl = document.getElementById("complete-atp-table");
    if (!tableEl) {
      alert("Tabel tidak ditemukan.");
      setCoping(false);
      return;
    }

    try {
      const clipboardItem = new ClipboardItem({
        "text/html": new Blob([tableEl.outerHTML], { type: "text/html" }),
        "text/plain": new Blob([tableEl.innerText], { type: "text/plain" }),
      });
      await navigator.clipboard.write([clipboardItem]);
      alert("🎁 HTML Tabel berhasil disalin! Anda dapat menempelkannya (paste) secara utuh dan rapi ke Google Docs atau Microsoft Word.");
    } catch (err) {
      // Fallback
      try {
        await navigator.clipboard.writeText(tableEl.innerText);
        alert("Teks tabel berhasil disalin (format teks biasa).");
      } catch (e) {
        alert("Browser menghadang izin salin otomatis.");
      }
    } finally {
      setCoping(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4 flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <FileCheck className="text-indigo-600 w-6 h-6" />
            Langkah 5 &amp; 6: Finalisasi Dokumen &amp; Ekspor ATP
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pratinjau hasil kemasan Alur Tujuan Pembelajaran siap pakai Anda. Silakan salin tabel HTML rapi or ekspor sebagai Word Document (.docx) yang sangat pas dengan KOP satuan pendidikan.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onResetAll}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Mulai Dari Awal
          </button>
        </div>
      </div>

      {/* Buttons Action Segment */}
      <div className="flex flex-wrap gap-3 p-4 bg-slate-900 rounded-2xl text-white items-center justify-between">
        <p className="text-xs text-slate-350">
          🎉 Alur Tujuan Pembelajaran (ATP) Anda siap digunakan untuk dinas atau pengajaran!
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopyHtml}
            disabled={coping}
            className="text-xs font-semibold text-indigo-400 bg-slate-850 hover:bg-slate-800 px-4 py-2.5 rounded-xl border border-indigo-500/30 transition flex items-center gap-1.5"
          >
            <Clipboard className="w-4 h-4" />
            {coping ? "Menyalin..." : "Salin Tabel HTML (Paste ke Word)"}
          </button>

          <button
            type="button"
            onClick={handleExportDocx}
            disabled={exporting}
            className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md"
          >
            <FileText className="w-4 h-4" />
            {exporting ? "Mengekspor..." : "Unduh File Word (.docx)"}
          </button>
        </div>
      </div>

      {/* Word-compatible Live Preview Box */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl overflow-x-auto shadow-inner max-w-full">
        <div id="complete-atp-table" className="min-w-[800px] text-slate-800 font-sans text-xs mx-auto space-y-4">
          
          {/* Document Header */}
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-sm font-bold tracking-tight text-slate-900">ALUR TUJUAN PEMBELAJARAN (ATP)</h1>
            <p className="text-xs uppercase font-medium text-slate-600">
              MATA PELAJARAN: {identity.subject} — FASE {identity.phase}
            </p>
          </div>

          {/* School Identity Information */}
          <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: "20px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "4px 8px", fontWeight: "bold", width: "20%" }}>Nama Satuan Pendidikan</td>
                <td style={{ padding: "4px 8px" }}>: {identity.schoolName || "-"}</td>
                <td style={{ padding: "4px 8px", fontWeight: "bold", width: "15%" }}>Tahun Ajaran</td>
                <td style={{ padding: "4px 8px" }}>: {identity.academicYear}</td>
              </tr>
              <tr>
                <td style={{ padding: "4px 8px", fontWeight: "bold" }}>Mata Pelajaran</td>
                <td style={{ padding: "4px 8px" }}>: {identity.subject}</td>
                <td style={{ padding: "4px 8px", fontWeight: "bold" }}>Nama Penyusun</td>
                <td style={{ padding: "4px 8px" }}>: {identity.author || "-"}</td>
              </tr>
              <tr>
                <td style={{ padding: "4px 8px", fontWeight: "bold" }}>Fase / Kelas Terpilih</td>
                <td style={{ padding: "4px 8px" }}>: Fase {identity.phase} / Kelas {identity.grades.join(", ")}</td>
                <td style={{ padding: "4px 8px", fontWeight: "bold" }}>Alokasi Waktu</td>
                <td style={{ padding: "4px 8px" }}>: {identity.jpPerWeek} JP per minggu</td>
              </tr>
            </tbody>
          </table>

          {/* Core ATP Table with clear solid lines for Word copying */}
          <table style={{ border: "1px solid #999999", borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "2px solid #666666" }}>
                <th style={{ border: "1px solid #999999", padding: "8px", textAlign: "center", fontWeight: "bold" }}>No</th>
                <th style={{ border: "1px solid #999999", padding: "8px", textAlign: "center", fontWeight: "bold", width: "100px" }}>Kode TP</th>
                <th style={{ border: "1px solid #999999", padding: "8px", textAlign: "left", fontWeight: "bold", width: "140px" }}>Elemen</th>
                <th style={{ border: "1px solid #999999", padding: "8px", textAlign: "left", fontWeight: "bold" }}>Tujuan Pembelajaran (TP)</th>
                <th style={{ border: "1px solid #999999", padding: "8px", textAlign: "center", fontWeight: "bold", width: "60px" }}>Kelas</th>
                <th style={{ border: "1px solid #999999", padding: "8px", textAlign: "center", fontWeight: "bold", width: "60px" }}>Smt</th>
                <th style={{ border: "1px solid #999999", padding: "8px", textAlign: "center", fontWeight: "bold", width: "50px" }}>JP</th>
                <th style={{ border: "1px solid #999999", padding: "8px", textAlign: "left", fontWeight: "bold", width: "160px" }}>Materi Pokok / Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {tps.map((tp, idx) => (
                <tr key={tp.id} style={{ borderBottom: "1px solid #cccccc" }}>
                  <td style={{ border: "1px solid #999999", padding: "8px", textAlign: "center" }}>{idx + 1}</td>
                  <td style={{ border: "1px solid #999999", padding: "8px", textAlign: "center", fontFamily: "monospace", color: "#312e81", fontWeight: "bold" }}>{tp.code}</td>
                  <td style={{ border: "1px solid #999999", padding: "8px", fontWeight: "bold" }}>{tp.element}</td>
                  <td style={{ border: "1px solid #999999", padding: "8px", lineHeight: "1.4" }}>{tp.text}</td>
                  <td style={{ border: "1px solid #999999", padding: "8px", textAlign: "center" }}>{tp.grade}</td>
                  <td style={{ border: "1px solid #999999", padding: "8px", textAlign: "center" }}>{tp.semester}</td>
                  <td style={{ border: "1px solid #999999", padding: "8px", textAlign: "center", fontWeight: "bold" }}>{tp.jp}</td>
                  <td style={{ border: "1px solid #999999", padding: "8px" }}>{tp.materiPokok || tp.content}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signature Block */}
          <div className="pt-8">
            <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "30px" }}>
              <tbody>
                <tr>
                  <td style={{ width: "50%", padding: "4px 8px", verticalAlign: "top" }}>
                    <p>Mengetahui,</p>
                    <p>Kepala Satuan Pendidikan</p>
                    <p style={{ marginTop: "60px" }}><strong>_________________________</strong></p>
                    <p>NIP. ..................................</p>
                  </td>
                  <td style={{ width: "50%", padding: "4px 8px", verticalAlign: "top" }}>
                    <p>........................, ............................. 2026</p>
                    <p>Guru Mata Pelajaran</p>
                    <p style={{ marginTop: "60px" }}><strong>{identity.author || "_________________________"}</strong></p>
                    <p>NIP. ..................................</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <div className="pt-4 flex justify-between border-t border-slate-100">
        <button
          type="button"
          onClick={onPrev}
          className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs px-4 py-2.5 rounded-xl transition"
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
