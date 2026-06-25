"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, X, Filter, Clock, ChevronDown, ArrowDownUp } from "lucide-react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchModal } from "../hooks/useSearchModal";
import { useDebounce } from "../../../hooks/useDebounce";
import { usePostSearch } from "../hooks/usePostSearch";
import { useUserSearch } from "../hooks/useUserSearch";
import { PostsSearchRequest, UsersSearchRequest } from "../types/search.types";

import { SearchTabs } from "./SearchTabs";
import { PostFilters } from "./PostFilters";
import { UserFilters } from "./UserFilters";
import { PostsResults } from "./PostsResults";
import { UsersResults } from "./UsersResults";
import { SearchLoadingState } from "./LoadingState";
import { SearchEmptyState } from "./EmptyState";
import { SearchErrorState } from "./ErrorState";

const SORT_OPTIONS = [
  { id: "best", label: "الأفضل" },
  { id: "newest", label: "الأحدث" },
  { id: "accurate", label: "الأكثر دقة" },
];

export const SearchModal = () => {
  const { isOpen, closeModal } = useSearchModal();
  const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const inputRef = useRef<HTMLInputElement>(null);

  const [postSort, setPostSort] = useState<"best" | "newest" | "accurate">("best");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [postFilters, setPostFilters] = useState<NonNullable<PostsSearchRequest["filters"]>>({});
  const [userFilters, setUserFilters] = useState<NonNullable<UsersSearchRequest["filters"]>>({});

  const [showFilters, setShowFilters] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("wasla_recent_searches");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const t = setTimeout(() => setRecentSearches(parsed), 0);
        return () => clearTimeout(t);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim() && isOpen) {
      const q = debouncedQuery.trim();
      const t = setTimeout(() => {
        setRecentSearches((prev) => {
          const next = [q, ...prev.filter((s) => s !== q)].slice(0, 5);
          localStorage.setItem("wasla_recent_searches", JSON.stringify(next));
          return next;
        });
      }, 0);
      return () => clearTimeout(t);
    }
  }, [debouncedQuery, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setShowFilters(false);
        setIsSortOpen(false);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handlePostFilterChange = useCallback(
    (key: string, value: string | number | undefined) => {
      setPostFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleUserFilterChange = useCallback(
    (key: string, value: string | boolean | undefined) => {
      setUserFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleResetPostFilters = useCallback(() => {
    setPostFilters({});
  }, []);

  const handleResetUserFilters = useCallback(() => {
    setUserFilters({});
  }, []);

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    isError: isPostsError,
    refetch: refetchPosts,
  } = usePostSearch(
    { query: debouncedQuery, filters: postFilters },
    { enabled: isOpen && activeTab === "posts" && debouncedQuery.length > 0 }
  );

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isUsersError,
    refetch: refetchUsers,
  } = useUserSearch(
    { query: debouncedQuery, filters: userFilters },
    { enabled: isOpen && activeTab === "users" && debouncedQuery.length > 0 }
  );

  if (!isOpen || typeof window === "undefined") return null;

  const renderActiveFilters = () => {
    const activeChips: { key: string; label: string; tab: "posts" | "users" }[] = [];
    
    if (activeTab === "posts") {
      if (postFilters.category) activeChips.push({ key: "category", label: postFilters.category === "REQUEST" ? "طلب" : "عرض", tab: "posts" });
      if (postFilters.serviceMode) activeChips.push({ key: "serviceMode", label: postFilters.serviceMode === "ONLINE" ? "عن بعد" : "ميداني", tab: "posts" });
      if (postFilters.location) activeChips.push({ key: "location", label: postFilters.location, tab: "posts" });
      if (postFilters.maxCredits !== undefined && postFilters.maxCredits < 24) activeChips.push({ key: "maxCredits", label: `أقل من ${postFilters.maxCredits} ساعة`, tab: "posts" });
    } else {
      if (userFilters.skillType) activeChips.push({ key: "skillType", label: userFilters.skillType === "OFFER" ? "مقدم خدمة" : "طالب خدمة", tab: "users" });
      if (userFilters.isOnline) activeChips.push({ key: "isOnline", label: "متصل الآن", tab: "users" });
      if (userFilters.location) activeChips.push({ key: "location", label: userFilters.location, tab: "users" });
    }

    if (activeChips.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <AnimatePresence>
          {activeChips.map((chip) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              key={chip.key} 
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-50 text-primary-700 rounded-lg border border-primary-100/50 text-[11px] font-bold"
            >
              <span>{chip.label}</span>
              <button 
                onClick={() => {
                  if (chip.tab === "posts") handlePostFilterChange(chip.key, undefined);
                  else handleUserFilterChange(chip.key, undefined);
                }}
                className="hover:bg-primary-200/50 p-0.5 rounded-md transition-all duration-200 hover:scale-[1.1] active:scale-[0.9] outline-none focus:outline-none"
              >
                <X size={12} />
              </button>
            </motion.div>
          ))}
          <motion.button
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (activeTab === "posts") handleResetPostFilters();
              else handleResetUserFilters();
            }}
            className="text-[11px] font-bold text-neutral-400 hover:text-neutral-600 px-2 py-1 transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] outline-none focus:outline-none rounded-md"
          >
            مسح الكل
          </motion.button>
        </AnimatePresence>
      </div>
    );
  };

  const renderToolbar = (count: number, label: string, showSort: boolean = true) => (
    <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100/50">
      <span className="text-sm font-bold text-neutral-800">
        {count} {label}
      </span>
      <div className="flex items-center gap-2">
        {/* Sort Button */}
        {showSort && (
          <div className="relative">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-neutral-50 hover:bg-neutral-100 border border-transparent text-[12px] font-bold text-neutral-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] outline-none focus:outline-none"
          >
            <ArrowDownUp size={14} className="text-neutral-500" />
            <span>{SORT_OPTIONS.find(o => o.id === postSort)?.label}</span>
          </button>
          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-[calc(100%+4px)] w-36 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-neutral-100 py-1.5 z-20"
              >
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setPostSort(opt.id as "best" | "newest" | "accurate"); setIsSortOpen(false); }}
                    className={`w-full text-right px-4 py-2 text-[12px] font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] outline-none focus:outline-none ${
                      postSort === opt.id ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        )}
        
        {/* Filter Button */}
        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-neutral-50 hover:bg-neutral-100 border border-transparent text-[12px] font-bold text-neutral-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] outline-none focus:outline-none"
        >
          <Filter size={14} className="text-neutral-500" />
          <span>تصفية</span>
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (debouncedQuery.length === 0) {
      return <SearchEmptyState />;
    }

    if (activeTab === "posts") {
      if (isLoadingPosts) return <SearchLoadingState />;
      if (isPostsError) return <SearchErrorState onRetry={refetchPosts} />;
      const hasPostFilters = Object.values(postFilters).some(v => v !== undefined && v !== "");
      if (!postsData?.posts?.length) return <SearchEmptyState query={debouncedQuery} onResetFilters={handleResetPostFilters} hasFilters={hasPostFilters} />;
      
      const sortedPosts = [...postsData.posts];
      if (postSort === "newest") {
        sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      return (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex flex-col">
          {renderToolbar(postsData.posts.length, "منشور", true)}
          {renderActiveFilters()}
          <PostsResults posts={sortedPosts} onNavigate={closeModal} />
        </motion.div>
      );
    }

    if (activeTab === "users") {
      if (isLoadingUsers) return <SearchLoadingState />;
      if (isUsersError) return <SearchErrorState onRetry={refetchUsers} />;
      const hasUserFilters = Object.values(userFilters).some(v => v !== undefined && v !== "");
      if (!usersData?.users?.length) return <SearchEmptyState query={debouncedQuery} onResetFilters={handleResetUserFilters} hasFilters={hasUserFilters} />;
      
      return (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex flex-col">
          {renderToolbar(usersData.users.length, "مستخدم", false)}
          {renderActiveFilters()}
          <UsersResults users={usersData.users} query={debouncedQuery} skillType={userFilters.skillType} onNavigate={closeModal} />
        </motion.div>
      );
    }

    return null;
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 backdrop-blur-sm pt-4 md:pt-[5vh] pb-4 px-3 md:px-4 overflow-hidden"
          onClick={handleBackdropClick}
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-4xl bg-white rounded-[24px] shadow-2xl flex flex-col h-[92vh] md:h-[85vh] relative overflow-hidden"
          >
            {/* ── Header: Search + Tabs ── */}
            <div className="border-b border-neutral-100 bg-white rounded-t-[24px] z-10 shrink-0">
              <div className="flex items-center gap-3 p-4 md:p-5">
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setTimeout(() => setIsInputFocused(false), 200)}
                    placeholder="ابحث عن منشورات أو مستخدمين..."
                    className="w-full bg-neutral-50/50 border border-neutral-200/80 rounded-[16px] py-3.5 pr-12 pl-4 text-[15px] font-bold text-neutral-800 outline-none focus:outline-none focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all shadow-sm"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />

                  <AnimatePresence>
                    {isInputFocused && query.length === 0 && recentSearches.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl shadow-lg border border-neutral-100 py-2 z-50 overflow-hidden"
                      >
                        <h4 className="text-[10px] font-bold text-neutral-400 mb-1 px-4 uppercase tracking-wide">عمليات البحث الأخيرة</h4>
                        {recentSearches.map((s, idx) => (
                          <button
                            key={idx}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setQuery(s);
                              setIsInputFocused(false);
                              inputRef.current?.blur();
                            }}
                            className="w-full text-right px-4 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] outline-none focus:outline-none"
                          >
                            <Clock size={14} className="text-neutral-400" />
                            <span>{s}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  onClick={closeModal}
                  className="p-3 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-[14px] transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] shrink-0 outline-none focus:outline-none"
                >
                  <X size={22} />
                </button>
              </div>

              <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            {/* ── Body ── */}
            <div className="flex-1 flex overflow-hidden min-h-0 bg-neutral-50/20 relative">
              
              {/* Results Container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar-thin px-4 py-5 md:px-6 w-full">
                <div className="min-h-[300px] max-w-2xl mx-auto">{renderContent()}</div>
              </div>

              {/* Desktop Drawer (Slide from right) */}
              <AnimatePresence>
                {showFilters && (
                  <div className="absolute inset-0 z-20 hidden md:flex justify-end overflow-hidden">
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-neutral-900/10 backdrop-blur-[1px]"
                      onClick={() => setShowFilters(false)}
                    />
                    <motion.aside
                      initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                      transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
                      className="absolute top-0 right-0 bottom-0 w-[300px] bg-white shadow-2xl flex flex-col border-l border-neutral-100/50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-5 border-b border-neutral-50 shrink-0">
                        <h3 className="font-bold text-neutral-800 text-[15px]">تصفية النتائج</h3>
                        <div className="flex items-center gap-2">
                          {(Object.keys(postFilters).length > 0 || Object.keys(userFilters).length > 0) && (
                            <button 
                              onClick={activeTab === "posts" ? handleResetPostFilters : handleResetUserFilters}
                              className="text-[11px] font-bold text-primary-600 hover:text-primary-700 transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] outline-none focus:outline-none px-2 py-1 rounded-md"
                            >
                              إعادة تعيين
                            </button>
                          )}
                          <button onClick={() => setShowFilters(false)} className="p-1.5 text-neutral-400 hover:text-neutral-700 bg-neutral-50 hover:bg-neutral-100 rounded-full transition-all duration-200 hover:scale-[1.1] active:scale-[0.9] outline-none focus:outline-none">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar-thin p-5">
                        <AnimatePresence mode="wait">
                          <motion.div key={activeTab} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="h-full">
                            {activeTab === "posts" ? (
                              <PostFilters filters={postFilters} onChange={handlePostFilterChange} onReset={handleResetPostFilters} />
                            ) : (
                              <UserFilters filters={userFilters} onChange={handleUserFilterChange} onReset={handleResetUserFilters} />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                      <div className="p-4 border-t border-neutral-100 bg-white shrink-0">
                        <button onClick={() => setShowFilters(false)} className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] outline-none focus:outline-none">
                          تطبيق الفلاتر
                        </button>
                      </div>
                    </motion.aside>
                  </div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>

          {/* ── Mobile: Bottom Sheet Filters ── */}
          <AnimatePresence>
            {showFilters && (
              <div className="md:hidden fixed inset-0 z-[110]">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowFilters(false)} />
                <motion.div
                  initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  drag="y" dragConstraints={{ top: 0 }} dragElastic={0.2}
                  onDragEnd={(_, info) => { if (info.offset.y > 100 || info.velocity.y > 500) setShowFilters(false); }}
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] h-[85vh] flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                  dir="rtl"
                >
                  <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mt-3 mb-2 shrink-0" />
                  <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 shrink-0">
                    <h3 className="font-bold text-neutral-900 text-[15px]">تصفية النتائج</h3>
                    <div className="flex items-center gap-2">
                      {(Object.keys(postFilters).length > 0 || Object.keys(userFilters).length > 0) && (
                        <button 
                          onClick={activeTab === "posts" ? handleResetPostFilters : handleResetUserFilters}
                          className="text-[11px] font-bold text-primary-600 hover:text-primary-700 transition-all duration-200 hover:scale-[1.05] active:scale-[0.95] outline-none focus:outline-none px-2 py-1 rounded-md"
                        >
                          إعادة تعيين
                        </button>
                      )}
                      <button onClick={() => setShowFilters(false)} className="p-2 text-neutral-400 hover:text-neutral-700 bg-neutral-50 rounded-full transition-all duration-200 hover:scale-[1.1] active:scale-[0.9] outline-none focus:outline-none">
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar-thin p-5">
                    {activeTab === "posts" ? (
                      <PostFilters filters={postFilters} onChange={handlePostFilterChange} onReset={handleResetPostFilters} />
                    ) : (
                      <UserFilters filters={userFilters} onChange={handleUserFilterChange} onReset={handleResetUserFilters} />
                    )}
                  </div>
                  <div className="p-4 border-t border-neutral-100 bg-white shrink-0">
                    <button onClick={() => setShowFilters(false)} className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] outline-none focus:outline-none">
                      تطبيق الفلاتر
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
