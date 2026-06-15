import type {
  ApiConversation,
  ApiMessage,
  PersonFolder,
  ChatRoom,
  Message,
} from "../chat.types";

const AVATAR_COLORS = [
  "bg-primary-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-teal-500",
];

function getInitialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`;
  }
  return name.slice(0, 2);
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  // Compare calendar days instead of raw milliseconds to avoid clock skew / timezone bugs
  const dStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const nStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diffDays = Math.round((nStart - dStart) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return date.toLocaleTimeString("ar-SA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) return "أمس";
  if (diffDays < 7) {
    return date.toLocaleDateString("ar-SA", { weekday: "long" });
  }
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}


/**
 * Transform a flat list of API conversations into PersonFolder[] grouped by the other participant.
 */
export function transformToPersonFolders(
  conversations: ApiConversation[],
  currentUserId: number
): PersonFolder[] {
  // Group conversations by the other person
  const personMap = new Map<
    number,
    { user: ApiConversation["participants"][0]["user"]; rooms: ChatRoom[] }
  >();

  conversations.forEach((conv) => {
    // Find the other participant (not the current user)
    const otherParticipant = conv.participants.find(
      (p) => p.userId !== currentUserId
    );

    if (!otherParticipant) return;

    const otherUser = otherParticipant.user;
    const existing = personMap.get(otherUser.id);

    const isUserOnline = otherUser.is_online ?? false;

    const room: ChatRoom = {
      id: String(conv.id),
      postTitle: conv.post?.title || "محادثة",
      lastMessage: conv.lastMessage?.body || "لا توجد رسائل بعد",
      lastMessageTime: conv.lastMessage
        ? formatTime(conv.lastMessage.createdAt)
        : formatTime(conv.createdAt),
      status: isUserOnline ? "online" : "offline",
      unreadCount: conv.unreadCount,
      messages: [], // Messages are loaded separately per conversation
      postId: conv.postId,
    };

    if (existing) {
      existing.rooms.push(room);
    } else {
      personMap.set(otherUser.id, {
        user: otherUser,
        rooms: [room],
      });
    }
  });

  // Convert map to PersonFolder[]
  const folders: PersonFolder[] = [];
  let colorIdx = 0;

  personMap.forEach(({ user, rooms }, userId) => {
    const isUserOnline = user.is_online ?? false;

    folders.push({
      personId: String(userId),
      personName: user.full_name || user.username,
      initials: getInitialsFromName(user.full_name || user.username),
      avatarColor: AVATAR_COLORS[colorIdx % AVATAR_COLORS.length],
      isOnline: isUserOnline,
      rooms,
    });
    colorIdx++;
  });


  return folders;
}

/**
 * Transform API messages into the UI Message format.
 */
export function transformMessages(
  apiMessages: ApiMessage[],
  currentUserId: number,
  isOtherUserOnline?: boolean
): Message[] {
  return apiMessages
    .filter((m) => !m.deletedAt) // Skip soft-deleted messages
    .map((m) => {
      const isFailed = String(m.id).startsWith("failed-");
      const isOptimistic = String(m.id).startsWith("optimistic-");

      // Determine status: priority is failed > optimistic > API status > fallbacks
      let status: "sent" | "delivered" | "read" | "error";

      if (isFailed) {
        status = "error";
      } else if (isOptimistic) {
        status = "sent";
      } else if (m.status) {
        // Use backend status as the primary source of truth
        switch (m.status) {
          case "READ":
            status = "read";
            break;
          case "DELIVERED":
            status = "delivered";
            break;
          case "SENT":
          default:
            status = "sent";
            break;
        }
      } else {
        // Fallback for messages without a status field (legacy)
        const hasBeenReadByOther =
          m.readBy && m.readBy.some((r) => r.userId !== currentUserId);
        if (hasBeenReadByOther) {
          status = "read";
        } else if (isOtherUserOnline) {
          status = "delivered";
        } else {
          status = "sent";
        }
      }

      return {
        id: m.id,
        sender: m.senderId === currentUserId ? "me" : "other",
        text: m.body || "",
        timestamp: formatMessageTime(m.createdAt),
        createdAt: m.createdAt,
        status,
        editedAt: m.editedAt,
      };
    });
}



