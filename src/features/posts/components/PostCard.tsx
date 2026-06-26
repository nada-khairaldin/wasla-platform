"use client";
import { useRouter, usePathname } from "next/navigation";
import { memo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Bookmark,
  Clock,
  MapPin,
  Globe,
  ChevronLeft,
  Tag,
  Edit3,
  Trash2,
  MessageSquare,
  ArrowLeft,
  Archive,
  RotateCcw,
  MoreVertical,
} from "lucide-react";
import { getInitials } from "../../../utils";
import { useSaveToggle, useSavedPosts } from "../hooks";
import { Post } from "../type";
import { useCreateConversation, useConversationForPost } from "../../messages/hooks";
import { useUserActions } from "../../../hooks/useUserActions";


const Badge = ({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string | number;
}) => (
  <div className="flex items-center gap-1.5 text-primary-700 bg-primary-100/40 px-2.5 py-1 rounded-lg border border-primary-100 transition-colors">
    <Icon size={13} className="text-primary-600 shrink-0" />
    <span className="text-[11px] font-black font-cairo whitespace-nowrap">
      {text}
    </span>
  </div>
);

const PostCardComponent = ({
  post,
  isRecommended = false,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
}: {
  post: Post;
  isRecommended?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: number) => void;
  onArchive?: (postId: number) => void;
  onRestore?: (postId: number) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: savedPosts } = useSavedPosts();
  const { mutate: toggleSave } = useSaveToggle();
  const { navigateToProfile, isSelf, canMessage, isLoading: isUserLoading } = useUserActions(post.userId || post.user?.id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isMobileMenuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isSaved = savedPosts?.some((sp) => sp.postId === post.id) ?? false;
  const isMyPostsView = pathname === "/my-posts" || pathname?.startsWith("/my-posts/");
  const isHomeView = pathname === "/home" || pathname?.startsWith("/home");

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave({ postId: post.id, isSavedBefore: isSaved });
  };


  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateToProfile();
  };

  const { hasConversation, conversationId } = useConversationForPost(post.id);
  const createConversation = useCreateConversation();

  const goToChat = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasConversation && conversationId) {
      router.push(`/messages?conversationId=${conversationId}`);
    } else {
      try {
        const conversation = await createConversation.mutateAsync(post.id);
        router.push(`/messages?conversationId=${conversation.id}`);
      } catch {
        // Silently handle — the mutation error state can be used for UI feedback
      }
    }
  };

  const isRequest = post.category === "REQUEST";
  const postTypeLabel = isRequest ? "طلب" : "عرض";
  const serviceModeLabel = post.serviceMode === "ONLINE" ? "عن بعد" : "ميداني";
  const formattedDate = new Date(post.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      onClick={() => {
        if (post.status === "DRAFT") {
          if (onEdit) onEdit(post);
          return;
        }
        router.push(`/home/${post.id}`);
      }}
      className={`relative flex flex-col p-5 md:p-6 rounded-xl transition-all duration-500 cursor-pointer
      hover:[&_.identification-arrow]:-translate-x-1.25 hover:[&_.card-title]:text-primary-700
      ${(isSaved || isRecommended || isMyPostsView) ? "bg-white" : "bg-neutral-50"} ${
        isRecommended
          ? "border-2 border-secondary-400 shadow-[0_10px_35px_rgb(239,207,133,0.15)] hover:shadow-secondary-300/40"
          : isHomeView
          ? "border border-transparent shadow-sm hover:shadow-lg hover:border-primary-300"
          : "border border-neutral-200/80 shadow-sm hover:shadow-lg hover:border-primary-300"
      }`}
    >
      <div className="absolute top-0 left-4 md:left-6">
        <div
          className={`px-4 md:px-5 py-2 rounded-b-xl md:rounded-b-2xl text-[12px] md:text-[13px] font-black font-cairo tracking-wide shadow-sm
          ${
            isRequest
              ? "bg-white text-primary-500 border-x border-b border-primary-50"
              : "bg-primary-700 text-white border-x border-b border-primary-800"
          }`}
        >
          {postTypeLabel}
        </div>
      </div>

      <div className="flex gap-sm items-center mb-4 md:mb-5">
        {/* Mobile menu trigger */}
        <div className="flex md:hidden relative z-20">
           <button 
             onClick={(e) => { 
               e.stopPropagation(); 
               setIsMobileMenuOpen(true); 
             }} 
             className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm border border-neutral-100"
           >
             <MoreVertical size={18} />
           </button>
        </div>

        {/* Desktop inline actions */}
        <div className="hidden md:flex gap-sm items-center">
          {!isSelf && !isUserLoading && (
            <button
              onClick={handleSave}
              className={`group relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm z-20 ${isSaved ? "bg-primary-600 text-white" : "bg-white text-primary-300 hover:text-primary-600 hover:shadow-md"}`}
            >
              <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-white text-[10px] font-cairo rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] pointer-events-none">
                {isSaved ? "إلغاء الحفظ" : "حفظ المنشور"}
              </span>
            </button>
          )}

          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(post);
              }}
              className="group relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-all duration-300 shadow-sm border border-neutral-100 hover:shadow-md z-20"
            >
              <Edit3 size={16} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-white text-[10px] font-cairo rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] pointer-events-none">
                تعديل المنشور
              </span>
            </button>
          )}

          {onArchive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive(post.id);
              }}
              className="group relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition-all duration-300 shadow-sm border border-neutral-100 hover:shadow-md z-20"
            >
              <Archive size={16} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-white text-[10px] font-cairo rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] pointer-events-none">
                أرشفة المنشور
              </span>
            </button>
          )}

          {onRestore && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRestore(post.id);
              }}
              className="group relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300 shadow-sm border border-neutral-100 hover:shadow-md z-20"
            >
              <RotateCcw size={16} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-white text-[10px] font-cairo rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] pointer-events-none">
                إعادة نشر المنشور
              </span>
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(post.id);
              }}
              className="group relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white text-error-500 hover:bg-error-50 hover:text-error-600 transition-all duration-300 shadow-sm border border-neutral-100 hover:shadow-md z-20"
            >
              <Trash2 size={16} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-800 text-white text-[10px] font-cairo rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[100] pointer-events-none">
                حذف المنشور
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-stretch md:items-start flex-1">
        <div
          onClick={goToProfile}
          className={`flex md:flex-col items-center gap-3 md:gap-2 pb-3 md:pb-0 border-b md:border-b-0 md:border-l pl-0 md:pl-4 hover:opacity-80 transition-opacity text-right md:text-center z-20
            ${isRecommended ? "border-secondary-100" : "border-primary-100"}`}
        >
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-primary-500 flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white font-black text-base md:text-lg">
              {getInitials(post.user?.username || "م")}
            </span>
          </div>

          <div className="flex flex-col md:items-center text-right md:text-center">
            <p className="text-[13px] md:text-[12px] font-black text-primary-900 leading-tight">
              {post.user?.username || "مستخدم وصلة"}
            </p>
            <p className="text-[11px] md:text-[10px] text-primary-400 font-bold mt-0.5 whitespace-nowrap">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex-1 text-right space-y-3 pt-1 md:pt-0">
          <h4 className="font-bold text-lg md:text-xl text-primary-900 leading-snug card-title transition-colors">
            {post.title}
          </h4>

          <div className="flex flex-wrap items-center gap-2">
            <Badge icon={Tag} text={isRequest ? "طلب خدمة" : "عرض خدمة"} />
            {post.assignedTimeCredits && (
              <Badge icon={Clock} text={`${post.assignedTimeCredits} ساعة`} />
            )}
            <Badge
              icon={post.serviceMode === "ONLINE" ? Globe : MapPin}
              text={serviceModeLabel}
            />
          </div>

          <p className="text-primary-800/70 text-[13px] leading-relaxed line-clamp-2 break-words pt-1">
            {post.description}
          </p>

          <div className="flex items-center gap-1 mt-2 text-primary-600 text-[11px] font-black transition-all duration-300 identification-arrow">
            <span>عرض التفاصيل الكاملة</span>
            <ChevronLeft size={14} />
          </div>
        </div>
      </div>

      {canMessage && (
        <div className="mt-5 md:mt-6 flex w-full md:w-auto md:justify-end z-20">
          <button
            onClick={goToChat}
            disabled={createConversation.isPending}
            className={`w-full md:w-auto px-8 py-3.5 md:py-3 rounded-full text-sm font-bold transition-all active:scale-95 shadow-sm text-center flex items-center justify-center gap-2 disabled:opacity-60
              ${
                hasConversation
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                  : isRecommended
                    ? "bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200"
                    : "bg-white text-primary-600 border border-primary-200 hover:bg-primary-50"
              }`}
          >
            {createConversation.isPending ? (
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : hasConversation ? (
              <>
                <MessageSquare size={15} />
                <span>الانتقال إلى المحادثة</span>
                <ArrowLeft size={14} />
              </>
            ) : (
              <>{isRequest ? "التواصل لتقديم عرضك" : "التواصل بخصوص العرض"}</>
            )}
          </button>
        </div>
      )}

      {mounted && isMobileMenuOpen && typeof window !== "undefined" && createPortal(
        <div 
          className="md:hidden fixed inset-0 z-[99999] bg-neutral-900/40 backdrop-blur-sm animate-in fade-in flex items-end" 
          onClick={(e) => { 
            e.stopPropagation(); 
            setIsMobileMenuOpen(false); 
          }}
          dir="rtl"
        >
          <div 
            className="bg-white w-full rounded-t-3xl p-5 space-y-2 animate-in slide-in-from-bottom-full duration-300 shadow-2xl pb-safe" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-5" />
            
            {!isSelf && !isUserLoading && (
              <button 
                onClick={(e) => { setIsMobileMenuOpen(false); handleSave(e); }} 
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-right"
              >
                <div className={`p-2 rounded-lg ${isSaved ? "bg-primary-50 text-primary-600" : "bg-neutral-100 text-neutral-500"}`}>
                  <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                </div>
                <span className={`font-bold font-cairo text-base ${isSaved ? "text-primary-700" : "text-neutral-700"}`}>
                  {isSaved ? "إلغاء الحفظ" : "حفظ المنشور"}
                </span>
              </button>
            )}
            
            {onEdit && (
              <button 
                onClick={(e) => { setIsMobileMenuOpen(false); e.stopPropagation(); onEdit(post); }} 
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-right"
              >
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <Edit3 size={20} />
                </div>
                <span className="font-bold font-cairo text-base text-neutral-700">تعديل المنشور</span>
              </button>
            )}
            
            {onArchive && (
              <button 
                onClick={(e) => { setIsMobileMenuOpen(false); e.stopPropagation(); onArchive(post.id); }} 
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-right"
              >
                <div className="p-2 rounded-lg bg-neutral-100 text-neutral-600">
                  <Archive size={20} />
                </div>
                <span className="font-bold font-cairo text-base text-neutral-700">أرشفة المنشور</span>
              </button>
            )}
            
            {onRestore && (
              <button 
                onClick={(e) => { setIsMobileMenuOpen(false); e.stopPropagation(); onRestore(post.id); }} 
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-right"
              >
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <RotateCcw size={20} />
                </div>
                <span className="font-bold font-cairo text-base text-emerald-700">إعادة نشر المنشور</span>
              </button>
            )}

            {onDelete && (
              <button 
                onClick={(e) => { setIsMobileMenuOpen(false); e.stopPropagation(); onDelete(post.id); }} 
                className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-right"
              >
                <div className="p-2 rounded-lg bg-error-50 text-error-600">
                  <Trash2 size={20} />
                </div>
                <span className="font-bold font-cairo text-base text-error-600">حذف المنشور</span>
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export const PostCard = memo(PostCardComponent);
PostCard.displayName = "PostCard";
