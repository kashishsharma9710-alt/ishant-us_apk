import React from "react";
import { Home, MessageSquare, Bell, BookOpen, Heart } from "lucide-react";
import { TabType } from "../types";

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingRemindersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  pendingRemindersCount = 0,
}) => {
  const tabs = [
    { id: "home" as TabType, label: "Home", icon: Home },
    { id: "chat" as TabType, label: "Chat", icon: MessageSquare, badgeLabel: "Ishant" },
    { id: "reminders" as TabType, label: "Reminders", icon: Bell, badgeCount: pendingRemindersCount },
    { id: "memory" as TabType, label: "Memory", icon: BookOpen },
    { id: "care" as TabType, label: "Care", icon: Heart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#091a13]/95 backdrop-blur-lg border-t border-[#173a27] pb-safe transition-all shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
      <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-[#52b788] scale-105"
                  : "text-[#7aa68e] hover:text-[#c4e3d1]"
              }`}
              aria-label={tab.label}
            >
              <div className="relative">
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-[#1b4332] shadow-sm shadow-[#2d6a4f]/50"
                      : "bg-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>

                {tab.badgeCount && tab.badgeCount > 0 ? (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#52b788] text-[#07130e] text-[10px] font-bold flex items-center justify-center ring-2 ring-[#091a13]">
                    {tab.badgeCount}
                  </span>
                ) : null}
              </div>

              <span
                className={`text-[11px] font-medium tracking-wide mt-0.5 transition-colors ${
                  isActive ? "text-[#95d5b2] font-semibold" : "text-[#6c967e]"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
