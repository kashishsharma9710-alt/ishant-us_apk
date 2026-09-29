import React, { useState } from "react";
import {
  Plus,
  Bell,
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  BellRing,
} from "lucide-react";
import { Reminder, ReminderCategory, RepeatFrequency } from "../types";

interface RemindersScreenProps {
  reminders: Reminder[];
  onAddReminder: (reminder: Reminder) => void;
  onUpdateReminder: (reminder: Reminder) => void;
  onDeleteReminder: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const CATEGORIES: ReminderCategory[] = [
  "Care",
  "Daily",
  "Personal",
  "Health",
  "Important",
];

export const RemindersScreen: React.FC<RemindersScreenProps> = ({
  reminders,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
  onToggleComplete,
}) => {
  const [filter, setFilter] = useState<"upcoming" | "today" | "completed">("upcoming");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("12:00");
  const [category, setCategory] = useState<ReminderCategory>("Care");
  const [repeat, setRepeat] = useState<RepeatFrequency>("once");
  const [note, setNote] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const openAddModal = () => {
    setEditingReminder(null);
    setTitle("");
    setDate(todayStr);
    setTime("12:00");
    setCategory("Care");
    setRepeat("once");
    setNote("");
    setIsModalOpen(true);
  };

  const openEditModal = (rem: Reminder) => {
    setEditingReminder(rem);
    setTitle(rem.title);
    setDate(rem.date);
    setTime(rem.time);
    setCategory(rem.category);
    setRepeat(rem.repeat);
    setNote(rem.note || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingReminder) {
      const updated: Reminder = {
        ...editingReminder,
        title: title.trim(),
        date,
        time,
        category,
        repeat,
        note: note.trim() || undefined,
      };
      onUpdateReminder(updated);
    } else {
      const newRem: Reminder = {
        id: `rem-${Date.now()}`,
        title: title.trim(),
        date,
        time,
        category,
        repeat,
        completed: false,
        note: note.trim() || undefined,
        createdAt: Date.now(),
      };
      onAddReminder(newRem);
    }

    setIsModalOpen(false);
  };

  const testNotification = async () => {
    if (!("Notification" in window)) {
      setNotificationStatus("Web Notifications not supported on this browser.");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification("Only us · Ishant", {
        body: "Srishti, this is a test reminder from Ishant! Take care 🌷",
        icon: "/tulip-icon.svg",
      });
      setNotificationStatus("Test reminder notification sent!");
    } else if (Notification.permission !== "denied") {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        new Notification("Only us · Ishant", {
          body: "Notifications enabled! Ishant is ready to keep you gently on track.",
          icon: "/tulip-icon.svg",
        });
        setNotificationStatus("Notifications permission granted!");
      } else {
        setNotificationStatus("Notification permission was dismissed.");
      }
    } else {
      setNotificationStatus("Notifications are currently blocked in browser settings.");
    }

    setTimeout(() => setNotificationStatus(null), 4000);
  };

  // Filter reminders
  const filteredReminders = reminders.filter((rem) => {
    if (filter === "completed") return rem.completed;
    if (filter === "today") return !rem.completed && rem.date === todayStr;
    return !rem.completed; // upcoming
  });

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#f0fdf4]">
            Reminders
          </h1>
          <p className="text-xs text-[#7fad92] mt-0.5">
            Calm, thoughtful schedule & care checks
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#2d6a4f] hover:bg-[#388261] text-[#f0fdf4] text-xs font-medium shadow-md shadow-[#0a1e14] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Filter Tabs & Test notification banner */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-1 bg-[#0b2116] rounded-xl border border-[#183e2a]">
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "upcoming"
                ? "bg-[#2d6a4f] text-[#f0fdf4]"
                : "text-[#7aa68d] hover:text-[#c4e3d1]"
            }`}
          >
            Upcoming ({reminders.filter((r) => !r.completed).length})
          </button>
          <button
            onClick={() => setFilter("today")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "today"
                ? "bg-[#2d6a4f] text-[#f0fdf4]"
                : "text-[#7aa68d] hover:text-[#c4e3d1]"
            }`}
          >
            Today ({reminders.filter((r) => !r.completed && r.date === todayStr).length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "completed"
                ? "bg-[#2d6a4f] text-[#f0fdf4]"
                : "text-[#7aa68d] hover:text-[#c4e3d1]"
            }`}
          >
            Done ({reminders.filter((r) => r.completed).length})
          </button>
        </div>

        <button
          onClick={testNotification}
          className="p-2 rounded-xl bg-[#123624] hover:bg-[#1a4731] border border-[#23583c] text-[#86bf9e] transition-colors"
          title="Test browser notification alert"
        >
          <BellRing className="w-4 h-4" />
        </button>
      </div>

      {notificationStatus && (
        <div className="p-3 rounded-xl bg-[#123825] border border-[#2d6a4f] text-xs text-[#a7dfbf] flex items-center gap-2 animate-fade-in">
          <Bell className="w-4 h-4 text-[#52b788]" />
          <span>{notificationStatus}</span>
        </div>
      )}

      {/* Reminder List */}
      {filteredReminders.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#091e14] border border-[#163a28] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#133624] text-[#74c69d] flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-base font-semibold text-[#f0fdf4]">
            {filter === "completed" ? "No completed reminders" : "All clear for now"}
          </h3>
          <p className="text-xs text-[#79a38b] max-w-xs mx-auto leading-relaxed">
            {filter === "completed"
              ? "Completed reminders will be archived here."
              : "No upcoming reminders scheduled. Add one whenever you'd like Ishant to remind you."}
          </p>
          {filter !== "completed" && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#1b4632] hover:bg-[#255f44] text-[#a4d7ba] text-xs font-medium border border-[#2d6a4f]/50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule a Reminder</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReminders.map((rem) => (
            <div
              key={rem.id}
              className={`rounded-2xl border p-4 transition-all ${
                rem.completed
                  ? "bg-[#081810] border-[#153423] opacity-60"
                  : "bg-[#0b2116] border-[#1c4530] hover:border-[#2b6849] shadow-sm shadow-[#05130c]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => onToggleComplete(rem.id)}
                    className="mt-0.5 text-[#52b788] hover:scale-110 transition-transform"
                    title={rem.completed ? "Mark incomplete" : "Mark done"}
                  >
                    {rem.completed ? (
                      <CheckCircle className="w-5 h-5 fill-[#2d6a4f] text-[#07130e]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#40916c]" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#133624] text-[#74c69d] border border-[#24583e]/50">
                        {rem.category}
                      </span>
                      {rem.repeat !== "once" && (
                        <span className="text-[10px] text-[#6d967e] capitalize">
                          · {rem.repeat}
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-sm font-semibold mt-1 ${
                        rem.completed
                          ? "line-through text-[#6a8d79]"
                          : "text-[#f0fdf4]"
                      }`}
                    >
                      {rem.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-[#79a68e] mt-1.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {rem.date === todayStr ? "Today" : rem.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rem.time}
                      </span>
                    </div>

                    {rem.note && (
                      <p className="text-xs text-[#8ab39c] mt-1.5 italic">
                        {rem.note}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(rem)}
                    className="p-1.5 rounded-lg text-[#6d9980] hover:text-[#95d5b2] hover:bg-[#133825] transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete reminder "${rem.title}"?`)) {
                        onDeleteReminder(rem.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-[#6d9980] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0b2116] border border-[#214f38] rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#183e2a]">
              <h3 className="font-serif text-lg font-semibold text-[#f0fdf4]">
                {editingReminder ? "Edit Reminder" : "New Reminder"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#78a58c] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#8ab89d] mb-1">
                  What should Ishant remind you about?
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Drink a glass of warm water"
                  className="w-full bg-[#081810] border border-[#1f4b34] rounded-xl px-3 py-2 text-sm text-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#8ab89d] mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#081810] border border-[#1f4b34] rounded-xl px-3 py-2 text-xs text-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8ab89d] mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#081810] border border-[#1f4b34] rounded-xl px-3 py-2 text-xs text-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#8ab89d] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ReminderCategory)}
                    className="w-full bg-[#081810] border border-[#1f4b34] rounded-xl px-3 py-2 text-xs text-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="bg-[#0b2116]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#8ab89d] mb-1">
                    Repeat
                  </label>
                  <select
                    value={repeat}
                    onChange={(e) => setRepeat(e.target.value as RepeatFrequency)}
                    className="w-full bg-[#081810] border border-[#1f4b34] rounded-xl px-3 py-2 text-xs text-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                  >
                    <option value="once" className="bg-[#0b2116]">Just once</option>
                    <option value="daily" className="bg-[#0b2116]">Daily</option>
                    <option value="weekly" className="bg-[#0b2116]">Weekly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8ab89d] mb-1">
                  Optional Note
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Listen to something calming"
                  className="w-full bg-[#081810] border border-[#1f4b34] rounded-xl px-3 py-2 text-xs text-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#8ab89d] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2d6a4f] hover:bg-[#388261] text-xs font-medium text-[#f0fdf4] shadow-md shadow-[#0a1e14]"
                >
                  {editingReminder ? "Save Changes" : "Create Reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
