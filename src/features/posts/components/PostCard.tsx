"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Clock, MapPin, Globe, ChevronLeft, Tag } from "lucide-react";
import { getInitials } from "../../../utils";

export interface Post {
  id: string;
  title: string;
  description: string;
  type: "طلب" | "عرض";
  category:
    | "البرمجة"
    | "التصميم"
    | "التسويق"
    | "إدارة الأعمال"
    | "كتابة المحتوى";
  hours?: number;
  isOnline: boolean;
  location?: string;
  isRecommended?: boolean;
  author: { id: string; name: string; image?: string; time: string };
}

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

export const PostCard = ({ post }: { post: Post }) => {
  const router = useRouter();
  const isRec = post.isRecommended;
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    console.log(`API Call: Save post ${post.id}`);
  };

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/profile/${post.author.id}`);
  };

  const goToChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/messages?post=${post.id}`);
  };

  return (
    <div
      onClick={() => router.push(`/home/${post.id}`)}
      className={`relative flex flex-col p-5 md:p-6 rounded-xl transition-all duration-500 cursor-pointer overflow-hidden
      hover:[&_.identification-arrow]:-translate-x-1.25 hover:[&_.card-title]:text-primary-700
      ${
        isRec
          ? "bg-white border-2 border-secondary-400 shadow-[0_10px_35px_rgb(239,207,133,0.15)] hover:shadow-secondary-300/40"
          : "bg-neutral-50 shadow-sm hover:shadow-lg hover:border-primary-300"
      }`}
    >
      <div className="absolute top-0 left-4 md:left-6">
        <div
          className={`px-4 md:px-5 py-2 rounded-b-xl md:rounded-b-2xl text-[12px] md:text-[13px] font-black font-cairo tracking-wide shadow-sm
          ${
            post.type === "طلب"
              ? "bg-white text-primary-500 border-x border-b border-primary-50"
              : "bg-primary-700 text-white border-x border-b border-primary-800"
          }`}
        >
          {post.type}
        </div>
      </div>

      <div className="flex justify-start mb-3 md:mb-4">
        <button
          onClick={handleSave}
          className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm z-20
            ${
              isSaved
                ? "bg-primary-600 text-white shadow-primary-200"
                : "bg-white text-primary-300 hover:text-primary-600 hover:shadow-md"
            }`}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-stretch md:items-start flex-1">
        <div
          onClick={goToProfile}
          className={`flex md:flex-col items-center gap-3 md:gap-2 pb-3 md:pb-0 border-b md:border-b-0 md:border-l pl-0 md:pl-4 hover:opacity-80 transition-opacity text-right md:text-center z-20
            ${isRec ? "border-secondary-100" : "border-primary-100"}`}
        >
          <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-primary-500 flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white font-black text-base md:text-lg">
              {getInitials(post.author.name)}
            </span>
          </div>

          <div className="flex flex-col md:items-center text-right md:text-center">
            <p className="text-[13px] md:text-[12px] font-black text-primary-900 leading-tight">
              {post.author.name}
            </p>
            <p className="text-[11px] md:text-[10px] text-primary-400 font-bold mt-0.5 whitespace-nowrap">
              {post.author.time}
            </p>
          </div>
        </div>

        <div className="flex-1 text-right space-y-3 pt-1 md:pt-0">
          {/* تم استبدال group-hover بـ كلاس مخصص يتحكم به السلايدر الخارجي بنقاء */}
          <h4 className="font-bold text-lg md:text-xl text-primary-900 leading-snug card-title transition-colors">
            {post.title}
          </h4>

          <div className="flex flex-wrap items-center gap-2">
            <Badge icon={Tag} text={post.category} />
            {post.hours && <Badge icon={Clock} text={`${post.hours} ساعة`} />}
            <Badge
              icon={post.isOnline ? Globe : MapPin}
              text={post.isOnline ? "عن بعد" : post.location || "ميداني"}
            />
          </div>

          <p className="text-primary-800/70 text-[13px] leading-relaxed line-clamp-2 pt-1">
            {post.description}
          </p>

          {/* تم استبدال group-hover بالـ identification-arrow التي تعزل حركتها داخل السلايدر */}
          <div className="flex items-center gap-1 mt-2 text-primary-600 text-[11px] font-black transition-all duration-300 identification-arrow">
            <span>عرض التفاصيل الكاملة</span>
            <ChevronLeft size={14} />
          </div>
        </div>
      </div>

      <div className="mt-5 md:mt-6 flex w-full md:w-auto md:justify-end z-20">
        <button
          onClick={goToChat}
          className={`w-full md:w-auto px-8 py-3.5 md:py-3 rounded-full text-sm font-bold transition-all active:scale-95 shadow-sm text-center
            ${
              isRec
                ? "bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200"
                : "bg-white text-primary-600 border border-primary-200 hover:bg-primary-50"
            }`}
        >
          {post.type === "طلب" ? "التواصل لتقديم عرضك" : "التواصل بخصوص العرض"}
        </button>
      </div>
    </div>
  );
};
