// ─── Enums ────────────────────────────────────────────────────────────────────

export type RoomStatus = "online" | "offline" ;
export type MessageStatus = "sent" | "delivered" | "read";
// ─── Message ──────────────────────────────────────────────────────────────────

export type Message = {
  id: string;
  sender: string;
  text: string;
  timestamp: string; 
  status: MessageStatus;
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
