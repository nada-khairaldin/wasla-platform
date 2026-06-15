// ─── API Types (match backend schema) ─────────────────────────────────────────

export type ChatParticipantUser = {
  id: number;
  username: string;
  full_name: string;
  profile_image: string | null;
  is_online: boolean;
  last_seen: string | null;
};

export type ConversationParticipant = {
  userId: number;
  joinedAt: string;
  user: ChatParticipantUser;
};


export type ApiMessage = {
  id: string;
  clientMessageId?: string | null;
  conversationId: string;
  senderId: number;
  sender: { id: number; username: string };
  body: string | null;
  status?: "SENT" | "DELIVERED" | "READ";
  createdAt: string;
  deliveredAt: string | null;
  readAt: string | null;
  editedAt: string | null;
  deletedAt: string | null;
  readBy: { id: string; messageId: string; userId: number; readAt: string }[];
};

export type ApiConversation = {
  id: string;
  postId: number;
  post: { id: number; title: string };
  participants: ConversationParticipant[];
  lastMessage: ApiMessage | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateConversationRequest = {
  postId: number;
};

export type SendMessageRequest = {
  body: string;
  clientMessageId: string;
};


export type ConversationResponse = {
  conversation: ApiConversation;
};

export type ConversationListResponse = {
  conversations: ApiConversation[];
  nextCursor: string | null;
};

export type MessageListResponse = {
  messages: ApiMessage[];
  nextCursor: string | null;
};

// ─── Socket.IO Event Types ───────────────────────────────────────────────────

/** Server → Client: new message for all participants in conversation room */
export type ChatMessageNewEvent = ApiMessage;

/** Server → Client: message confirmation for the sender only */
export type ChatMessageSentEvent = ApiMessage;

/** Server → Client: batched status updates (500ms debounce) */
export type ChatMessagesStatusUpdate = {
  messageId: string;
  status: "SENT" | "DELIVERED" | "READ";
  deliveredAt?: string | null;
  readAt?: string | null;
};

export type ChatMessagesStatusEvent = {
  conversationId: string;
  updates: ChatMessagesStatusUpdate[];
};

/** Server → Client: user came online */
export type ChatPresenceOnlineEvent = {
  userId: number;
};

/** Server → Client: user went offline */
export type ChatPresenceOfflineEvent = {
  userId: number;
  lastSeen: string;
};

/** Server → Client: message deleted */
export type ChatMessageDeletedEvent = {
  id: string;
  conversationId: string;
  deletedAt: string;
};

/** Client → Server payloads */
export type ChatJoinPayload = {
  conversationId: string;
};

export type ChatLeavePayload = {
  conversationId: string;
};

export type ChatMessagesDeliveredPayload = {
  conversationId: string;
  messageIds: string[];
};

export type ChatMessagesReadPayload = {
  conversationId: string;
  messageIds: string[];
};

// ─── UI Types (used by components) ────────────────────────────────────────────

// ─── Enums ────────────────────────────────────────────────────────────────────

export type RoomStatus = "online" | "offline" ;
export type MessageStatus = "sent" | "delivered" | "read" | "error";

// ─── Message ──────────────────────────────────────────────────────────────────

export type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: string; 
  status: MessageStatus;
  editedAt?: string | null;
  createdAt?: string;
};

// ─── Chat Room ────────────────────────────────────────────────────────────────
// One room = one post/service negotiation between provider & beneficiary

export type ChatRoom = {
  id: string;
  postTitle: string;      
  lastMessage: string; 
  lastMessageTime: string;
  status: RoomStatus;
  unreadCount: number;
  messages: Message[];
  /** The conversation's postId from the API */
  postId?: number;
};

// ─── Person Folder ────────────────────────────────────────────────────────────
// All chat rooms with the same person grouped as a folder

export type PersonFolder = {
  personId: string;
  personName: string;    
  initials: string;       
  avatarColor: string;    
  isOnline: boolean;
  rooms: ChatRoom[];
};

// ─── Active chat state ────────────────────────────────────────────────────────

export type ActiveChat = {
  personId: string;
  roomId: string;
};
