import { apiRequest } from "@/src/services/api";
import type {
  ConversationResponse,
  ConversationListResponse,
  MessageListResponse,
  CreateConversationRequest,
  SendMessageRequest,
  ApiMessage,
} from "../chat.types";

// Re-export a minimal MessageResponse type for the send/edit endpoints
type ApiMessageResponse = { message: { id: string; conversationId: string; senderId: number; body: string | null; createdAt: string } };

export const chatService = {
  /** Create a new conversation or reuse an existing one for a post */
  createConversation: (postId: number) => {
    return apiRequest<ConversationResponse, CreateConversationRequest>({
      method: "POST",
      url: "/conversations",
      payload: { postId },
    });
  },

  /** Create a new direct conversation or reuse an existing one for a user */
  createDirectConversation: (recipientId: number) => {
    return apiRequest<ConversationResponse, { recipientId: number }>({
      method: "POST",
      url: "/conversations/direct",
      payload: { recipientId },
    });
  },

  /** List all conversations for the current user */
  getConversations: (cursor?: string, limit: number = 20) => {
    const params: Record<string, string | number> = { limit };
    if (cursor) params.cursor = cursor;
    return apiRequest<ConversationListResponse>({
      method: "GET",
      url: "/conversations",
      payload: params,
    });
  },

  /** Get a single conversation by ID */
  getConversation: (conversationId: string) => {
    return apiRequest<ConversationResponse>({
      method: "GET",
      url: `/conversations/${conversationId}`,
    });
  },

  /** List messages in a conversation */
  getMessages: (conversationId: string, cursor?: string, limit: number = 30) => {
    const params: Record<string, string | number> = { limit };
    if (cursor) params.cursor = cursor;
    return apiRequest<MessageListResponse>({
      method: "GET",
      url: `/conversations/${conversationId}/messages`,
      payload: params,
    });
  },

  /** Send a message in a conversation */
  sendMessage: (conversationId: string, body: string, clientMessageId: string) => {
    return apiRequest<ApiMessageResponse, SendMessageRequest>({
      method: "POST",
      url: `/conversations/${conversationId}/messages`,
      payload: { body, clientMessageId },
    });
  },


  /** Mark a message as read */
  markAsRead: (messageId: string) => {
    return apiRequest<{ readReceipt: { id: string; messageId: string; userId: number; readAt: string } }>({
      method: "POST",
      url: `/messages/${messageId}/read`,
    });
  },

  /** Edit own message */
  editMessage: (messageId: string, body: string) => {
    return apiRequest<{ message: ApiMessage }, { body: string }>({
      method: "PATCH",
      url: `/messages/${messageId}`,
      payload: { body },
    });
  },

  /** Soft-delete own message */
  deleteMessage: (messageId: string) => {
    return apiRequest<{ message: ApiMessage }>({
      method: "DELETE",
      url: `/messages/${messageId}`,
    });
  },
};
