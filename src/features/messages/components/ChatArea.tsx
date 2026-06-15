import { useEffect, useRef } from "react";
import type { Message } from "../chat.types";
import { MessageBubble } from "./MessageBubble";
import { Skeleton } from '@/src/components/ui/Skeleton';

type ChatAreaProps = {
  messages: Message[];
  conversationId: string;
  isLoading?: boolean;
  dateDivider?: string;
};

function getDateLabel(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const now = new Date();

  // Compare calendar days
  const dStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const nStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diffDays = Math.round((nStart - dStart) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "اليوم";
  }
  if (diffDays === 1) {
    return "الأمس";
  }
  if (diffDays < 7) {
    return date.toLocaleDateString("ar-SA", { weekday: "long" });
  }
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ChatArea({ messages, conversationId, isLoading , dateDivider }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 flex flex-col gap-3 bg-neutral-50/40 custom-scrollbar w-full">
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-15 w-3/5 rounded-2xl rounded-br-none" />
          <Skeleton className="h-20 w-2/5 rounded-2xl rounded-bl-none self-end" />
          <Skeleton className="h-15 w-4/6 rounded-2xl rounded-br-none" />
        </div>
      ) : (
        <>
          {messages.map((msg, index) => {
            const dateStr = msg.createdAt || msg.timestamp;
            const currentDateLabel = getDateLabel(dateStr);

            const previousMsg = index > 0 ? messages[index - 1] : null;
            const previousDateStr = previousMsg ? (previousMsg.createdAt || previousMsg.timestamp) : null;
            const previousDateLabel = previousDateStr ? getDateLabel(previousDateStr) : null;

            const showSeparator = !previousDateLabel || (currentDateLabel && currentDateLabel !== previousDateLabel);

            return (
              <div key={msg.id} className="flex flex-col gap-3 w-full shrink-0">
                {showSeparator && currentDateLabel && (
                  <div className="flex items-center justify-center my-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] md:text-[11px] font-bold text-neutral-400 bg-neutral-100/70 rounded-full px-3 py-1 border border-neutral-200/20">
                      {currentDateLabel}
                    </span>
                  </div>
                )}
                <MessageBubble message={msg} conversationId={conversationId} />
              </div>
            );
          })}
          
          <div ref={bottomRef} className="shrink-0" />
        </>
      )}
    </div>
  );
}