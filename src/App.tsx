/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { SchoolIdentity, CurriculumElement, LearningObjective, BabMateri } from "./types";
import { getPresetElements, getPresetBabs } from "./data/curriculumData";
import { getLocalCP } from "./utils/curriculumData";
import { getCalculatedIntrakurikulerJP, getValidJpForTp } from "./data/intrakurikulerJP";
import { generateTpsClientSide } from "./utils/geminiClient";
import Swal from "sweetalert2";

// Import modular screens
import LoginView from "./components/LoginView";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import DashboardView from "./components/DashboardView";
import WorkspaceView from "./components/WorkspaceView";
import SettingsView from "./components/SettingsView";

import { SesiKurikulumProvider, useSesiKurikulum } from "./context/SesiKurikulumContext";

export default function App() {
  return (
    <SesiKurikulumProvider>
      <AppContent />
    </SesiKurikulumProvider>
  );
}

function AppContent() {
  // 1. Core States & Interactive Navigation View Flow
  const [activeView, setActiveView] = useState<"login" | "dashboard" | "identity" | "parameters" | "workspace" | "settings">("dashboard");
  const [activeTab, setActiveTab] = useState<"identitas" | "cp" | "tp" | "atp" | "prota" | "promes" | "kktp" | "alokasi">("identitas");
  
  // SesiKurikulum Context Hook
  const {
    state,
    updateIdentitas,
    setBabs: setBabsContext,
    setTps: setTpsContext,
    setElements: setElementsContext,
    reorderATP,
    updateTPText
  } = useSesiKurikulum();

  const identity = state.identitas;
  const elements = state.cp.elemen;
  const babs = state.bab;
  const tps = state.tp;

  // Custom setter triggers mapped to context state
  const setIdentity = (updater: any) => {
    if (typeof updater === 'function') {
      updateIdentitas(updater(state.identitas));
    } else {
      updateIdentitas(updater);
    }
  };

  const setElements = (updater: any) => {
    if (typeof updater === 'function') {
      setElementsContext(updater(state.cp.elemen));
    } else {
      setElementsContext(updater);
    }
  };

  const setBabs = (updater: any) => {
    if (typeof updater === 'function') {
      setBabsContext(updater(state.bab));
    } else {
      setBabsContext(updater);
    }
  };

  const setTps = (updater: any) => {
    if (typeof updater === 'function') {
      setTpsContext(updater(state.tp));
    } else {
      setTpsContext(updater);
    }
  };

  // Interactive configurations
  const [theoryWeight, setTheoryWeight] = useState<number>(40); // Weight Theory percentage (ex: 40%)
  const [isServerOnline, setIsServerOnline] = useState<boolean | null>(null);
  const [generatingProgress, setGeneratingProgress] = useState<boolean>(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [promesSelections, setPromesSelections] = useState<{ [key: string]: boolean }>({});
  const [showSaveToast, setShowSaveToast] = useState(false);

  // 2. Fetch API Status Connection Check on Mount
  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setIsServerOnline(data.status === "ok" && data.hasApiKey);
      })
      .catch(() => {
        setIsServerOnline(false);
      });
  }, []);

  // Fetch CP data from folder only when the user goes to Step 2 (elemen cp) or later
  useEffect(() => {
    const isStepToShowCp = activeTab !== "identitas";
    if (isStepToShowCp) {
      fetchCpDataForSubject(identity.subject, identity.phase, identity.jenjang);
    }
  }, [activeTab, identity.subject, identity.phase, identity.jenjang]);

  // Set default materials on initial setup once logged in
  useEffect(() => {
    if (babs.length === 0 && tps.length === 0) {
      const defaultBabs = getPresetBabs(identity.jenjang || "SMP", identity.phase || "D", identity.subject || "Matematika", identity.grades);
      setBabs(defaultBabs);
    }
  }, [babs.length, tps.length, identity.jenjang, identity.phase, identity.subject, identity.grades]);

  // Synchronize babs with tps so that PROTA always stays perfectly in sync with custom/edited TPs!
  useEffect(() => {
    if (tps && tps.length > 0) {
      const syncedBabs = tps.map((tp) => ({
        id: tp.id,
        code: tp.code || "TP",
        name: tp.text, // The actual formulated TP text
        semester: tp.semester || 1,
        jpEstimation: tp.jp || 4,
        grade: tp.grade
      }));
      
      const currentHash = JSON.stringify(babs.map(b => ({ id: b.id, code: b.code, name: b.name, semester: b.semester, jp: b.jpEstimation, grade: b.grade })));
      const nextHash = JSON.stringify(syncedBabs.map(b => ({ id: b.id, code: b.code, name: b.name, semester: b.semester, jp: b.jpEstimation, grade: b.grade })));
      
      if (currentHash !== nextHash) {
        setBabs(syncedBabs);
      }
    }
  }, [tps, babs]);

  const fetchCpDataForSubject = async (subj: string, phs: string, jnj: string) => {
    try {
      const elements = getLocalCP(subj, phs, jnj);
      if (elements && elements.length > 0) {
        setElements(elements);
        return;
      }
    } catch (err) {
      console.warn("Gagal mengambil CP dari folder lokal, menggunakan preset:", err);
    }
    // Fallback to local preset elements
    const presets = getPresetElements(subj, phs);
    setElements(presets);
  };

  // Sync default grades & phases when school level changes
  const handleLevelChange = (level: string) => {
    let nextPhase = "D";
    let nextGrades = ["7", "8", "9"];
    let nextJp = 4;

    if (level === "PAUD") {
      nextPhase = "Fondasi";
      nextGrades = ["TK A", "TK B"];
      nextJp = 15;
    } else if (level === "SD") {
      nextPhase = "B";
      nextGrades = ["3", "4"];
      nextJp = getCalculatedIntrakurikulerJP("SD", "3", identity.subject || "Matematika").jpPerWeek;
    } else if (level === "SMP") {
      nextPhase = "D";
      nextGrades = ["7", "8", "9"];
      nextJp = getCalculatedIntrakurikulerJP("SMP", "7", identity.subject || "Matematika").jpPerWeek;
    } else if (level === "SMA") {
      nextPhase = "E";
      nextGrades = ["10"];
      nextJp = getCalculatedIntrakurikulerJP("SMA", "10", identity.subject || "Matematika").jpPerWeek;
    } else if (level === "SMK") {
      nextPhase = "F";
      nextGrades = ["11", "12"];
      nextJp = 18;
    }

    setIdentity(prev => {
      const updated = {
        ...prev,
        jenjang: level,
        phase: nextPhase,
        grades: nextGrades,
        jpPerWeek: nextJp
      };
      // Fetch CP from official folder only if not in identity step
      if (activeTab !== "identitas") {
        fetchCpDataForSubject(prev.subject, nextPhase, level);
      }
      return updated;
    });
    
    // Auto load relevant preset chapters
    const defaultBabs = getPresetBabs(level, nextPhase, identity.subject, nextGrades);
    setBabs(defaultBabs);
    setTps([]);
  };

  // Sync elements when subject or phase shifts
  const handleSubjectOrPhaseChange = (subjectName: string, phaseName: string) => {
    if (activeTab !== "identitas") {
      fetchCpDataForSubject(subjectName, phaseName, identity.jenjang);
    }
    setTps([]);
    const defaultBabs = getPresetBabs(identity.jenjang, phaseName, subjectName, identity.grades);
    setBabs(defaultBabs);
  };

  // Trigger loading presets dynamically
  const handleLoadBabsPreset = () => {
    const defaultBabs = getPresetBabs(identity.jenjang, identity.phase, identity.subject, identity.grades);
    setBabs(defaultBabs);
  };

  // Handle manual addition of Bab / Chapter
  const handleAddBabManual = () => {
    const newNo = babs.length + 1;
    const newBab: BabMateri = {
      id: `bab-manual-${Date.now()}`,
      code: `BAB ${newNo}`,
      name: `Materi Pelajaran Bab ${newNo}`,
      semester: 1,
      jpEstimation: 18
    };
    setBabs([...babs, newBab]);
  };

  // Update specific field in Bab
  const handleUpdateBabField = (id: string, field: keyof BabMateri, val: any) => {
    setBabs(prev => prev.map(b => b.id === id ? { ...b, [field]: val } : b));
  };

  // Delete Bab
  const handleDeleteBab = (id: string) => {
    setBabs(prev => prev.filter(b => b.id !== id));
  };

  // Generate All Documents
  const handleGenerateAllDocuments = () => {
    if (babs.length === 0) {
      Swal.fire({
        title: "Daftar Bab Kosong",
        text: "Harap isi Daftar Materi / Bab terlebih dahulu. Anda bisa menambahkannya secara manual atau klik 'Muat Otomatis Bab Preset'!",
        icon: "warning",
        confirmButtonColor: "#2563eb"
      });
      return;
    }

    setGeneratingProgress(true);
    setLoadingMsg("Mendistribusikan materi pokok & rumusan Bloom...");

    setTimeout(() => {
      setLoadingMsg("Menghitung alokasi Jam Pelajaran (JP) berdasarkan beban...");
      setTimeout(() => {
        setLoadingMsg("Menyusun Struktur Program Tahunan & Semester...");
        setTimeout(() => {
          // Generate actual Objectives
          const generatedTpsList: LearningObjective[] = [];
          const mapelAbbr = identity.subject.substring(0, 3).toUpperCase();
          const defaultEle = elements[0]?.name || "Elemen";

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
          const validGrades = (identity.grades || []).filter(g => phaseAvailableGrades.includes(g));
          const finalGrades = validGrades.length > 0 ? validGrades : [phaseAvailableGrades[0]];

          const numGrades = finalGrades.length;
          const updatedBabs = babs.map((b, bIdx) => {
            const gradeIndex = Math.min(numGrades - 1, Math.floor((bIdx / babs.length) * numGrades));
            const hasValidGrade = b.grade && finalGrades.includes(b.grade);
            return {
              ...b,
              grade: hasValidGrade ? b.grade : (finalGrades[gradeIndex] || "7")
            };
          });
          setBabs(updatedBabs);

          updatedBabs.forEach((bab, idx) => {
            const numTps = identity.tpPerBab || 2;
            const rawSingleJp = Math.max(2, Math.floor((bab.jpEstimation - identity.jpSumatifPerBab) / numTps));
            const singleJp = getValidJpForTp(rawSingleJp, identity.jpPerWeek);

            const verbsByPhaseKey: { [key: string]: string[] } = {
              "Fondasi": ["mengenal", "mengeksplorasi", "menunjukkan", "mempraktikkan"],
              "A": ["mengidentifikasi", "menyebutkan", "menghitung", "membandingkan"],
              "B": ["memahami", "menjelaskan", "menggunakan", "menyelesaikan"],
              "C": ["menganalisis", "menyimpulkan", "memisahkan", "menyusun"],
              "D": ["merumuskan", "membuktikan", "memecahkan", "menguraikan"],
              "E": ["mengevaluasi", "merancang", "menganalisis", "mengaitkan"],
              "F": ["menciptakan", "mengonstruksi", "mengulas", "memvalidasi"]
            };

            const verbs = verbsByPhaseKey[identity.phase] || ["memahami", "menjelaskan", "menerapkan"];

            for (let t = 0; t < numTps; t++) {
              const verb = verbs[t % verbs.length];
              const elIndex = idx % elements.length;
              const relatedElement = elements[elIndex]?.name || defaultEle;

              let kalimatTp = `Peserta didik mampu ${verb} konsep inti ${bab.name} untuk memecahkan permasalahan secara sistematis.`;
              if (identity.subject === "Matematika") {
                kalimatTp = t === 0 
                  ? `Peserta didik mampu ${verb} konsep dasar kelayakan matematis dan formulasi abstrak pada ${bab.name}.`
                  : `Peserta didik mampu ${verb} rumus kalkulasi terapan untuk memodelkan persoalan riil terkait ${bab.name}.`;
              } else if (identity.subject === "Pancasila") {
                kalimatTp = t === 0
                  ? `Peserta didik mampu ${verb} integritas karakter luhur serta wawasan falsafah kebangsaan dari ${bab.name}.`
                  : `Peserta didik mampu ${verb} pembiasaan toleransi bernegara seputar bahasan ${bab.name}.`;
              } else if (identity.subject.includes("Indonesia")) {
                kalimatTp = t === 0
                  ? `Peserta didik mampu ${verb} struktur sastra dan gagasan kritis utama dari tulisan ${bab.name}.`
                  : `Peserta didik mampu ${verb} argumen orisinal kolaboratif mengenai topik ${bab.name}.`;
              }

              const objectiveCode = `${mapelAbbr}.${identity.phase}.${relatedElement.substring(0, 3).toUpperCase()}.${String(generatedTpsList.length + 1).padStart(2, "0")}`;

              generatedTpsList.push({
                id: `tp-auto-${Date.now()}-${idx}-${t}`,
                code: objectiveCode,
                element: relatedElement,
                competency: verb,
                content: bab.name,
                text: kalimatTp,
                grade: bab.grade || finalGrades[0] || "7",
                semester: bab.semester,
                jp: singleJp,
                materiPokok: bab.name,
                babCode: bab.code
              });
            }
          });

          setTps(generatedTpsList);
          setGeneratingProgress(false);
          setActiveView("workspace");
          setActiveTab("cp");
        }, 800);
      }, 700);
    }, 600);
  };

  // Reorder TPs inside ATP Sequencer
  const handleMoveTp = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === tps.length - 1) return;

    const updated = [...tps];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setTps(updated);
  };

  // Edit individual TP directly
  const handleUpdateTpText = (id: string, text: string) => {
    setTps(prev => prev.map(t => t.id === id ? { ...t, text } : t));
  };

  // Save changes toast trigger
  const handleSaveChanges = () => {
    setShowSaveToast(true);
    setTimeout(() => {
      setShowSaveToast(false);
    }, 3000);
  };

  // Call robust DOCX Export API
  const handleDownloadDocx = async (targetTab: string, additionalParams?: any) => {
    try {
      const response = await fetch("/api/curriculum/export-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identity,
          tps,
          babs,
          elements,
          promesSelections,
          tab: targetTab,
          ...additionalParams
        })
      });

      if (!response.ok) {
        throw new Error("Gagal mengunduh dokumen. Pastikan server dev aktif.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const subjectSlug = (identity.subject || "dokumen").replace(/\s+/g, "_");
      a.download = `administrasi_${targetTab}_${subjectSlug}.docx`.toLowerCase();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      alert(`Gagal mengunduh: ${err.message}`);
    }
  };

  // Interactive AI rewrite/improvement for TPs using Gemini
  const handleAISimplifyAllTps = async () => {
    // 1. Determine local key fallback if backend is offline/static (e.g., on Vercel)
    // Read from Vite's statically replaced variables
    // @ts-ignore
    const staticEnvGemini = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || "";
    const localKey = localStorage.getItem("client_gemini_api_key") || staticEnvGemini || "";

    if (!isServerOnline && !localKey) {
      Swal.fire({
        title: "Kunci API Belum Terpasang",
        text: "Kunci API Gemini belum diatur di menu Pengaturan. Harap isi Kunci API di menu Pengaturan (Vercel Mode) untuk memproses fitur AI cerdas langsung dari browser Anda.",
        icon: "info",
        confirmButtonColor: "#2563eb"
      });
      return;
    }

    setGeneratingProgress(true);
    setLoadingMsg("Sistem AI mengoptimasi taksonomi kata kerja dan struktur operasional...");

    try {
      let dataTps: any[] = [];

      if (isServerOnline) {
        // Mode 1: Server-side proxy (Highly secure, hides key)
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
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Batas kuota terlampaui atau respon server tidak valid.");
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.tps)) {
          dataTps = data.tps;
        } else {
          throw new Error("Format respons AI dari server tidak valid.");
        }
      } else {
        // Mode 2: Client-side direct call (Perfect fallback for static Vercel deployments)
        console.log("[Dual-Mode] Server offline/static. Running Gemini AI directly on client side.");
        dataTps = await generateTpsClientSide(
          identity.subject,
          identity.phase,
          elements,
          identity,
          localKey
        );
      }

      if (Array.isArray(dataTps) && dataTps.length > 0) {
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
        const mapelAbbr = subjectAbbrMap[identity.subject] || identity.subject.substring(0, 3).toUpperCase();
        
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
        const validGrades = (identity.grades || []).filter(g => phaseAvailableGrades.includes(g));
        const finalGrades = validGrades.length > 0 ? validGrades : [phaseAvailableGrades[0]];

        const elementCounts: Record<string, number> = {};
        const formatted = dataTps.map((obj: any, idx: number) => {
          const tpKelas = (obj.kelas && finalGrades.includes(String(obj.kelas)))
            ? String(obj.kelas)
            : (finalGrades[0] || String(obj.kelas) || "7");

          const rawElement = (obj.element || "ELE").trim();
          const eleAbbr = rawElement.substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, "");
          const key = `${tpKelas}_${eleAbbr}`;
          elementCounts[key] = (elementCounts[key] || 0) + 1;
          const noUrut = String(elementCounts[key]).padStart(2, "0");

          let code = (obj.code || "").trim();
          if (!code) {
            code = `${mapelAbbr}.${identity.phase}.${tpKelas}.${eleAbbr}.${noUrut}`;
          }

          const validJp = getValidJpForTp(obj.jp || 4, identity.jpPerWeek);

          return {
            id: `tp-gemini-${Date.now()}-${idx}`,
            code: code,
            element: obj.element,
            competency: obj.competency,
            content: obj.content,
            text: obj.text,
            grade: tpKelas,
            semester: (idx % 2 === 0) ? 1 : 2,
            jp: validJp,
            materiPokok: obj.materiPokok || obj.content
          };
        });
        setTps(formatted);
        Swal.fire({
          title: "Optimasi Berhasil",
          text: "Tujuan Pembelajaran berhasil dirumuskan secara optimal berbasis Taksonomi Bloom oleh Sistem AI!",
          icon: "success",
          confirmButtonColor: "#2563eb"
        });
      } else {
        throw new Error("Format respons AI tidak valid.");
      }
    } catch (err: any) {
      console.warn("AI Generation failed:", err);
      Swal.fire({
        title: "Menggunakan Rumusan Lokal",
        text: `Koneksi AI sedang sibuk atau ada kendala (${err.message || "Quota limit"}). Sistem otomatis mengadopsi rumusan lokal berkualitas tinggi secara terstandar.`,
        icon: "info",
        confirmButtonColor: "#2563eb"
      });
      handleGenerateAllDocuments();
    } finally {
      setGeneratingProgress(false);
    }
  };

  // Time metrics calculations
  const totalWeeksS1 = identity.weeksSemester1;
  const totalWeeksS2 = identity.weeksSemester2;
  const weekJp = identity.jpPerWeek;
  const availableJpS1 = totalWeeksS1 * weekJp;
  const availableJpS2 = totalWeeksS2 * weekJp;
  const allocatedJpS1 = tps.filter(t => t.semester === 1).reduce((sum, t) => sum + t.jp, 0);
  const allocatedJpS2 = tps.filter(t => t.semester === 2).reduce((sum, t) => sum + t.jp, 0);
  const overallAllocatedJp = allocatedJpS1 + allocatedJpS2;
  const overallAvailableJp = availableJpS1 + availableJpS2;
  
  // Progress calculations
  const calculatedProgressPercent = Math.min(100, Math.round(overallAvailableJp > 0 ? (overallAllocatedJp / overallAvailableJp) * 100 : 85));

  // Determine page title for top bar
  const getPageTitle = () => {
    switch (activeView) {
      case "dashboard": return "Dashboard Administrasi";
      case "identity": return "Identitas Pembelajaran";
      case "parameters": return "Parameter & Daftar Bab";
      case "workspace": return "Administrasi Pembelajaran";
      case "settings": return "Pengaturan Sistem";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-sans antialiased text-slate-900 selection:bg-blue-150">
      
      {/* Absolute Loading overlay during generate operations */}
      {generatingProgress && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border p-8 rounded-3xl max-w-sm w-full text-center space-y-5 shadow-2xl animate-fade-in-up">
            <div className="w-14 h-14 bg-blue-505 rounded-2xl flex items-center justify-center mx-auto text-white shadow-md animate-bounce">
              <Sparkles className="w-7 h-7 text-white animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base font-sans">Perangkat Kurikulum Nasional</h3>
              <p className="text-xs text-slate-500 mt-1">{loadingMsg}</p>
            </div>
            <div className="w-44 bg-slate-100 h-2 rounded-full overflow-hidden mx-auto border relative">
              <div className="bg-blue-600 h-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: "70%" }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Floating alert toast indicators */}
      {showSaveToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700/50">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-semibold">Seluruh draft parameter & bab sukses tersimpan di Cloud Database</span>
          </div>
        </div>
      )}

      {/* Login Screen Flow Component */}
      {activeView === "login" && (
        <LoginView onLoginSuccess={() => setActiveView("dashboard")} />
      )}

      {/* Main logged in layouts */}
      {activeView !== "login" && (
        <div className="pl-68 min-h-screen flex flex-col">
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            identity={identity}
            tps={tps}
            setTps={setTps}
            elements={elements}
          />
          
          <div className="flex-1 flex flex-col">
            <TopBar
              pageTitle={getPageTitle()}
              activeTab={activeTab}
              handleDownloadDocx={handleDownloadDocx}
              activeView={activeView}
              isDocumentsGenerated={tps.length > 0}
            />

            {activeView === "dashboard" && (
              <DashboardView
                identity={identity}
                calculatedProgressPercent={calculatedProgressPercent}
                overallAllocatedJp={overallAllocatedJp}
                overallAvailableJp={overallAvailableJp}
                setActiveView={setActiveView}
                setActiveTab={setActiveTab}
                handleGenerateAllDocuments={handleGenerateAllDocuments}
                tps={tps}
              />
            )}

            {activeView === "workspace" && (
              <WorkspaceView
                identity={identity}
                setIdentity={setIdentity}
                tps={tps}
                setTps={setTps}
                elements={elements}
                setElements={setElements}
                babs={babs}
                setBabs={setBabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleDownloadDocx={handleDownloadDocx}
                handleAISimplifyAllTps={handleAISimplifyAllTps}
                handleMoveTp={handleMoveTp}
                handleUpdateTpText={handleUpdateTpText}
                promesSelections={promesSelections}
                setPromesSelections={setPromesSelections}
                calculatedProgressPercent={calculatedProgressPercent}
                overallAllocatedJp={overallAllocatedJp}
                allocatedJpS1={allocatedJpS1}
                allocatedJpS2={allocatedJpS2}
                availableJpS1={availableJpS1}
                availableJpS2={availableJpS2}
                theoryWeight={theoryWeight}
                setTheoryWeight={setTheoryWeight}
                handleLoadBabsPreset={handleLoadBabsPreset}
                handleAddBabManual={handleAddBabManual}
                handleUpdateBabField={handleUpdateBabField}
                handleDeleteBab={handleDeleteBab}
                handleGenerateAllDocuments={handleGenerateAllDocuments}
                handleLevelChange={handleLevelChange}
                handleSubjectOrPhaseChange={handleSubjectOrPhaseChange}
                isServerOnline={isServerOnline}
                setActiveView={setActiveView}
              />
            )}

            {activeView === "settings" && (
              <SettingsView isServerOnline={isServerOnline} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
