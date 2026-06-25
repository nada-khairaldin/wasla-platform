"use client";
import { Search } from "lucide-react";
import { useSearchModal } from "../hooks/useSearchModal";

function SearchBar() {
  const { openModal } = useSearchModal();

  return (
    <button
      onClick={openModal}
      className="relative group w-full flex items-center bg-[#f1f3f5] rounded-xl py-2 pr-4 pl-10 h-[40px] hover:bg-[#e9ecef] transition-all text-neutral-400 text-sm font-cairo cursor-pointer"
    >
      <span className="opacity-80">ابحث عن...</span>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-primary-500 transition-colors"
        size={18}
      />
    </button>
  );
}

export default SearchBar;
