import React from "react";
import {
  MessageSquare,
  Bell,
  BookOpen,
  Heart,
  Sparkles,
  ArrowRight,
  Mic,
  Calendar,
  Flower2,
  Clock,
  Zap,
} from "lucide-react";
import { TabType, Reminder, Memory, FavouriteItem } from "../types";
import { TulipIcon } from "../components/TulipIcon";
import { Download, Smartphone } from "lucide-react";

interface HomeScreenProps {
  onNavigate: (tab: TabType) => void;
  onOpenVoiceModal: () => void;
  onOpenDownloadModal?: () => void;
  reminders: Reminder[];
  memories: Memory[];
  favourites: FavouriteItem[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenVoiceModal,
  onOpenDownloadModal,
  reminders,
  memories,
  favourites,
}) => {
  // Get contextual time-of-day greeting
  const currentHour = new Date().getHours();
  let timeGreeting = "Good day";
  let greetingSubtext = "I hope your heart feels peaceful and light today.";

  if (currentHour < 12) {
    timeGreeting = "Good morning";
    greetingSubtext = "Start your day at your own gentle pace. Ishant is right here with you.";
  } else if (currentHour < 17) {
    timeGreeting = "Good afternoon";
    greetingSubtext = "Remember to take a mindful breath and stay refreshed.";
  } else if (currentHour < 21) {
    timeGreeting = "Good evening";
    greetingSubtext = "Unwind slowly from the day. You've done well.";
  } else {
    timeGreeting = "Peaceful night";
    greetingSubtext = "Rest your eyes and mind tonight, Srishti.";
  }

  const pendingReminders = reminders.filter((r) => !r.completed);
  const nextReminder = pendingReminders[0];

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#102a1d] via-[#0d2318] to-[#07170f] border border-[#214f38]/60 p-6 shadow-xl shadow-[#040e09]">
        {/* Subtle decorative background tulip glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#2d6a4f]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-[#1b4332]/30 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#74c69d]">
                Personal AI Companion
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#52b788]"></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#95d5b2] bg-[#163826] px-2.5 py-1 rounded-full border border-[#2d6a4f]/50">
              <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse"></span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#52b788] fill-[#52b788]" />
                Fast Free Gemini
              </span>
            </div>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#f0fdf4] tracking-tight mt-1">
            {timeGreeting}, Srishti 🌷
          </h1>

          <p className="text-sm text-[#a3c9b3] mt-2 leading-relaxed">
            {greetingSubtext}
          </p>

          {/* Quick Chat Callout */}
          <div className="mt-5 pt-4 border-t border-[#1a442e]/70 flex items-center justify-between">
            <button
              onClick={() => onNavigate("chat")}
              className="flex-1 mr-3 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#2d6a4f] to-[#1c4733] hover:from-[#357a5b] hover:to-[#23573e] text-[#f0fdf4] font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0a1f15] transition-all transform active:scale-98"
            >
              <MessageSquare className="w-4 h-4 text-[#95d5b2]" />
              <span>Talk to Ishant</span>
              <ArrowRight className="w-4 h-4 text-[#95d5b2] ml-auto" />
            </button>

            <button
              onClick={onOpenVoiceModal}
              className="p-3 rounded-2xl bg-[#143525] hover:bg-[#1a4430] border border-[#2d6a4f]/50 text-[#95d5b2] transition-colors"
              title="Voice Mode Preview"
              aria-label="Voice Mode"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Srishti's Favourites Showcase (Highlighted & Dedicated) */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Flower2 className="w-4 h-4 text-[#52b788]" />
            <h2 className="font-serif text-lg font-semibold text-[#e8f5ec]">
              Srishti's Favourites
            </h2>
          </div>
          <button
            onClick={() => onNavigate("favourites")}
            className="text-xs font-medium text-[#74c69d] hover:text-[#b7e4c7] flex items-center gap-1 transition-colors"
          >
            <span>View all 11</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div
          onClick={() => onNavigate("favourites")}
          className="cursor-pointer group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d261a] to-[#123323] border border-[#215439] p-4 transition-all hover:border-[#3a845e] shadow-md shadow-[#05130b]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#1b4632] border border-[#2d6a4f] flex items-center justify-center group-hover:scale-105 transition-transform">
                <TulipIcon size={24} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#f0fdf4] group-hover:text-[#95d5b2] transition-colors">
                  Personal Preferences
                </h3>
                <p className="text-xs text-[#82ad94]">
                  Chole Bhature · Green · Boys Over Flowers · Tulip
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] bg-[#1a4430] text-[#95d5b2] px-2.5 py-1 rounded-full border border-[#2d6a4f]/50">
                Dedicated List
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards Grid */}
      <section className="grid grid-cols-2 gap-3.5">
        {/* Reminders Card */}
        <div
          onClick={() => onNavigate("reminders")}
          className="cursor-pointer group rounded-2xl bg-[#0b2116] border border-[#1b452f] hover:border-[#2d6a4f] p-4 transition-all shadow-sm shadow-[#05120c] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#163a28] flex items-center justify-center text-[#74c69d]">
                <Bell className="w-4 h-4" />
              </div>
              {pendingReminders.length > 0 && (
                <span className="text-[11px] font-bold bg-[#1b4632] text-[#95d5b2] px-2 py-0.5 rounded-full">
                  {pendingReminders.length} due
                </span>
              )}
            </div>
            <h3 className="font-serif text-sm font-semibold text-[#e8f5ec] group-hover:text-[#95d5b2] transition-colors">
              Reminders
            </h3>
            <p className="text-xs text-[#7ea891] mt-1 line-clamp-1">
              {nextReminder ? nextReminder.title : "Keep daily calm routines"}
            </p>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-[#52b788] font-medium">
            <span>Manage tasks</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Memory Card */}
        <div
          onClick={() => onNavigate("memory")}
          className="cursor-pointer group rounded-2xl bg-[#0b2116] border border-[#1b452f] hover:border-[#2d6a4f] p-4 transition-all shadow-sm shadow-[#05120c] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#163a28] flex items-center justify-center text-[#74c69d]">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-[#7ea891]">
                {memories.length} notes
              </span>
            </div>
            <h3 className="font-serif text-sm font-semibold text-[#e8f5ec] group-hover:text-[#95d5b2] transition-colors">
              Memory Bank
            </h3>
            <p className="text-xs text-[#7ea891] mt-1 line-clamp-1">
              Private thoughts & moments
            </p>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-[#52b788] font-medium">
            <span>View memories</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Care Mode Card */}
        <div
          onClick={() => onNavigate("care")}
          className="cursor-pointer group rounded-2xl bg-[#0b2116] border border-[#1b452f] hover:border-[#2d6a4f] p-4 transition-all shadow-sm shadow-[#05120c] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#163a28] flex items-center justify-center text-[#74c69d]">
                <Heart className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-[#74c69d] bg-[#143a26] px-1.5 py-0.5 rounded">
                Sanctuary
              </span>
            </div>
            <h3 className="font-serif text-sm font-semibold text-[#e8f5ec] group-hover:text-[#95d5b2] transition-colors">
              Care Mode
            </h3>
            <p className="text-xs text-[#7ea891] mt-1 line-clamp-1">
              Breathing, mood & hydration
            </p>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-[#52b788] font-medium">
            <span>Open sanctuary</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Voice Mode Preview Card */}
        <div
          onClick={onOpenVoiceModal}
          className="cursor-pointer group rounded-2xl bg-[#0b2116] border border-[#1b452f] hover:border-[#2d6a4f] p-4 transition-all shadow-sm shadow-[#05120c] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#163a28] flex items-center justify-center text-[#74c69d]">
                <Mic className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase font-bold text-[#62b588] tracking-wider">
                Phase 2
              </span>
            </div>
            <h3 className="font-serif text-sm font-semibold text-[#e8f5ec] group-hover:text-[#95d5b2] transition-colors">
              Voice Mode
            </h3>
            <p className="text-xs text-[#7ea891] mt-1 line-clamp-1">
              Wake word: "Ishant"
            </p>
          </div>
          <div className="mt-3 flex items-center text-[11px] text-[#52b788] font-medium">
            <span>Preview & test</span>
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </section>

      {/* Download / Install App on Phone Card */}
      {onOpenDownloadModal && (
        <section
          onClick={onOpenDownloadModal}
          className="cursor-pointer group rounded-2xl bg-gradient-to-r from-[#113524] to-[#184832] border border-[#2d6a4f] p-4 transition-all hover:border-[#40916c] shadow-md shadow-[#05130b] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b4c35] border border-[#367957] flex items-center justify-center text-[#52b788] group-hover:scale-105 transition-transform">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-semibold text-[#f0fdf4]">
                  Install "Only us" on Phone
                </h3>
                <span className="text-[10px] bg-[#1a4430] text-[#95d5b2] px-2 py-0.5 rounded-full border border-[#2d6a4f]/50">
                  APK / Mobile
                </span>
              </div>
              <p className="text-xs text-[#a2ceb5] mt-0.5">
                Install as a native phone app or export APK
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#74c69d] group-hover:translate-x-1 transition-transform" />
        </section>
      )}

      {/* Daily Thought from Ishant */}
      <section className="p-4 rounded-2xl bg-[#0a1e14] border border-[#173e2a] flex items-start gap-3">
        <div className="p-2 rounded-xl bg-[#153e2a] text-[#74c69d] shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-wide uppercase text-[#88b69b]">
            Thought from Ishant
          </h4>
          <p className="text-xs text-[#c5ded0] mt-1 italic leading-relaxed">
            "A tulip doesn't strive to impress the garden; it simply blooms in its own quiet grace. Take your time today, Srishti."
          </p>
        </div>
      </section>
    </div>
  );
};
