import React, { useState } from "react";
import {
  Utensils,
  Palette,
  Film,
  Tv,
  Sun,
  Music,
  MapPin,
  Eye,
  Cookie,
  Sparkles,
  Edit2,
  Check,
  X,
  RotateCcw,
  ArrowLeft,
  Heart,
  Flower2,
} from "lucide-react";
import { FavouriteItem, TabType } from "../types";
import { TulipIcon } from "../components/TulipIcon";

interface FavouritesScreenProps {
  favourites: FavouriteItem[];
  onUpdateFavourites: (updated: FavouriteItem[]) => void;
  onResetToDefaults: () => void;
  onNavigate: (tab: TabType) => void;
}

export const FavouritesScreen: React.FC<FavouritesScreenProps> = ({
  favourites,
  onUpdateFavourites,
  onResetToDefaults,
  onNavigate,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editNote, setEditNote] = useState("");

  const startEdit = (item: FavouriteItem) => {
    setEditingId(item.id);
    setEditValue(item.value);
    setEditNote(item.note || item.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setEditNote("");
  };

  const saveEdit = (id: string) => {
    if (!editValue.trim()) return;
    const updated = favourites.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          value: editValue.trim(),
          note: editNote.trim(),
          updatedAt: new Date().toLocaleDateString(),
        };
      }
      return item;
    });
    onUpdateFavourites(updated);
    setEditingId(null);
  };

  // Icon mapping
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Utensils":
        return <Utensils className="w-5 h-5 text-[#52b788]" />;
      case "Palette":
        return <Palette className="w-5 h-5 text-[#52b788]" />;
      case "Film":
        return <Film className="w-5 h-5 text-[#52b788]" />;
      case "Tv":
        return <Tv className="w-5 h-5 text-[#52b788]" />;
      case "Sun":
        return <Sun className="w-5 h-5 text-[#e9c46a]" />;
      case "Music":
        return <Music className="w-5 h-5 text-[#52b788]" />;
      case "MapPin":
        return <MapPin className="w-5 h-5 text-[#52b788]" />;
      case "Eye":
        return <Eye className="w-5 h-5 text-[#52b788]" />;
      case "Cookie":
        return <Cookie className="w-5 h-5 text-[#e76f51]" />;
      case "Sparkles":
        return <Sparkles className="w-5 h-5 text-[#e76f51]" />;
      case "Tulip":
        return <TulipIcon size={22} />;
      default:
        return <Heart className="w-5 h-5 text-[#52b788]" />;
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#102d1f] hover:bg-[#18422f] text-[#95d5b2] text-xs font-medium border border-[#23583c] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm("Reset all favourites to Srishti's original 11 items?")) {
              onResetToDefaults();
            }
          }}
          className="text-xs text-[#709b82] hover:text-[#a7d7bc] flex items-center gap-1 py-1 px-2 transition-colors"
          title="Reset to default items"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Screen Title Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#123625] via-[#0d281c] to-[#081b13] border border-[#21563a] p-5 shadow-lg shadow-[#041009] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <TulipIcon size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1 text-[11px] font-semibold uppercase tracking-wider text-[#74c69d]">
            <Flower2 className="w-3.5 h-3.5" />
            <span>Curated For Srishti</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#f0fdf4]">
            Srishti's Favourites
          </h1>
          <p className="text-xs text-[#9cc4ab] mt-1 max-w-sm leading-relaxed">
            The special colours, flavours, stories, and songs that define Srishti.
            Always kept safe and readily accessible.
          </p>
        </div>
      </div>

      {/* Individual Favourite Cards */}
      <div className="grid grid-cols-1 gap-3">
        {favourites.map((fav) => {
          const isEditing = editingId === fav.id;

          return (
            <div
              key={fav.id}
              className={`rounded-2xl border transition-all p-4 ${
                fav.key === "flower" || fav.key === "colour"
                  ? "bg-gradient-to-r from-[#0d2b1d] to-[#123625] border-[#296847] shadow-sm shadow-[#0a1e14]"
                  : "bg-[#0b2116] border-[#18422e] hover:border-[#276144]"
              }`}
            >
              {isEditing ? (
                /* Edit Mode */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#74c69d]">
                      Edit {fav.category}
                    </span>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-[#83ae95] hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#86b198] block mb-1">
                      Favourite Value
                    </label>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full bg-[#07170f] border border-[#24583e] rounded-xl px-3 py-2 text-sm text-[#f0fdf4] focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                      placeholder="Enter favourite..."
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#86b198] block mb-1">
                      Personal Note / Details
                    </label>
                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      className="w-full bg-[#07170f] border border-[#24583e] rounded-xl px-3 py-2 text-xs text-[#d8f3dc] focus:outline-none focus:ring-1 focus:ring-[#52b788]"
                      placeholder="Add a gentle note (e.g. why you love it)..."
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1.5 rounded-lg text-xs text-[#8cb79d] hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(fav.id)}
                      className="px-4 py-1.5 rounded-lg bg-[#2d6a4f] hover:bg-[#398262] text-xs font-medium text-[#f0fdf4] flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#143d28] border border-[#276144] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {renderIcon(fav.iconName)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6cb588]">
                          {fav.category}
                        </span>
                        {fav.updatedAt && (
                          <span className="text-[10px] text-[#6d967e]">
                            · edited
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-base font-semibold text-[#f0fdf4] mt-0.5">
                        {fav.value}
                      </h3>
                      <p className="text-xs text-[#8cb79d] mt-1 leading-relaxed">
                        {fav.note || fav.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => startEdit(fav)}
                    className="p-1.5 rounded-lg text-[#659178] hover:text-[#95d5b2] hover:bg-[#143a27] transition-colors"
                    title={`Edit ${fav.category}`}
                    aria-label={`Edit ${fav.category}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer reassurance */}
      <div className="p-4 rounded-2xl bg-[#091f14] border border-[#18422e] text-center text-xs text-[#74a589]">
        <span>🌷 Only us keeps these personal favorites stored locally on your device.</span>
      </div>
    </div>
  );
};
