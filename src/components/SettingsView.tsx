import React, { useState, useEffect } from "react";
import { Lock, Settings, CheckCircle2, XCircle, Loader2, HelpCircle } from "lucide-react";
import { testGeminiConnection } from "../utils/geminiClient";
import Swal from "sweetalert2";

interface SettingsViewProps {
  isServerOnline: boolean | null;
}

export default function SettingsView({ isServerOnline }: SettingsViewProps) {
  const [clientApiKey, setClientApiKey] = useState<string>(() => {
    return localStorage.getItem("client_gemini_api_key") || "";
  });

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientApiKey(e.target.value.trim());
  };

  const handleSaveApiKey = () => {
    if (clientApiKey) {
      localStorage.setItem("client_gemini_api_key", clientApiKey);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kunci API berhasil disimpan secara lokal.',
        confirmButtonColor: '#2563eb'
      });
    } else {
      localStorage.removeItem("client_gemini_api_key");
      Swal.fire({
        icon: 'info',
        title: 'Terhapus',
        text: 'Kunci API telah dihapus dari penyimpanan.',
        confirmButtonColor: '#2563eb'
      });
    }
  };

  const handleClearApiKey = () => {
    setClientApiKey("");
    localStorage.removeItem("client_gemini_api_key");
    setTestStatus("idle");
    Swal.fire({
      icon: 'success',
      title: 'Terhapus',
      text: 'Kunci API telah dihapus.',
      confirmButtonColor: '#2563eb'
    });
  };

  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle");
  const [showTutorial, setShowTutorial] = useState(true);

  const handleTestConnection = async () => {
    if (!clientApiKey) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Harap masukkan Kunci API terlebih dahulu.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }
    
    setIsTesting(true);
    setTestStatus("idle");
    
    // Attempt the test
    const success = await testGeminiConnection(clientApiKey);
    
    setTestStatus(success ? "success" : "error");
    setIsTesting(false);
    
    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Koneksi Berhasil!',
        text: 'API Key valid dan siap digunakan.',
        confirmButtonColor: '#16a34a'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Gagal',
        text: 'Gagal terhubung ke Gemini API. Periksa kembali API Key Anda.',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  return (
    <main className="p-8 max-w-4xl w-full mx-auto space-y-6 animate-fade-in-up" id="settings-view">
      <div className="space-y-1">
        <h3 className="text-lg font-extrabold text-slate-800">Pengaturan Kunci API Gemini</h3>
        <p className="text-xs text-slate-500 leading-normal">
          Isi Kunci API Gemini Anda di bawah ini untuk mengaktifkan fitur AI.
        </p>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-xs space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-600" />
              <span>Input API Key</span>
            </h5>
          </div>

          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Masukkan Kunci API Gemini Anda (AIzaSy...)"
              value={clientApiKey}
              onChange={handleApiKeyChange}
              className="flex-1 text-sm bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400/85 font-mono shadow-xs"
              id="client-gemini-api-key-input"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleSaveApiKey}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !clientApiKey}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-70"
            >
              {isTesting ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Menguji...</>
              ) : (
                <>Tes Koneksi</>
              )}
            </button>
            {clientApiKey && (
              <button
                type="button"
                onClick={handleClearApiKey}
                className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold transition cursor-pointer"
                id="clear-client-api-key"
              >
                Hapus
              </button>
            )}
          </div>

          {testStatus === "success" && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-xs mt-4">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="font-semibold">Koneksi Berhasil! API Key valid dan siap digunakan.</span>
            </div>
          )}
          
          {testStatus === "error" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs mt-4">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="font-semibold">Koneksi Gagal. Periksa kembali API Key Anda.</span>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100">
          <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3">
            <h6 className="text-sm font-bold text-blue-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              Panduan Mendapatkan Gemini API Key
            </h6>
            <ol className="list-decimal pl-4 text-xs text-slate-700 space-y-2 font-medium leading-relaxed">
              <li>Kunjungi portal resmi <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold">Google AI Studio</a> dan login dengan akun Google Anda.</li>
              <li>Setujui syarat dan ketentuan jika Anda baru pertama kali login.</li>
              <li>Di halaman utama, klik tombol biru <strong>"Create API key"</strong>.</li>
              <li>Pilih proyek Google Cloud yang ada atau biarkan sistem membuat proyek baru untuk Anda, lalu konfirmasi.</li>
              <li>Salin Kunci API yang muncul (Kunci ini biasanya berawalan dengan teks <code className="bg-white border border-slate-200 px-1 py-0.5 rounded text-[11px] text-blue-600">AIzaSy...</code>).</li>
              <li>Tempelkan Kunci API tersebut pada kolom input di atas, lalu klik <strong>Simpan</strong>.</li>
            </ol>
            <p className="text-[10px] text-slate-500 pt-2 border-t border-blue-100 mt-3">
              * Privasi Terjamin: Kunci API Anda disimpan dengan aman secara lokal di dalam memori browser perangkat Anda (localStorage) dan tidak pernah dibagikan atau disimpan ke server kami.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
