"use client";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { getInitials } from "../../../utils";
import { useSaveToggle, useSavedPosts } from "../hooks";
import { Post } from "../type";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useCreateConversation, useConversationForPost } from "../../messages/hooks";


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

export const PostCard = ({
  post,
  isRecommended = false,
  onEdit,
  onDelete,
}: {
  post: Post;
  isRecommended?: boolean;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: number) => void;
}) => {
  const router = useRouter();
  const { data: savedPosts } = useSavedPosts();
  const { mutate: toggleSave } = useSaveToggle();
  const { data: currentUser } = useCurrentUser();
  const isOwnPost = post.userId === Number(currentUser?.user?.userId);
  const isSaved = savedPosts?.some((sp) => sp.postId === post.id) ?? false;

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSave({ postId: post.id, isSavedBefore: isSaved });
  };

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${post.userId}`);
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
      onClick={() => router.push(`/home/${post.id}`)}
      className={`relative flex flex-col p-5 md:p-6 rounded-xl transition-all duration-500 cursor-pointer overflow-hidden
      hover:[&_.identification-arrow]:-translate-x-1.25 hover:[&_.card-title]:text-primary-700
      ${
        isRecommended
          ? "bg-white border-2 border-secondary-400 shadow-[0_10px_35px_rgb(239,207,133,0.15)] hover:shadow-secondary-300/40"
          : "bg-neutral-50 shadow-sm hover:shadow-lg hover:border-primary-300"
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
        {!isOwnPost && (
          <button
            onClick={handleSave}
            className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm z-20 ${isSaved ? "bg-primary-600 text-white" : "bg-white text-primary-300 hover:text-primary-600 hover:shadow-md"}`}
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
        )}

        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(post);
            }}
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-all duration-300 shadow-sm border border-neutral-100 hover:shadow-md"
            title="تعديل المنشور"
          >
            <Edit3 size={16} />
          </button>
        )}

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(post.id);
            }}
            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white text-error-500 hover:bg-error-50 hover:text-error-600 transition-all duration-300 shadow-sm border border-neutral-100 hover:shadow-md"
            title="حذف المنشور"
          >
            <Trash2 size={16} />
          </button>
        )}
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

          <p className="text-primary-800/70 text-[13px] leading-relaxed line-clamp-2 pt-1">
            {post.description}
          </p>

          <div className="flex items-center gap-1 mt-2 text-primary-600 text-[11px] font-black transition-all duration-300 identification-arrow">
            <span>عرض التفاصيل الكاملة</span>
            <ChevronLeft size={14} />
          </div>
        </div>
      </div>

      {!isOwnPost && (
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
    </div>
  );
};
