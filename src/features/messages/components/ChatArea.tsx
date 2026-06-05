import { useEffect, useRef } from "react";
import type { Message } from "../chat.types";
import { MessageBubble } from "./MessageBubble";
import { Skeleton } from '@/src/components/ui/Skeleton';

type ChatAreaProps = {
 messages: Message[];
  isLoading?: boolean;
  dateDivider?: string;
};

export function ChatArea({ messages, isLoading , dateDivider }: ChatAreaProps) {
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
          {dateDivider && (
            <div className="flex items-center justify-center my-2 shrink-0">
              <span className="text-[10px] md:text-[11px] font-bold text-neutral-400 bg-neutral-100/70 rounded-full px-3 py-1 border border-neutral-200/20">
                {dateDivider}
              </span>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          
          <div ref={bottomRef} className="shrink-0" />
        </>
      )}
    </div>
  );
}