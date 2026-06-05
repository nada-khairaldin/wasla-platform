import type { ChatRoom, RoomStatus } from "../chat.types";

type ConversationItemProps = {
  room: ChatRoom;
  isActive: boolean;
  onSelect: (roomId: string) => void;
};

const statusDot: Record<RoomStatus, { color: string; label: string }> = {
  online: { color: "bg-success-500", label: "نشط" },
  offline: { color: "bg-neutral-400", label: "غير نشط" },
};

export function ConversationItem({
  room,
  isActive,
  onSelect,
}: ConversationItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(room.id)}
      className={`w-full mt-xxs text-right px-3 py-3 rounded-xl transition-all duration-200 flex flex-col gap-1 hover:cursor-pointer${
        isActive ? " bg-primary-50" : " hover:bg-neutral-50"
      }`}
    >
      {/* Title row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-neutral-900 truncate flex-1">
          {room.postTitle}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`w-2 h-2 rounded-full ${statusDot[room.status].color}`}
          />
          <span className="text-[10px] font-medium text-neutral-500">
            {statusDot[room.status].label}
          </span>
        </div>
      </div>

      {/* Last message preview */}
      <p className="text-xs text-neutral-500 truncate">{room.lastMessage}</p>

      {/* Time + unread badge */}
      <div className="flex items-center justify-between gap-2 mt-0.5">
        <span className="text-[10px] text-neutral-400">
          {room.lastMessageTime}
        </span>
        {room.unreadCount > 0 && (
          <span className="text-[10px] font-bold bg-primary-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
            {room.unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}
