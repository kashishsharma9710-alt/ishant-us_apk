import { Message, Memory, FavouriteItem, Reminder, CareEntry, AppSettings } from "../types";
import { DEFAULT_FAVOURITES } from "../data/defaultFavourites";

const CHAT_KEY = "onlyus_chat_history_v1";
const MEMORIES_KEY = "onlyus_memories_v1";
const FAVOURITES_KEY = "onlyus_favourites_v1";
const REMINDERS_KEY = "onlyus_reminders_v1";
const CARE_KEY = "onlyus_care_entries_v1";
const SETTINGS_KEY = "onlyus_settings_v1";

export const DEFAULT_SETTINGS: AppSettings = {
  aiTone: "warm_calm",
  language: "hinglish",
  aiModel: "gemini-3.1-flash-lite",
  theme: "forest",
  soundEnabled: true,
  notificationsEnabled: true,
  privacyLockEnabled: false,
};

export const INITIAL_GREETING_MESSAGE: Message = {
  id: "greeting-initial",
  role: "assistant",
  content: "Hello Srishti! 🌷 Main Ishant hoon, aapka personal companion. Aaj ka din kaisa chal raha hai? Kuch share karna ho ya bas baatein karni ho, main hamesha yahin hoon.",
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

export function getStoredChat(): Message[] {
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    if (!raw) return [INITIAL_GREETING_MESSAGE];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [INITIAL_GREETING_MESSAGE];
  } catch {
    return [INITIAL_GREETING_MESSAGE];
  }
}

export function saveStoredChat(messages: Message[]): void {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  } catch (err) {
    console.error("Failed to save chat to localStorage", err);
  }
}

export function clearStoredChat(): void {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify([INITIAL_GREETING_MESSAGE]));
  } catch (err) {
    console.error("Failed to clear chat", err);
  }
}

export function getStoredFavourites(): FavouriteItem[] {
  try {
    const raw = localStorage.getItem(FAVOURITES_KEY);
    if (!raw) {
      saveStoredFavourites(DEFAULT_FAVOURITES);
      return DEFAULT_FAVOURITES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FAVOURITES;
  } catch {
    return DEFAULT_FAVOURITES;
  }
}

export function saveStoredFavourites(items: FavouriteItem[]): void {
  try {
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save favourites", err);
  }
}

export function resetFavouritesToDefault(): FavouriteItem[] {
  saveStoredFavourites(DEFAULT_FAVOURITES);
  return DEFAULT_FAVOURITES;
}

export function getStoredMemories(): Memory[] {
  try {
    const raw = localStorage.getItem(MEMORIES_KEY);
    if (!raw) {
      // Seed with one gentle starter memory to illustrate the feature
      const initial: Memory[] = [
        {
          id: "mem-first",
          title: "A calm beginning with Only us",
          category: "Milestone",
          note: "Started using Only us with Ishant AI — a quiet, peaceful space made just for me.",
          date: new Date().toISOString().split("T")[0],
          createdAt: Date.now(),
          tags: ["New Beginnings", "Peace"],
        },
      ];
      saveStoredMemories(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredMemories(memories: Memory[]): void {
  try {
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories));
  } catch (err) {
    console.error("Failed to save memories", err);
  }
}

export function getStoredReminders(): Reminder[] {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    if (!raw) {
      const today = new Date().toISOString().split("T")[0];
      const initial: Reminder[] = [
        {
          id: "rem-1",
          title: "Drink a warm cup of water & stretch",
          date: today,
          time: "10:30",
          category: "Care",
          repeat: "daily",
          completed: false,
          note: "Stay hydrated and give your eyes a rest",
          createdAt: Date.now(),
        },
        {
          id: "rem-2",
          title: "Listen to 'Love Me Like You Do' for a calm break",
          date: today,
          time: "17:00",
          category: "Personal",
          repeat: "once",
          completed: false,
          note: "A 5-minute melodic pause",
          createdAt: Date.now(),
        },
      ];
      saveStoredReminders(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredReminders(reminders: Reminder[]): void {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  } catch (err) {
    console.error("Failed to save reminders", err);
  }
}

export function getStoredCareEntries(): CareEntry[] {
  try {
    const raw = localStorage.getItem(CARE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredCareEntries(entries: CareEntry[]): void {
  try {
    localStorage.setItem(CARE_KEY, JSON.stringify(entries));
  } catch (err) {
    console.error("Failed to save care entries", err);
  }
}

export function getStoredSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error("Failed to save settings", err);
  }
}

export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(CHAT_KEY);
    localStorage.removeItem(MEMORIES_KEY);
    localStorage.removeItem(FAVOURITES_KEY);
    localStorage.removeItem(REMINDERS_KEY);
    localStorage.removeItem(CARE_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (err) {
    console.error("Failed to clear data", err);
  }
}
