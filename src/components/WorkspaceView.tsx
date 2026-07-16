import React from "react";
import Swal from "sweetalert2";
import { 
  Download, 
  Sparkles, 
  Layers, 
  Clock, 
  ArrowUp, 
  ArrowDown, 
  Compass, 
  User, 
  Sliders, 
  Calendar, 
  Database, 
  Plus, 
  Trash2, 
  Minus, 
  ClipboardList, 
  Info, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  GraduationCap
} from "lucide-react";
import { SchoolIdentity, CurriculumElement, LearningObjective, BabMateri } from "../types";
import { subjectOptions } from "../data/curriculumData";
import { getLocalSubjects } from "../utils/curriculumData";
import { useSesiKurikulum } from "../context/SesiKurikulumContext";
import { validateAlokasiJP } from "@/server/utils/kalenderUtils";
import { getCalculatedIntrakurikulerJP, getValidJpForTp } from "../data/intrakurikulerJP";

interface WorkspaceViewProps {
  identity: SchoolIdentity;
  setIdentity: React.Dispatch<React.SetStateAction<SchoolIdentity>>;
  tps: LearningObjective[];
  setTps: React.Dispatch<React.SetStateAction<LearningObjective[]>>;
  elements: CurriculumElement[];
  setElements: React.Dispatch<React.SetStateAction<CurriculumElement[]>>;
  babs: BabMateri[];
  setBabs: React.Dispatch<React.SetStateAction<BabMateri[]>>;
  activeTab: "identitas" | "cp" | "tp" | "atp" | "prota" | "promes" | "kktp" | "alokasi";
  setActiveTab: React.Dispatch<React.SetStateAction<"identitas" | "cp" | "tp" | "atp" | "prota" | "promes" | "kktp" | "alokasi">>;
  handleDownloadDocx: (targetTab: string, additionalParams?: any) => void;
  handleAISimplifyAllTps: () => void;
  handleMoveTp: (index: number, direction: "up" | "down") => void;
  handleUpdateTpText: (id: string, text: string) => void;
  promesSelections: { [key: string]: boolean };
  setPromesSelections: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  calculatedProgressPercent: number;
  overallAllocatedJp: number;
  allocatedJpS1: number;
  allocatedJpS2: number;
  availableJpS1: number;
  availableJpS2: number;

  // Parameters View and Identity View controls
  theoryWeight: number;
  setTheoryWeight: (weight: number) => void;
  handleLoadBabsPreset: () => void;
  handleAddBabManual: () => void;
  handleUpdateBabField: (id: string, field: keyof BabMateri, val: any) => void;
  handleDeleteBab: (id: string) => void;
  handleGenerateAllDocuments: () => void;
  handleLevelChange: (level: string) => void;
  handleSubjectOrPhaseChange: (subjectName: string, phaseName: string) => void;
  isServerOnline: boolean | null;
  setActiveView: (view: any) => void;
}

export default function WorkspaceView({
  identity,
  setIdentity,
  tps,
  setTps,
  elements,
  setElements,
  babs,
  setBabs,
  activeTab,
  setActiveTab,
  handleDownloadDocx,
  handleAISimplifyAllTps,
  handleMoveTp,
  handleUpdateTpText,
  promesSelections,
  setPromesSelections,
  calculatedProgressPercent,
  overallAllocatedJp,
  allocatedJpS1,
  allocatedJpS2,
  availableJpS1,
  availableJpS2,
  theoryWeight,
  setTheoryWeight,
  handleLoadBabsPreset,
  handleAddBabManual,
  handleUpdateBabField,
  handleDeleteBab,
  handleGenerateAllDocuments,
  handleLevelChange,
  handleSubjectOrPhaseChange,
  isServerOnline,
  setActiveView
}: WorkspaceViewProps) {
  const { state } = useSesiKurikulum();
  const validation = validateAlokasiJP(state);
  const getAvailableGradesForPhase = (phase: string): string[] => {
    switch (phase) {
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
  const phaseAvailableGrades = getAvailableGradesForPhase(identity.phase);
  const rawGrades = identity.grades && identity.grades.length > 0 ? identity.grades : ["7"];
  const activeGrades = rawGrades.filter(g => phaseAvailableGrades.includes(g)).length > 0
    ? rawGrades.filter(g => phaseAvailableGrades.includes(g))
    : [phaseAvailableGrades[0]];

  const [kktpOption, setKktpOption] = React.useState<"A" | "B" | "C">("A");

  // Steps Definition array for step by step sequential flow
  const stepsList = [
    { id: "identitas", label: "Identitas", stepNo: 1, desc: "Info & Konfigurasi" },
    { id: "cp", label: "Elemen CP", stepNo: 2, desc: "Capaian Pembelajaran" },
    { id: "tp", label: "Tujuan (TP)", stepNo: 3, desc: "Formulasi TP" },
    { id: "atp", label: "Alur (ATP)", stepNo: 4, desc: "Urutan KBM Logis" },
    { id: "prota", label: "PROTA", stepNo: 5, desc: "Program Tahunan" },
    { id: "promes", label: "PROMES", stepNo: 6, desc: "Program Semester" },
    { id: "kktp", label: "KKTP", stepNo: 7, desc: "Kriteria Ketuntasan" },
    { id: "alokasi", label: "Alokasi JP", stepNo: 8, desc: "Analisis Alokasi" },
  ] as const;

  const currentStepIndex = stepsList.findIndex((s) => s.id === activeTab);
  const isDocumentsGenerated = tps.length > 0;

  const handleAddTp = (grade: string) => {
    const mapelAbbr = identity.subject ? identity.subject.substring(0, 3).toUpperCase() : "MAPEL";
    const gradeTps = tps.filter(t => (t.grade || identity.grades[0]) === grade);
    const nextNum = gradeTps.length + 1;
    const firstElement = elements[0]?.name || "Umum";
    const code = `${mapelAbbr}.${identity.phase || "X"}.${firstElement.substring(0, 3).toUpperCase()}.${String(nextNum).padStart(2, "0")}`;

    const newTp: LearningObjective = {
      id: `tp-manual-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      code: code,
      element: firstElement,
      competency: "Memahami",
      content: "Materi Baru",
      text: "Mendeskripsikan dan menjelaskan konsep baru...",
      grade: grade,
      semester: 1,
      jp: 4,
      materiPokok: "Materi Baru",
    };

    setTps(prev => [...prev, newTp]);
  };

  const handleDeleteTp = (id: string) => {
    Swal.fire({
      title: "Hapus Tujuan Pembelajaran?",
      text: "Tujuan Pembelajaran ini akan dihapus dari program semester dan seluruh dokumen terkait.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setTps(prev => prev.filter(t => t.id !== id));
        Swal.fire({
          title: "Dihapus!",
          text: "TP berhasil dihapus.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleUpdateTpJp = (id: string, newJp: number) => {
    setTps(prev => prev.map(t => t.id === id ? { ...t, jp: Math.max(1, newJp) } : t));
  };

  // Track maximum sequential step unlocked
  const [maxUnlockedIdx, setMaxUnlockedIdx] = React.useState<number>(() => {
    if (tps && tps.length > 0) {
      return 7; // All steps unlocked if there are already generated elements
    }
    return 1; // Step 2 ("cp", index 1) is unlocked initially once Step 1 is accessible
  });

  const [stepGenerating, setStepGenerating] = React.useState<string | null>(null);
  const [stepGenMessage, setStepGenMessage] = React.useState<string>("");

  const [sdSubjects, setSdSubjects] = React.useState<string[]>([]);
  const [loadingSdSubjects, setLoadingSdSubjects] = React.useState(false);

  React.useEffect(() => {
    if (identity.jenjang && identity.phase) {
      setLoadingSdSubjects(true);
      try {
        const subjects = getLocalSubjects(identity.phase, identity.jenjang);
        if (subjects && subjects.length > 0) {
          setSdSubjects(subjects);
          
          // Check if identity.subject is matched (case-insensitive and trimmed)
          const matched = subjects.find((s: string) => s.toLowerCase() === identity.subject?.toLowerCase());
          if (matched) {
            if (matched !== identity.subject) {
              // Keep the casing uniform
              setIdentity(prev => ({ ...prev, subject: matched }));
              handleSubjectOrPhaseChange(matched, identity.phase);
            }
          } else {
            // Select the first one
            const firstSubj = subjects[0];
            setIdentity(prev => ({ ...prev, subject: firstSubj }));
            handleSubjectOrPhaseChange(firstSubj, identity.phase);
          }
        }
      } catch (err) {
        console.error("Error loading subjects locally:", err);
      } finally {
        setLoadingSdSubjects(false);
      }
    } else {
      setSdSubjects([]);
    }
  }, [identity.jenjang, identity.phase]);

  const handleAutoFitJP = () => {
    const weekJp = identity.jpPerWeek;
    const availableS1 = identity.weeksSemester1 * weekJp;
    const availableS2 = identity.weeksSemester2 * weekJp;

    // Leave exactly 15% reserve (cadangan) of available JP
    const reserveS1 = Math.round(availableS1 * 0.15);
    const reserveS2 = Math.round(availableS2 * 0.15);

    const targetS1 = availableS1 - reserveS1;
    const targetS2 = availableS2 - reserveS2;

    const updatedTps = tps.map((tp) => ({ ...tp }));

    // Helper function to adjust JP for a list of TPs to match a target while keeping JPs valid
    const adjustSemesterTps = (semTps: any[], available: number, target: number) => {
      const getTpCurrentJp = (tp: any) => {
        return tp.jpAlokasi !== undefined ? tp.jpAlokasi : (tp.jp || 0);
      };

      const currentSum = semTps.reduce((sum, t) => sum + getTpCurrentJp(t), 0);
      if (currentSum === 0) return;
      
      // Scale proportionally
      const ratio = target / currentSum;
      let allocated = 0;
      
      semTps.forEach((tp, i) => {
        const currentJp = getTpCurrentJp(tp);
        let rawJp = Math.max(2, Math.round(currentJp * ratio));
        let validJp = getValidJpForTp(rawJp, weekJp);
        
        // Ensure it doesn't exceed the remaining space
        if (i === semTps.length - 1) {
          // For the last element, try to get as close to target as possible, but must be valid
          const remaining = target - allocated;
          validJp = getValidJpForTp(remaining, weekJp);
          
          // Ensure total allocation + reserve is <= available
          if (allocated + validJp > available) {
            validJp = getValidJpForTp(available - allocated - 2, weekJp);
            if (validJp < 2) validJp = getValidJpForTp(2, weekJp);
          }
        }
        
        allocated += validJp;
        tp.jp = validJp;
        tp.jpAlokasi = validJp;
      });
      
      // Safety pass to adjust down if it exceeds the available limit
      let finalSum = semTps.reduce((sum, t) => sum + getTpCurrentJp(t), 0);
      if (finalSum > available) {
        const sorted = [...semTps].sort((a, b) => getTpCurrentJp(b) - getTpCurrentJp(a));
        for (const tp of sorted) {
          if (finalSum <= available) break;
          const currentJp = getTpCurrentJp(tp);
          const reduced = getValidJpForTp(currentJp - 2, weekJp);
          if (reduced < currentJp) {
            tp.jp = reduced;
            tp.jpAlokasi = reduced;
            finalSum -= (currentJp - reduced);
          }
        }
      }

      // Safety pass to adjust up if the reserve is too large (greater than 15% target)
      finalSum = semTps.reduce((sum, t) => sum + getTpCurrentJp(t), 0);
      let reserve = available - finalSum;
      const targetReserve = Math.round(available * 0.15);
      if (reserve > targetReserve) {
        // We have too much reserve! Let's increase some TPs' JP to reduce reserve closer to 15%
        const sorted = [...semTps].sort((a, b) => getTpCurrentJp(a) - getTpCurrentJp(b));
        for (const tp of sorted) {
          if (available - finalSum <= targetReserve) break;
          const currentJp = getTpCurrentJp(tp);
          const increased = getValidJpForTp(currentJp + 2, weekJp);
          if (increased > currentJp && finalSum + (increased - currentJp) <= available) {
            tp.jp = increased;
            tp.jpAlokasi = increased;
            finalSum += (increased - currentJp);
          }
        }
      }
    };

    // Semester 1
    const s1Tps = updatedTps.filter(t => t.semester === 1);
    adjustSemesterTps(s1Tps, availableS1, targetS1);

    // Semester 2
    const s2Tps = updatedTps.filter(t => t.semester === 2);
    adjustSemesterTps(s2Tps, availableS2, targetS2);

    setTps(updatedTps);
    Swal.fire({
      title: "Optimasi Berhasil",
      text: "Alokasi JP per topik materi (ATP) berhasil disesuaikan secara proporsional dengan menyisakan cadangan 15% untuk keperluan penilaian sumatif, proyek, atau cadangan darurat.",
      icon: "success",
      confirmButtonColor: "#2563eb"
    });
  };

  const isIdentityComplete = () => {
    return (
      (identity.schoolName?.trim() ?? "") !== "" &&
      (identity.academicYear?.trim() ?? "") !== "" &&
      (identity.schoolAddress?.trim() ?? "") !== "" &&
      (identity.author?.trim() ?? "") !== "" &&
      (identity.nip?.trim() ?? "") !== "" &&
      (identity.kepalaSekolah?.trim() ?? "") !== "" &&
      (identity.nipKepalaSekolah?.trim() ?? "") !== ""
    );
  };

  const handleStepClick = async (tabId: typeof stepsList[number]["id"]) => {
    if (tabId !== "identitas" && !isIdentityComplete()) {
      Swal.fire({
        title: "Identitas Belum Lengkap",
        text: "Mohon isi semua data identitas satuan pendidikan, guru pengampu, dan kepala sekolah di Langkah 1 terlebih dahulu!",
        icon: "warning",
        confirmButtonColor: "#2563eb"
      });
      return;
    }

    const targetIdx = stepsList.findIndex((s) => s.id === tabId);
    
    // Gated sequential progress control
    if (targetIdx > maxUnlockedIdx) {
      // If user clicks the direct next step, allow them to unlock it via sequential AI-generation!
      if (targetIdx === maxUnlockedIdx + 1) {
        const nextStep = stepsList[targetIdx];
        setStepGenerating(nextStep.id);
        const messages: { [key: string]: string } = {
          tp: "Sistem AI merumuskan katalog Tujuan Pembelajaran (TP) terstruktur berbasis Kurikulum Nasional...",
          atp: "Sistem AI mengurutkan Alur Tujuan Pembelajaran secara logis-kronologis sesuai Fase...",
          prota: "Sistem AI memetakan Program Tahunan (PROTA) & distribusi beban ajar...",
          promes: "Sistem AI menjadwalkan Program Semester (PROMES) rinci per minggu...",
          kktp: "Sistem AI menghitung rubrik Kriteria Ketuntasan (KKTP) instan guru...",
          alokasi: "Sistem AI menyinkronkan total alokasi Jam Pelajaran dan kalender akademik sekolah..."
        };
        setStepGenMessage(messages[nextStep.id] || "Sistem AI merumuskan langkah berikutnya...");

        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (nextStep.id === "tp" && tps.length === 0) {
          try {
            await handleAISimplifyAllTps();
          } catch (err) {
            handleGenerateAllDocuments();
          }
        }

        setMaxUnlockedIdx(targetIdx);
        setStepGenerating(null);
        setActiveTab(tabId);
        return;
      }

      Swal.fire({
        title: "Langkah Belum Terbuka",
        text: "Selesaikan dan pahami langkah sebelumnya secara berurutan terlebih dahulu sebelum membuka langkah ini!",
        icon: "info",
        confirmButtonColor: "#2563eb"
      });
      return;
    }

    // If target equals "tp" and we don't have tps yet, trigger generation
    if (tabId === "tp" && tps.length === 0) {
      setStepGenerating("tp");
      setStepGenMessage("Sistem AI merumuskan katalog Tujuan Pembelajaran (TP) terstruktur berbasis Kurikulum Nasional...");
      await new Promise((resolve) => setTimeout(resolve, 1550));
      try {
        await handleAISimplifyAllTps();
      } catch (err) {
        handleGenerateAllDocuments();
      }
      setMaxUnlockedIdx(2);
      setStepGenerating(null);
    }

    setActiveTab(tabId);
  };

  const handleNextStep = async () => {
    if (activeTab === "identitas") {
      if (!isIdentityComplete()) {
        Swal.fire({
          title: "Identitas Belum Lengkap",
          text: "Mohon isi semua data identitas satuan pendidikan, guru pengampu, dan kepala sekolah di Langkah 1 terlebih dahulu!",
          icon: "warning",
          confirmButtonColor: "#2563eb"
        });
        return;
      }
      setActiveTab("cp");
    } else {
      const nextIdx = currentStepIndex + 1;
      if (nextIdx < stepsList.length) {
        const nextStep = stepsList[nextIdx];
        
        // If the next step is not yet unlocked
        if (nextIdx > maxUnlockedIdx) {
          setStepGenerating(nextStep.id);
          const messages: { [key: string]: string } = {
            tp: "Sistem AI merumuskan katalog Tujuan Pembelajaran (TP) terstruktur berbasis Kurikulum Nasional...",
            atp: "Sistem AI mengurutkan Alur Tujuan Pembelajaran secara logis-kronologis sesuai Fase...",
            prota: "Sistem AI memetakan Program Tahunan (PROTA) & distribusi beban ajar...",
            promes: "Sistem AI menjadwalkan Program Semester (PROMES) rinci per minggu...",
            kktp: "Sistem AI menghitung rubrik Kriteria Ketuntasan (KKTP) instan guru...",
            alokasi: "Sistem AI menyinkronkan total alokasi Jam Pelajaran dan kalender akademik sekolah..."
          };
          setStepGenMessage(messages[nextStep.id] || "Sistem AI merumuskan langkah berikutnya...");

          await new Promise((resolve) => setTimeout(resolve, 1500));

          if (nextStep.id === "tp" && tps.length === 0) {
            try {
              await handleAISimplifyAllTps();
            } catch (err) {
              handleGenerateAllDocuments();
            }
          }

          setMaxUnlockedIdx(nextIdx);
          setStepGenerating(null);
        }

        setActiveTab(nextStep.id);
      }
    }
  };

  const handlePrevStep = () => {
    if (activeTab === "identitas") {
      setActiveView("dashboard");
    } else {
      const prevIdx = currentStepIndex - 1;
      if (prevIdx >= 0) {
        setActiveTab(stepsList[prevIdx].id);
      }
    }
  };

  return (
    <main className="p-8 max-w-6xl w-full mx-auto space-y-6 flex-1 flex flex-col justify-start" id="workspace-view">
      
      {/* Upper header workspace information */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="space-y-1.5 animate-fade-in">
          <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">
            Workspace Penyusunan Administrasi Guru
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isDocumentsGenerated && (
            <button
              onClick={() => handleDownloadDocx("all")}
              disabled={!validation.statusValid}
              className="flex items-center gap-2 px-5 py-3 bg-[#006c49] text-white font-bold text-xs rounded-xl hover:brightness-110 shadow-lg shadow-emerald-250/50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              id="workspace-export-all-btn"
              title={!validation.statusValid ? "Harap selaraskan alokasi JP di Langkah 9 terlebih dahulu" : "Unduh Seluruh Dokumen"}
            >
              <Download className="w-4 h-4 text-white" />
              <span>Unduh Seluruh Bahan (.docx)</span>
            </button>
          )}
        </div>
      </div>

      {/* STEP-BY-STEP SEQUENTIAL PROGRESS HEADER BAR */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e8f0] overflow-x-auto">
        <div className="flex justify-between items-center min-w-[900px] relative">
          
          {/* Connector line behind circles */}
          <div className="absolute left-6 right-6 top-[18px] h-0.5 bg-slate-100 -z-1">
            <div 
              className="h-full bg-blue-600 transition-all duration-500" 
              style={{ width: `${(Math.max(0, currentStepIndex) / (stepsList.length - 1)) * 100}%` }}
            />
          </div>

          {stepsList.map((st, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = st.id === activeTab;
            const isLocked = idx > maxUnlockedIdx || (st.id !== "identitas" && !isIdentityComplete());
            
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleStepClick(st.id)}
                className="flex flex-col items-center flex-1 relative group focus:outline-none"
              >
                {/* Bullet circle badge */}
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs border-2 transition duration-200 ${
                    isActive 
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-110" 
                      : isCompleted 
                        ? "bg-emerald-600 border-emerald-600 text-white" 
                        : isLocked 
                          ? "bg-slate-50 border-slate-205 text-slate-300 cursor-not-allowed" 
                          : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    st.stepNo
                  )}
                </div>

                {/* Legend labels */}
                <span className={`text-[10px] font-extrabold mt-2 whitespace-nowrap tracking-tight ${
                  isActive ? "text-blue-600" : isCompleted ? "text-emerald-700 font-semibold" : "text-slate-500"
                }`}>
                  {st.label}
                </span>
                
                <span className="text-[8px] text-slate-400 scale-90 block mt-0.5 font-light opacity-0 group-hover:opacity-100 transition whitespace-nowrap absolute -bottom-4 bg-slate-800 text-white px-2 py-0.5 rounded shadow-lg z-20 pointer-events-none">
                  {st.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Display Dynamic Active Tab sheets */}
      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-xs flex-1 flex flex-col justify-between">
        
        {/* ========================================================= */}
        {/* STEP 1: IDENTITAS TAB */}
        {/* ========================================================= */}
        {activeTab === "identitas" && (
          <div className="space-y-6 animate-fade-in-up" id="tab-identity">
            <div className="space-y-1 border-b pb-4">
              <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Langkah 1: Lengkasi Administrasi Informasi Kop Dinasti</span>
              </h4>
              <p className="text-xs text-slate-500">
                Pondasi awal! Lengkapi data di bawah ini untuk dipetakan secara dinamis pada kop seluruh perangkat administrasi (Word) yang akan diunduh.
              </p>
            </div>

            <div className="space-y-6">
              {/* Block A: Satuan Pendidikan Box (1 wide box) */}
              <div className="bg-[#FAFBFD]/40 border border-[#e2e8f0] rounded-2xl p-5 space-y-4">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b pb-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>A. Informasi Satuan Pendidikan</span>
                </h5>
                
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Nama Sekolah / Satuan Pendidikan</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400/80 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500/10 transition"
                    placeholder="SMPN 1 Indonesia"
                    value={identity.schoolName}
                    onChange={(e) => setIdentity(prev => ({ ...prev, schoolName: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Tahun Pelajaran</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400/80 focus:outline-none focus:border-blue-600"
                      placeholder="2026/2027"
                      value={identity.academicYear}
                      onChange={(e) => setIdentity(prev => ({ ...prev, academicYear: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Kurikulum Berjalan</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400/80 focus:outline-none focus:border-blue-600"
                      value={identity.curriculumName}
                      onChange={(e) => setIdentity(prev => ({ ...prev, curriculumName: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Alamat Kantor Sekolah</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400/80 focus:outline-none focus:border-blue-600"
                    placeholder="Jl. Kemerdekaan Nomor. 1"
                    value={identity.schoolAddress}
                    onChange={(e) => setIdentity(prev => ({ ...prev, schoolAddress: e.target.value }))}
                  />
                </div>
              </div>

              {/* Row 2: Side by side Guru & Kepala Sekolah block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Block B: Guru identity forms */}
                <div className="bg-[#FAFBFD]/40 border border-[#e2e8f0] rounded-2xl p-5 space-y-4">
                  <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b pb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>B. Identitas Guru Pengampu</span>
                  </h5>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Nama Lengkap Guru &amp; Gelar</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400/80 focus:outline-none focus:border-blue-600"
                      placeholder="Muhammad Alimka, S.Pd., M.Pd."
                      value={identity.author}
                      onChange={(e) => setIdentity(prev => ({ ...prev, author: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">NIP / NUPTK Resmi Guru</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400/80 focus:outline-none focus:border-blue-600"
                      placeholder="1234567890"
                      value={identity.nip}
                      onChange={(e) => setIdentity(prev => ({ ...prev, nip: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Block C: Identitas Kepala Sekolah */}
                <div className="bg-[#FAFBFD]/40 border border-[#e2e8f0] rounded-2xl p-5 space-y-4">
                  <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b pb-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>C. Identitas Kepala Sekolah</span>
                  </h5>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Nama Lengkap Kepala Sekolah &amp; Gelar</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400/80 focus:outline-none focus:border-blue-600"
                      placeholder="Dr. H. Ahmad Dahlan, M.Pd."
                      value={identity.kepalaSekolah || ""}
                      onChange={(e) => setIdentity(prev => ({ ...prev, kepalaSekolah: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">NIP / NUPTK Kepala Sekolah</label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400/80 focus:outline-none focus:border-blue-600"
                      placeholder="1234567890"
                      value={identity.nipKepalaSekolah || ""}
                      onChange={(e) => setIdentity(prev => ({ ...prev, nipKepalaSekolah: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: D. Konfigurasi Pembelajaran (1 wide box under it) */}
              <div className="bg-[#FAFBFD]/40 border border-[#e2e8f0] rounded-2xl p-5 space-y-5">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b pb-2">
                  <Sliders className="w-4 h-4 text-blue-600" />
                  <span>D. Konfigurasi Pembelajaran (Wajib Berurutan)</span>
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Inner Column of D - Sequential selection */}
                  <div className="space-y-4">
                    {/* 1. Jenjang Pendidikan */}
                    <div className="bg-slate-50/65 p-4 rounded-xl border border-slate-200/50 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-705 mb-2 block">1. Jenjang Pendidikan</label>
                        <div className="grid grid-cols-5 gap-1.5">
                          {["PAUD", "SD", "SMP", "SMA", "SMK"].map((level) => {
                            const activeLvl = identity.jenjang === level;
                            return (
                              <button
                                type="button"
                                key={level}
                                onClick={() => handleLevelChange(level)}
                                className={`py-2 px-1 text-[11px] font-extrabold rounded-xl border text-center transition ${
                                  activeLvl
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-white text-slate-650 border-slate-200 hover:border-slate-350"
                                }`}
                              >
                                {level}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Target Fase */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1.5">
                        <div>
                          <label className="text-xs font-bold text-slate-705 mb-1.5 block">
                            2. Target Fase {!identity.jenjang && <span className="text-red-500 font-normal text-[10px]">(Pilih Jenjang Dulu)</span>}
                          </label>
                          <select
                            value={identity.phase || ""}
                            disabled={!identity.jenjang}
                            onChange={(e) => {
                              const val = e.target.value;
                              let nextGrades: string[] = [];
                              if (val === "Fondasi") nextGrades = ["TK A", "TK B"];
                              else if (val === "A") nextGrades = ["1", "2"];
                              else if (val === "B") nextGrades = ["3", "4"];
                              else if (val === "C") nextGrades = ["5", "6"];
                              else if (val === "D") nextGrades = ["7", "8", "9"];
                              else if (val === "E") nextGrades = ["10"];
                              else if (val === "F") nextGrades = ["11", "12"];

                              const nextJp = getCalculatedIntrakurikulerJP(identity.jenjang, nextGrades[0], identity.subject).jpPerWeek || 4;

                              setIdentity(prev => ({
                                ...prev,
                                phase: val,
                                grades: nextGrades,
                                kelas: nextGrades,
                                jpPerWeek: nextJp
                              }));
                              handleSubjectOrPhaseChange(identity.subject, val);
                            }}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-805 font-bold focus:outline-none focus:border-blue-600 transition disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            {!identity.jenjang && <option value="">-- Pilih Jenjang Dulu --</option>}
                            {identity.jenjang === "PAUD" && <option value="Fondasi">Fase Fondasi</option>}
                            {identity.jenjang === "SD" && (
                              <>
                                <option value="A">Fase A (Kls 1-2)</option>
                                <option value="B">Fase B (Kls 3-4)</option>
                                <option value="C">Fase C (Kls 5-6)</option>
                              </>
                            )}
                            {identity.jenjang === "SMP" && <option value="D">Fase D (Kls 7-9)</option>}
                            {(identity.jenjang === "SMA" || identity.jenjang === "SMK") && (
                              <>
                                <option value="E">Fase E (Kls 10)</option>
                                <option value="F">Fase F (Kls 11-12)</option>
                              </>
                            )}
                          </select>
                        </div>

                        {/* 3. Mata Pelajaran */}
                        <div>
                          <label className="text-xs font-bold text-slate-705 mb-1.5 block">
                            3. Mata Pelajaran {loadingSdSubjects && <span className="text-[10px] text-blue-500 font-normal animate-pulse">(Memuat...)</span>}
                            {!identity.phase && <span className="text-red-500 font-normal text-[10px]">(Pilih Fase Dulu)</span>}
                          </label>
                          <select
                            value={identity.subject || ""}
                            disabled={!identity.phase || loadingSdSubjects}
                            onChange={(e) => {
                              const val = e.target.value;
                              setIdentity(prev => ({ ...prev, subject: val }));
                              handleSubjectOrPhaseChange(val, identity.phase);
                            }}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-805 font-bold focus:outline-none focus:border-blue-600 disabled:bg-slate-50 disabled:text-slate-400"
                          >
                            {!identity.phase && <option value="">-- Pilih Fase Dulu --</option>}
                            {identity.phase && sdSubjects.map(subj => (
                              <option key={subj} value={subj}>{subj}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Inner Column of D - Grades & Larger WP Workload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-600 mb-1.5 block">Tingkatan / Pilihan Kelas</label>
                      <div className="flex flex-wrap gap-1.5 py-1">
                        {(() => {
                          let availableGrades: string[] = [];
                          switch (identity.phase) {
                            case "Fondasi": availableGrades = ["TK A", "TK B"]; break;
                            case "A": availableGrades = ["1", "2"]; break;
                            case "B": availableGrades = ["3", "4"]; break;
                            case "C": availableGrades = ["5", "6"]; break;
                            case "D": availableGrades = ["7", "8", "9"]; break;
                            case "E": availableGrades = ["10"]; break;
                            case "F": availableGrades = ["11", "12"]; break;
                            default: availableGrades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
                          }
                          return availableGrades.map((g) => {
                            const isSelected = (identity.grades || []).includes(g);
                            return (
                              <button
                                type="button"
                                key={g}
                                onClick={() => {
                                  const currentGrades = (identity.grades || []).filter((x: string) => availableGrades.includes(x));
                                  let nextGrades;
                                  if (isSelected) {
                                    nextGrades = currentGrades.filter((x: string) => x !== g);
                                  } else {
                                    nextGrades = [...currentGrades, g];
                                  }
                                  if (nextGrades.length === 0) {
                                    nextGrades = [g];
                                  }
                                  setIdentity(prev => ({ ...prev, grades: nextGrades, kelas: nextGrades }));
                                }}
                                className={`py-1.5 px-3 rounded-lg text-[10px] font-bold border transition ${
                                  isSelected
                                    ? "bg-blue-600 text-white border-blue-600 shadow-xs scale-102"
                                    : "bg-white text-slate-650 border-slate-200 hover:border-slate-350"
                                }`}
                              >
                                {identity.jenjang === "PAUD" ? g : `Kelas ${g}`}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    {/* Highly requested: larger and wider weekly JP workload input container */}
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Beban JP Mingguan</label>
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setIdentity(prev => ({ ...prev, jpPerWeek: Math.max(1, prev.jpPerWeek - 1) }))}
                          className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition active:scale-95 shadow-sm"
                        >
                          <ArrowDown className="w-5 h-5 font-bold" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="40"
                          value={identity.jpPerWeek}
                          onChange={(e) => setIdentity(prev => ({ ...prev, jpPerWeek: parseInt(e.target.value) || 0 }))}
                          className="w-28 text-center bg-white border border-slate-200 rounded-xl py-3 px-4 text-xl font-black text-blue-600 tracking-tight font-mono focus:outline-none focus:border-blue-600 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setIdentity(prev => ({ ...prev, jpPerWeek: Math.min(40, prev.jpPerWeek + 1) }))}
                          className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition active:scale-95 shadow-sm"
                        >
                          <ArrowUp className="w-5 h-5 font-bold" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: E. Kalender Akademik & Konfigurasi Administrasi */}
              <div className="bg-[#FAFBFD]/40 border border-[#e2e8f0] rounded-2xl p-5 space-y-5">
                <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b pb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>E. Kalender Akademik &amp; Konfigurasi Administrasi</span>
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card: Minggu Efektif inputs */}
                  <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl shadow-3xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-blue-700">
                      <Calendar className="w-4 h-4" />
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-850">Minggu Efektif KBM</h5>
                    </div>
                    <div className="space-y-3.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Semester 1 (Ganjil)</label>
                        <div className="relative">
                          <input
                            type="number"
                            className="w-full pl-3.5 pr-14 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:border-blue-600 focus:outline-none"
                            value={identity.weeksSemester1}
                            onChange={(e) => setIdentity(prev => ({ ...prev, weeksSemester1: parseInt(e.target.value) || 0 }))}
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">Minggu</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Semester 2 (Genap)</label>
                        <div className="relative">
                          <input
                            type="number"
                            className="w-full pl-3.5 pr-14 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-800 focus:border-blue-600 focus:outline-none"
                            value={identity.weeksSemester2}
                            onChange={(e) => setIdentity(prev => ({ ...prev, weeksSemester2: parseInt(e.target.value) || 0 }))}
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">Minggu</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card: Sumatif JP Per Bahas center adjustment widget */}
                  <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl shadow-3xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-blue-700">
                      <Clock className="w-4 h-4" />
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-850">Cagar Jam Evaluasi</h5>
                    </div>
                    <div className="space-y-4 pt-1">
                      <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        <strong>Cagar Jam Evaluasi</strong> adalah cadangan Jam Pelajaran (JP) yang dialokasikan khusus pada setiap bab untuk penilaian sumatif, remedial, dan pengayaan, sehingga tidak memotong jam tatap muka materi inti.
                      </p>
                      <div className="p-3 bg-blue-50/50 border border-blue-105 rounded-xl flex flex-col items-center">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-600 block mb-1.5">Penilaian Sumatif Bab (JP)</span>
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setIdentity(prev => ({ ...prev, jpSumatifPerBab: Math.max(0, prev.jpSumatifPerBab - 2) }))}
                            className="w-8 h-8 bg-white shadow-xs hover:shadow border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-700 active:scale-95 transition"
                          >
                            -
                          </button>
                          <span className="text-2xl font-black font-mono text-blue-700">{identity.jpSumatifPerBab}</span>
                          <button
                            type="button"
                            onClick={() => setIdentity(prev => ({ ...prev, jpSumatifPerBab: prev.jpSumatifPerBab + 2 }))}
                            className="w-8 h-8 bg-white shadow-xs hover:shadow border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-700 active:scale-95 transition"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-[9px] font-bold text-blue-550 block mt-1.5 leading-none">Cagar JP Sumatif Evaluasi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: CAPAIAN PEMBELAJARAN (CP) */}
        {/* ========================================================= */}
        {activeTab === "cp" && (
          <div className="space-y-4 animate-fade-in-up md:min-h-[350px]" id="tab-content-cp">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>Capaian Pembelajaran (CP) per Elemen Mata Pelajaran</span>
                </h4>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block mt-0.5 font-mono">Keputusan KEPALA BSKAP KEMENTERIAN PENDIDIKAN DASAR DAN MENENGAH NOMOR 046/H/KR/2025</span>
              </div>
              <button
                onClick={() => handleDownloadDocx("cp")}
                className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-100/60 transition flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CP .docx</span>
              </button>
            </div>

            <div className="overflow-hidden border border-[#e2e8f0] rounded-2xl bg-white shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#FAFBFD] font-bold text-slate-500 border-b border-[#e2e8f0]">
                  <tr>
                    <th className="px-5 py-3 w-40">Elemen Target</th>
                    <th className="px-5 py-3">Deskripsi Capaian Pembelajaran Resmi BSKAP 2025</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {elements.map((el, i) => (
                    <tr key={i} className="align-top hover:bg-slate-50/20">
                      <td className="px-5 py-4 font-bold text-slate-850">{el.name}</td>
                      <td className="px-5 py-4 text-slate-600 leading-relaxed font-sans">{el.cpText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 4: TUJUAN PEMBELAJARAN (TP) */}
        {/* ========================================================= */}
        {activeTab === "tp" && (
          <div className="space-y-4 animate-fade-in-up md:min-h-[350px]" id="tab-content-tp">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-805 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>Uraian Rumusan Tujuan Pembelajaran (TP)</span>
                </h4>
                <span className="text-[10px] text-slate-400 block mt-0.5">Kompetensi intrakurikuler terformulasi berbasis Taksonomi Kata Kerja Operasional</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleAISimplifyAllTps}
                  className="text-xs font-black text-amber-850 bg-amber-50 border border-amber-205 px-3 py-1.5 rounded-xl hover:bg-amber-100 transition flex items-center gap-1.5 shadow-3xs active:scale-95"
                  id="btn-regenerate-tp-ai-header"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>Optimasi Ulang via AI</span>
                </button>
                <button
                  onClick={() => handleDownloadDocx("tp")}
                  className="text-xs font-bold text-blue-600 bg-blue-50/40 border border-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-100/60 transition flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh TP .docx</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {activeGrades.map((grade) => {
                const filteredTps = tps.filter(obj => (obj.grade || identity.grades[0]) === grade);

                return (
                  <div key={grade} className="space-y-4 border border-slate-100 rounded-2xl p-4 bg-[#F8FAFC]/55">
                    <div className="flex items-center justify-between bg-white border border-[#E2E8F0] px-4 py-2 rounded-xl shadow-3xs">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-blue-605" />
                        <span className="text-xs font-black text-slate-800">Tujuan Pembelajaran Kelas {grade}</span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 font-bold border border-blue-100">
                          {filteredTps.length} TP
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddTp(grade)}
                        className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg hover:bg-emerald-100 transition flex items-center gap-1 active:scale-95 shadow-3xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah TP</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-[#e2e8f0] rounded-2xl bg-white shadow-3xs">
                      <table className="w-full text-left border-collapse text-xs min-w-[800px]">
                        <thead className="bg-[#FAFBFD] font-bold text-slate-500 border-b border-[#e2e8f0]">
                          <tr>
                            <th className="px-4 py-3 text-center w-28">Kode</th>
                            <th className="px-4 py-3 w-48">Elemen CP</th>
                            <th className="px-4 py-3 w-28 text-center">Semester</th>
                            {identity.grades.length > 1 && (
                              <th className="px-4 py-3 w-32">Kelas</th>
                            )}
                            <th className="px-4 py-3 text-center w-36">Alokasi JP</th>
                            <th className="px-4 py-3 text-center w-20">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {filteredTps.map((obj) => (
                            <React.Fragment key={obj.id}>
                              {/* Row 1: Metadata */}
                              <tr className="align-middle bg-slate-50/25">
                                <td className="px-4 py-2 text-center w-28">
                                  <input
                                    type="text"
                                    className="w-full bg-[#FAFBFD] border border-slate-205 px-2 py-1.5 text-xs text-blue-700 font-mono font-bold focus:outline-none focus:border-blue-605 rounded-lg text-center"
                                    value={obj.code}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setTps(prev => prev.map(t => t.id === obj.id ? { ...t, code: val } : t));
                                    }}
                                  />
                                </td>
                                <td className="px-4 py-2 w-48">
                                  <select
                                    value={obj.element}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setTps(prev => prev.map(t => t.id === obj.id ? { ...t, element: val } : t));
                                    }}
                                    className="w-full bg-white border border-slate-205 px-2 py-1.5 text-xs text-slate-800 rounded-lg outline-none font-medium"
                                  >
                                    {elements.map(el => (
                                      <option key={el.name} value={el.name}>{el.name}</option>
                                    ))}
                                    {elements.length === 0 && (
                                      <option value={obj.element}>{obj.element}</option>
                                    )}
                                  </select>
                                </td>
                                <td className="px-4 py-2 text-center w-28">
                                  <select
                                    value={obj.semester || 1}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 1;
                                      setTps(prev => prev.map(t => t.id === obj.id ? { ...t, semester: val } : t));
                                    }}
                                    className="bg-white border border-slate-205 px-2 py-1.5 text-xs text-slate-800 rounded-lg outline-none font-medium mx-auto"
                                  >
                                    <option value={1}>Smtr 1</option>
                                    <option value={2}>Smtr 2</option>
                                  </select>
                                </td>
                                {identity.grades.length > 1 && (
                                  <td className="px-4 py-2 w-32">
                                    <select
                                      value={obj.grade || grade}
                                      onChange={(e) => {
                                        const nextGrad = e.target.value;
                                        setTps(prev => prev.map(t => t.id === obj.id ? { ...t, grade: nextGrad } : t));
                                      }}
                                      className="px-2 py-1.5 bg-white border border-slate-200 text-xs text-slate-705 font-bold rounded-lg outline-none w-full"
                                    >
                                      {identity.grades.map(g => (
                                        <option key={g} value={g}>Kelas {g}</option>
                                      ))}
                                    </select>
                                  </td>
                                )}
                                <td className="px-4 py-2 text-center w-36">
                                  <div className="flex items-center justify-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5 w-fit mx-auto shadow-3xs">
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateTpJp(obj.id, obj.jp - 1)}
                                      className="p-1 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60 active:scale-95"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <input
                                      type="number"
                                      className="w-10 text-center bg-white border border-slate-200/60 rounded px-1 py-0.5 font-bold text-xs"
                                      value={obj.jp}
                                      onChange={(e) => handleUpdateTpJp(obj.id, parseInt(e.target.value) || 0)}
                                    />
                                    <span className="text-[10px] text-slate-400 font-bold px-0.5">JP</span>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateTpJp(obj.id, obj.jp + 1)}
                                      className="p-1 rounded bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60 active:scale-95"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                                <td className="px-4 py-2 text-center w-20">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTp(obj.id)}
                                    className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100/80 rounded-lg border border-red-100 transition active:scale-95 shadow-3xs"
                                    title="Hapus TP"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                              {/* Row 2: Kalimat Rumusan Tujuan Pembelajaran (TP) */}
                              <tr className="border-b border-slate-200/80 bg-white">
                                <td colSpan={identity.grades.length > 1 ? 6 : 5} className="px-4 pb-3.5 pt-1.5">
                                  <div className="flex flex-col gap-1.5 w-full bg-[#FAFBFD] p-2.5 rounded-xl border border-slate-100 shadow-3xs">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 select-none">
                                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                      Kalimat Rumusan Tujuan Pembelajaran (TP)
                                    </div>
                                    <textarea
                                      rows={2}
                                      className="w-full bg-white border border-slate-200/80 px-3 py-2 text-xs text-slate-800 font-medium leading-relaxed focus:outline-none focus:border-blue-500 rounded-lg shadow-3xs focus:ring-1 focus:ring-blue-100 resize-none"
                                      value={obj.text}
                                      onChange={(e) => handleUpdateTpText(obj.id, e.target.value)}
                                      placeholder="Tuliskan rumusan tujuan pembelajaran operasional di sini..."
                                    />
                                  </div>
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}
                          {filteredTps.length === 0 && (
                            <tr>
                              <td colSpan={identity.grades.length > 1 ? 6 : 5} className="px-4 py-6 text-center text-slate-400">
                                Belum ada TP yang didelegasikan ke Kelas {grade}. Silakan tambah baru atau jalankan ulang "Generate".
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 5: ALUR TUJUAN PEMBELAJARAN (ATP) */}
        {/* ========================================================= */}
        {activeTab === "atp" && (
          <div className="space-y-4 animate-fade-in-up md:min-h-[350px]" id="tab-content-atp">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Alur Tujuan Pembelajaran (ATP) &amp; Urutan KBM Logis</span>
                </h4>
                <p className="text-xs text-[#94a3b8] mt-0.5">Atur urutan progres mengajar per semester untuk tiap kelas secara logis dan runtut</p>
              </div>
              <button
                onClick={() => handleDownloadDocx("atp")}
                className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-100/60 transition flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh ATP .docx</span>
              </button>
            </div>

            <div className="space-y-6">
              {activeGrades.map((grade) => {
                const filteredTps = tps.filter(obj => (obj.grade || identity.grades[0]) === grade);

                return (
                  <div key={grade} className="space-y-4 border border-slate-100 rounded-2xl p-4 bg-[#F8FAFC]/55">
                    <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] px-4 py-2 rounded-xl w-fit shadow-2xs">
                      <GraduationCap className="w-4 h-4 text-blue-605" />
                      <span className="text-xs font-black text-slate-800">Alur KPM Kelas {grade}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {[1, 2].map((semNum) => {
                        const semTps = filteredTps.filter(obj => obj.semester === semNum);
                        const semTitle = semNum === 1 ? "Semester I (Ganjil)" : "Semester II (Genap)";
                        const badgeColor = semNum === 1 ? "bg-amber-50 text-amber-800 border-amber-100" : "bg-indigo-50 text-indigo-800 border-indigo-100";
                        const sumJp = semTps.reduce((sum, item) => sum + (item.jp || 0), 0);

                        return (
                          <div key={semNum} className="space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-md border ${badgeColor}`}>
                                  {semTitle}
                                </span>
                                <span className="text-[10px] text-slate-400 font-extrabold font-mono">
                                  {semTps.length} TP ({sumJp} JP)
                                </span>
                              </div>

                              <div className="space-y-2">
                                {semTps.map((obj, localIndex) => {
                                  const absoluteIndex = tps.findIndex(t => t.id === obj.id);

                                  return (
                                    <div
                                      key={obj.id}
                                      className="p-3 border border-[#e2e8f0] rounded-xl bg-[#f8fafc]/40 hover:bg-white transition flex items-center justify-between gap-3 shadow-3xs"
                                    >
                                      <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <button
                                          type="button"
                                          disabled={localIndex === 0}
                                          onClick={() => {
                                            const filteredWithAbsoluteIndex = tps
                                              .map((tp, idx) => ({ tp, idx }))
                                              .filter(item => (item.tp.grade || identity.grades[0]) === grade && item.tp.semester === semNum);
                                            const prevAbsoluteIndex = filteredWithAbsoluteIndex[localIndex - 1].idx;

                                            const updated = [...tps];
                                            const temp = updated[absoluteIndex];
                                            updated[absoluteIndex] = updated[prevAbsoluteIndex];
                                            updated[prevAbsoluteIndex] = temp;
                                            setTps(updated);
                                          }}
                                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-505"
                                          title="Geser naik"
                                        >
                                          <ArrowUp className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          disabled={localIndex === semTps.length - 1}
                                          onClick={() => {
                                            const filteredWithAbsoluteIndex = tps
                                              .map((tp, idx) => ({ tp, idx }))
                                              .filter(item => (item.tp.grade || identity.grades[0]) === grade && item.tp.semester === semNum);
                                            const nextAbsoluteIndex = filteredWithAbsoluteIndex[localIndex + 1].idx;

                                            const updated = [...tps];
                                            const temp = updated[absoluteIndex];
                                            updated[absoluteIndex] = updated[nextAbsoluteIndex];
                                            updated[nextAbsoluteIndex] = temp;
                                            setTps(updated);
                                          }}
                                          className="p-1 rounded bg-slate-100 hover:bg-slate-205 disabled:opacity-40 text-slate-505"
                                          title="Geser turun"
                                        >
                                          <ArrowDown className="w-3 h-3" />
                                        </button>
                                        <span className="font-mono text-[9px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded border border-blue-100">
                                          {obj.code}
                                        </span>
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <p className="text-[11px] text-slate-800 font-semibold leading-tight">{obj.text}</p>
                                        <span className="text-[8px] uppercase font-bold tracking-wider text-[#94a3b8] block mt-0.5 font-mono truncate">
                                          {obj.element} • {obj.materiPokok || obj.content}
                                        </span>
                                      </div>

                                      <div className="flex-shrink-0 text-right space-y-0.5 border-l border-slate-100 pl-2">
                                        <span className="font-mono font-bold text-blue-700 text-[11px] block">{obj.jp} JP</span>
                                      </div>
                                    </div>
                                  );
                                })}
                                {semTps.length === 0 && (
                                  <div className="p-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-[#94a3b8] text-center text-[10px] font-light py-8">
                                    Belum ada rumusan alur TP untuk Semester {semNum === 1 ? "Ganjil" : "Genap"}.
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 6: PROGRAM TAHUNAN (PROTA) */}
        {/* ========================================================= */}
        {activeTab === "prota" && (
          <div className="space-y-4 animate-fade-in-up md:min-h-[350px]" id="tab-content-prota">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Program Tahunan (PROTA) Kurikulum Nasional</span>
                </h4>
                <span className="text-[10px] text-slate-400 block mt-0.5">Pemandu akumulasi sasaran JP dan materi pembelajaran setahun</span>
              </div>
              <button
                onClick={() => handleDownloadDocx("prota")}
                className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-100/60 transition flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Prota .docx</span>
              </button>
            </div>

            <div className="space-y-6">
              {activeGrades.map((grade) => {
                const filteredBabs = babs.filter(b => (b.grade || identity.grades[0]) === grade);
                const totalJp = filteredBabs.reduce((sum, b) => sum + b.jpEstimation, 0);

                return (
                  <div key={grade} className="space-y-4 border border-slate-100 rounded-2xl p-4 bg-[#F8FAFC]/55">
                    <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] px-4 py-2 rounded-xl w-fit shadow-2xs">
                      <GraduationCap className="w-4 h-4 text-blue-605" />
                      <span className="text-xs font-black text-slate-805">Prota Kelas {grade}</span>
                    </div>

                    <div className="space-y-4">
                      {[1, 2].map((semNum) => {
                        const semBabs = filteredBabs.filter(b => b.semester === semNum);
                        const semTitle = semNum === 1 ? "Semester I (Ganjil)" : "Semester II (Genap)";
                        const badgeColor = semNum === 1 ? "bg-amber-100 text-amber-800" : "bg-indigo-100 text-indigo-800";
                        const semJp = semBabs.reduce((sum, b) => sum + b.jpEstimation, 0);

                        return (
                          <div key={semNum} className="space-y-2 bg-white p-4 rounded-xl border border-slate-100 shadow-3xs">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-md ${badgeColor}`}>
                                {semTitle}
                              </span>
                              <span className="text-[10px] text-slate-405 font-bold font-mono">
                                Subtotal Semester: {semJp} JP
                              </span>
                            </div>

                            <div className="overflow-hidden border border-[#e2e8f0] rounded-xl bg-white shadow-3xs">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead className="bg-[#FAFBFD] font-bold text-slate-500 border-b border-[#e2e8f0]">
                                  <tr>
                                    <th className="px-4 py-2.5 text-center w-28">Kode Bab</th>
                                    <th className="px-4 py-2.5">Deskripsi Bahasan Pokok Keilmuan / Materi</th>
                                    {identity.grades.length > 1 && (
                                      <th className="px-4 py-2.5 w-32">Kelas</th>
                                    )}
                                    <th className="px-4 py-2.5 text-center w-36">Alokasi Jam Belajar</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                  {semBabs.map((b) => (
                                    <tr key={b.id} className="hover:bg-[#FAFBFD]/30 transition">
                                      <td className="px-4 py-2.5 text-center font-mono font-bold text-slate-400">{b.code}</td>
                                      <td className="px-4 py-2.5 font-semibold text-slate-800">{b.name}</td>
                                      {identity.grades.length > 1 && (
                                        <td className="px-4 py-2.5">
                                          <select
                                            value={b.grade || grade}
                                            onChange={(e) => {
                                              const nextGrad = e.target.value;
                                              setBabs(prev => prev.map(item => item.id === b.id ? { ...item, grade: nextGrad } : item));
                                            }}
                                            className="px-2 py-1 bg-white border border-slate-200 text-xs text-slate-705 font-bold rounded-lg outline-none"
                                          >
                                            {identity.grades.map(g => (
                                              <option key={g} value={g}>Kelas {g}</option>
                                            ))}
                                          </select>
                                        </td>
                                      )}
                                      <td className="px-4 py-2.5 text-center font-mono font-extrabold text-blue-700">{b.jpEstimation} JP</td>
                                    </tr>
                                  ))}
                                  {semBabs.length === 0 && (
                                    <tr>
                                      <td colSpan={identity.grades.length > 1 ? 4 : 3} className="px-4 py-6 text-center text-slate-400 font-light">
                                        Belum ada alokasi materi untuk Semester {semNum === 1 ? "I (Ganjil)" : "II (Genap)"} di Kelas {grade}.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}

                      {filteredBabs.length > 0 && (
                        <div className="flex justify-end p-3 bg-slate-50 border border-slate-150 rounded-xl font-bold text-slate-805 text-[10px] uppercase font-mono tracking-wider shadow-3xs">
                          <span>Total Akumulasi Pembelajaran Kelas {grade}: </span>
                          <span className="ml-1.5 font-black text-blue-700 font-mono text-[11px]">{totalJp} JP</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 7: PROGRAM SEMESTER (PROMES) */}
        {/* ========================================================= */}
        {activeTab === "promes" && (
          <div className="space-y-4 animate-fade-in-up md:min-h-[350px]" id="tab-content-promes">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Program Semester (PROMES) Jadwal Mingguan KBM</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Plot program tatap muka dan evaluasi per minggu efektif (M1 - M4)</p>
              </div>
              <button
                onClick={() => handleDownloadDocx("promes")}
                className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-100/60 transition flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Promes .docx</span>
              </button>
            </div>

            <div className="space-y-6">
              {activeGrades.map((grade) => {
                const filteredTps = tps.filter(t => (t.grade || identity.grades[0]) === grade);
                const s1Tps = filteredTps.filter(t => t.semester === 1);
                const s2Tps = filteredTps.filter(t => t.semester === 2);
                const weekJp = Number(identity.jpPerWeek || 3);

                // Helper to compute weekly schedules chronologically
                const computeSchedules = (tpsList: any[], isSemester2: boolean) => {
                  let currentWeek = 1;
                  const months = isSemester2
                    ? ["Januari", "Februari", "Maret", "April", "Mei", "Juni"]
                    : ["Juli", "Agustus", "September", "Oktober", "November", "Desember"];

                  return tpsList.map((tp) => {
                    const tpJp = tp.jpAlokasi !== undefined ? tp.jpAlokasi : (tp.jp || 2);
                    const neededWeeks = Math.max(1, Math.ceil(Number(tpJp) / weekJp));
                    const startWeek = currentWeek;
                    const endWeek = currentWeek + neededWeeks - 1;
                    currentWeek += neededWeeks;

                    const occupiedWeeks: number[] = [];
                    for (let w = startWeek; w <= endWeek; w++) {
                      occupiedWeeks.push(w);
                    }

                    const occupiedMonths = occupiedWeeks.map((w) => {
                      const monthIdx = Math.min(5, Math.floor((w - 1) / 4));
                      return months[monthIdx];
                    });
                    const uniqueMonths = Array.from(new Set(occupiedMonths));
                    const bulanBlok = uniqueMonths.join("-");

                    return {
                      ...tp,
                      occupiedWeeks,
                      bulanBlok,
                    };
                  });
                };

                const s1TpsWithSchedule = computeSchedules(s1Tps, false);
                const s2TpsWithSchedule = computeSchedules(s2Tps, true);

                return (
                  <div key={grade} className="space-y-4">
                    {identity.grades.length > 1 && (
                      <div className="flex items-center gap-2 bg-[#F1F5F9]/80 border border-[#E2E8F0] px-4 py-2 rounded-2xl w-fit">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-black text-slate-800">Promes Kelas {grade}</span>
                      </div>
                    )}

                    {/* Semester I (Ganjil) Block */}
                    <div className="space-y-2 border border-slate-100 p-4 rounded-2xl bg-[#FCFDFE]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">Semester I (Ganjil)</span>
                        <span className="text-[10px] text-slate-400 font-mono">Bulan: Juli - Desember</span>
                      </div>
                      <div className="overflow-x-auto border border-[#e2e8f0] rounded-xl bg-white max-h-[250px] overflow-y-auto">
                        <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                          <thead className="bg-[#FAFBFD] font-bold text-slate-500 border-b border-[#e2e8f0] text-center">
                            <tr>
                              <th className="px-4 py-2.5 text-left w-24">Kode TP</th>
                              <th className="px-4 py-2.5 text-left w-64 mr-2">Fokus Indikator Tujuan</th>
                              <th className="px-1 py-1 w-10">M1</th>
                              <th className="px-1 py-1 w-10">M2</th>
                              <th className="px-1 py-1 w-10">M3</th>
                              <th className="px-1 py-1 w-10">M4</th>
                              <th className="px-4 py-2.5 w-32 text-center">Bulan Blok</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {s1TpsWithSchedule.map((tp) => (
                              <tr key={tp.id} className="hover:bg-slate-50/20">
                                <td className="px-4 py-2 text-blue-600 font-mono font-bold">{tp.code}</td>
                                <td className="px-4 py-2 truncate max-w-xs font-light text-slate-600 font-sans">{tp.text}</td>
                                {[1, 2, 3, 4].map((wk) => {
                                  const key = `${tp.id}-${wk}`;
                                  const defaultChecked = tp.occupiedWeeks.some((w: number) => ((w - 1) % 4) + 1 === wk);
                                  const checked = promesSelections[key] ?? defaultChecked;
                                  return (
                                    <td key={wk} className="px-1 py-1 text-center">
                                      <input
                                        type="checkbox"
                                        className="rounded text-blue-600 focus:ring-blue-400 w-4 h-4 border-slate-300 pointer-events-auto cursor-pointer"
                                        checked={checked}
                                        onChange={(e) => setPromesSelections({...promesSelections, [key]: e.target.checked })}
                                      />
                                    </td>
                                  );
                                })}
                                <td className="px-4 py-2 text-center text-slate-505 font-bold">{tp.bulanBlok}</td>
                              </tr>
                            ))}
                            {s1TpsWithSchedule.length === 0 && (
                              <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-slate-400 font-light">
                                  Belum ada TP untuk Semester I.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Semester II (Genap) Block */}
                    <div className="space-y-2 border border-slate-100 p-4 rounded-2xl bg-[#FCFDFE]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">Semester II (Genap)</span>
                        <span className="text-[10px] text-slate-400 font-mono">Bulan: Januari - Juni</span>
                      </div>
                      <div className="overflow-x-auto border border-[#e2e8f0] rounded-xl bg-white max-h-[250px] overflow-y-auto">
                        <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                          <thead className="bg-[#FAFBFD] font-bold text-slate-500 border-b border-[#e2e8f0] text-center">
                            <tr>
                              <th className="px-4 py-2.5 text-left w-24">Kode TP</th>
                              <th className="px-4 py-2.5 text-left w-64 mr-2">Fokus Indikator Tujuan</th>
                              <th className="px-1 py-1 w-10">M1</th>
                              <th className="px-1 py-1 w-10">M2</th>
                              <th className="px-1 py-1 w-10">M3</th>
                              <th className="px-1 py-1 w-10">M4</th>
                              <th className="px-4 py-2.5 w-32 text-center">Bulan Blok</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {s2TpsWithSchedule.map((tp) => (
                              <tr key={tp.id} className="hover:bg-slate-50/20">
                                <td className="px-4 py-2 text-blue-600 font-mono font-bold">{tp.code}</td>
                                <td className="px-4 py-2 truncate max-w-xs font-light text-slate-600 font-sans">{tp.text}</td>
                                {[1, 2, 3, 4].map((wk) => {
                                  const key = `${tp.id}-${wk}`;
                                  const defaultChecked = tp.occupiedWeeks.some((w: number) => ((w - 1) % 4) + 1 === wk);
                                  const checked = promesSelections[key] ?? defaultChecked;
                                  return (
                                    <td key={wk} className="px-1 py-1 text-center">
                                      <input
                                        type="checkbox"
                                        className="rounded text-blue-600 focus:ring-blue-400 w-4 h-4 border-slate-300 pointer-events-auto cursor-pointer"
                                        checked={checked}
                                        onChange={(e) => setPromesSelections({...promesSelections, [key]: e.target.checked })}
                                      />
                                    </td>
                                  );
                                })}
                                <td className="px-4 py-2 text-center text-slate-550 font-bold">{tp.bulanBlok}</td>
                              </tr>
                            ))}
                            {s2TpsWithSchedule.length === 0 && (
                              <tr>
                                <td colSpan={7} className="px-4 py-6 text-center text-slate-400 font-light">
                                  Belum ada TP untuk Semester II.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 8: KKTP RUBRIK CRITERIA */}
        {/* ========================================================= */}
        {activeTab === "kktp" && (
          <div className="space-y-4 animate-fade-in-up md:min-h-[350px]" id="tab-content-kktp">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-805 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) — Pendekatan {kktpOption === "A" ? "Deskripsi Kriteria" : kktpOption === "B" ? "Rubrik" : "Interval Nilai"}</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {kktpOption === "A" 
                    ? "Menetapkan kriteria ketuntasan secara kualitatif (memadai / tidak memadai)" 
                    : kktpOption === "B" 
                    ? "Menyusun rubrik deskripsi bertingkat berdasarkan tingkat kompetensi siswa" 
                    : "Menyusun kriteria berdasarkan skala interval nilai persentase hasil asesmen"}
                </p>
              </div>
              <button
                onClick={() => handleDownloadDocx("kktp", { kktpOption })}
                className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3.5 py-2 rounded-xl hover:bg-blue-100/60 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                id="kktp-download-btn"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh KKTP .docx</span>
              </button>
            </div>

            {/* Segmented Control Selector for KKTP Option A / B / C */}
            <div className="bg-slate-50 border border-slate-200/80 p-2 rounded-2xl flex flex-col md:flex-row md:items-center gap-3.5" id="kktp-approach-selector">
              <span className="text-xs font-black text-slate-700 md:pl-2">Pilih Pendekatan KKTP (Kemdikbudristek):</span>
              <div className="flex flex-wrap gap-1 bg-slate-200/50 p-1 rounded-xl border border-slate-200 w-fit">
                <button
                  type="button"
                  onClick={() => setKktpOption("A")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    kktpOption === "A"
                      ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-850"
                  }`}
                  id="btn-kktp-opt-a"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-50 text-[9px] font-black flex items-center justify-center border border-blue-200">A</span>
                  <span>Deskripsi Kriteria</span>
                </button>
                <button
                  type="button"
                  onClick={() => setKktpOption("B")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    kktpOption === "B"
                      ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-850"
                  }`}
                  id="btn-kktp-opt-b"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-50 text-[9px] font-black flex items-center justify-center border border-blue-200">B</span>
                  <span>Rubrik Ketercapaian</span>
                </button>
                <button
                  type="button"
                  onClick={() => setKktpOption("C")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    kktpOption === "C"
                      ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-850"
                  }`}
                  id="btn-kktp-opt-c"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-50 text-[9px] font-black flex items-center justify-center border border-blue-200">C</span>
                  <span>Interval Nilai</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {activeGrades.map((grade) => {
                const filteredTps = tps.filter(t => (t.grade || identity.grades[0]) === grade);

                return (
                  <div key={grade} className="space-y-3">
                    {identity.grades.length > 1 && (
                      <div className="flex items-center gap-2 bg-[#F1F5F9]/80 border border-[#E2E8F0] px-4 py-2 rounded-2xl w-fit">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-black text-slate-850">KKTP Kelas {grade}</span>
                      </div>
                    )}

                    <div className="overflow-hidden border border-[#e2e8f0] rounded-2xl bg-white">
                      <table className="w-full text-left border-collapse text-[10.5px]">
                        {kktpOption === "A" && (
                          <>
                            <thead className="bg-[#FAFBFD] font-bold text-slate-500 border-b border-[#e2e8f0]">
                              <tr>
                                <th className="px-4 py-3 text-center w-24">Kode</th>
                                <th className="px-4 py-3 w-72">Kriteria Penilaian / Indikator TP</th>
                                <th className="px-4 py-3 text-center text-rose-700 w-32">Tidak Memadai</th>
                                <th className="px-4 py-3 text-center text-green-700 w-32">Memadai</th>
                                <th className="px-4 py-3 text-slate-600">Rencana Tindak Lanjut / Catatan Masukan</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 align-top">
                              {filteredTps.map((tp) => (
                                <tr key={tp.id} className="hover:bg-slate-50/10">
                                  <td className="px-4 py-3.5 text-center font-mono font-bold text-blue-600">{tp.code}</td>
                                  <td className="px-4 py-3.5 font-semibold text-slate-800 leading-normal">{tp.text}</td>
                                  <td className="px-4 py-3.5 text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-rose-50 text-rose-600 rounded-md border border-rose-100 font-bold text-[9px] uppercase tracking-wide">
                                      ❌ Belum Muncul
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 text-center">
                                    <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-md border border-green-100 font-bold text-[9px] uppercase tracking-wide">
                                      ✔️ Sudah Muncul
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 text-slate-500 leading-normal font-light">
                                    Peserta didik dianggap tuntas jika mayoritas kriteria bernilai Memadai. Bila belum memadai, lakukan intervensi pembelajaran personal pada indikator materi terkait.
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </>
                        )}

                        {kktpOption === "B" && (
                          <>
                            <thead className="bg-[#FAFBFD] font-bold text-slate-500 border-b border-[#e2e8f0]">
                              <tr>
                                <th className="px-4 py-3 text-center w-24">Kode</th>
                                <th className="px-4 py-3 w-48">Indikator TP</th>
                                <th className="px-4 py-3 text-slate-505 w-32">Baru Berkembang (0-40%)</th>
                                <th className="px-4 py-3 text-slate-505 w-32">Layak (41-60%)</th>
                                <th className="px-4 py-3 text-slate-505 w-32">Cakap (61-80%)</th>
                                <th className="px-4 py-3 text-slate-505 w-32">Mahir (81-100%)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 align-top">
                              {filteredTps.map((tp) => (
                                <tr key={tp.id} className="hover:bg-slate-50/10">
                                  <td className="px-4 py-3.5 text-center font-mono font-bold text-blue-600">{tp.code}</td>
                                  <td className="px-4 py-3.5 font-semibold text-slate-800 leading-normal">{tp.text}</td>
                                  <td className="px-4 py-3.5 text-slate-400 leading-normal">Konteks gagasan dasar belum tampak, butuh pendampingan total.</td>
                                  <td className="px-4 py-3.5 text-slate-400 leading-normal">Mampu melafalkan dasar materi secara parsial dengan stimulus bantuan.</td>
                                  <td className="px-4 py-3.5 text-slate-400 leading-normal">Konsep dikuasai matang, mandiri merampungkan seluruh latihan evaluasi.</td>
                                  <td className="px-4 py-3.5 text-slate-400 leading-normal">Pemahaman mendalam melampaui standar kompetensi dasar kelas.</td>
                                </tr>
                              ))}
                            </tbody>
                          </>
                        )}

                        {kktpOption === "C" && (
                          <>
                            <thead className="bg-[#FAFBFD] font-bold text-slate-500 border-b border-[#e2e8f0]">
                              <tr>
                                <th className="px-4 py-3 text-center w-24">Kode</th>
                                <th className="px-4 py-3 w-48">Indikator TP</th>
                                <th className="px-4 py-3 text-rose-700 bg-rose-50/20 w-32">0 - 40%</th>
                                <th className="px-4 py-3 text-amber-700 bg-amber-50/20 w-32">41 - 60%</th>
                                <th className="px-4 py-3 text-blue-700 bg-blue-50/20 w-32">61 - 80%</th>
                                <th className="px-4 py-3 text-green-700 bg-green-50/20 w-32">81 - 100%</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700 align-top">
                              {filteredTps.map((tp) => (
                                <tr key={tp.id} className="hover:bg-slate-50/10">
                                  <td className="px-4 py-3.5 text-center font-mono font-bold text-blue-600">{tp.code}</td>
                                  <td className="px-4 py-3.5 font-semibold text-slate-800 leading-normal">{tp.text}</td>
                                  <td className="px-4 py-3.5 text-rose-600 bg-rose-50/10 leading-normal">
                                    <p className="font-semibold text-[10px]">Perlu Bimbingan</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5 font-light">Belum tuntas, wajib mengikuti remedial di seluruh bagian.</p>
                                  </td>
                                  <td className="px-4 py-3.5 text-amber-600 bg-amber-50/10 leading-normal">
                                    <p className="font-semibold text-[10px]">Cukup</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5 font-light">Belum tuntas, mengikuti remedial pada indikator tertentu.</p>
                                  </td>
                                  <td className="px-4 py-3.5 text-blue-600 bg-blue-50/10 leading-normal">
                                    <p className="font-semibold text-[10px]">Baik</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5 font-light">Sudah tuntas, dapat melanjutkan ke tujuan berikutnya.</p>
                                  </td>
                                  <td className="px-4 py-3.5 text-green-600 bg-green-50/10 leading-normal">
                                    <p className="font-semibold text-[10px]">Sangat Baik</p>
                                    <p className="text-[9px] text-slate-400 mt-0.5 font-light">Sudah tuntas, perlu diberikan tantangan pengayaan.</p>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </>
                        )}

                        {filteredTps.length === 0 && (
                          <tbody>
                            <tr>
                              <td colSpan={6} className="px-4 py-6 text-center text-slate-400 font-light font-sans">
                                Belum ada TP yang didelegasikan untuk Kelas {grade}.
                              </td>
                            </tr>
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 9: ALOKASI WAKTU */}
        {/* ========================================================= */}
        {activeTab === "alokasi" && (
          <div className="space-y-6 animate-fade-in-up md:min-h-[350px]" id="tab-content-alokasi">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Analisis Beban Belajar Jam Pelajaran (JP) Konten</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Analisis visual penyebaran kuantitatif jam mengajar intra-kurikuler tiap bab materi</p>
              </div>
              <button
                onClick={() => handleDownloadDocx("alokasi")}
                className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl hover:bg-blue-100/60 transition flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Alokasi .docx</span>
              </button>
            </div>            {/* Regulatory Time Allocation Analysis Dashboard */}
            <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4 animate-fade-in" id="jp-alokasi-analysis-dashboard">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-extrabold text-slate-800 text-sm">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <span>Dasbor Validasi Waktu Efektif (Sisa Kuota)</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Sistem memantau keselarasan jam belajar riil berdasarkan total minggu kerja efektif.
                  </p>
                </div>
                {/* Auto-Fit Action Button */}
                <button
                  type="button"
                  onClick={handleAutoFitJP}
                  className="w-full md:w-auto text-xs font-bold text-white bg-blue-600 border border-blue-700 px-4 py-2 rounded-xl hover:bg-blue-700 hover:shadow-md transition duration-150 flex items-center justify-center gap-1.5 self-center"
                >
                  <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>Auto-Fit JP (Sisakan 15% Cadangan)</span>
                </button>
              </div>

              {/* Warnings & Alerts */}
              {!validation.statusValid ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs space-y-2 flex gap-3 items-start animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-red-900 block text-sm">Peringatan: Alokasi JP Melebihi Anggaran Tersedia!</span>
                    <p className="mt-1 leading-relaxed font-medium">
                      Total JP materi yang direncanakan di ATP (<strong>{validation.totalJpTp} JP</strong>) melebihi batas maksimal anggaran waktu tersedia (<strong>{validation.totalJpEfektif} JP</strong>). Silakan klik tombol <strong>Auto-Fit JP</strong> di atas untuk mengurangi alokasi JP per topik secara proporsional demi menjaga perencanaan tetap valid, atau edit JP secara manual.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs space-y-1 flex gap-3 items-start animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-emerald-900 block text-sm">Status Perencanaan: Valid &amp; Selaras!</span>
                    <p className="mt-1 leading-relaxed font-medium">
                      Sisa kuota waktu tersedia bernilai positif atau nol (Sisa Kuota: <strong>+{validation.selisihTp} JP</strong>). Pembelajaran intrakurikuler dapat terselenggara penuh dalam minggu efektif yang tersedia.
                    </p>
                    {validation.selisihTp < (validation.totalJpEfektif * 0.1) && (
                      <p className="mt-1.5 text-[11px] text-amber-700 font-medium">
                        *Tips: Idealnya sisa kuota dicadangkan minimal 10-20% ({Math.round(validation.totalJpEfektif * 0.1)} - {Math.round(validation.totalJpEfektif * 0.2)} JP) untuk penilaian sumatif, proyek, dan cadangan waktu tidak terduga. Anda bisa mengoptimalkannya dengan menekan tombol <strong>Auto-Fit JP</strong> di atas.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Three Column Quantitative Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-extrabold">Total Anggaran JP Tersedia</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-extrabold text-slate-800 text-lg">{validation.totalJpEfektif}</span>
                    <span className="text-[10px] text-slate-400 font-bold">JP</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">{identity.weeksSemester1 + identity.weeksSemester2} Minggu Kerja × {identity.jpPerWeek} JP</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-extrabold">Jumlah Jam Terpakai ATP</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-extrabold text-slate-800 text-lg">{validation.totalJpTp}</span>
                    <span className="text-[10px] text-slate-400 font-bold">JP</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">Total beban ajar konten inti</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono tracking-wider font-extrabold">Sisa Kuota Cadangan</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className={`font-extrabold text-lg ${validation.selisihTp < 0 ? "text-red-600" : "text-emerald-600"}`}>
                      {validation.selisihTp}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">JP</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">
                    {validation.selisihTp >= 0 ? `+${Math.round((validation.selisihTp / validation.totalJpEfektif) * 100)}% Cadangan` : "Kelebihan Beban!"}
                  </span>
                </div>
              </div>
            </div>

            {/* Semester indicators box summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-150 space-y-2 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Semester I (Ganjil)</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Minggu Efektif KBM:</span>
                  <span className="font-bold font-mono text-slate-800">{identity.weeksSemester1} Minggu</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Alokasi Maksimum Teoretis:</span>
                  <span className="font-bold font-mono text-slate-800">{availableJpS1} JP</span>
                </div>
                <hr className="border-slate-205" />
                <div className="flex justify-between items-center text-xs font-bold text-blue-600">
                  <span>Teralokasi Materi Inti:</span>
                  <span className="font-mono">{allocatedJpS1} JP</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-150 space-y-2 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Semester II (Genap)</span>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Minggu Efektif KBM:</span>
                  <span className="font-bold font-mono text-slate-800">{identity.weeksSemester2} Minggu</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Alokasi Maksimum Teoretis:</span>
                  <span className="font-bold font-mono text-slate-800">{availableJpS2} JP</span>
                </div>
                <hr className="border-slate-205" />
                <div className="flex justify-between items-center text-xs font-bold text-blue-600">
                  <span>Teralokasi Materi Inti:</span>
                  <span className="font-mono">{allocatedJpS2} JP</span>
                </div>
              </div>
            </div>

            {/* Analysis of Learning Load (Analisis Beban Belajar JP Konten) */}
            <div className="space-y-4 pt-2">
              <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest block font-mono">
                Rujukan Regulasi &amp; Analisis Beban Belajar (Permendikdasmen No. 13 Tahun 2025)
              </span>

              {activeGrades.map((grade) => {
                const rule = getCalculatedIntrakurikulerJP(identity.jenjang || "SMP", grade, identity.subject || "Matematika");
                const totalWeeks = identity.weeksSemester1 + identity.weeksSemester2;
                const totalJpEfektifGrade = totalWeeks * identity.jpPerWeek;
                
                const gradeTps = tps.filter(t => (t.grade || identity.grades[0]) === grade);
                const gradeAllocatedJp = gradeTps.reduce((sum, t) => sum + t.jp, 0);

                const gradeSummativeJp = Math.max(0, totalJpEfektifGrade - gradeAllocatedJp);
                const astsJp = Math.min(4, Math.max(0, Math.floor(gradeSummativeJp * 0.2)));
                const asasJp = Math.min(4, Math.max(0, Math.floor(gradeSummativeJp * 0.2)));
                const harianSumatifJp = Math.max(0, gradeSummativeJp - astsJp - asasJp);

                return (
                  <div key={grade} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-[#FAFBFD] border border-slate-150 rounded-2xl p-5 shadow-3xs">
                    {/* Regulation Guideline Info */}
                    <div className="md:col-span-2 space-y-3 border-b md:border-b-0 md:border-r border-slate-200/80 pb-3 md:pb-0 md:pr-4">
                      <div className="flex items-center gap-1.5 text-blue-700 font-extrabold text-xs">
                        <Info className="w-3.5 h-3.5" />
                        <span>Standar Regulasi Kelas {grade}</span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-2">
                        <p className="font-sans font-light leading-relaxed">
                          Berdasarkan lampiran <strong>Permendikdasmen No. 13 Tahun 2025</strong> tentang Struktur Kurikulum Merdeka Nasional:
                        </p>
                        <div className="bg-white border border-slate-100 rounded-xl p-3 space-y-1.5 font-mono text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Target Tahunan:</span>
                            <span className="font-bold text-slate-700">{rule.jpAnnual} JP</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Asumsi Efektif:</span>
                            <span className="font-bold text-slate-700">{rule.weeksAssumed} Minggu</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Target Mingguan:</span>
                            <span className="font-bold text-blue-600">{rule.jpPerWeek} JP/Minggu</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-normal">
                          *Sistem menyesuaikan perhitungan jam riil berdasarkan kalender efektif sekolah Anda.
                        </p>
                      </div>
                    </div>

                    {/* Breakdown of Learning Load with Summatives */}
                    <div className="md:col-span-3 space-y-3">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Distribusi JP &amp; Aktivitas Sumatif</span>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        {/* Core Content */}
                        <div className="flex justify-between items-center bg-white border border-slate-100 rounded-xl p-2.5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700">1. Materi &amp; Tujuan Pembelajaran Inti</span>
                            <span className="text-[10px] text-slate-400">Alokasi JP Tatap Muka KBM Elemen CP</span>
                          </div>
                          <span className="font-bold font-mono text-slate-800 bg-slate-50 px-2 py-1 rounded-lg">{gradeAllocatedJp} JP</span>
                        </div>

                        {/* Summative Activities */}
                        <div className="bg-white border border-slate-100 rounded-xl p-3 space-y-2">
                          <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700">2. Aktivitas Sumatif &amp; Evaluasi Capaian</span>
                              <span className="text-[10px] text-slate-400">Penilaian, Remedial, &amp; Pengayaan</span>
                            </div>
                            <span className="font-bold font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">+{gradeSummativeJp} JP</span>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono text-slate-500 pt-0.5">
                            <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                              <span className="text-slate-400 uppercase block tracking-wider text-[8px] font-semibold">ASTS</span>
                              <span className="font-bold text-slate-700 text-xs">{astsJp} JP</span>
                              <span className="text-[8px] text-slate-400 block mt-0.5">Tengah Smt</span>
                            </div>
                            <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                              <span className="text-slate-400 uppercase block tracking-wider text-[8px] font-semibold">ASAS</span>
                              <span className="font-bold text-slate-700 text-xs">{asasJp} JP</span>
                              <span className="text-[8px] text-slate-400 block mt-0.5">Akhir Smt</span>
                            </div>
                            <div className="bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                              <span className="text-slate-400 uppercase block tracking-wider text-[8px] font-semibold">Formulatif/Remidial</span>
                              <span className="font-bold text-slate-700 text-xs">{harianSumatifJp} JP</span>
                              <span className="text-[8px] text-slate-400 block mt-0.5">Harian &amp; Bab</span>
                            </div>
                          </div>
                        </div>

                        {/* Sum Total */}
                        <div className="flex justify-between items-center bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 text-emerald-800 font-bold">
                          <span>Total Alokasi Pembelajaran (100% Selaras)</span>
                          <span className="font-mono text-sm">{gradeAllocatedJp + gradeSummativeJp} JP / {totalJpEfektifGrade} JP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WIZARD PREV / NEXT STEPS ACTION FOOTER BAR */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center">
          <button
            type="button"
            onClick={handlePrevStep}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl font-bold text-xs transition active:scale-95 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Sebelumnya</span>
          </button>

          {activeTab === "alokasi" ? (
            <button
              type="button"
              onClick={() => handleDownloadDocx("all")}
              disabled={!validation.statusValid}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-200/50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none disabled:animate-none"
              title={!validation.statusValid ? "Harap selaraskan alokasi JP di Langkah 9 terlebih dahulu" : "Unduh Seluruh Dokumen"}
            >
              <Download className="w-4 h-4 text-white" />
              <span>Selesai &amp; Download Seluruh Administrasi (.docx)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-95"
            >
              <span>Selanjutnya</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Sign Details Footer block */}
      </div>

      {stepGenerating !== null && (
        <div className="fixed inset-0 bg-slate-905/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in bg-black/50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-5 border border-slate-100 mx-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-8 h-8 animate-spin text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Merumuskan dengan Sistem AI</h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">{stepGenMessage}</p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full animate-pulse rounded-full" style={{ width: "65%" }} />
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
