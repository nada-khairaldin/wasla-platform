import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div className="relative group w-full">
      <input
        type="text"
        placeholder="ابحث عن..."
        className="w-full bg-[#f1f3f5] border-none rounded-xl py-2 pr-10 pl-4 text-sm font-cairo outline-none focus:bg-[#e9ecef] focus:ring-2 focus:ring-primary-500 transition-all h-[40px] "
      />
      <Search
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-primary-500"
        size={18}
      />
    </div>
  );
}

export default SearchBar;
