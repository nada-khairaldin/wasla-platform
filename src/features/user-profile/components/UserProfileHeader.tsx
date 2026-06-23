import React from "react";
import { UserProfile } from "@/src/types";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { useCreateConversation } from "@/src/features/messages/hooks/useCreateConversation";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

interface UserProfileHeaderProps {
  profile: UserProfile["profile"];
  userId: number;
}

export default function UserProfileHeader({ profile, userId }: UserProfileHeaderProps) {
  const { name, username, bio, profilePicture } = profile;
  const { data: currentUser } = useCurrentUser();
  const createConversation = useCreateConversation();
  const router = useRouter();

  const isCurrentUser = currentUser?.user?.userId === userId;

  const handleMessageClick = async () => {
    try {
      const conversation = await createConversation.mutateAsync({ recipientId: userId });
      router.push(`/messages?conversationId=${conversation.id}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-neutral-100 p-4 sm:p-6 h-full flex flex-col justify-center" dir="rtl">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Avatar (right side) */}
        <div className="relative flex-shrink-0">
          {profilePicture ? (
            <img src={profilePicture} alt={name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
              {name?.charAt(0) || "م"}
            </div>
          )}
        </div>

        {/* Content (left side) */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0 text-right">
              <h1 className="text-lg sm:text-xl font-bold text-primary-500 truncate">{name}</h1>
              <p className="text-neutral-400 text-xs sm:text-sm truncate">@{username}</p>
            </div>
            {!isCurrentUser && (
              <button
                onClick={handleMessageClick}
                disabled={createConversation.isPending}
                className="shrink-0 flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-semibold hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{createConversation.isPending ? "جاري..." : "مراسلة"}</span>
              </button>
            )}
          </div>

          {/* Bio — hidden on very small, visible sm+ */}
          <div className="hidden sm:block mt-2">
            {bio ? (
              <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3">
                {bio}
              </p>
            ) : (
              <p className="text-neutral-400 text-sm leading-relaxed italic">
                لا توجد نبذة شخصية.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bio on mobile (below avatar row) */}
      <div className="sm:hidden mt-3">
        {bio ? (
          <p className="text-neutral-600 text-sm leading-relaxed">{bio}</p>
        ) : (
          <p className="text-neutral-400 text-xs leading-relaxed italic">
            لا توجد نبذة شخصية.
          </p>
        )}
      </div>
    </div>
  );
}
