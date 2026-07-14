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

      {/* Product Introduction & Features Grid Section */}
      <div className="space-y-6">
        <div className="border-l-4 border-blue-600 pl-4 py-1">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
            Produk Unggulan Guru Hebat (by alimkadigital)
          </h3>
          <p className="text-xs text-slate-550 mt-1 font-sans">
            Solusi integratif kecerdasan buatan untuk mendongkrak produktivitas pengajaran dan melengkapi berkas administrasi sekolah secara instan.
          </p>
        </div>

        {/* 3 Grid Layout representing product highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Grid 1: Pakar Modul Ajar */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-blue-300 transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 group-hover:scale-105 duration-200">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-[9px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-100">AI Powered</span>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-[#0058be] text-base tracking-tight">
                  Pakar Modul Ajar
                </h4>
                <p className="text-xs text-slate-500 font-bold">
                  Buat RPP/RPM + Asesmen + Materi + LKPD + Bank Soal Terintegrasi
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Capek begadang cuma buat bikin administrasi mengajar? Buat Modul Ajar otomatis secara cepat, praktis, dan presisi dalam hitungan detik. Hasil rapi dan bisa langsung diunduh dalam format Docx (Word).
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 mt-5 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://pakarmodul.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition duration-150 py-2 px-1 rounded-xl flex items-center justify-center gap-1 border border-blue-100"
                >
                  <ExternalLink className="w-3 h-3" />
                  Akses Website
                </a>
                <a
                  href="https://lynk.id/alimkadigital/zr352j9l7l73"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 transition duration-150 py-2 px-1 rounded-xl flex items-center justify-center gap-1 shadow-2xs"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Dapatkan Produk
                </a>
              </div>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block text-center">Solusi Administrasi RPP Lengkap</span>
            </div>
          </div>

          {/* Grid 2: Pakar Kokurikuler */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-orange-300 transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 group-hover:scale-105 duration-200">
                  <Compass className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-[9px] bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded-full border border-orange-100">Kokurikuler</span>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-orange-700 text-base tracking-tight">
                  Pakar Kokurikuler
                </h4>
                <p className="text-xs text-slate-500 font-bold">
                  Tahapan Projek + Analisis Konteks + Dimensi Lulusan + Tema & Tujuan
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Sajikan berkas kokurikuler sekolah tanpa drama prompt rumit. Susun tema, tahapan kegiatan, analisis konteks, dan dimensi kelulusan secara praktis, terstruktur, sesuai regulasi terbaru.
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 mt-5 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://pakarkokurikuler.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 transition duration-150 py-2 px-1 rounded-xl flex items-center justify-center gap-1 border border-orange-100"
                >
                  <ExternalLink className="w-3 h-3" />
                  Akses Website
                </a>
                <a
                  href="https://lynk.id/alimkadigital/0jq7o2mm6nko"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-white bg-orange-600 hover:bg-orange-700 transition duration-150 py-2 px-1 rounded-xl flex items-center justify-center gap-1 shadow-2xs"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Dapatkan Produk
                </a>
              </div>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block text-center">Integrasi Kokurikuler Sekolah Praktis</span>
            </div>
          </div>

          {/* Grid 3: Pakar Buat Soal */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-emerald-300 transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:scale-105 duration-200">
                  <ClipboardCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100">Evaluasi OK</span>
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-emerald-700 text-base tracking-tight">
                  Pakar Buat Soal
                </h4>
                <p className="text-xs text-slate-550 font-bold">
                  Standar Sekolah + AKM + TKA + Ragam Soal Olimpiade
                </p>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  Hanya dengan menginput materi atau topik, buat instrumen evaluasi pembelajaran secara instan. Menghasilkan ragam variasi soal berkualitas tinggi yang terstruktur rapi untuk latihan atau ujian sekolah.
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 mt-5 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://pakarbuatsoal.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition duration-150 py-2 px-1 rounded-xl flex items-center justify-center gap-1 border border-emerald-100"
                >
                  <ExternalLink className="w-3 h-3" />
                  Akses Website
                </a>
                <a
                  href="https://lynk.id/alimkadigital/kmpm0le67pdp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition duration-150 py-2 px-1 rounded-xl flex items-center justify-center gap-1 shadow-2xs"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Dapatkan Produk
                </a>
              </div>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block text-center">Bank Soal &amp; Evaluasi HOTS</span>
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}
