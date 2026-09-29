import React from "react";
import { Settings, ArrowLeft, Download } from "lucide-react";
import { TulipIcon } from "./TulipIcon";
import { TabType } from "../types";

interface TopHeaderProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  onOpenDownload?: () => void;
  titleOverride?: string;
  showBack?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenDownload,
  titleOverride,
  showBack = false,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0a1811]/90 backdrop-blur-md border-b border-[#163826]/70 px-4 py-3 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {showBack ? (
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 text-[#a8d5ba] hover:text-white transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-[#143324]"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5 text-[#62b588]" />
            <span className="text-sm font-medium">Home</span>
          </button>
        ) : (
          <div
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1b4332] to-[#0d281e] border border-[#2d6a4f]/50 flex items-center justify-center shadow-sm shadow-[#0a1a12] group-hover:border-[#52b788]/60 transition-all">
              <TulipIcon size={22} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg font-semibold tracking-tight text-[#f0fdf4]">
                  Only us
                </span>
                <span className="text-[10px] tracking-widest uppercase font-medium px-1.5 py-0.5 rounded bg-[#163826] text-[#74c69d] border border-[#2d6a4f]/40">
                  Private
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#82b496]">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#40916c] animate-pulse"></span>
                <span>Ishant AI is active</span>
              </div>
            </div>
          </div>
        )}

        {titleOverride && (
          <span className="font-serif text-base font-medium text-[#e2f0e7] truncate max-w-[160px]">
            {titleOverride}
          </span>
        )}

        <div className="flex items-center gap-1.5">
          {onOpenDownload && (
            <button
              onClick={onOpenDownload}
              className="p-2 rounded-xl text-[#8cb89c] hover:text-[#d8f3dc] hover:bg-[#143324] transition-all"
              aria-label="Download / Install App"
              title="Download / Install App"
            >
              <Download className="w-5 h-5 text-[#52b788]" />
            </button>
          )}

          <button
            onClick={() => onNavigate("settings")}
            className={`p-2 rounded-xl transition-all ${
              currentTab === "settings"
                ? "bg-[#1f4f39] text-[#b7e4c7] ring-1 ring-[#52b788]/50"
                : "text-[#8cb89c] hover:text-[#d8f3dc] hover:bg-[#143324]"
            }`}
            aria-label="App Settings"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
