export type TabType = "home" | "chat" | "reminders" | "memory" | "care" | "favourites" | "settings";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  modelUsed?: string;
  isStreaming?: boolean;
}

export type MemoryCategory = "Moment" | "Thought" | "Milestone" | "Conversation" | "Dream";

export interface Memory {
  id: string;
  title: string;
  category: MemoryCategory;
  note: string;
  date: string;
  createdAt: number;
  tags?: string[];
}

export interface FavouriteItem {
  id: string;
  key: string;
  category: string;
  value: string;
  iconName: string;
  description?: string;
  note?: string;
  updatedAt?: string;
}

export type ReminderCategory = "Care" | "Daily" | "Personal" | "Health" | "Important";
export type RepeatFrequency = "once" | "daily" | "weekly";

export interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  category: ReminderCategory;
  repeat: RepeatFrequency;
  completed: boolean;
  note?: string;
  createdAt: number;
}

export type MoodType = "Peaceful" | "Content" | "Tired" | "Stressed" | "Overwhelmed" | "Reflective";

export interface CareEntry {
  id: string;
  date: string;
  mood: MoodType;
  waterGlasses: number;
  reflection?: string;
  createdAt: number;
}

export interface AppSettings {
  aiTone: "warm_calm" | "focused" | "cheerful";
  language: "hinglish" | "english" | "hindi";
  aiModel: "gemini-3.1-flash-lite" | "gemini-flash-latest" | "gemini-3.8-flash";
  theme: "forest" | "emerald" | "sage";
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  privacyLockEnabled: boolean;
}
