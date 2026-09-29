import React, { useState, useEffect } from "react";
import {
  Heart,
  Droplets,
  Wind,
  Shield,
  ShieldAlert,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Coffee,
  Check,
  Plus,
  Minus,
  Lock,
  Unlock,
} from "lucide-react";
import { MoodType, CareEntry } from "../types";
import { TulipIcon } from "../components/TulipIcon";

interface CareScreenProps {
  entries: CareEntry[];
  onSaveEntry: (entry: CareEntry) => void;
  privacyLock: boolean;
  onTogglePrivacyLock: () => void;
}

export const CareScreen: React.FC<CareScreenProps> = ({
  entries,
  onSaveEntry,
  privacyLock,
  onTogglePrivacyLock,
}) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const todayEntry = entries.find((e) => e.date === todayStr);

  const [selectedMood, setSelectedMood] = useState<MoodType>(
    todayEntry?.mood || "Peaceful"
  );
  const [waterCups, setWaterCups] = useState<number>(
    todayEntry?.waterGlasses || 4
  );
  const [reflection, setReflection] = useState<string>(
    todayEntry?.reflection || ""
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Breathing exercise state
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale">(
    "Inhale"
  );
  const [breathSeconds, setBreathSeconds] = useState(4);

  useEffect(() => {
    let timer: any;
    if (isBreathing) {
      timer = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === "Inhale") return "Hold";
              if (currentPhase === "Hold") return "Exhale";
              return "Inhale";
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathing]);

  const moods: { type: MoodType; label: string; icon: any; color: string }[] = [
    { type: "Peaceful", label: "Peaceful", icon: Sparkles, color: "#52b788" },
    { type: "Content", label: "Content", icon: Smile, color: "#74c69d" },
    { type: "Tired", label: "Tired", icon: Coffee, color: "#e9c46a" },
    { type: "Stressed", label: "Stressed", icon: Meh, color: "#f4a261" },
    { type: "Overwhelmed", label: "Overwhelmed", icon: Frown, color: "#e76f51" },
    { type: "Reflective", label: "Reflective", icon: Heart, color: "#95d5b2" },
  ];

  const handleSaveDailyCare = () => {
    const entry: CareEntry = {
      id: todayEntry ? todayEntry.id : `care-${Date.now()}`,
      date: todayStr,
      mood: selectedMood,
      waterGlasses: waterCups,
      reflection: reflection.trim() || undefined,
      createdAt: Date.now(),
    };
    onSaveEntry(entry);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const getCompanionComfortNote = (mood: MoodType) => {
    switch (mood) {
      case "Tired":
        return "Srishti, fatigue is your body's honest request for rest. Try dimming the lights, sipping warm water, and giving yourself permission to slow down.";
      case "Stressed":
        return "Deep breath. Whatever feels heavy right now doesn't need to be solved all at once. Take it one gentle minute at a time.";
      case "Overwhelmed":
        return "Step back from everything for five minutes. Close your eyes, feel the ground beneath you, and know that you are safe in this quiet sanctuary.";
      case "Peaceful":
        return "Cherish this calm stillness. Let your mind soak in the quiet harmony of today.";
      case "Content":
        return "A gentle, contented heart is the greatest treasure. May this peaceful warmth stay with you throughout the day.";
      case "Reflective":
        return "Reflections help us understand our feelings. Write down whatever thoughts want to be acknowledged today.";
      default:
        return "Always here for you, Srishti. Be gentle with yourself.";
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Care Mode Header & Privacy Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#74c69d]">
            <Heart className="w-3.5 h-3.5 fill-[#52b788]/20 text-[#52b788]" />
            <span>Private Sanctuary</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#f0fdf4]">
            Care Mode
          </h1>
        </div>

        <button
          onClick={onTogglePrivacyLock}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl border text-xs font-medium transition-all ${
            privacyLock
              ? "bg-[#1f4f39] text-[#b7e4c7] border-[#40916c]"
              : "bg-[#0c2217] text-[#7ea891] border-[#18422e] hover:text-white"
          }`}
          title={privacyLock ? "Privacy shield active" : "Enable privacy blur"}
        >
          {privacyLock ? (
            <>
              <Lock className="w-3.5 h-3.5 text-[#52b788]" />
              <span>Shield On</span>
            </>
          ) : (
            <>
              <Unlock className="w-3.5 h-3.5" />
              <span>Shield Off</span>
            </>
          )}
        </button>
      </div>

      {/* Non-Diagnostic Disclaimer */}
      <div className="p-3 rounded-2xl bg-[#091e14] border border-[#173e2a] text-[11px] text-[#73a388] leading-relaxed flex items-start gap-2">
        <Shield className="w-4 h-4 text-[#52b788] shrink-0 mt-0.5" />
        <span>
          Care Mode is a personal non-diagnostic wellness space designed for calm
          and comfort. It does not provide medical diagnoses or replace medical
          care.
        </span>
      </div>

      {/* Main Content with Privacy Blur Wrapper */}
      <div
        className={`space-y-5 transition-all duration-300 ${
          privacyLock ? "blur-md select-none pointer-events-none" : ""
        }`}
      >
        {/* Mood Check-In Card */}
        <section className="rounded-3xl bg-[#0b2116] border border-[#1b432f] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-base font-semibold text-[#f0fdf4]">
              How are you feeling today, Srishti?
            </h2>
            <span className="text-[11px] text-[#739f86]">{todayStr}</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {moods.map((m) => {
              const Icon = m.icon;
              const isSelected = selectedMood === m.type;

              return (
                <button
                  key={m.type}
                  onClick={() => setSelectedMood(m.type)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? "bg-[#18422e] border-[#52b788] shadow-sm shadow-[#0a1e14] scale-102"
                      : "bg-[#081810] border-[#163826] text-[#729e84] hover:border-[#275c40]"
                  }`}
                >
                  <Icon
                    className="w-5 h-5 mb-1.5"
                    style={{ color: isSelected ? m.color : undefined }}
                  />
                  <span
                    className={`text-[11px] font-medium ${
                      isSelected ? "text-[#f0fdf4]" : "text-[#729e84]"
                    }`}
                  >
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Supportive Reflection from Ishant */}
          <div className="mt-4 p-3.5 rounded-2xl bg-[#081911] border border-[#183d29] text-xs text-[#a3d1b8] leading-relaxed italic flex items-start gap-2.5">
            <div className="shrink-0 mt-0.5">
              <TulipIcon size={16} />
            </div>
            <div>
              <span className="font-semibold not-italic text-[#6eb98c] block mb-0.5">
                Ishant's Care Note:
              </span>
              "{getCompanionComfortNote(selectedMood)}"
            </div>
          </div>
        </section>

        {/* Calming Breathing Guide (4-4-4 Box Rhythmic Circle) */}
        <section className="rounded-3xl bg-gradient-to-br from-[#0c2419] to-[#081911] border border-[#1d4832] p-6 text-center shadow-md">
          <div className="flex items-center justify-center gap-2 mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#74c69d]">
            <Wind className="w-3.5 h-3.5 text-[#52b788]" />
            <span>Gentle Breathing Anchor</span>
          </div>

          <h3 className="font-serif text-lg font-semibold text-[#f0fdf4] mb-4">
            Rhythmic 4-4-4 Pause
          </h3>

          <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-3">
            {/* Ambient outer glow */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                isBreathing
                  ? breathPhase === "Inhale"
                    ? "bg-[#2d6a4f]/40 scale-110"
                    : breathPhase === "Hold"
                    ? "bg-[#52b788]/30 scale-110"
                    : "bg-[#1b4332]/20 scale-90"
                  : "bg-[#1b4332]/10"
              } blur-xl`}
            />

            {/* Breathing Circle */}
            <div
              className={`relative z-10 w-36 h-36 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 shadow-xl ${
                isBreathing
                  ? breathPhase === "Inhale"
                    ? "border-[#52b788] bg-[#17432f] scale-105"
                    : breathPhase === "Hold"
                    ? "border-[#74c69d] bg-[#1a4b35] scale-105"
                    : "border-[#2d6a4f] bg-[#0e2a1d] scale-95"
                  : "border-[#214f38] bg-[#0c2317]"
              }`}
            >
              {isBreathing ? (
                <>
                  <span className="text-sm font-semibold tracking-wider uppercase text-[#d8f3dc]">
                    {breathPhase}
                  </span>
                  <span className="text-3xl font-serif font-bold text-[#f0fdf4] mt-1">
                    {breathSeconds}
                  </span>
                </>
              ) : (
                <div className="space-y-1">
                  <Wind className="w-6 h-6 text-[#52b788] mx-auto" />
                  <span className="text-xs text-[#90bda3] font-medium block">
                    Ready to relax?
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-[#79a68e] max-w-xs mx-auto mb-4">
            {isBreathing
              ? "Follow the cycle: Inhale calmly, hold gently, and release slowly."
              : "A simple 1-minute breathing exercise to center your mind."}
          </p>

          <button
            onClick={() => {
              setIsBreathing(!isBreathing);
              setBreathSeconds(4);
              setBreathPhase("Inhale");
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all shadow-md ${
              isBreathing
                ? "bg-[#173e2a] hover:bg-[#205238] text-[#e0f2e8] border border-[#2d6a4f]"
                : "bg-gradient-to-r from-[#2d6a4f] to-[#1c4733] hover:from-[#378160] hover:to-[#22573f] text-[#f0fdf4] border border-[#40916c]/40"
            }`}
          >
            {isBreathing ? "Pause Breathing" : "Begin Breathing Exercise"}
          </button>
        </section>

        {/* Daily Hydration Counter */}
        <section className="rounded-3xl bg-[#0b2116] border border-[#1b432f] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#123624] text-[#52b788] flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-semibold text-[#f0fdf4]">
                  Hydration Tracker
                </h3>
                <p className="text-[11px] text-[#719b83]">Daily target: 8 glasses</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setWaterCups(Math.max(0, waterCups - 1))}
                className="w-7 h-7 rounded-lg bg-[#143d28] hover:bg-[#1a4f34] text-[#86bf9e] flex items-center justify-center"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-base font-serif font-bold text-[#f0fdf4] min-w-6 text-center">
                {waterCups}
              </span>
              <button
                onClick={() => setWaterCups(Math.min(16, waterCups + 1))}
                className="w-7 h-7 rounded-lg bg-[#2d6a4f] hover:bg-[#388261] text-[#f0fdf4] flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Water cups visual meter */}
          <div className="grid grid-cols-8 gap-1.5 pt-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                onClick={() => setWaterCups(i + 1)}
                className={`h-7 rounded-lg cursor-pointer transition-all flex items-center justify-center text-[10px] font-bold ${
                  i < waterCups
                    ? "bg-[#2d6a4f] text-[#d8f3dc] shadow-sm shadow-[#143b27]"
                    : "bg-[#091d13] border border-[#163826] text-[#4d725d]"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </section>

        {/* Private Reflection Notes */}
        <section className="rounded-3xl bg-[#0b2116] border border-[#1b432f] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm font-semibold text-[#f0fdf4]">
              Private Daily Reflection
            </h3>
            <span className="text-[10px] text-[#6b987e]">Stored locally only</span>
          </div>

          <textarea
            rows={3}
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write a private thought or how your day felt..."
            className="w-full bg-[#081810] border border-[#1b442f] rounded-2xl p-3 text-xs text-[#f0fdf4] placeholder-[#577f68] focus:outline-none focus:ring-1 focus:ring-[#52b788] resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            {saveSuccess ? (
              <span className="text-xs text-[#52b788] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved to local log!
              </span>
            ) : (
              <span className="text-[11px] text-[#638e76]">
                Keeps your mind clear & grounded
              </span>
            )}

            <button
              onClick={handleSaveDailyCare}
              className="py-2 px-4 rounded-xl bg-[#2d6a4f] hover:bg-[#388261] text-[#f0fdf4] text-xs font-medium shadow-sm transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Care Check-in</span>
            </button>
          </div>
        </section>
      </div>

      {privacyLock && (
        <div className="p-4 rounded-2xl bg-[#0d261a] border border-[#21563a] text-center space-y-2">
          <Lock className="w-6 h-6 text-[#52b788] mx-auto" />
          <h4 className="text-sm font-serif font-semibold text-[#f0fdf4]">
            Privacy Shield Enabled
          </h4>
          <p className="text-xs text-[#82ad93]">
            Care details are blurred to protect your privacy. Tap "Shield On" above to reveal.
          </p>
        </div>
      )}
    </div>
  );
};
