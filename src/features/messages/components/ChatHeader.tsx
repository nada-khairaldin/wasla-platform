import { ChevronRight, FilePlus } from "lucide-react";
import type { PersonFolder, ChatRoom } from "../chat.types";
import { PersonAvatar } from "./PersonAvatar";

type ChatHeaderProps = {
  person: PersonFolder;
  room: ChatRoom;
  onBack?: () => void;
  onCreateContract?: () => void;
};

export function ChatHeader({
  person,
  room,
  onBack,
  onCreateContract,
}: ChatHeaderProps) {
  return (
    <div className="relative z-10 flex items-center justify-between px-4 md:px-xl py-3.5 md:py-sm bg-white border-b border-neutral-50 shrink-0 text-right w-full">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        {/* Back button (visible only on mobile) */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center p-1.5 -mr-1 text-primary-500 hover:bg-neutral-50 rounded-xl md:hidden transition-all shrink-0"
        >
          <ChevronRight size={22} strokeWidth={2.5} />
        </button>

        {/* User avatar */}
        <div className="shrink-0">
          <PersonAvatar
            initials={person.initials}
            colorClass={person.avatarColor}
            size="md"
          />
        </div>

        {/* Post title and user name */}
        <div className="flex flex-col items-start min-w-0 pr-1 text-right">
          <h3 className="text-xs md:text-sm font-bold text-neutral-900 truncate w-full max-w-[140px] sm:max-w-[220px] md:max-w-none">
            {room.postTitle}
          </h3>
          <p className="text-[10px] md:text-xs font-medium text-neutral-400 truncate w-full mt-0.5">
            {person.personName}
          </p>
        </div>
      </div>

      {/* Contract creation button */}
      <div className="shrink-0">
<button
  type="button"
  onClick={onCreateContract}
  className="flex items-center justify-center gap-1.5 md:gap-2 px-3 py-2 md:px-base md:py-[15px] 
             rounded-full  border border-neutral-200
             bg-primary-50 text-neutral-600 font-bold text-[11px] md:text-xs 
             shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] 
             hover:bg-primary-500 hover:text-white hover:border-primary-500 hover:cursor-pointer
             active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] 
             active:scale-[0.98] transition-all shrink-0 c"
>
  <FilePlus className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" strokeWidth={2.5} />
  <span className="hidden sm:inline">إنشاء عقد خدمة</span>
  <span className="inline sm:hidden">إنشاء عقد</span>
</button>
      </div>
    </div>
  );
}
