"use client";

import { useState } from "react";
import type {
  PersonFolder,
  ActiveChat,
  Message,
} from "@/src/features/messages/chat.types";
import { MOCK_PERSONS } from "@/src/features/messages/data/chat.data";
import { ConversationsSidebar } from "@/src/features/messages/components/ConversationsSidebar";
import { ChatHeader } from "@/src/features/messages/components/ChatHeader";
import { ChatArea } from "@/src/features/messages/components/ChatArea";
import { ChatInput } from "@/src/features/messages/components/ChatInput";
import { MessagesEmptyState } from "@/src/features/messages/components/MessagesEmptyState";
import { ContractModal } from "@/src/features/messages/components/ContractModal"; 
import { CreateContractForm } from "@/src/features/messages/components/CreateContractForm"; 
import  type {ContractFormValues}  from "@/src/features/messages/schemas/chat";
import { motion } from "framer-motion";

type MessagesPageProps = {
  persons?: PersonFolder[];
  onBrowseServices?: () => void;
  onCreateContract?: (personId: string, roomId: string, formData?: ContractFormValues) => void;
  onSendMessage?: (personId: string, roomId: string, text: string) => void;
};

export default function MessagesPage({
  persons = MOCK_PERSONS,
  onBrowseServices,
  onCreateContract,
  onSendMessage,
}: MessagesPageProps) {
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>(
    {},
  );

  // Derived state for the active person and room
  const activePerson = activeChat
    ? (persons.find((pf) => pf.personId === activeChat.personId) ?? null)
    : null;

  const activeRoom =
    activePerson && activeChat
      ? (activePerson.rooms.find((r) => r.id === activeChat.roomId) ?? null)
      : null;

  const displayMessages = activeRoom
    ? [...activeRoom.messages, ...(localMessages[activeRoom.id] ?? [])]
    : [];

  const handleSelectRoom = (personId: string, roomId: string) => {
    setActiveChat({ personId, roomId });
  };

  const handleBack = () => setActiveChat(null);

  const handleSend = (text: string) => {
    if (!activeChat) return;

    const newMsg: Message = {
      id: `local-${Date.now()}`,
      sender: "me",
      text,
      timestamp: new Intl.DateTimeFormat("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
      status: "sent",
    };

    setLocalMessages((prev) => ({
      ...prev,
      [activeChat.roomId]: [...(prev[activeChat.roomId] ?? []), newMsg],
    }));

    onSendMessage?.(activeChat.personId, activeChat.roomId, text);
  };


  const handleCreateContractClick = () => {
    if (activeChat) {
      setIsContractModalOpen(true);
    }
  };


  const handleContractSubmit = (data: ContractFormValues) => {
    if (activeChat) {
      onCreateContract?.(activeChat.personId, activeChat.roomId, data);
      setIsContractModalOpen(false); 
    }
  };

  if (persons.length === 0) {
    return <MessagesEmptyState onBrowseServices={onBrowseServices} />;
  }


  const contractInitialData = {
    postTitle: activeRoom?.postTitle || "عنوان الخدمة المتفق عليها", 
    providerName: "Nada (أنت) ",
    seekerName: activePerson?.personName || "",
    serviceMode: "online" as "online" | "offline", 
    timeCredits: 2,
  };

  return (
    <div
      className={`w-full bg-white flex overflow-hidden border-t border-neutral-50 transition-all duration-200 ${
        activeChat
          ? "fixed inset-0 z-[60] h-full md:relative md:inset-auto md:z-10 md:h-[calc(100vh-85px)]"
          : "relative h-[calc(100dvh-85px)] md:h-[calc(100vh-85px)]"
      }`}
    >
      {/* Sidebar: Hidden on mobile when a chat is active */}
      <div
        className={`w-full md:w-[320px] lg:w-[360px] shrink-0 h-full border-l border-neutral-50 ${
          activeChat ? "hidden md:block" : "block"
        }`}
      >
        <ConversationsSidebar
          persons={persons}
          activeChat={activeChat}
          onSelectRoom={handleSelectRoom}
        />
      </div>

      {/* Active Chat Window */}
      <div
        className={`flex-1 flex flex-col h-full min-h-0 overflow-hidden relative ${
          !activeChat ? "hidden md:flex" : "flex"
        }`}
      >
        {activePerson && activeRoom ? (
          <motion.div
            key={activeChat?.roomId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col h-full min-h-0 overflow-hidden"
          >
            <ChatHeader
              person={activePerson}
              room={activeRoom}
              onBack={handleBack}
              onCreateContract={handleCreateContractClick}
            />

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-neutral-50/20">
              <ChatArea messages={displayMessages} dateDivider="اليوم" />
            </div>
            <ChatInput onSend={handleSend} />
          </motion.div>
        ) : (
          /* Desktop Empty State */
          <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-neutral-50/40">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-primary-500 flex items-center justify-center border border-neutral-200/50">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-neutral-400">
              اختر محادثة للبدء
            </p>
          </div>
        )}
      </div>

  
      <ContractModal
        isOpen={isContractModalOpen}
        onClose={() => setIsContractModalOpen(false)}
      >
        <CreateContractForm
          initialData={contractInitialData}
          onCancel={() => setIsContractModalOpen(false)}
          onSubmit={handleContractSubmit}
        />
      </ContractModal>
    </div>
  );
}
