import React, { useState } from "react";
import {
  Plus,
  BookOpen,
  Calendar,
  Search,
  Tag,
  Trash2,
  Edit3,
  X,
  Check,
  Download,
  AlertCircle,
} from "lucide-react";
import { Memory, MemoryCategory } from "../types";

interface MemoryScreenProps {
  memories: Memory[];
  onAddMemory: (memory: Memory) => void;
  onUpdateMemory: (memory: Memory) => void;
  onDeleteMemory: (id: string) => void;
}

const CATEGORIES: MemoryCategory[] = [
  "Moment",
  "Thought",
  "Milestone",
  "Conversation",
  "Dream",
];

export const MemoryScreen: React.FC<MemoryScreenProps> = ({
  memories,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<MemoryCategory>("Moment");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [tagsInput, setTagsInput] = useState("");

  const openAddModal = () => {
    setEditingMemory(null);
    setTitle("");
    setCategory("Moment");
    setNote("");
    setDate(new Date().toISOString().split("T")[0]);
    setTagsInput("");
    setIsModalOpen(true);
  };

  const openEditModal = (mem: Memory) => {
    setEditingMemory(mem);
    setTitle(mem.title);
    setCategory(mem.category);
    setNote(mem.note);
    setDate(mem.date);
    setTagsInput(mem.tags ? mem.tags.join(", ") : "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !note.trim()) return;

    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingMemory) {
      const updated: Memory = {
        ...editingMemory,
        title: title.trim(),
        category,
        note: note.trim(),
        date,
        tags: parsedTags,
      };
      onUpdateMemory(updated);
    } else {
      const newMemory: Memory = {
        id: `mem-${Date.now()}`,
        title: title.trim(),
        category,
        note: note.trim(),
        date,
        tags: parsedTags,
        createdAt: Date.now(),
      };
      onAddMemory(newMemory);
    }

    setIsModalOpen(false);
  };

  // Filter memories
  const filteredMemories = memories.filter((mem) => {
    const matchesCat =
      selectedCategory === "all" || mem.category === selectedCategory;
    const matchesQuery =
      mem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mem.tags &&
        mem.tags.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    return matchesCat && matchesQuery;
  });

  const exportMemoriesJson = () => {
    const blob = new Blob([JSON.stringify(memories, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OnlyUs_Memories_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#f0fdf4]">
            Memories
          </h1>
          <p className="text-xs text-[#80ab93] mt-0.5">
            Private reflections, quiet thoughts & milestones
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#2d6a4f] hover:bg-[#388261] text-[#f0fdf4] text-xs font-medium shadow-md shadow-[#0a1e14] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Note separating Memory from Favourites */}
      <div className="p-3.5 rounded-2xl bg-[#091e14] border border-[#173d2a] flex items-center justify-between text-xs text-[#83af95]">
        <span>
          💡 Looking for food, movies or flower choices? Check{" "}
          <strong className="text-[#a4d7ba]">Srishti's Favourites</strong> on Home.
        </span>
        {memories.length > 0 && (
          <button
            onClick={exportMemoriesJson}
            className="text-[11px] text-[#65b387] hover:text-[#9fe2be] flex items-center gap-1 shrink-0 ml-2"
            title="Export memories to file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        )}
      </div>

      {/* Search and Category filter */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#648e76]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memories or tags..."
            className="w-full bg-[#0b2116] border border-[#1b442f] rounded-xl pl-9 pr-3 py-2 text-xs text-[#f0fdf4] placeholder-[#577d67] focus:outline-none focus:ring-1 focus:ring-[#52b788]"
          />
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-[#2d6a4f] text-[#f0fdf4]"
                : "bg-[#0c2217] text-[#7da78f] hover:bg-[#133524]"
            }`}
          >
            All ({memories.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-[#2d6a4f] text-[#f0fdf4]"
                  : "bg-[#0c2217] text-[#7da78f] hover:bg-[#133524]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Memories List */}
      {filteredMemories.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#091e14] border border-[#163a28] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#133624] text-[#74c69d] flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-base font-semibold text-[#f0fdf4]">
            {searchQuery ? "No matching memories found" : "No memories saved yet"}
          </h3>
          <p className="text-xs text-[#78a28a] max-w-xs mx-auto leading-relaxed">
            Record a heartfelt thought, milestone, or quiet moment. Ishant stores them locally on your device.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#1b4632] hover:bg-[#255f44] text-[#a4d7ba] text-xs font-medium border border-[#2d6a4f]/50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Memory</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="rounded-2xl bg-[#0b2116] border border-[#1b432f] hover:border-[#2a6848] p-4 transition-all shadow-sm shadow-[#05130c]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#133624] text-[#74c69d] border border-[#24583e]/50">
                      {mem.category}
                    </span>
                    <span className="text-[11px] text-[#6d967e] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {mem.date}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-semibold text-[#f0fdf4] pt-1">
                    {mem.title}
                  </h3>

                  <p className="text-xs text-[#a3cbba] leading-relaxed whitespace-pre-wrap pt-0.5">
                    {mem.note}
                  </p>

                  {mem.tags && mem.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-2">
                      {mem.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-[#0e271a] text-[#7aa98f] px-2 py-0.5 rounded-md border border-[#1d4933]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(mem)}
                    className="p-1.5 rounded-lg text-[#6d9980] hover:text-[#95d5b2] hover:bg-[#133825] transition-colors"
                    title="Edit Memory"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete memory "${mem.title}"?`)) {
                        onDeleteMemory(mem.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-[#6d9980] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Memory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0b2116] border border-[#214f38] rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#183e2a]">
              <h3 className="font-serif text-lg font-semibold text-[#f0fdf4]">
                {editingMemory ? "Edit Memory" : "Save New Memory"}
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
                  Memory Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. A peaceful evening walk"
                  className="w-full bg-[#081810] border border-[#1f4b34] rounded-xl px-3 py-2 text-sm text-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#8ab89d] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MemoryCategory)}
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
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#081810] border border-[#1f4b34] rounded-xl px-3 py-2 text-xs text-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8ab89d] mb-1">
                  Memory Details & Thoughts
                </label>
                <textarea
                  rows={4}
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What happened or what were you feeling?..."
                  className="w-full bg-[#081810] border border-[#1f4b34] rounded-xl px-3 py-2 text-xs text-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#52b788] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#8ab89d] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Travel, Relaxation, Smile"
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
                  {editingMemory ? "Update Memory" : "Save Memory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
