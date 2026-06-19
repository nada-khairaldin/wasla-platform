"use client";

import { useState, Suspense, useSyncExternalStore } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { ActiveChat } from "@/src/features/messages/chat.types";
import { ConversationsSidebar } from "@/src/features/messages/components/ConversationsSidebar";
import { ChatHeader } from "@/src/features/messages/components/ChatHeader";
import { ChatArea } from "@/src/features/messages/components/ChatArea";
import { ChatInput } from "@/src/features/messages/components/ChatInput";
import { MessagesEmptyState } from "@/src/features/messages/components/MessagesEmptyState";
import { ContractModal } from "@/src/features/messages/components/ContractModal";
import { CreateContractForm } from "@/src/features/messages/components/CreateContractForm";
import type { ContractFormValues } from "@/src/features/messages/schemas/chat";
import { motion } from "framer-motion";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useChatSocket,
  generateUUID,
} from "@/src/features/messages/hooks";
import { useCurrentUser } from "@/src/hooks/useCurrentUser";

function MessagesPageContent() {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversationIdFromUrl = searchParams.get("conversationId");

  const { data: currentUser } = useCurrentUser();
  const currentUserId = Number(currentUser?.user?.userId);

  const {
    personFolders,
    conversations,
    isLoading: isConversationsLoading,
  } = useConversations();

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  // Derived active chat from URL param and person folders
  const activeChat = (() => {
    if (!conversationIdFromUrl || !personFolders.length) return null;
    for (const folder of personFolders) {
      const room = folder.rooms.find((r) => r.id === conversationIdFromUrl);
      if (room) {
        return { personId: folder.personId, roomId: room.id };
      }
    }
    return null;
  })();

  // Get active person and room from folders
  const activePerson = activeChat
    ? (personFolders.find((pf) => pf.personId === activeChat.personId) ?? null)
    : null;

  const activeRoom =
    activePerson && activeChat
      ? (activePerson.rooms.find((r) => r.id === activeChat.roomId) ?? null)
      : null;

  // Connect Socket.IO and manage room join/leave
  useChatSocket(activeChat?.roomId ?? null);

  // Fetch messages for the active conversation
  const {
    messages: displayMessages,
    isLoading: isMessagesLoading,
  } = useMessages(
    activeChat?.roomId ?? null,
    activePerson?.isOnline ?? false
  );


  // Send message mutation
  const sendMessageMutation = useSendMessage();

  const handleSelectRoom = (personId: string, roomId: string) => {
    router.push(`/messages?conversationId=${roomId}`);
  };

  const handleBack = () => router.push("/messages");

  const handleSend = (text: string) => {
    if (!activeChat) return;
    const clientMessageId = generateUUID();
    sendMessageMutation.mutate({
      conversationId: activeChat.roomId,
      body: text,
      clientMessageId,
    });
  };

  const handleCreateContractClick = () => {
    if (activeChat) {
      setIsContractModalOpen(true);
    }
  };

  const handleContractSubmit = (data: ContractFormValues) => {
    setIsContractModalOpen(false);
    // TODO: integrate with exchanges API
  };

  // Determine if the current user is the provider (initiator, NOT the post owner)
  const activeConversation = activeChat
    ? conversations?.find((c) => c.id === activeChat.roomId)
    : null;

  // The provider is the person who started the conversation (not the post owner).
  // In the API, participants[0] is typically the initiator. We compare against the post owner.
  const isProvider = (() => {
    if (!activeConversation || !currentUserId) return false;
    // The post owner is the person who created the post
    // The provider (who contacted) is the OTHER person
    // Find the post owner from participants — the one whose userId matches a participant
    // Since we don't have post.userId in the conversation, we check:
    // If the current user is NOT the post owner, they are the provider (they initiated contact)
    const postOwnerParticipant = activeConversation.participants.find(
      (p) => p.userId !== currentUserId
    );
    // If there's no other participant, we can't determine
    if (!postOwnerParticipant) return false;
    // The current user is the provider if they are NOT the post owner
    // Since conversations are linked to posts, the person who clicked "تواصل" is the initiator
    // We'll use a simple heuristic: the first participant who joined is the initiator
    const sortedParticipants = [...activeConversation.participants].sort(
      (a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
    );
    return sortedParticipants[0]?.userId === currentUserId;
  })();

  if (!isMounted) {
    return null; // The Suspense fallback will effectively be what the user sees, but returning null or skeleton ensures no mismatch
  }

  if (!isConversationsLoading && personFolders.length === 0) {
    return <MessagesEmptyState onBrowseServices={() => {}} />;
  }

  const contractInitialData = {
    postTitle: activeRoom?.postTitle || "عنوان الخدمة المتفق عليها",
    providerName: activePerson?.personName || "",
    seekerName: "",
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
          persons={personFolders}
          activeChat={activeChat}
          onSelectRoom={handleSelectRoom}
          isLoading={isConversationsLoading}
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
              showContractButton={isProvider}
            />

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-neutral-50/20">
              <ChatArea
                messages={displayMessages}
                conversationId={activeChat?.roomId ?? ""}
                isLoading={isMessagesLoading}
                dateDivider="اليوم"
              />
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

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-neutral-50/20 h-[calc(100vh-85px)]">
        <div className="text-neutral-400 text-sm font-medium animate-pulse">جاري تحميل المحادثات...</div>
      </div>
    }>
      <MessagesPageContent />
    </Suspense>
  );
}
