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
import { usePost } from "@/src/features/posts/hooks";
import { useCreateContract } from "@/src/features/contracts/hooks/useCreateContract";
import { useUserProfile } from "@/src/features/profile/hooks/useUserProfile";
import { useUserExchanges } from "@/src/features/profile/hooks/useUserExchanges";
import toast from "react-hot-toast";

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
  const { data: currentUserProfile } = useUserProfile(currentUserId);

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

  const activeConversation = activeChat
    ? conversations?.find((c) => c.id === activeChat.roomId)
    : null;

  const { data: postData } = usePost(activeConversation?.postId ?? 0);
  const createContractMutation = useCreateContract();
  const { data: userExchanges } = useUserExchanges();

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
    if (!activeChat || !activeConversation?.postId || !postData) {
      toast.error("لا يمكن انشاء العقد حالياً: بيانات الخدمة غير متوفرة");
      return;
    }
    setIsContractModalOpen(true);
  };

  const isPostOwner = currentUserId === postData?.userId;
  
  // Strict Role Logic based on Offer/Request
  let providerId = 0;
  let seekerId = 0;
  
  if (postData) {
    if (postData.category === "OFFER") {
      providerId = postData.userId;
      seekerId = isPostOwner ? (activeConversation?.participants.find(p => p.userId !== postData.userId)?.userId || 0) : currentUserId;
    } else {
      // REQUEST
      providerId = isPostOwner ? (activeConversation?.participants.find(p => p.userId !== postData.userId)?.userId || 0) : currentUserId;
      seekerId = postData.userId;
    }
  }

  const isSeeker = currentUserId === seekerId;
  const hasActiveContract = 
    !!(activeConversation as { exchange?: unknown })?.exchange || 
    !!(postData as { exchange?: unknown })?.exchange ||
    (userExchanges?.some(e => e.postId === activeConversation?.postId && !["CANCELED", "REJECTED"].includes(e.status)) ?? false);
  
  const showContractButton = Boolean(
    isSeeker && 
    currentUserId
  );

  const handleContractSubmit = async (data: ContractFormValues) => {
    if (!activeConversation?.postId || !postData || !currentUserId || !providerId) return;
    try {
      await createContractMutation.mutateAsync({
        postId: activeConversation.postId,
        providerId: providerId,
        duration: data.timeCredits,
        contractEndDate: data.maxEndDate,
      });
      toast.success("تم انشاء العقد بنجاح");
      setIsContractModalOpen(false);
    } catch (error: unknown) {
      const err = error as Error & { response?: { status: number, data?: { message?: string } } };
      if (err?.response?.status === 409 || err?.message?.includes("already exists") || err?.message?.includes("active")) {
         toast.error("يوجد عقد نشط أو معلق مسبقاً لهذه الخدمة");
      } else if (err?.response?.status === 400 && err?.response?.data?.message === "Insufficient time credits") {
         toast.error("رصيدك غير كافٍ لإنشاء هذا العقد");
      } else if (err?.response?.status === 400) {
         toast.error("بيانات غير صالحة. الرجاء التأكد من صحة المدخلات.");
      } else {
         toast.error(err?.response?.data?.message || err?.message || "حدث خطأ غير متوقع");
      }
    }
  };

  if (!isMounted) {
    return null; // The Suspense fallback will effectively be what the user sees, but returning null or skeleton ensures no mismatch
  }

  if (!isConversationsLoading && personFolders.length === 0) {
    return <MessagesEmptyState onBrowseServices={() => {}} />;
  }

  const currentUserDisplayName = currentUserProfile?.profile?.name || currentUserProfile?.profile?.username || currentUser?.user?.full_name || currentUser?.user?.username || "";

  const providerName = providerId === currentUserId 
    ? (currentUserDisplayName ? `${currentUserDisplayName} (أنا)` : "(أنا)") 
    : (providerId === postData?.userId ? (postData?.user?.full_name || postData?.user?.username || "") : activePerson?.personName || "");

  const seekerNameValue = seekerId === currentUserId 
    ? (currentUserDisplayName ? `${currentUserDisplayName} (أنا)` : "(أنا)") 
    : (seekerId === postData?.userId ? (postData?.user?.full_name || postData?.user?.username || "") : activePerson?.personName || "");

  const contractInitialData = {
    postTitle: postData?.title || activeRoom?.postTitle || "عنوان الخدمة المتفق عليها",
    providerName: providerName,
    seekerName: seekerNameValue,
    serviceMode: (postData?.serviceMode?.toLowerCase() as "online" | "offline") || "online",
    timeCredits: postData?.assignedTimeCredits || 2,
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
              showContractButton={showContractButton}
              hasActiveContract={hasActiveContract}
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
          isSubmitting={createContractMutation.isPending}
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
