import { memo } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Globe, Clock, Tag, ChevronLeft } from "lucide-react";
import { Post } from "../../posts/type";
import { getInitials } from "../../../utils";

const Badge = ({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string | number;
}) => (
  <div className="flex items-center gap-1 text-primary-700 bg-primary-50/80 px-1.5 py-0.5 rounded border border-primary-100/50 transition-colors">
    <Icon size={10} className="text-primary-500 shrink-0" />
    <span className="text-[9px] font-bold font-cairo whitespace-nowrap">
      {text}
    </span>
  </div>
);

const PostResultCardComponent = ({
  post,
  onNavigate,
}: {
  post: Post;
  onNavigate?: () => void;
}) => {
  const router = useRouter();
  const isRequest = post.category === "REQUEST";
  const postTypeLabel = isRequest ? "طلب" : "عرض";
  const serviceModeLabel = post.serviceMode === "ONLINE" ? "عن بعد" : "ميداني";

  const handleClick = () => {
    onNavigate?.();
    router.push(`/home/${post.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col p-5 rounded-2xl bg-white border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-primary-200 transition-all cursor-pointer group text-right"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">
              {getInitials(post.user?.username || "م")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-primary-900 leading-tight">
              {post.user?.username || "مستخدم وصلة"}
            </span>
            <span className="text-[10px] text-primary-400 mt-0.5">
              {new Date(post.createdAt).toLocaleDateString("ar-EG")}
            </span>
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
            isRequest
              ? "bg-primary-50 text-primary-600"
              : "bg-primary-600 text-white"
          }`}
        >
          {postTypeLabel}
        </div>
      </div>

      <h4 className="font-bold text-[15px] text-neutral-900 mb-2.5 group-hover:text-primary-600 transition-colors line-clamp-1">
        {post.title}
      </h4>

      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <Badge icon={Tag} text={isRequest ? "طلب خدمة" : "عرض خدمة"} />
        {post.assignedTimeCredits && (
          <Badge icon={Clock} text={`${post.assignedTimeCredits} ساعة`} />
        )}
        <Badge
          icon={post.serviceMode === "ONLINE" ? Globe : MapPin}
          text={serviceModeLabel}
        />
      </div>

      <p className="text-neutral-400 text-[11px] leading-relaxed line-clamp-2 mb-4 font-medium">
        {post.description}
      </p>

      <div className="mt-auto flex items-center justify-end text-primary-500 text-[11px] font-bold group-hover:text-primary-600 transition-colors">
        <span>عرض التفاصيل</span>
        <ChevronLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />
      </div>
    </div>
  );
};

export const PostResultCard = memo(PostResultCardComponent);
PostResultCard.displayName = "PostResultCard";
