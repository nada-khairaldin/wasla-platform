import { Skeleton } from "../../../components/ui/Skeleton";
import type {
  PersonFolder as PersonFolderType,
  ActiveChat,
} from "../chat.types";
import { PersonFolder } from "./PersonFolder";

type ConversationsSidebarProps = {
  persons: PersonFolderType[];
  activeChat: ActiveChat | null;
  onSelectRoom: (personId: string, roomId: string) => void;
  isLoading?: boolean;
};

export function ConversationsSidebar({
  persons,
  activeChat,
  onSelectRoom,
  isLoading = false,
}: ConversationsSidebarProps) {
  return (
    <aside className="w-full h-full bg-white flex flex-col overflow-hidden text-right">
      <div className="px-4 border-b border-neutral-50 py-[28px] shrink-0 border-l border-neutral-50">
        <h2 className="text-base font-bold text-neutral-900 leading-none">
          المحادثات
        </h2>
      </div>

      {/* Folders Scrollable List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-1 custom-scrollbar border-l border-neutral-50">
        {isLoading ?  [...Array(4)].map((_, i) => (<div key={i} className="flex flex-col gap-3 p-2 pointer-events-none opacity-70">
      {/* Folder Header */}
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full shrink-0 aspect-square" />
        <Skeleton className="h-4 w-1/2 rounded" />
      </div>

      {/* Room List with Vertical Line */}
      <div className="flex flex-col gap-3 pr-8 relative">
        <div className="absolute top-0 right-4 bottom-0 w-px bg-neutral-200" />
        
        <Skeleton className="h-3 w-32 rounded" />
        <Skeleton className="h-3 w-32 rounded" />
      </div>
    </div>
  ))

         : (
        persons.map((folder, idx) => (
          <PersonFolder
            key={folder.personId}
            folder={folder}
            activeChat={activeChat}
            onSelectRoom={onSelectRoom}
            defaultOpen={idx === 0}
          />
        ))
      )}
      </div>
    </aside>
  );
}
