"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type ChatInputProps = {
  onSend: (text: string) => void;
};

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState<string>("");

  // Handles sending the message and resetting the input field
  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed) return;
    
    onSend(trimmed);
    setValue("");
  }

  // Listens for Enter key to trigger send, supports Shift+Enter for new lines
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-t border-neutral-100 shrink-0 w-full" dir="rtl">
      {/* Input container with focus effects */}
      <div className="flex-1 flex items-center bg-neutral-50/60 border border-neutral-100 rounded-xl px-4 py-2.5 focus-within:border-primary-500/30 focus-within:bg-white transition-all">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب رسالتك هنا..."
          className="flex-1 bg-transparent text-base text-neutral-800 placeholder-neutral-400 outline-none text-right font-medium"
        />
      </div>

      {/* Send button */}
      <button
        type="button"
        onClick={handleSend}
        className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 hover:cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:scale-100"
        disabled={!value.trim()}
      >
        <Send size={14}  strokeWidth={2.5} />
        <span>إرسال</span>
      </button>
    </div>
  );
}