import React, { useState } from "react";
import { GraduationCap, AlertCircle, User, Lock, Eye, EyeOff, ChevronRight, BadgeCheck } from "lucide-react";

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState("guru@nasional.id");
  const [password, setPassword] = useState("kurikulumnasional");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setLoginError("Masukan email dan password akses guru dlu.");
      return;
    }
    setLoginError(null);
    setIsProcessingLogin(true);

    setTimeout(() => {
      setIsProcessingLogin(false);
      onLoginSuccess();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden" id="login-container">
      {/* Split Screen Left Side: Creative Brand Banner Section */}
      <aside className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 relative items-center justify-center overflow-hidden">
        {/* Blurry ambient decorative visual grids */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3 blur-4xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-4xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-5xl"></div>

        <div className="relative z-10 text-center p-8 space-y-6">
          <div className="p-8 bg-white/15 backdrop-blur-xl rounded-full inline-flex items-center justify-center border border-white/25 shadow-2xl animate-fade-in-down">
            <GraduationCap className="text-white w-18 h-18" />
          </div>
          <div className="space-y-3">
            <h1 className="font-sans font-extrabold text-[32px] text-white tracking-tight drop-shadow-sm leading-tight">Generator Administrasi Guru</h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">Urus CP/TP/ATP/Prota/Promes/KKTP dengan mudah</p>
          </div>
          <p className="text-white/80 max-w-md mx-auto text-sm leading-relaxed font-sans font-light">
            Penyusunan Capaian Pembelajaran, Alur Pembagian Jam, Prota, Promes, dan KKTP terstandar Kurikulum Nasional secara langsung tanpa ketik berulang.
          </p>
        </div>
      </aside>

      {/* Split Screen Right Side: Form Inputs */}
      <main className="w-full lg:w-1/2 flex items-center justify-center bg-[#FAFBFD] p-6">
        <div className="w-full max-w-md space-y-6">
          
          {/* Mobile device logo layout */}
          <div className="flex flex-col items-center lg:hidden text-center space-y-2">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-md">
              <GraduationCap className="text-white w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-blue-600 tracking-tight font-sans">Generator Administrasi Guru</h2>
            <p className="text-xs uppercase font-bold tracking-widest text-[#94a3b8]">Urus CP/TP/ATP/Prota/Promes/KKTP dengan mudah</p>
          </div>

          {/* Login Container Box */}
          <div className="bg-white rounded-3xl p-8 shadow-md border border-[#e2e8f0]/80 space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">Selamat Datang Guru Pengajar</h2>
              <p className="text-xs text-slate-500 mt-1 leading-normal">
                Masukan detail akun terverifikasi dapodik atau sandi kurikulum guru untuk mengakses portal.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex gap-2 items-center">
                <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0" id="login-error-alert" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Input Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Alamat Email / NUPTK</label>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <User className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-[#FAFBFD] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-xs text-slate-800 placeholder:text-slate-400/80"
                    placeholder="nama@sekolah.id"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="login-email-input"
                  />
                </div>
              </div>

              {/* Password Input Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700 block">Sandi Akses Kurikulum</label>
                  <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Lupa Sandi?</a>
                </div>
                <div className="relative group">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="w-4.5 h-4.5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-11 pr-12 py-3 bg-[#FAFBFD] border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-xs text-slate-800 font-mono placeholder:text-slate-400/80"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="login-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* MASUK button */}
              <button
                type="submit"
                disabled={isProcessingLogin}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition hover:-translate-y-0.5 active:translate-y-0 active:scale-98 flex items-center justify-center gap-2 group"
                id="login-submit-btn"
              >
                {isProcessingLogin ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Memproses Sesi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk Sekarang</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer details inside login container */}
            <div className="border-t border-[#e2e8f0]/60 pt-4 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold font-mono">Generator Administrasi Guru v2.4.5</span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                Standard 2025
              </span>
            </div>
          </div>

          {/* Outside help link */}
          <footer className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Butuh bantuan mendaftarkan sekolah? <a href="#" className="font-bold text-blue-600 hover:underline">Hubungi IT Support</a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
