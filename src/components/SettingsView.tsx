import React, { useState, useEffect } from "react";
import { Lock, Settings } from "lucide-react";

interface SettingsViewProps {
  isServerOnline: boolean | null;
}

export default function SettingsView({ isServerOnline }: SettingsViewProps) {
  // Admin & Middleware Protection States
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem("is_admin_mode") === "true";
  });
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem("admin_session_token");
  });
  const [adminPinInput, setAdminPinInput] = useState<string>("");
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [loadingAdminStats, setLoadingAdminStats] = useState<boolean>(false);

  // Auto-load admin stats if already logged in as admin
  useEffect(() => {
    if (isAdminMode && adminToken) {
      setLoadingAdminStats(true);
      fetch("/api/admin/stats", {
        headers: {
          "Authorization": `Bearer ${adminToken}`
        }
      })
      .then(res => {
        if (!res.ok) throw new Error("Silakan log in admin kembali.");
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setAdminStats(data.stats);
        }
      })
      .catch((err) => {
        setAdminError(err.message || "Gagal memuat diagnos statistik.");
        setIsAdminMode(false);
        setAdminToken(null);
        localStorage.removeItem("is_admin_mode");
        localStorage.removeItem("admin_session_token");
      })
      .finally(() => {
        setLoadingAdminStats(false);
      });
    }
  }, [isAdminMode, adminToken]);

  // Admin Login Handler via server middleware
  const handleAdminVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPinInput.trim()) {
      setAdminError("PIN Admin diperlukan.");
      return;
    }
    setAdminError(null);
    setLoadingAdminStats(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: adminPinInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal masuk admin.");
      }

      setAdminToken(data.token);
      setIsAdminMode(true);
      localStorage.setItem("is_admin_mode", "true");
      localStorage.setItem("admin_session_token", data.token);
      setAdminPinInput("");
    } catch (err: any) {
      setAdminError(err.message || "Kesalahan otentikasi admin backend.");
    } finally {
      setLoadingAdminStats(false);
    }
  };

  // Safe logout of Admin area
  const handleAdminLogout = () => {
    setIsAdminMode(false);
    setAdminToken(null);
    setAdminStats(null);
    setAdminError(null);
    localStorage.removeItem("is_admin_mode");
    localStorage.removeItem("admin_session_token");
  };

  // Refresh stats via protected API
  const handleRefreshAdminStats = async () => {
    if (!adminToken) return;
    setLoadingAdminStats(true);
    setAdminError(null);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "Authorization": `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengambil diagnos.");
      }
      setAdminStats(data.stats);
    } catch (err: any) {
      setAdminError(err.message || "Akses modul terproteksi gagal.");
    } finally {
      setLoadingAdminStats(false);
    }
  };

  // Flush/Clear cache stats via protected API
  const handleClearAdminCache = async () => {
    if (!adminToken) return;
    if (!window.confirm("Kosongkan log statistik aktivitas server-side?")) return;
    setLoadingAdminStats(true);
    setAdminError(null);
    try {
      const res = await fetch("/api/admin/clear-cache", {
        method: "POST",
        headers: { "Authorization": `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Operasi terproteksi dibatalkan.");
      }
      alert(data.message || "Cache dikosongkan.");
      await handleRefreshAdminStats();
    } catch (err: any) {
      setAdminError(err.message || "Gagal menghubungi middleware.");
    } finally {
      setLoadingAdminStats(false);
    }
  };

  return (
    <main className="p-8 max-w-4xl w-full mx-auto space-y-6 animate-fade-in-up" id="settings-view">
      <div className="space-y-1">
        <h3 className="text-lg font-extrabold text-slate-800">Status Integrasi Server-Side Administrasi</h3>
        <p className="text-xs text-slate-500 leading-normal">
          Tinjau koneksi aman API model kecerdasan buatan, enkripsi kop, dan standarisasi penulisan.
        </p>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-xs space-y-6">
        {/* Status checklist rows */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Koneksi Server Middle-ware</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Memastikan fungsionalitas hosting handal</p>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-200 font-mono">
              ONLINE &amp; AKTIF
            </span>
          </div>

          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-800">API Key Gemini AI Studio</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Dibutuhkan untuk merumuskan Bloom taksonomi berkalimat canggih</p>
            </div>
            {isServerOnline ? (
              <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-200 font-mono">
                TERVAKSIN &amp; TERPASANG
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded-lg border border-amber-200 font-mono">
                MOCK AUTOPILOT (Isi dev key di Settings jika ada)
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Enkripsi Berkas Dokumen Master (.docx)</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Memastikan format kompatibilitas Microsoft Word, Google Docs &amp; LibreOffice</p>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-200 font-mono">
              READY (docx v7.0)
            </span>
          </div>
        </div>

        {/* Warning detail description bar */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 leading-relaxed font-light">
          Sistem ini diprogram secara full-stack menggunakan Express + React + Tailwind CSS. Keamanan berkas, metadata guru, data murid, dan kunci API tidak akan dibocorkan ke client browser sama sekali demi menjaga netralitas audit administrasi sekolah pengajar.
        </div>
      </div>

      {/* ADMIN PORTAL PANEL */}
      <div className="space-y-1 pt-4">
        <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          <span>Portal Administrator &amp; Diagnostik Server</span>
        </h3>
        <p className="text-xs text-slate-500 leading-normal">
          Dilindungi oleh middleware backend. Monitor status server, lalu lintas API, dan bersihkan cache diagnostik secara real-time.
        </p>
      </div>

      {!isAdminMode ? (
        <form onSubmit={handleAdminVerifySubmit} className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-xs space-y-4" id="settings-admin-login-form">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Verifikasi PIN Keamanan Admin</label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Masukkan PIN Administrator..."
                value={adminPinInput}
                onChange={(e) => setAdminPinInput(e.target.value)}
                className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400/80"
                id="settings-admin-pin"
              />
              <button
                type="submit"
                disabled={loadingAdminStats}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition"
                id="settings-admin-login-btn"
              >
                {loadingAdminStats ? "Memproses..." : "Masuk Admin"}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              *PIN Default: <strong className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">kurikulumnasional</strong>
            </span>
          </div>

          {adminError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium" id="settings-admin-error">
              {adminError}
            </div>
          )}
        </form>
      ) : (
        <div className="space-y-4" id="settings-admin-portal">
          <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-xs space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                <div>
                  <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest block font-sans">Sesi Admin Terverifikasi</span>
                  <span className="text-[10px] text-slate-400 font-medium font-sans">Middleware Proteksi Backend: AKTIF</span>
                </div>
              </div>
              <button
                onClick={handleAdminLogout}
                className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-[10px] font-bold hover:bg-slate-200 transition"
                id="settings-admin-logout-btn"
              >
                Keluar Sesi Admin
              </button>
            </div>

            {adminError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs" id="settings-admin-dash-error">
                {adminError}
              </div>
            )}

            {/* STATS PANEL CONTAINER */}
            {loadingAdminStats && !adminStats ? (
              <div className="text-center py-6 text-xs text-slate-400">
                Memuat data diagnostik dari API middleware...
              </div>
            ) : adminStats ? (
              <div className="space-y-6">
                
                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="p-4 bg-blue-50/55 border border-blue-100 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Total Hit API</span>
                    <div className="mt-2">
                      <span className="text-3xl font-extrabold font-mono text-blue-800">{adminStats.totalRequests}</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Semenjak server dimulai</span>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50/55 border border-indigo-100 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Analisis CP (AI)</span>
                    <div className="mt-2">
                      <span className="text-3xl font-extrabold font-mono text-indigo-800">{adminStats.cpAnalyses}</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Pecahan TP teranalisis</span>
                    </div>
                  </div>

                  <div className="p-4 bg-violet-50/55 border border-violet-102 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Unduhan Dokumen</span>
                    <div className="mt-2">
                      <span className="text-3xl font-extrabold font-mono text-violet-800">{adminStats.docxExports}</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Ekspor berkas DOCX word</span>
                    </div>
                  </div>

                </div>

                {/* Detail Server stats diagnostics */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Spesifikasi Lingkungan &amp; Diagnostik Node.js</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Runtime Version:</span>
                      <span className="font-semibold text-slate-700">{adminStats.nodeVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Suhu / OS Platform:</span>
                      <span className="font-semibold text-slate-700 uppercase">{adminStats.platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Memory RSS:</span>
                      <span className="font-semibold text-slate-700 font-mono">{adminStats.memoryUsageMB.rss} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Heap Memory:</span>
                      <span className="font-semibold text-slate-700 font-mono">{adminStats.memoryUsageMB.heapUsed} / {adminStats.memoryUsageMB.heapTotal} MB</span>
                    </div>
                    <div className="flex justify-between col-span-1 sm:col-span-2 border-t pt-2 mt-1 border-slate-200">
                      <span className="text-slate-400">Waktu Aktif Server (Uptime):</span>
                      <span className="font-semibold text-slate-700">{adminStats.uptimeFormatted}</span>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                Data tidak tersedia. Tekan Ambil Data untuk memicu request.
              </div>
            )}

            {/* Diagnostic operations list */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={handleRefreshAdminStats}
                disabled={loadingAdminStats}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition"
                id="settings-admin-refresh-stats"
              >
                {loadingAdminStats ? "Memperbarui..." : "Ambil Data Terbaru"}
              </button>
              <button
                type="button"
                onClick={handleClearAdminCache}
                disabled={loadingAdminStats}
                className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition"
                id="settings-admin-clear-cache"
              >
                Kosongkan Cache Statistik
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
