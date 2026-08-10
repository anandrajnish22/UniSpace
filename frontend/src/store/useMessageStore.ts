import { create } from 'zustand';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    profile?: { avatar: string | null };
  };
}

export interface Conversation {
  id: string;
  type: string;
  otherUser?: {
    id: string;
    name: string;
    profile?: { avatar: string | null };
  };
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

interface MessageState {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  activeConversationId: string | null;
  typingUsers: Record<string, Set<string>>; // conversationId -> set of userIds
  
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  setActiveConversation: (id: string | null) => void;
  
  addMessage: (message: Message) => void;
  updateConversationTimestamp: (conversationId: string, message: Message) => void;
  
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,
  typingUsers: {},

  setConversations: (conversations) => set({ conversations }),
  
  setMessages: (conversationId, msgs) => 
    set((state) => ({
      messages: { ...state.messages, [conversationId]: msgs }
    })),
    
  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessage: (message) =>
    set((state) => {
      const convMessages = state.messages[message.conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [message.conversationId]: [...convMessages, message],
        },
      };
    }),

  updateConversationTimestamp: (conversationId, message) =>
    set((state) => {
      const updatedConvs = state.conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: message,
            updatedAt: message.createdAt,
          };
        }
        return conv;
      });
      // Sort by updatedAt descending
      updatedConvs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      
      return { conversations: updatedConvs };
    }),

  setTyping: (conversationId, userId, isTyping) =>
    set((state) => {
      const currentSet = state.typingUsers[conversationId] || new Set();
      const newSet = new Set(currentSet);
      if (isTyping) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return {
        typingUsers: { ...state.typingUsers, [conversationId]: newSet },
      };
    }),
}));
