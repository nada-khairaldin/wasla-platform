"use client";

import { useMemo, useState } from "react";
import HeroSection from "../../../features/home/components/HeroSection";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { BalanceCard } from "../../../features/home/components/BalanceCard";
import { SidebarFilters } from "../../../features/home/components/SidebarFilters";
import { RecommendedCarousel } from "../../../features/posts/components/RecommendedCarousel";
import { ChevronLeft, ChevronRight, Sparkles, Funnel } from "lucide-react";
import { PostCard } from "../../../features/posts/components/PostCard";
import { usePosts } from "../../../features/posts/hooks";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useUserProfile } from "../../../hooks/useUserProfile";

interface FilterCriteria {
  type: string;
  categories: string[];
  hours: number;
}

export default function HomePage() {
  const { data: currentUser, isLoading } = useCurrentUser();
  const userId = currentUser?.user?.userId;
  const { data: profileData, isLoading: isProfileLoading } = useUserProfile(userId);

  const points = profileData?.profile?.stats?.availableTimeCredits ?? 0;
  const username = profileData?.profile?.username ?? "User";

  const { data: postsData, isLoading: isPostsLoading } = usePosts();
  const posts = postsData ?? [];

  const [activeFilters, setActiveFilters] = useState<FilterCriteria>({
    type: "الكل",
    categories: [],
    hours: 24,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const postsPerPage = 10;

  const handleFilterChange = (newFilters: FilterCriteria) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const postType = post.category === "REQUEST" ? "طلب" : "عرض";
      const matchesType =
        activeFilters.type === "الكل" || postType === activeFilters.type;

      const matchesCategory =
        activeFilters.categories.length === 0 ||
        activeFilters.categories.some(
          (cat) => post.title.includes(cat) || post.description.includes(cat),
        );

      const matchesHours =
        (post.assignedTimeCredits || 0) <= activeFilters.hours;

      return matchesType && matchesCategory && matchesHours;
    });
  }, [posts, activeFilters]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const currentPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, currentPage]);

  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 pt-8">
        <div className="grid grid-cols-12 gap-6 items-stretch mb-8">
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <BalanceCard points={points} isLoading={isProfileLoading} />
          </aside>

          <div className="col-span-12 md:col-span-8 lg:col-span-9">
            <HeroSection user={username} isLoading={isLoading} />
          </div>
        </div>

        <section className="my-16">
          <div className="flex flex-col gap-2 mb-8 px-2 text-right">
            <div className="flex items-center gap-2">
              <Sparkles size={28} className="text-secondary-500" />
              <h3 className="font-black text-primary-900 text-3xl">
                منشورات موصى بها
              </h3>
            </div>
            <p className="text-primary-400 text-base font-medium">
              قائمة منتقاة بعناية من خلال الذكاء الاصطناعي بناءً على اهتماماتك
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 -inset-x-4 bg-secondary-50/30 rounded-[50px] -z-10 blur-3xl" />
            <RecommendedCarousel />
          </div>
        </section>

        <div className="grid grid-cols-12 gap-8 items-start">
          <aside className="col-span-12 lg:col-span-3 sticky top-21 hidden lg:block">
            <SidebarFilters
              isLoading={false}
              onFilterChange={handleFilterChange}
            />
          </aside>

          <div
            id="latest-posts-section"
            className="space-y-8 col-span-12 lg:col-span-9"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-8 bg-primary-600 rounded-full"></div>
                <h3 className="font-bold text-primary-900 text-xl tracking-tight">
                  آخر المنشورات
                </h3>
              </div>

              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200 w-11 h-11 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <Funnel size={20} className="text-primary-600" />
              </button>
            </div>

            <div className="grid gap-6">
              {isPostsLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-neutral-50 p-6 rounded-xl space-y-4 animate-pulse"
                    >
                      <div className="flex justify-between items-center">
                        <div className="w-16 h-6 bg-neutral-200 rounded-full" />
                        <div className="w-10 h-10 bg-neutral-200 rounded-full" />
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-neutral-200 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-neutral-200 rounded w-1/3" />
                          <div className="h-3 bg-neutral-200 rounded w-1/4" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-neutral-200 rounded w-3/4" />
                        <div className="h-4 bg-neutral-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))
              ) : currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-24 bg-neutral-50 rounded-[32px] border-2 border-dashed border-neutral-200">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-neutral-500 font-bold text-lg">
                    لا توجد نتائج تطابق خياراتك
                  </p>
                  <button
                    onClick={() =>
                      handleFilterChange({
                        type: "الكل",
                        categories: [],
                        hours: 24,
                      })
                    }
                    className="text-primary-600 font-black underline mt-3 hover:text-primary-800"
                  >
                    إعادة تعيين كافة الفلاتر
                  </button>
                </div>
              )}
            </div>

            {/*pagination controls*/}
            {totalPages > 1 && (
              <div
                className="flex justify-center items-center gap-3 pt-12 pb-10"
                dir="rtl"
              >
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((prev) => prev - 1);
                    window.scrollTo({ top: 800, behavior: "smooth" });
                  }}
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all shadow-sm
                    ${
                      currentPage === 1
                        ? "opacity-30 cursor-not-allowed border-neutral-100 text-neutral-300"
                        : "border-primary-100 text-primary-600 hover:bg-primary-600 hover:text-white"
                    }`}
                >
                  <ChevronRight size={22} />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 800, behavior: "smooth" });
                        }}
                        className={`w-11 h-11 rounded-xl font-black text-sm transition-all duration-300
                        ${
                          currentPage === page
                            ? "bg-primary-600 text-white shadow-lg shadow-primary-200 scale-105"
                            : "bg-white text-primary-400 border border-primary-50 hover:text-primary-600"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((prev) => prev + 1);
                    window.scrollTo({ top: 800, behavior: "smooth" });
                  }}
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all shadow-sm
                    ${
                      currentPage === totalPages
                        ? "opacity-30 cursor-not-allowed border-neutral-100 text-neutral-300"
                        : "border-primary-100 text-primary-600 hover:bg-primary-600 hover:text-white"
                    }`}
                >
                  <ChevronLeft size={22} />
                </button>
              </div>
            )}
          </div>
        </div>

        <SidebarFilters
          isLoading={false}
          isMobileDrawer={true}
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          onFilterChange={handleFilterChange}
        />
      </div>
    </main>
  );
}
