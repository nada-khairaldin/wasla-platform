import { useState } from "react";
import type { Message } from "../chat.types";
import { Check, CheckCheck, AlertCircle, Pencil, Trash2 } from "lucide-react";
import { useEditMessage, useDeleteMessage } from "../hooks";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";
import { useConversations } from "../hooks/useConversations";

type MessageBubbleProps = {
  message: Message;
  conversationId: string;
};

export function MessageBubble({ message, conversationId }: MessageBubbleProps) {
  const isMe = message.sender === "me";

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const editMutation = useEditMessage();
  const deleteMutation = useDeleteMessage();

  const { data: currentUser } = useCurrentUser();
  const currentUserId = Number(currentUser?.user?.userId);
  const { conversations } = useConversations();
  const conversation = conversations?.find((c) => c.id === conversationId);
  const isRecipientOnline = conversation?.participants?.some(
    (p) => p.user.id !== currentUserId && p.user.is_online
  );

  const isRead = message.status === "read";
  const isDelivered = message.status === "delivered" || (message.status === "sent" && isRecipientOnline);
  const isSent = message.status === "sent" && !isDelivered;

  const handleSaveEdit = () => {
    if (!editText.trim() || editText === message.text) {
      setIsEditing(false);
      return;
    }
    editMutation.mutate(
      {
        messageId: message.id,
        conversationId,
        body: editText,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setShowActions(false);
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(
      {
        messageId: message.id,
        conversationId,
      },
      {
        onSuccess: () => {
          setIsConfirmingDelete(false);
          setShowActions(false);
        },
      }
    );
  };

  const toggleActions = () => {
    if (isMe && !isEditing && !isConfirmingDelete) {
      setShowActions(!showActions);
    }
  };

  return (
    <div 
      className={`flex w-full items-center gap-2 group relative ${isMe ? "justify-end" : "justify-start"}`}
      dir="rtl"
    >
      {/* Action buttons shown on hover or when clicked/tapped (for mobile) */}
      {isMe && !isEditing && !isConfirmingDelete && !String(message.id).startsWith("optimistic-") && !String(message.id).startsWith("failed-") && (
        <div 
          className={`flex items-center gap-1 shrink-0 transition-opacity duration-200 ${
            showActions 
              ? "opacity-100" 
              : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
              setEditText(message.text);
            }}
            className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-neutral-100 rounded-full transition-colors"
            title="تعديل الرسالة"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsConfirmingDelete(true);
            }}
            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-55 rounded-full transition-colors"
            title="حذف الرسالة"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}

      {/* Message bubble */}
      <div
        onClick={toggleActions}
        className={`max-w-[75%] md:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed flex flex-col gap-1 shadow-sm select-text cursor-pointer transition-transform active:scale-[0.99] ${
          isMe
            ? "bg-primary-500 text-white rounded-tl-xl rounded-bl-none"
            : "bg-white text-neutral-800 rounded-tr-xl rounded-br-none border border-neutral-100"
        }`}
      >
        {isEditing ? (
          /* Edit Mode */
          <div className="flex flex-col gap-2 w-full min-w-[180px] md:min-w-[240px] text-neutral-800" onClick={(e) => e.stopPropagation()}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full min-h-[50px] p-2 text-sm text-neutral-800 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none font-medium"
              dir="auto"
              autoFocus
            />
            <div className="flex items-center justify-end gap-1.5 text-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(false);
                }}
                className="px-2.5 py-1 text-neutral-600 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors font-semibold"
              >
                إلغاء
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveEdit();
                }}
                disabled={editMutation.isPending || !editText.trim()}
                className="px-2.5 py-1 text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 rounded-lg transition-colors font-semibold flex items-center gap-1"
              >
                {editMutation.isPending ? "حفظ..." : "حفظ"}
              </button>
            </div>
          </div>
        ) : isConfirmingDelete ? (
          /* Delete Confirmation Mode */
          <div className="flex flex-col gap-2 w-full min-w-[180px] text-white" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs text-red-200 font-bold leading-normal">
              هل أنت متأكد من حذف هذه الرسالة؟
            </p>
            <div className="flex items-center justify-end gap-1.5 text-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfirmingDelete(false);
                }}
                className="px-2.5 py-1 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors font-semibold"
              >
                تراجع
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirmDelete();
                }}
                disabled={deleteMutation.isPending}
                className="px-2.5 py-1 text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 rounded-lg transition-colors font-semibold"
              >
                {deleteMutation.isPending ? "حذف..." : "حذف"}
              </button>
            </div>
          </div>
        ) : (
          /* Normal Text Content */
          <>
            <p className="whitespace-pre-wrap break-words font-medium text-[13px] md:text-sm">
              {message.text}
            </p>

            {/* Timestamp, status icons, and edited indicator */}
            <div
              className={`flex items-center gap-1 text-[10px] select-none mt-0.5 ${
                isMe
                  ? "text-white/70 justify-end"
                  : "text-neutral-400 justify-start"
              }`}
            >
              <span>{message.timestamp}</span>

              {message.editedAt && (
                <span className="opacity-70 text-[9px] mr-1 shrink-0 font-semibold">(معدلة)</span>
              )}

              {isMe && (
                <span className="shrink-0 mr-0.5">
                  {isSent && (
                    <Check size={13} className="text-white/50" strokeWidth={2.5} />
                  )}

                  {isDelivered && !isRead && (
                    <CheckCheck
                      size={13}
                      className="text-white/50"
                      strokeWidth={2}
                    />
                  )}

                  {isRead && (
                    <CheckCheck
                      size={13}
                      className="text-green-300"
                      strokeWidth={2.5}
                    />
                  )}

                  {message.status === "error" && (
                    <span className="flex items-center gap-0.5 text-red-200 font-bold" title="فشل إرسال الرسالة">
                      <AlertCircle size={12} className="text-red-300 shrink-0" />
                      <span>فشل الإرسال</span>
                    </span>
                  )}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

