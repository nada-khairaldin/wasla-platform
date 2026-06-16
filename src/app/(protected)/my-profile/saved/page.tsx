"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, Bookmark } from "lucide-react";
import Link from "next/link";
import { useSavedPosts } from "@/src/features/posts/hooks";
import { PostCard } from "@/src/features/posts/components/PostCard";
import { Skeleton } from "@/src/components/ui/Skeleton";

export default function SavedPostsPage() {
  const router = useRouter();
  const { data: savedPosts = [], isLoading, error } = useSavedPosts();

  return (
    <div className="min-h-screen bg-neutral-50 px-4 md:px-8 lg:px-16 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Header Block */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/my-profile")}
            className="w-10 h-10 rounded-full bg-white border border-neutral-100 flex items-center justify-center text-primary-500 hover:bg-neutral-50 hover:shadow-sm transition-all"
            title="رجوع للملف الشخصي"
          >
            <ArrowRight size={20} />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">المنشورات المحفوظة</h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">المنشورات والخدمات التي قمت بحفظها للرجوع إليها لاحقاً</p>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-neutral-200/80 rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-5 text-right relative"
              >
                {/* Top actions & badge placeholders */}
                <div className="flex justify-between items-center mb-1">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="w-16 h-7 rounded-b-xl" />
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-stretch md:items-start flex-1">
                  {/* User info */}
                  <div className="flex md:flex-col items-center gap-3 md:gap-2 pb-3 md:pb-0 border-b md:border-b-0 md:border-l pl-0 md:pl-4 border-neutral-100 text-right md:text-center shrink-0">
                    <Skeleton className="w-11 h-11 md:w-14 md:h-14 rounded-full" />
                    <div className="flex flex-col md:items-center gap-1.5 w-20">
                      <Skeleton className="h-3.5 w-full rounded" />
                      <Skeleton className="h-2.5 w-4/5 rounded" />
                    </div>
                  </div>

                  {/* Post details */}
                  <div className="flex-1 space-y-3 pt-1 md:pt-0">
                    <Skeleton className="h-6 w-3/4 rounded" />
                    
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-6 w-20 rounded-lg" />
                      <Skeleton className="h-6 w-16 rounded-lg" />
                      <Skeleton className="h-6 w-20 rounded-lg" />
                    </div>

                    {/* Description */}
                    <div className="space-y-2 pt-1">
                      <Skeleton className="h-3.5 w-full rounded" />
                      <Skeleton className="h-3.5 w-5/6 rounded" />
                    </div>

                    <Skeleton className="h-4 w-28 rounded mt-2" />
                  </div>
                </div>

                {/* Bottom button */}
                <div className="mt-5 md:mt-6 flex w-full md:w-auto md:justify-end">
                  <Skeleton className="w-full md:w-40 h-11 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-neutral-100 rounded-2xl text-center max-w-2xl mx-auto w-full">
            <p className="text-error-600 font-bold mb-2">عذراً، فشل تحميل المنشورات</p>
            <p className="text-neutral-400 text-sm mb-4">يرجى المحاولة مرة أخرى لاحقاً.</p>
          </div>
        ) : savedPosts.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white border border-neutral-100 rounded-2xl max-w-2xl mx-auto w-full mt-4">
            <div className="p-4 bg-neutral-50 rounded-full text-neutral-400 mb-4">
              <Bookmark size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-1">لا توجد منشورات محفوظة بعد</h3>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed max-w-sm">
              لم تقم بحفظ أي منشورات أو خدمات حتى الآن. تصفح الخدمات المتاحة وقم بحفظ ما يعجبك.
            </p>
            <Link
              href="/home"
              className="py-2.5 px-6 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 transition-all shadow-sm"
            >
              تصفح الخدمات
            </Link>
          </div>
        ) : (
          /* Grid of Saved Posts */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {savedPosts.map((saved) => (
              <PostCard key={saved.id} post={saved.post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
