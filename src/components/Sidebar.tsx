import React from "react";
import { 
  LayoutDashboard, 
  User, 
  Sliders, 
  RotateCcw,
  BookOpen,
  Target,
  GitBranch,
  Calendar,
  Clock,
  ClipboardCheck,
  LineChart,
  CheckSquare,
  GraduationCap
} from "lucide-react";
import Swal from "sweetalert2";
import { SchoolIdentity, CurriculumElement, LearningObjective } from "../types";

interface SidebarProps {
  activeView: "login" | "dashboard" | "produk" | "identity" | "parameters" | "workspace" | "settings";
  setActiveView: (view: "login" | "dashboard" | "produk" | "identity" | "parameters" | "workspace" | "settings") => void;
  activeTab: "identitas" | "cp" | "tp" | "atp" | "prota" | "promes" | "kktp" | "alokasi";
  setActiveTab: (tab: "identitas" | "cp" | "tp" | "atp" | "prota" | "promes" | "kktp" | "alokasi") => void;
  identity: SchoolIdentity;
  tps: LearningObjective[];
  setTps: React.Dispatch<React.SetStateAction<LearningObjective[]>>;
  elements: CurriculumElement[];
}

export default function Sidebar({
  activeView,
  setActiveView,
  activeTab,
  setActiveTab,
  identity,
  tps,
  elements
}: SidebarProps) {
  
  const isDocumentsGenerated = tps.length > 0;

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

  // Handles dynamic clicking of any of the 8 wizard steps directly from the sidebar
  const handleStepClick = (tabId: "identitas" | "cp" | "tp" | "atp" | "prota" | "promes" | "kktp" | "alokasi") => {
    const steps: ("identitas" | "cp" | "tp" | "atp" | "prota" | "promes" | "kktp" | "alokasi")[] = [
      "identitas", "cp", "tp", "atp", "prota", "promes", "kktp", "alokasi"
    ];
    const targetIdx = steps.indexOf(tabId);
    
    // Prevent navigating past Step 1 if Step 1 is not complete
    if (tabId !== "identitas" && !isIdentityComplete()) {
      Swal.fire({
        title: "Identitas Belum Lengkap",
        text: "Mohon isi semua data identitas satuan pendidikan, guru pengampu, dan kepala sekolah di Langkah 1 terlebih dahulu!",
        icon: "warning",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Ok, Mengerti"
      });
      return;
    }
    
    // Prevent navigating past CP if documents aren't generated yet
    if (targetIdx > 1 && !isDocumentsGenerated) {
      Swal.fire({
        title: "Akses Terkunci",
        text: "Sesi penyusunan administrasi wajib dilakukan berurutan. Silakan lengkapi Identitas & Konfigurasi di Langkah 1, lalu formulasikan Tujuan Pembelajaran (TP) terlebih dahulu!",
        icon: "warning",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Ok, Mengerti"
      });
      return;
    }
    
    setActiveTab(tabId);
    setActiveView("workspace");
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Mulai Sesi Baru?",
      text: "Sesi baru akan mengatur ulang draf perangkat administratif Anda ke bawaan.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#ba1a1a",
      cancelButtonColor: "#475569",
      confirmButtonText: "Ya, Muli Sesi Baru",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
         window.location.reload();
      }
    });
  };

  const handleFinalisasi = () => {
    if (!isDocumentsGenerated) {
      Swal.fire({
        title: "Belum Bisa Finalisasi",
        text: "Anda belum menyusun perangkat administrasi kurikulum Nasional. Silakan formulasikan Tujuan Pembelajaran (TP) terlebih dahulu.",
        icon: "error",
        confirmButtonColor: "#2563eb"
      });
      return;
    }

    Swal.fire({
      title: "Sukses Finalisasi!",
      html: `
        <div class="text-sm mb-4">
          Seluruh dokumen administrasi resmi untuk mata pelajaran <b>${identity.subject}</b> (${identity.academicYear}) di <b>${identity.schoolName}</b> telah berhasil difinalisasi dan siap diunduh!
        </div>
        <div class="p-3 bg-blue-50 border border-blue-100 rounded-xl text-left mt-3">
          <h4 class="font-bold text-blue-800 text-sm mb-2">🎁 Penawaran Spesial:</h4>
          <p class="text-xs text-blue-700 mb-2">Tingkatkan produktivitas Anda dengan Produk Unggulan Guru Hebat (by alimkadigital):</p>
          <ul class="text-xs text-blue-800 space-y-1.5 list-disc pl-4 font-medium">
            <li>Pakar Modul Ajar</li>
            <li>Pakar Kokurikuler</li>
            <li>Pakar Buat Soal</li>
          </ul>
        </div>
      `,
      icon: "success",
      confirmButtonColor: "#10b981",
      confirmButtonText: "Lihat Produk Unggulan",
      showCancelButton: true,
      cancelButtonText: "Tutup",
      cancelButtonColor: "#64748b"
    }).then((result) => {
      if (result.isConfirmed) {
        setActiveView("produk");
      }
    });
  };

  // Define steps list with correct numbers and titles
  const sidebarSteps = [
    { id: "identitas" as const, label: "01 — Identitas & Konfig", icon: User },
    { id: "cp" as const, label: "02 — Elemen CP", icon: BookOpen },
    { id: "tp" as const, label: "03 — Tujuan Pembelajaran", icon: Target },
    { id: "atp" as const, label: "04 — Alur Tujuan Pembelajaran", icon: GitBranch },
    { id: "prota" as const, label: "05 — Program Tahunan", icon: Calendar },
    { id: "promes" as const, label: "06 — Program Semester", icon: Clock },
    { id: "kktp" as const, label: "07 — KKTP (Kriteria)", icon: ClipboardCheck },
    { id: "alokasi" as const, label: "08 — Alokasi JP", icon: LineChart },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-68 bg-white border-r border-[#e2e8f0] flex flex-col py-6 px-4 z-40 overflow-y-auto shadow-level-2" id="app-sidebar">
      
      {/* Brand Header with Flat Institutional Education Logo as per UI criteria */}
      <div className="flex flex-col items-center mb-5 text-center shrink-0 border-b border-slate-100 pb-4">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3 transition-transform hover:scale-105 duration-200 shadow-3xs border border-blue-105">
          <GraduationCap className="w-8 h-8 text-[#0058be]" />
        </div>
        <h1 className="text-base font-extrabold tracking-widest text-[#0058be] font-sans">ADM GURU</h1>
        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight mt-1">
          Administrasi Kurikulum Nasional
        </p>
      </div>

      {/* Main Navigation Controls */}
      <div className="flex-1 space-y-1.5 pr-1">
        
        {/* Core Dashboard View */}
        <button
          onClick={() => setActiveView("dashboard")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition duration-150 outline-none text-left ${
            activeView === "dashboard"
              ? "bg-blue-50 text-[#0058be] font-bold border-l-4 border-[#0058be] pl-2"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
          }`}
          id="sidebar-btn-dashboard"
          title="Beranda Dashboard Utama"
        >
          <LayoutDashboard className={`w-4 h-4 ${activeView === "dashboard" ? "text-[#0058be]" : "text-slate-400"}`} />
          <span className="text-xs font-semibold uppercase tracking-wider font-mono">Beranda Utama</span>
        </button>

        {/* Produk Unggulan View */}
        <button
          onClick={() => setActiveView("produk")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition duration-150 outline-none text-left ${
            activeView === "produk"
              ? "bg-blue-50 text-[#0058be] font-bold border-l-4 border-[#0058be] pl-2"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
          }`}
          id="sidebar-btn-produk"
          title="Produk Unggulan Guru Hebat"
        >
          <User className={`w-4 h-4 ${activeView === "produk" ? "text-[#0058be]" : "text-slate-400"}`} />
          <span className="text-xs font-semibold uppercase tracking-wider font-mono">Produk Unggulan</span>
        </button>

        {/* API Key Settings View */}
        <button
          onClick={() => setActiveView("settings")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition duration-150 outline-none text-left ${
            activeView === "settings"
              ? "bg-blue-50 text-[#0058be] font-bold border-l-4 border-[#0058be] pl-2"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
          }`}
          id="sidebar-btn-settings"
          title="Pengaturan Kunci API"
        >
          <Sliders className={`w-4 h-4 ${activeView === "settings" ? "text-[#0058be]" : "text-slate-400"}`} />
          <span className="text-xs font-semibold uppercase tracking-wider font-mono">Pengaturan API</span>
        </button>

        {/* Separator */}
        <div className="py-1 shrink-0">
          <span className="text-[9px] font-black tracking-widest text-slate-400 block px-3 uppercase font-mono">
            Sesi Penyusunan
          </span>
        </div>

        {/* Render 9 Steps list dynamically */}
        {sidebarSteps.map((step) => {
          const isSelected = activeView === "workspace" && activeTab === step.id;
          const StepIcon = step.icon;
          const isStepDisabled = step.id !== "identitas" && !isIdentityComplete();
          
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition duration-150 outline-none text-left relative ${
                isSelected
                  ? "bg-blue-50/70 text-[#0058be] font-bold border-l-4 border-[#0058be] pl-2 shadow-2xs"
                  : isStepDisabled
                    ? "text-slate-300 bg-transparent cursor-not-allowed opacity-50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent"
              }`}
              id={`sidebar-btn-step-${step.id}`}
            >
              <StepIcon className={`w-4 h-4 ${isSelected ? "text-[#0058be]" : isStepDisabled ? "text-slate-200" : "text-slate-400"}`} />
              <span className={`text-xs ${isSelected ? "font-bold" : "font-semibold"} tracking-tight`}>
                {step.label}
              </span>
              
              {/* Optional check icon badge for steps completed */}
              {isDocumentsGenerated && step.id !== "identitas" && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Finalisasi Dokumen Button at sidebar bottom */}
      <div className="pt-2 pb-4 shrink-0">
        <button
          onClick={handleFinalisasi}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl transition duration-150 font-bold text-xs shadow-2xs"
          id="sidebar-finalisasi-btn"
        >
          <CheckSquare className="w-4 h-4 text-emerald-600" />
          <span>Finalisasi Dokumen</span>
        </button>
      </div>

      {/* Profile Area & Logout link at footer */}
      <div className="mt-auto border-t border-slate-100 pt-5 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 hover:bg-red-100/80 text-red-600 rounded-xl transition duration-155 text-xs font-bold shadow-3xs"
          id="sidebar-logout-btn"
          title="Mulai Sesi Baru"
        >
          <RotateCcw className="w-4 h-4 text-red-500" />
          <span>Mulai Sesi Baru</span>
        </button>
      </div>
    </aside>
  );
}

