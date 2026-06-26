"use client";

import { useRouter, useParams } from "next/navigation";
import {
  ArrowRight,
  Clock,
  Layers,
  Monitor,
  Bookmark,
  MessageCircle,
  Star,
  ArrowLeft,
} from "lucide-react";
import Button from "@/src/components/ui/Button";
import DetailItem from "@/src/features/posts/components/DetailItem";
import {
  usePost,
  useSaveToggle,
  useSavedPosts,
} from "@/src/features/posts/hooks";
import { Skeleton } from "../../../../components/ui/Skeleton";
import { useCreateConversation, useConversationForPost } from "@/src/features/messages/hooks";
import { useUserActions } from "@/src/hooks/useUserActions";

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params?.id);

  const { data: post, isLoading: isPostLoading, error } = usePost(postId);
  const { data: savedPosts } = useSavedPosts();
  const { mutate: toggleSave } = useSaveToggle();
  const { mutate: toggleSave } = useSaveToggle();
  const { navigateToProfile, isSelf, canMessage } = useUserActions(post?.userId);
  const isSaved = savedPosts?.some((sp) => sp.postId === postId) ?? false;
  const { hasConversation, conversationId } = useConversationForPost(postId);
  const createConversation = useCreateConversation();

  const handleSave = () => {
    if (!postId) return;
    toggleSave({ postId, isSavedBefore: isSaved });
  };

  const handleContact = async () => {
    if (hasConversation && conversationId) {
      router.push(`/messages?conversationId=${conversationId}`);
    } else {
      try {
        const conversation = await createConversation.mutateAsync(postId);
        router.push(`/messages?conversationId=${conversation.id}`);
      } catch {
        // Handle error silently
      }
    }
  };

  if (isPostLoading) {
    return (
      <main className="min-h-screen bg-white font-cairo pb-20" dir="rtl">
        <section className="bg-primary-700 text-white pt-8 pb-16 px-4 md:px-10 rounded-b-[40px] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-800/30 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

          <div className="max-w-[1200px] mx-auto relative z-10">
            <div className="flex items-center justify-between mb-10">
              <Skeleton className="w-11 h-11 rounded-full !bg-white/10 border border-white/10" />
              <Skeleton className="w-11 h-11 rounded-full !bg-white/10 border border-white/10" />
            </div>
            <Skeleton className="h-6 w-24 rounded-lg !bg-white/10 mb-4" />

            <div className="space-y-3 max-w-[900px]">
              <Skeleton className="h-9 w-3/4 rounded-xl !bg-white/20" />
              <Skeleton className="h-9 w-1/2 rounded-xl !bg-white/20" />
            </div>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-4 md:px-10 -mt-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[24px] border border-neutral-100 shadow-xl shadow-neutral-100/40 space-y-5">
              <div className="flex items-center gap-2 border-b border-neutral-50 pb-3">
                <div className="w-1 h-5 bg-primary-600 rounded-full" />
                <Skeleton className="h-6 w-36 rounded-md" />
              </div>

              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="bg-neutral-50 p-6 rounded-[24px] border border-neutral-200/40 space-y-4">
                <Skeleton className="h-4 w-48 rounded-md" />
                <div className="flex gap-3 flex-wrap">
                  <Skeleton className="h-14 flex-1 min-w-[110px] rounded-xl" />
                  <Skeleton className="h-14 flex-1 min-w-[110px] rounded-xl" />
                  <Skeleton className="h-14 flex-1 min-w-[110px] rounded-xl" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-md shadow-neutral-100/20 space-y-4">
                <Skeleton className="h-4 w-20 rounded-md" />

                <div className="flex items-center justify-between bg-neutral-50/60 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 rounded-md" />
                    </div>
                  </div>
                  <Skeleton className="w-12 h-6 rounded-lg" />
                </div>
              </div>
              <Skeleton className="w-full h-14 rounded-xl" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-cairo bg-white">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">
          تعذر العثور على المنشور
        </h2>
        <p className="text-neutral-500 mb-6">
          قد يكون المنشور قد تم حذفه أو أن الرابط غير صحيح.
        </p>
        <Button
          onClick={() => router.push("/home")}
          variant="filled"
          className="px-6 py-3 rounded-xl font-bold"
        >
          العودة للرئيسية
        </Button>
      </div>
    );
  }

  const isRequest = post.category === "REQUEST";
  const postTypeLabel = isRequest ? "طلب خدمة" : "عرض خدمة";
  const serviceModeLabel = post.serviceMode === "ONLINE" ? "عن بعد" : "ميداني";

  return (
    <main className="min-h-screen bg-white font-cairo pb-20" dir="rtl">
      <section className="bg-primary-700 text-white pt-8 pb-16 px-4 md:px-10 rounded-b-[40px] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-800/30 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex items-center justify-between mb-10">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-5 py-2.5 text-xs md:text-sm font-bold text-white hover:bg-white/15 transition-all active:scale-95 shadow-sm"
            >
              <ArrowRight size={16} />
            </button>
            {isSelf && (
              <button
                onClick={handleSave}
                className={`w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 border backdrop-blur-sm shadow-sm active:scale-90
                ${
                  isSaved
                    ? "bg-secondary-400 border-secondary-400 text-primary-900"
                    : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
              </button>
            )}
          </div>

          <span className="inline-block px-3 py-1 bg-secondary-400/20 text-secondary-300 border border-secondary-400/20 rounded-lg text-xs font-black tracking-wide mb-4">
            {postTypeLabel}
          </span>

          <h1 className="text-2xl md:text-4xl font-black text-white leading-snug tracking-tight max-w-[900px]">
            {post.title}
          </h1>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 md:px-10 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[24px] border border-neutral-100 shadow-xl shadow-neutral-100/40 space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-50 pb-3">
              <div className="w-1 h-5 bg-primary-600 rounded-full" />
              <h3 className="font-bold text-neutral-800 text-base md:text-lg">
                وصف الخدمة بالتفصيل
              </h3>
            </div>

            <p className="text-neutral-600 text-sm md:text-base leading-relaxed font-medium whitespace-pre-line text-justify">
              {post.description}
            </p>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-50 p-6 rounded-[24px] border border-neutral-200/40 space-y-4">
              <h3 className="font-bold text-neutral-800 text-sm">
                محددات الخدمة الزمنية والميدانية
              </h3>
              <div className="flex gap-3 flex-wrap">
                {post.assignedTimeCredits && (
                  <DetailItem
                    icon={<Clock size={18} className="text-primary-600" />}
                    label="الوقت المتوقع"
                    value={`${post.assignedTimeCredits} ساعة`}
                  />
                )}
                <DetailItem
                  icon={<Layers size={18} className="text-primary-600" />}
                  label="المجال الرئيسي"
                  value={postTypeLabel}
                />
                <DetailItem
                  icon={<Monitor size={18} className="text-primary-600" />}
                  label="طريقة تقديمها"
                  value={serviceModeLabel}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-[24px] border border-neutral-100 shadow-md shadow-neutral-100/20 space-y-4">
              <h3 className="font-bold text-neutral-400 text-xs tracking-wider">
                مقدم الخدمة
              </h3>

              <div
                onClick={() => navigateToProfile()}
                className="flex items-center justify-between bg-neutral-50/60 p-3.5 rounded-2xl cursor-pointer hover:bg-neutral-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-900 text-white font-black flex items-center justify-center text-lg shadow-sm transition-transform duration-300 group-hover:scale-105">
                    {(post.user?.username?.[0] || "م").toUpperCase()}
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-black text-primary-900 text-base group-hover:text-primary-600 transition-colors">
                      {post.user?.username || "مستخدم وصلة"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg border border-amber-100 shadow-inner">
                  <Star size={13} fill="currentColor" />
                  <span className="text-xs font-black font-cairo">9.5</span>
                </div>
              </div>
            </div>

            {canMessage && (
              <Button
                onClick={handleContact}
                disabled={createConversation.isPending}
                variant="filled"
                className={`w-full py-4 rounded-xl font-bold text-base shadow-xl flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform disabled:opacity-60 ${
                  hasConversation
                    ? "!bg-emerald-600 shadow-emerald-500/20 hover:!bg-emerald-700"
                    : "shadow-primary-500/20"
                }`}
              >
                {createConversation.isPending ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : hasConversation ? (
                  <>
                    <MessageCircle size={18} />
                    <span>الانتقال إلى المحادثة</span>
                    <ArrowLeft size={16} />
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} />
                    <span>تواصل الآن لإنشاء العقد</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
