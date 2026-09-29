import React, { useState } from "react";
import {
  Settings,
  Sparkles,
  Languages,
  Shield,
  Bell,
  Mic,
  Database,
  Trash2,
  Download,
  Info,
  Smartphone,
  Check,
  AlertTriangle,
  Heart,
  Palette,
  Zap,
} from "lucide-react";
import { AppSettings, TabType } from "../types";
import { TulipIcon } from "../components/TulipIcon";
import { clearAllLocalData } from "../services/storage";

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onNavigate: (tab: TabType) => void;
  onResetAllData: () => void;
  memoriesCount: number;
  remindersCount: number;
  favouritesCount: number;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onNavigate,
  onResetAllData,
  memoriesCount,
  remindersCount,
  favouritesCount,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2000);
  };

  const handleExportAllData = () => {
    const allData = {
      exportedAt: new Date().toISOString(),
      app: "Only us",
      assistant: "Ishant AI",
      user: "Srishti",
      settings,
      localStorageDump: {
        chat: localStorage.getItem("onlyus_chat_history_v1"),
        memories: localStorage.getItem("onlyus_memories_v1"),
        favourites: localStorage.getItem("onlyus_favourites_v1"),
        reminders: localStorage.getItem("onlyus_reminders_v1"),
        care: localStorage.getItem("onlyus_care_entries_v1"),
      },
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OnlyUs_Backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#f0fdf4]">
          Settings & Preferences
        </h1>
        <p className="text-xs text-[#7fab92] mt-0.5">
          Personalize Ishant AI, privacy, and device controls
        </p>
      </div>

      {saveBanner && (
        <div className="p-3 rounded-xl bg-[#143d28] border border-[#2d6a4f] text-xs text-[#95d5b2] flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-[#52b788]" />
          <span>Preference saved!</span>
        </div>
      )}

      {/* Gemini Fast Engine Selection */}
      <section className="rounded-3xl bg-gradient-to-br from-[#0e2c1d] to-[#0a1f14] border border-[#2d6a4f]/70 p-5 space-y-3 shadow-md shadow-[#05140b]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#52b788] fill-[#52b788]" />
            <h2 className="font-serif text-sm font-semibold text-[#f0fdf4]">
              Gemini AI Engine & Reply Speed
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#95d5b2] bg-[#1a4b33] px-2 py-0.5 rounded-full border border-[#2d6a4f]/50">
            Free & Fast
          </span>
        </div>

        <p className="text-xs text-[#a2ceb5] leading-relaxed">
          Select your preferred Gemini version for Ishant. Flash Lite is optimized for near-instant, zero-latency replies.
        </p>

        <div className="grid grid-cols-1 gap-2 pt-1">
          {[
            {
              id: "gemini-3.1-flash-lite",
              label: "⚡ Gemini 3.1 Flash Lite (Ultra Fast)",
              badge: "Fastest & Free",
              desc: "Minimal thinking latency, fastest response time, lightweight and brisk conversation.",
            },
            {
              id: "gemini-flash-latest",
              label: "⚡ Gemini Flash (Latest)",
              badge: "Fast & Balanced",
              desc: "Great balance of rapid responses and high reasoning accuracy.",
            },
            {
              id: "gemini-3.8-flash",
              label: "✨ Gemini 3.8 Flash (Comprehensive)",
              badge: "Standard",
              desc: "Detailed contextual depth and reasoning for complex discussions.",
            },
          ].map((m) => {
            const isSelected = (settings.aiModel || "gemini-3.1-flash-lite") === m.id;

            return (
              <button
                key={m.id}
                onClick={() => updateSetting("aiModel", m.id as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-[#18422e] border-[#52b788] text-[#f0fdf4] shadow-sm shadow-[#0a1e14]"
                    : "bg-[#081810] border-[#163826] text-[#7ea891] hover:border-[#285e43]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-[#d8f3dc] flex items-center gap-1.5">
                    {m.label}
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isSelected
                        ? "bg-[#52b788] text-[#07130e]"
                        : "bg-[#143725] text-[#78a88f]"
                    }`}
                  >
                    {m.badge}
                  </span>
                </div>
                <div className="text-[11px] text-[#7aa78f] mt-1 leading-relaxed">
                  {m.desc}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* AI Companion Personality & Tone */}
      <section className="rounded-3xl bg-[#0b2116] border border-[#1b432f] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#52b788]" />
          <h2 className="font-serif text-sm font-semibold text-[#f0fdf4]">
            Ishant's Tone & Demeanor
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {[
            { id: "warm_calm", label: "Warm & Calm", desc: "Gentle, supportive and serene companion" },
            { id: "focused", label: "Focused & Concise", desc: "Clear, helpful and straight to the point" },
            { id: "cheerful", label: "Playful & Cheerful", desc: "Uplifting, optimistic and lighthearted" },
          ].map((tone) => (
            <button
              key={tone.id}
              onClick={() => updateSetting("aiTone", tone.id as any)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                settings.aiTone === tone.id
                  ? "bg-[#18422e] border-[#52b788] text-[#f0fdf4]"
                  : "bg-[#081810] border-[#163826] text-[#7ea891] hover:border-[#285e43]"
              }`}
            >
              <div className="font-semibold text-xs text-[#d8f3dc]">
                {tone.label}
              </div>
              <div className="text-[10px] text-[#719d85] mt-0.5 leading-snug">
                {tone.desc}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Language Preference */}
      <section className="rounded-3xl bg-[#0b2116] border border-[#1b432f] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-[#52b788]" />
          <h2 className="font-serif text-sm font-semibold text-[#f0fdf4]">
            Language Mode
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "hinglish", label: "Hinglish (Natural)", desc: "Conversational mix" },
            { id: "english", label: "English", desc: "Fluent & polished" },
            { id: "hindi", label: "Hindi (हिंदी)", desc: "Warm & traditional" },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => updateSetting("language", lang.id as any)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                settings.language === lang.id
                  ? "bg-[#18422e] border-[#52b788] text-[#f0fdf4]"
                  : "bg-[#081810] border-[#163826] text-[#7ea891] hover:border-[#285e43]"
              }`}
            >
              <div className="font-semibold text-xs text-[#d8f3dc]">
                {lang.label}
              </div>
              <div className="text-[10px] text-[#719d85] mt-0.5">
                {lang.desc}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Theme Settings */}
      <section className="rounded-3xl bg-[#0b2116] border border-[#1b432f] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#52b788]" />
          <h2 className="font-serif text-sm font-semibold text-[#f0fdf4]">
            Botanical Theme
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "forest", label: "Forest Emerald", color: "#1b4332" },
            { id: "emerald", label: "Midnight Olive", color: "#143725" },
            { id: "sage", label: "Soft Sage", color: "#2d6a4f" },
          ].map((th) => (
            <button
              key={th.id}
              onClick={() => updateSetting("theme", th.id as any)}
              className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                settings.theme === th.id
                  ? "bg-[#18422e] border-[#52b788] text-[#f0fdf4]"
                  : "bg-[#081810] border-[#163826] text-[#7ea891] hover:border-[#285e43]"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: th.color }}
              />
              <span className="text-xs font-medium text-[#d8f3dc]">
                {th.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Voice & Microphone (Phase 2 Placeholder & Details) */}
      <section className="rounded-3xl bg-[#0b2116] border border-[#1b432f] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-[#52b788]" />
            <h2 className="font-serif text-sm font-semibold text-[#f0fdf4]">
              Voice & Microphone Settings
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64b588] bg-[#143a27] px-2 py-0.5 rounded-full border border-[#285c40]">
            Phase 2
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#081910] border border-[#163b28] space-y-2 text-xs text-[#80ab93]">
          <div className="flex items-center justify-between">
            <span className="text-[#d8f3dc] font-medium">Future Wake Word:</span>
            <span className="font-serif text-[#74c69d] font-bold text-sm">
              "Ishant"
            </span>
          </div>
          <p className="text-[11px] text-[#6d967e] leading-relaxed">
            Hands-free wake-word detection, background listening, and screen-off
            voice activation are reserved for the Phase 2 mobile engine.
          </p>
        </div>
      </section>

      {/* Reminders & Notifications */}
      <section className="rounded-3xl bg-[#0b2116] border border-[#1b432f] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#52b788]" />
          <h2 className="font-serif text-sm font-semibold text-[#f0fdf4]">
            Reminders & Notifications
          </h2>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#081810] border border-[#163826]">
          <div>
            <span className="text-xs font-medium text-[#d8f3dc] block">
              In-App Audio & Chimes
            </span>
            <span className="text-[11px] text-[#719d85]">
              Gentle audio cues for reminders and tasks
            </span>
          </div>
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={(e) => updateSetting("soundEnabled", e.target.checked)}
            className="w-4 h-4 accent-[#52b788] cursor-pointer"
          />
        </div>
      </section>

      {/* Care Mode Privacy */}
      <section className="rounded-3xl bg-[#0b2116] border border-[#1b432f] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#52b788]" />
          <h2 className="font-serif text-sm font-semibold text-[#f0fdf4]">
            Privacy & Local Storage
          </h2>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#081810] border border-[#163826]">
          <div>
            <span className="text-xs font-medium text-[#d8f3dc] block">
              Care Mode Shield Blur
            </span>
            <span className="text-[11px] text-[#719d85]">
              Auto-blur sensitive reflections in Care Mode
            </span>
          </div>
          <input
            type="checkbox"
            checked={settings.privacyLockEnabled}
            onChange={(e) => updateSetting("privacyLockEnabled", e.target.checked)}
            className="w-4 h-4 accent-[#52b788] cursor-pointer"
          />
        </div>

        <div className="p-3 rounded-2xl bg-[#081810] border border-[#163826] text-xs text-[#80ab93] space-y-1">
          <div className="flex items-center justify-between">
            <span>Total Memories:</span>
            <strong className="text-[#a4d7ba]">{memoriesCount}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Reminders:</span>
            <strong className="text-[#a4d7ba]">{remindersCount}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span>Srishti's Favourites:</span>
            <strong className="text-[#a4d7ba]">{favouritesCount}</strong>
          </div>
        </div>
      </section>

      {/* APK / PWA Mobile App Guide */}
      <section className="rounded-3xl bg-gradient-to-br from-[#123625] via-[#0d281c] to-[#081b13] border border-[#245b3d] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#52b788]" />
          <h2 className="font-serif text-sm font-semibold text-[#f0fdf4]">
            Mobile APK & PWA Install
          </h2>
        </div>

        <p className="text-xs text-[#a2ceb5] leading-relaxed">
          Only us is structured as an installable standalone web application (PWA)
          with manifest and service worker readiness. You can install it
          directly to your Android or iOS home screen:
        </p>

        <div className="p-3 rounded-2xl bg-[#081810]/70 border border-[#1c4832] text-xs text-[#85b597] space-y-1.5">
          <div className="flex items-start gap-2">
            <span className="font-bold text-[#52b788]">1.</span>
            <span>In Chrome on Android, tap the three dots menu (⋮).</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-[#52b788]">2.</span>
            <span>Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold text-[#52b788]">3.</span>
            <span>Only us will launch as an independent app icon with a native mobile window.</span>
          </div>
        </div>
      </section>

      {/* Data Backup & Reset */}
      <section className="rounded-3xl bg-[#0b2116] border border-[#1b432f] p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#52b788]" />
          <h2 className="font-serif text-sm font-semibold text-[#f0fdf4]">
            Backup & Reset
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExportAllData}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#143c28] hover:bg-[#1d5237] text-xs font-medium text-[#b7e4c7] border border-[#2b6848] flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full Backup (JSON)</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-xs font-medium text-red-200 border border-red-800/40 flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Data</span>
          </button>
        </div>
      </section>

      {/* About Only us */}
      <section className="text-center py-4 space-y-1 text-xs text-[#6a947c]">
        <div className="w-7 h-7 rounded-xl bg-[#133724] border border-[#214f38] flex items-center justify-center mx-auto mb-2">
          <TulipIcon size={16} />
        </div>
        <p className="font-serif font-medium text-[#a0cbb2]">
          Only us · Designed for Srishti
        </p>
        <p className="text-[11px] text-[#59806a]">
          AI Companion: Ishant AI · Clean, calm & private
        </p>
      </section>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0d2217] border border-red-800/50 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-800 text-red-300 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif text-base font-semibold text-[#f0fdf4]">
                Reset All Local Data?
              </h3>
              <p className="text-xs text-[#95bfa7] leading-relaxed">
                This will reset chat history, memories, reminders, and care entries to their initial defaults. Srishti's favourites will be reset to default.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs text-[#8cb69d] hover:text-white bg-[#091a11] border border-[#163d28]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetAllData();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-red-800 hover:bg-red-700 shadow-md transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
