import type { Message } from "../chat.types";
import { Check, CheckCheck } from "lucide-react";

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.sender === "me";

  return (
    <div className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] md:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed flex flex-col gap-0.5 shadow-sm ${
          isMe
            ? "bg-primary-500 text-white rounded-tl-xl rounded-bl-none"
            : "bg-white text-neutral-800 rounded-tr-xl rounded-br-none border border-neutral-100"
        }`}
      >
        {/* Message text content */}
        <p className="whitespace-pre-wrap break-words font-medium text-[13px] md:text-sm">
          {message.text}
        </p>

        {/* Timestamp and status icons */}
        <div
          className={`flex items-center gap-1 text-[10px] select-none mt-0.5 ${
            isMe
              ? "text-white/70 justify-end"
              : "text-neutral-400 justify-start"
          }`}
        >
          <span>{message.timestamp}</span>

          {isMe && (
            <span className="shrink-0 mr-0.5">
              {message.status === "sent" && (
                <Check size={13} className="text-white/50" strokeWidth={2.5} />
              )}

              {message.status === "delivered" && (
                <CheckCheck
                  size={13}
                  className="text-white/50"
                  strokeWidth={2}
                />
              )}

              {message.status === "read" && (
                <CheckCheck
                  size={13}
                  className="text-success-300"
                  strokeWidth={2.5}
                />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
