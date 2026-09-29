import React, { useState, useEffect } from "react";
import { TabType, Message, FavouriteItem, Memory, Reminder, CareEntry, AppSettings } from "./types";
import {
  getStoredChat,
  saveStoredChat,
  clearStoredChat,
  getStoredFavourites,
  saveStoredFavourites,
  resetFavouritesToDefault,
  getStoredMemories,
  saveStoredMemories,
  getStoredReminders,
  saveStoredReminders,
  getStoredCareEntries,
  saveStoredCareEntries,
  getStoredSettings,
  saveStoredSettings,
  clearAllLocalData,
} from "./services/storage";
import { TopHeader } from "./components/TopHeader";
import { BottomNav } from "./components/BottomNav";
import { VoiceModal } from "./components/VoiceModal";
import { DownloadModal } from "./components/DownloadModal";
import { HomeScreen } from "./screens/HomeScreen";
import { ChatScreen } from "./screens/ChatScreen";
import { FavouritesScreen } from "./screens/FavouritesScreen";
import { MemoryScreen } from "./screens/MemoryScreen";
import { RemindersScreen } from "./screens/RemindersScreen";
import { CareScreen } from "./screens/CareScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>("home");
  const [messages, setMessages] = useState<Message[]>([]);
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [careEntries, setCareEntries] = useState<CareEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize local storage on mount
  useEffect(() => {
    setMessages(getStoredChat());
    setFavourites(getStoredFavourites());
    setMemories(getStoredMemories());
    setReminders(getStoredReminders());
    setCareEntries(getStoredCareEntries());
    setSettings(getStoredSettings());
    setIsLoaded(true);
  }, []);

  // Update handlers
  const handleUpdateMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    saveStoredChat(newMessages);
  };

  const handleClearMessages = () => {
    clearStoredChat();
    setMessages(getStoredChat());
  };

  const handleUpdateFavourites = (updated: FavouriteItem[]) => {
    setFavourites(updated);
    saveStoredFavourites(updated);
  };

  const handleResetFavourites = () => {
    const defs = resetFavouritesToDefault();
    setFavourites(defs);
  };

  const handleAddMemory = (memory: Memory) => {
    const updated = [memory, ...memories];
    setMemories(updated);
    saveStoredMemories(updated);
  };

  const handleUpdateMemory = (memory: Memory) => {
    const updated = memories.map((m) => (m.id === memory.id ? memory : m));
    setMemories(updated);
    saveStoredMemories(updated);
  };

  const handleDeleteMemory = (id: string) => {
    const updated = memories.filter((m) => m.id !== id);
    setMemories(updated);
    saveStoredMemories(updated);
  };

  const handleAddReminder = (reminder: Reminder) => {
    const updated = [reminder, ...reminders];
    setReminders(updated);
    saveStoredReminders(updated);
  };

  const handleUpdateReminder = (reminder: Reminder) => {
    const updated = reminders.map((r) => (r.id === reminder.id ? reminder : r));
    setReminders(updated);
    saveStoredReminders(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveStoredReminders(updated);
  };

  const handleToggleReminderComplete = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    setReminders(updated);
    saveStoredReminders(updated);
  };

  const handleSaveCareEntry = (entry: CareEntry) => {
    const filtered = careEntries.filter((e) => e.date !== entry.date);
    const updated = [entry, ...filtered];
    setCareEntries(updated);
    saveStoredCareEntries(updated);
  };

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const handleResetAllData = () => {
    clearAllLocalData();
    setMessages(getStoredChat());
    setFavourites(resetFavouritesToDefault());
    setMemories(getStoredMemories());
    setReminders(getStoredReminders());
    setCareEntries(getStoredCareEntries());
    setSettings(getStoredSettings());
    setCurrentTab("home");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#07130e] flex items-center justify-center text-[#52b788]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0f281d] border border-[#276144] animate-pulse flex items-center justify-center">
            <span className="text-xl">🌷</span>
          </div>
          <span className="font-serif text-sm tracking-wide text-[#b5e0c8]">
            Only us
          </span>
        </div>
      </div>
    );
  }

  const pendingRemindersCount = reminders.filter((r) => !r.completed).length;

  // Determine header behavior
  const showBackHeader = currentTab === "favourites" || currentTab === "settings";
  const headerTitle =
    currentTab === "favourites"
      ? "Srishti's Favourites"
      : currentTab === "settings"
      ? "Settings"
      : undefined;

  return (
    <div className="min-h-screen bg-[#06110c] text-[#e5f0ea] flex justify-center selection:bg-[#20573e] selection:text-[#e8f2ec]">
      {/* Mobile-first Phone shell container */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-[#07130e] shadow-2xl border-x border-[#122e20]/60 relative">
        {/* Top Header */}
        <TopHeader
          currentTab={currentTab}
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenDownload={() => setIsDownloadModalOpen(true)}
          showBack={showBackHeader}
          titleOverride={headerTitle}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 pt-4 pb-20 overflow-y-auto">
          {currentTab === "home" && (
            <HomeScreen
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
              reminders={reminders}
              memories={memories}
              favourites={favourites}
            />
          )}

          {currentTab === "chat" && (
            <ChatScreen
              messages={messages}
              onUpdateMessages={handleUpdateMessages}
              onClearMessages={handleClearMessages}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              memories={memories}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === "favourites" && (
            <FavouritesScreen
              favourites={favourites}
              onUpdateFavourites={handleUpdateFavourites}
              onResetToDefaults={handleResetFavourites}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === "reminders" && (
            <RemindersScreen
              reminders={reminders}
              onAddReminder={handleAddReminder}
              onUpdateReminder={handleUpdateReminder}
              onDeleteReminder={handleDeleteReminder}
              onToggleComplete={handleToggleReminderComplete}
            />
          )}

          {currentTab === "memory" && (
            <MemoryScreen
              memories={memories}
              onAddMemory={handleAddMemory}
              onUpdateMemory={handleUpdateMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          )}

          {currentTab === "care" && (
            <CareScreen
              entries={careEntries}
              onSaveEntry={handleSaveCareEntry}
              privacyLock={settings.privacyLockEnabled}
              onTogglePrivacyLock={() =>
                handleUpdateSettings({
                  ...settings,
                  privacyLockEnabled: !settings.privacyLockEnabled,
                })
              }
            />
          )}

          {currentTab === "settings" && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onNavigate={(tab) => setCurrentTab(tab)}
              onResetAllData={handleResetAllData}
              memoriesCount={memories.length}
              remindersCount={reminders.length}
              favouritesCount={favourites.length}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          pendingRemindersCount={pendingRemindersCount}
        />

        {/* Voice Mode Modal */}
        <VoiceModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onOpenChat={() => {
            setIsVoiceModalOpen(false);
            setCurrentTab("chat");
          }}
        />

        {/* Download & Install Modal */}
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
        />
      </div>
    </div>
  );
}
