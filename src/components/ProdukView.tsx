import React from "react";
import { BookOpen, Compass, ClipboardCheck, ExternalLink, ShoppingBag, Award } from "lucide-react";

export default function ProdukView() {
  return (
    <div className="space-y-6 animate-fade-in-up" id="produk-view">
      <div className="space-y-2 border-l-4 border-blue-600 pl-4 py-1">
        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          Produk Unggulan Guru Hebat (by alimkadigital)
        </h2>
        <p className="text-sm text-slate-500">
          Lebih Cepat, Lebih Rapi, Lebih Lengkap.
        </p>
      </div>

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
  );
}
