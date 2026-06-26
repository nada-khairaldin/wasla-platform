import { memo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SearchUser } from "../types/search.types";
import { getInitials } from "../../../utils";
import { MapPin, Star, Activity, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { useCreateConversation } from "../../messages/hooks/useCreateConversation";
import { useProfileNavigation } from "../../../hooks/useProfileNavigation";
import { useUserActions } from "../../../hooks/useUserActions";

const UserCardComponent = ({
  user,
  query = "",
  skillType = "",
  onNavigate,
}: {
  user: SearchUser;
  query?: string;
  skillType?: string;
  onNavigate?: () => void;
}) => {
  const router = useRouter();
  const createConversation = useCreateConversation();
  const { navigateToProfile, isSelf, canMessage } = useUserActions(user.id);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate?.();
    navigateToProfile();
  };

  const handleMessageClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const conv = await createConversation.mutateAsync({ recipientId: user.id });
      onNavigate?.();
      router.push(`/messages?conversationId=${conv.id}`);
    } catch (err) {
      console.error("Failed to start conversation:", err);
    }
  };

  let isProvider = true;
  if (skillType === "REQUEST") {
    isProvider = false;
  } else if (skillType === "OFFER") {
    isProvider = true;
  } else {
    if (query) {
      const q = query.toLowerCase();
      const matchesOffer = user.offeredSkills?.some(s => s.toLowerCase().includes(q));
      const matchesRequest = user.requestedSkills?.some(s => s.toLowerCase().includes(q));
      if (matchesRequest && !matchesOffer) {
        isProvider = false;
      } else if (matchesOffer) {
        isProvider = true;
      } else {
        isProvider = !!(user.offeredSkills && user.offeredSkills.length > 0);
      }
    } else {
      isProvider = !!(user.offeredSkills && user.offeredSkills.length > 0);
    }
  }

  const hasMetaInfo = user.location || user.trustRating || user.stats;

  return (
    <div
      onClick={handleProfileClick}
      className="flex flex-col p-4 md:p-5 rounded-[16px] bg-white border border-neutral-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all cursor-pointer group text-right relative overflow-hidden"
    >
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          {user.profile_image ? (
            <Image
              src={user.profile_image}
              alt={user.username}
              width={56}
              height={56}
              unoptimized
              className="w-14 h-14 rounded-full object-cover border border-neutral-100"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center border border-primary-100">
              <span className="text-primary-600 font-bold text-lg">
                {getInitials(user.full_name || user.username)}
              </span>
            </div>
          )}
          {user.isOnline && (
            <div className="absolute bottom-0 right-0.5 w-3.5 h-3.5 bg-green-500 border-[2.5px] border-white rounded-full shadow-sm" />
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <h4 className="font-bold text-[16px] text-neutral-900 group-hover:text-primary-700 transition-colors truncate">
                {user.full_name || user.username}
              </h4>
              <span className="text-[12px] text-neutral-500 truncate mt-0.5 font-medium">
                @{user.username}
              </span>
            </div>
            
            <div className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold border ${
              isProvider 
                ? "bg-primary-50 text-primary-700 border-primary-200 shadow-sm" 
                : "bg-secondary-50 text-secondary-800 border-secondary-200 shadow-sm"
            }`}>
              {isProvider ? "مقدم خدمة" : "طالب خدمة"}
            </div>
          </div>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="mb-4 text-[13px] text-neutral-600 leading-relaxed line-clamp-2">
          {user.bio}
        </p>
      )}

      {/* Meta Info */}
      {hasMetaInfo && (
        <div className="flex flex-wrap items-center gap-3 mb-4 bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-100/80">
          {user.location && (
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 font-bold">
              <MapPin size={12} className="text-neutral-400" />
              <span className="truncate max-w-[100px]">{user.location}</span>
            </div>
          )}
          {user.trustRating && (
            <>
              {user.location && <div className="w-1 h-1 rounded-full bg-neutral-300" />}
              <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-bold">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                <span>{user.trustRating.average.toFixed(1)}</span>
                <span className="text-neutral-400 font-medium">({user.trustRating.count})</span>
              </div>
            </>
          )}
          {user.stats && (
            <>
              {(user.location || user.trustRating) && <div className="w-1 h-1 rounded-full bg-neutral-300" />}
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 font-bold">
                <Activity size={12} className="text-primary-400" />
                <span>{user.stats.servicesProvided + user.stats.servicesReceived} خدمة</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Skills */}
      {user.offeredSkills && user.offeredSkills.length > 0 && (
        <div className="mb-5">
          <div className="flex flex-wrap gap-2">
            {user.offeredSkills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] bg-neutral-100 text-neutral-700 border border-neutral-200/60 px-2.5 py-1 rounded-lg font-bold"
              >
                {skill}
              </span>
            ))}
            {user.offeredSkills.length > 4 && (
              <span className="text-[11px] bg-neutral-50 text-neutral-500 border border-neutral-200/50 px-2 py-1 rounded-lg font-bold">
                +{user.offeredSkills.length - 4} المزيد
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-auto pt-4 border-t border-neutral-100/80 flex items-center gap-3">
        <button
          onClick={handleProfileClick}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-[12px] font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] outline-none focus:outline-none"
        >
          <span>عرض الملف</span>
          <ExternalLink size={14} />
        </button>
        {canMessage && (
          <button
            onClick={handleMessageClick}
            disabled={createConversation.isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[12px] font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] outline-none focus:outline-none disabled:opacity-70 disabled:hover:scale-100 disabled:active:scale-100"
          >
            {createConversation.isPending ? (
              <>
                <span>جاري...</span>
                <Loader2 size={14} className="animate-spin" />
              </>
            ) : (
              <>
                <span>مراسلة</span>
                <MessageCircle size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export const UserCard = memo(UserCardComponent);
UserCard.displayName = "UserCard";
