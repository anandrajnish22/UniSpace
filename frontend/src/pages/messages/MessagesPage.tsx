import { useState, useEffect, useRef } from 'react';
import { useMessageStore, type Conversation, type Message } from '@/store/useMessageStore';
import { useAuthStore } from '@/store/authStore';
import { useSocketStore } from '@/store/useSocketStore';
import { api } from '@/lib/api';
import { Search, Send, User as UserIcon, Loader2, ArrowLeft, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export const MessagesPage = () => {
  const { user } = useAuthStore();
  const { socket } = useSocketStore();
  const { 
    conversations, 
    messages, 
    activeConversationId, 
    typingUsers,
    setConversations, 
    setMessages, 
    setActiveConversation,
    addMessage,
    updateConversationTimestamp
  } = useMessageStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch conversations initially
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/conversations');
        if (res.data?.success && res.data?.data) {
          setConversations(res.data.data);
          // If no active conversation selected yet, default to the first one
          if (!activeConversationId && res.data.data.length > 0) {
            setActiveConversation(res.data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load conversations', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, [setConversations]);

  // 2. Fetch messages for active conversation
  useEffect(() => {
    if (!activeConversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/conversations/${activeConversationId}/messages`);
        if (res.data?.success && res.data?.data) {
          setMessages(activeConversationId, res.data.data);
        }
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };

    fetchMessages();

    // Gentle polling fallback every 3s to sync new replies seamlessly
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeConversationId, setMessages]);

  // 3. Socket room join/leave
  useEffect(() => {
    if (activeConversationId && socket) {
      socket.emit('join_conversation', activeConversationId);
      return () => {
        socket.emit('leave_conversation', activeConversationId);
      };
    }
  }, [activeConversationId, socket]);

  // 4. Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConversationId]);

  // 5. Send message with instant optimistic UI update
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content || !activeConversationId || isSending) return;

    setNewMessage('');
    setIsSending(true);

    const tempId = 'temp-' + Date.now();
    const optimisticMsg: Message = {
      id: tempId,
      conversationId: activeConversationId,
      senderId: user?.id || '',
      content: content,
      createdAt: new Date().toISOString(),
      sender: {
        id: user?.id || '',
        name: user?.name || 'You',
        profile: { avatar: (user as any)?.profileImage || (user as any)?.profile?.avatar || null }
      }
    };

    // Instant local state update
    addMessage(optimisticMsg);
    updateConversationTimestamp(activeConversationId, optimisticMsg);

    try {
      const res = await api.post(`/conversations/${activeConversationId}/messages`, {
        content: content
      });

      if (res.data?.success && res.data?.data) {
        const realMsg = res.data.data;
        useMessageStore.setState((state) => {
          const convMsgs = state.messages[activeConversationId] || [];
          return {
            messages: {
              ...state.messages,
              [activeConversationId]: convMsgs.map(m => m.id === tempId ? realMsg : m)
            }
          };
        });
        updateConversationTimestamp(activeConversationId, realMsg);
      }

      socket?.emit('typing_stop', { conversationId: activeConversationId });
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    if (activeConversationId && socket) {
      socket.emit('typing_start', { conversationId: activeConversationId });
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', { conversationId: activeConversationId });
      }, 2000);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversationId ? (messages[activeConversationId] || []) : [];
  const isOtherUserTyping = activeConversationId ? (typingUsers[activeConversationId]?.size > 0) : false;

  return (
    <div className="h-[calc(100vh-3.5rem)] lg:h-screen flex bg-transparent overflow-hidden">
      
      {/* ── Conversations List Pane ───────────────────── */}
      <div className={`w-full lg:w-96 flex-col border-r border-white/10 bg-white/5 backdrop-blur-md ${activeConversationId ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/10">
          <h1 className="text-xl font-display font-bold text-white mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-white/60 text-sm">No conversations found.</div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                className={`w-full text-left p-4 flex items-center gap-3 transition-colors border-b border-white/5 ${
                  activeConversationId === conv.id ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-black/40 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                  {conv.otherUser?.profile?.avatar ? (
                    <img src={conv.otherUser.profile.avatar} alt={conv.otherUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-white/40" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-white truncate">{conv.otherUser?.name}</span>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-white/60 shrink-0">
                        {format(new Date(conv.lastMessage.createdAt), 'MMM d, h:mm a')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/60 truncate">
                    {typingUsers[conv.id]?.size > 0 ? (
                      <span className="text-primary-400 italic">typing...</span>
                    ) : conv.lastMessage ? (
                      <span className={conv.lastMessage.senderId !== user?.id && conv.unreadCount > 0 ? "text-white font-medium" : ""}>
                        {conv.lastMessage.senderId === user?.id ? 'You: ' : ''}{conv.lastMessage.content}
                      </span>
                    ) : (
                      <span className="italic text-white/40">No messages yet</span>
                    )}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── Active Chat Pane ────────────────────────── */}
      <div className={`flex-1 flex-col bg-transparent ${!activeConversationId ? 'hidden lg:flex' : 'flex'}`}>
        {!activeConversationId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-white/40">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5 backdrop-blur-md z-10 sticky top-0">
              <button 
                onClick={() => setActiveConversation(null)}
                className="lg:hidden p-2 -ml-2 text-white/40 hover:text-white rounded-lg hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                {activeConversation?.otherUser?.profile?.avatar ? (
                  <img src={activeConversation.otherUser.profile.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-white/40" />
                )}
              </div>
              <div>
                <h2 className="font-semibold text-white">{activeConversation?.otherUser?.name}</h2>
                <p className="text-xs text-white/60">{activeConversation?.type} Chat</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.map((msg, idx) => {
                const isMine = msg.senderId === user?.id;
                const showAvatar = !isMine && (idx === activeMessages.length - 1 || activeMessages[idx + 1]?.senderId === user?.id);
                
                return (
                  <div key={msg.id} className={`flex gap-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
                    {!isMine && (
                      <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-black/40 border border-white/10 mt-auto flex items-center justify-center">
                        {showAvatar && (
                          activeConversation?.otherUser?.profile?.avatar ? 
                            <img src={activeConversation.otherUser.profile.avatar} alt="" className="w-full h-full object-cover" /> :
                            <UserIcon className="w-4 h-4 text-white/40" />
                        )}
                      </div>
                    )}
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isMine 
                        ? 'bg-primary-600 text-white rounded-br-sm shadow-md' 
                        : 'bg-white/10 border border-white/10 text-white rounded-bl-sm backdrop-blur-md'
                    }`}>
                      <p className="text-sm break-words">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMine ? 'text-primary-200' : 'text-white/40'}`}>
                        {format(new Date(msg.createdAt), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {isOtherUserTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-black/40 border border-white/10 mt-auto flex items-center justify-center">
                    {activeConversation?.otherUser?.profile?.avatar ? 
                      <img src={activeConversation.otherUser.profile.avatar} alt="" className="w-full h-full object-cover" /> :
                      <UserIcon className="w-4 h-4 text-white/40" />
                    }
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10 bg-transparent backdrop-blur-md">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary-500/50 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-500 transition-colors shrink-0 shadow-glow"
                >
                  {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
