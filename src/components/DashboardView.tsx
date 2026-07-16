import React from "react";
import { 
  BookOpen, 
  Compass, 
  ClipboardCheck,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShoppingBag
} from "lucide-react";
import Swal from "sweetalert2";
import { SchoolIdentity, LearningObjective } from "../types";
import ProdukView from "./ProdukView";

interface DashboardViewProps {
  identity: SchoolIdentity;
  calculatedProgressPercent: number;
  overallAllocatedJp: number;
  overallAvailableJp: number;
  setActiveView: (view: "login" | "dashboard" | "identity" | "parameters" | "workspace" | "settings") => void;
  setActiveTab: (tab: "identitas" | "konfigurasi" | "cp" | "tp" | "atp" | "prota" | "promes" | "kktp" | "alokasi") => void;
  handleGenerateAllDocuments: () => void;
  tps: LearningObjective[];
}

export default function DashboardView({
  setActiveView,
  setActiveTab,
  tps
}: DashboardViewProps) {
  
  const isDocumentsGenerated = tps.length > 0;

  const handleLanjutkanSesi = () => {
    if (!isDocumentsGenerated) {
      setActiveTab("identitas");
      setActiveView("workspace");
    } else {
      setActiveTab("cp");
      setActiveView("workspace");
    }
  };

  return (
    <main className="p-8 max-w-5xl w-full mx-auto space-y-8 animate-fade-in-up" id="dashboard-view">
      
      {/* Welcome Banner Card & Page Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        {/* Decorative background grids */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "16px 16px" }}></div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase font-bold tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full text-blue-100 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
              Sistem Penunjang Administrasi Guru
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl leading-tight font-sans text-white">
              Selamat Datang di Portal Kurikulum Nasional
            </h2>
            <p className="text-sm md:text-base text-blue-100/90 leading-relaxed font-sans font-light">
              Sistem cerdas penunjang administrasi Anda. Kami menghadirkan solusi terlengkap untuk menyederhanakan perencanaan, pengajaran, dan evaluasi hasil belajar secara instan dan efisien sesuai standar Kementerian terbaru. Gunakan rangkaian tool pakar kami untuk mempercepat tugas administratif rutin Anda!
            </p>
          </div>
          
          <div className="pt-2 flex flex-wrap gap-4">
            <button 
              onClick={handleLanjutkanSesi}
              className="bg-white text-indigo-700 hover:bg-slate-50 text-xs font-bold px-7 py-3.5 flex items-center gap-2.5 transition duration-150 shadow-md rounded-2xl active:scale-95"
            >
              <span>Mulai Rancang Administrasi Pembelajaran</span>
              <ArrowRight className="w-4 h-4 text-indigo-750" />
            </button>
          </div>
        </div>
      </div>

      {/* Produk Unggulan Section */}
      <div className="pt-4 border-t border-slate-100">
        <ProdukView />
      </div>


    </main>
  );
}
