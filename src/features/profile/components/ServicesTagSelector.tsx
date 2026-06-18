"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { X, Plus, Search } from "lucide-react";
import { getSkillIcon } from "@/src/utils/skillIcons";
import { useSkills } from "@/src/features/skills";

interface ServicesTagSelectorProps {
  label: string;
  icon?: React.ReactNode;
  selectedTags: string[];
  onChange: (tags: string[]) => void;
  addButtonLabel: string;
  placeholder?: string;
  category: "TECHNICAL" | "GENERAL";
}

export default function ServicesTagSelector(props: ServicesTagSelectorProps) {
  const { label, icon, selectedTags, onChange, addButtonLabel, placeholder = "البحث في الخدمات...", category } = props;
  
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Load approved skills from backend
  const { data: dbSkills = [] } = useSkills();

  // Merge database skills with selected tags dynamically
  const localServices = useMemo(() => {
    const dbSkillNames = dbSkills.map((s) => s.name);
    const names = new Set([...dbSkillNames, ...selectedTags]);
    return Array.from(names);
  }, [dbSkills, selectedTags]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRemove = (tagToRemove: string) => {
    onChange(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleAdd = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (trimmed) {
      if (!selectedTags.includes(trimmed)) {
        onChange([...selectedTags, trimmed]);
      }
    }
    setSearch("");
    setIsOpen(false);
  };

  const handleCreateNewSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    // Check if it already exists case-insensitively in dbSkills
    const existing = dbSkills.find(
      (s) => s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (existing) {
      handleAdd(existing.name);
      return;
    }

    handleAdd(trimmed);
  };

  // Filter suggestions from localServices list
  const suggestions = localServices.filter(
    (item) =>
      item.toLowerCase().includes(search.toLowerCase()) &&
      !selectedTags.includes(item)
  );

  const showCustomOption =
    search.trim() !== "" &&
    !localServices.some((item) => item.toLowerCase() === search.trim().toLowerCase()) &&
    !selectedTags.some((item) => item.toLowerCase() === search.trim().toLowerCase());

  return (
    <div className="flex flex-col gap-3 w-full text-right" ref={dropdownRef}>
      {/* Label & Icon Header */}
      <div className="flex items-center gap-2 pr-1 text-primary-500">
        {icon}
        <span className="text-base font-bold">{label}</span>
      </div>

      {/* Selected Tags Box */}
      <div className="relative w-full rounded-2xl border border-neutral-200 bg-white p-4 min-h-[72px] flex flex-wrap gap-2.5 items-center">
        {selectedTags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eef3f7] text-[#1e4c6e] rounded-full text-xs font-semibold select-none border border-neutral-100/50"
          >
            {getSkillIcon(tag, { className: "w-3.5 h-3.5 text-[#1e4c6e] shrink-0" })}
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="p-0.5 hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
              title="إزالة"
            >
              <X size={12} className="text-[#8fa8be] hover:text-[#1e4c6e]" />
            </button>
          </div>
        ))}

        {/* Dotted Add Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-neutral-300 text-neutral-500 hover:text-[#1e4c6e] hover:border-[#1e4c6e] rounded-full text-xs transition-all cursor-pointer bg-white font-medium"
        >
          <Plus size={13} />
          <span>{addButtonLabel}</span>
        </button>

        {/* Search Dropdown */}
        {isOpen && (
          <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-xl shadow-2xl border border-primary-50 z-[1000] p-3 animate-in fade-in slide-in-from-top-2 flex flex-col gap-2">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-4 pr-10 py-2 border border-neutral-100 rounded-xl text-xs bg-neutral-50/50 focus:bg-white focus:outline-none focus:border-primary-400 transition-all text-right font-cairo"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (search.trim()) {
                      if (showCustomOption) {
                        handleCreateNewSkill(search);
                      } else {
                        handleAdd(search.trim());
                      }
                    }
                  }
                }}
              />
            </div>

            {/* Suggestions list */}
            <div className="max-h-[160px] overflow-y-auto custom-scrollbar flex flex-col gap-0.5 mt-1">
              {suggestions.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => handleAdd(item)}
                  className="w-full py-2 px-3 text-right text-xs text-neutral-650 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  {getSkillIcon(item, { className: "w-3.5 h-3.5 text-neutral-400 shrink-0" })}
                  <span>{item}</span>
                </button>
              ))}

              {showCustomOption && (
                <button
                  type="button"
                  onClick={() => handleCreateNewSkill(search)}
                  className="w-full py-2.5 px-3 text-right text-xs font-bold text-success-600 hover:bg-success-50 rounded-lg transition-colors flex items-center gap-1.5 border-t border-neutral-50 mt-1"
                >
                  <Plus size={14} />
                  <span>إضافة مهارة جديدة: &quot;{search.trim()}&quot;</span>
                </button>
              )}

              {suggestions.length === 0 && !showCustomOption && (
                <p className="text-center text-xs text-neutral-400 py-3">لا توجد خدمات متاحة</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
