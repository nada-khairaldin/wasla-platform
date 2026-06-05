"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { PersonFolder as PersonFolderType, ActiveChat } from "../chat.types";
import { PersonAvatar } from "./PersonAvatar";
import { ConversationItem } from "./ConversationItem";

type PersonFolderProps = {
  folder: PersonFolderType;
  activeChat: ActiveChat | null;
  onSelectRoom: (personId: string, roomId: string) => void;
  defaultOpen?: boolean;
};

export function PersonFolder({
  folder,
  activeChat,
  onSelectRoom,
  defaultOpen = false,
}: PersonFolderProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const totalUnread = folder.rooms.reduce((acc, r) => acc + r.unreadCount, 0);
  const isActiveFolder = activeChat?.personId === folder.personId;

  return (
    <div className="flex flex-col" >
      {/* Folder header (person row) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-3 px-3 py-3 rounded-xl w-full text-right transition-all  duration-200 hover:cursor-pointer ${
          isActiveFolder ? "bg-primary-100/50" : "hover:bg-neutral-50"
        }`}
      >
        {/* Avatar */}
        <PersonAvatar
          initials={folder.initials}
          colorClass={folder.avatarColor}
          size="md"
        />

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-neutral-900">{folder.personName}</p>
        </div>

        {/* Unread badge + room count + chevron */}
        <div className="flex items-center gap-2 shrink-0">
          {totalUnread > 0 && (
            <span className="text-[10px] font-bold bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center leading-none">
              {totalUnread}
            </span>
          )}
          <span className="text-[11px] text-neutral-400 font-medium">
            {folder.rooms.length} محادثات
          </span>
          {isOpen ? (
            <ChevronUp size={14} className="text-neutral-400" />
          ) : (
            <ChevronDown size={14} className="text-neutral-400" />
          )}
        </div>
      </button>

      {/* Room list (accordion body) */}
      {isOpen && (
        <div className="flex flex-col gap-1 pr-6 pl-2 pb-2 mt-1 border-r border-neutral-200 mr-5">
          {folder.rooms.map((room) => (
            <ConversationItem
              key={room.id}
              room={room}
              isActive={
                activeChat?.personId === folder.personId &&
                activeChat?.roomId === room.id
              }
              onSelect={(roomId) => onSelectRoom(folder.personId, roomId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}