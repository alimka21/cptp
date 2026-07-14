import React from "react";
import { Download } from "lucide-react";

interface TopBarProps {
  pageTitle: string;
  activeTab: string;
  handleDownloadDocx: (targetTab: string) => void;
  activeView: string;
  isDocumentsGenerated: boolean;
}

export default function TopBar({
  pageTitle,
  activeTab,
  handleDownloadDocx,
  activeView,
  isDocumentsGenerated
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[#e2e8f0] flex justify-between items-center px-8 shadow-xs" id="app-topbar">
      {/* Page Title Left */}
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-slate-800 tracking-tight font-sans">
          {pageTitle}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Context-aware CTA Actions (shown inside workspace and when all sessions are complete) */}
        {activeView === "workspace" && isDocumentsGenerated && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadDocx(activeTab)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition active:scale-95 shadow-xs"
              id="topbar-download-btn"
              title="Unduh Modul Docx"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh .docx</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
