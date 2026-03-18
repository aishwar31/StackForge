import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { 
  LifeBuoy, 
  MessageSquare, 
  Search, 
  User, 
  Clock, 
  Send, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const SOCKET_URL = (import.meta as any).env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5001';

interface SupportRoom {
  _id: string; // roomId
  lastMessage: string;
  sender: string;
  senderId: string;
  updatedAt: string;
  unreadCount: number;
}

interface Message {
  _id?: string;
  sender: string;
  senderId?: string;
  message: string;
  isFromAdmin: boolean;
  type: 'support';
  roomId: string;
  createdAt?: string;
}

const AdminSupport = () => {
  const [rooms, setRooms] = useState<SupportRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchRooms();
    
    socketRef.current = io(SOCKET_URL);
    
    socketRef.current.on('new_support_request', (data) => {
      toast.success(`New Support Request from ${data.sender}!`, { icon: '🆘' });
      fetchRooms();
    });

    socketRef.current.on('receive_support_message', (message: Message) => {
      setMessages((prev) => {
        // Only append if it's for the currently selected room
        if (message.roomId === selectedRoom) {
          return [...prev, message];
        }
        return prev;
      });
      fetchRooms(); // Refresh room list to show updated last message
    });

    socketRef.current.on('receive_support_history', (history: Message[]) => {
      setMessages(history);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedRoom && socketRef.current) {
      socketRef.current.emit('join_support', { roomId: selectedRoom, userId: user?.id });
    }
  }, [selectedRoom, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/chat/support-rooms');
      setRooms(response.data.data);
    } catch (error) {
      console.error('Error fetching support rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom || !socketRef.current || !user) return;

    socketRef.current.emit('send_support_message', {
      roomId: selectedRoom,
      sender: user.name,
      senderId: user.id,
      message: newMessage,
      isFromAdmin: true,
    });

    setNewMessage('');
  };

  const filteredRooms = rooms.filter(room => 
    room.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-160px)] flex gap-8">
      {/* Sidebar: Room List */}
      <aside className="w-96 flex flex-col gap-6">
        <div className="glass-card p-6 border-white/5 bg-white/5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tighter text-white italic">Support <span className="text-primary text-2xl">Threads</span></h2>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Filter size={18} />
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textMuted" size={18} />
            <input 
              type="text" 
              placeholder="Search by client or content..."
              className="input-field pl-12 py-3 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 scrollbar-hide">
          {loading ? (
             Array(5).fill(0).map((_, i) => (
                <div key={i} className="glass-card p-5 animate-pulse border-white/5 bg-white/5">
                   <div className="h-4 w-24 bg-white/10 rounded mb-3" />
                   <div className="h-3 w-full bg-white/5 rounded" />
                </div>
             ))
          ) : filteredRooms.length === 0 ? (
             <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 opacity-40">
                <p className="text-xs font-black uppercase tracking-widest">No Active Transmissions</p>
             </div>
          ) : (
            filteredRooms.map((room) => (
              <motion.button
                key={room._id}
                onClick={() => setSelectedRoom(room._id)}
                className={`w-full text-left glass-card p-5 border-white/5 transition-all group ${selectedRoom === room._id ? 'bg-primary/10 border-primary/20 scale-[1.02]' : 'bg-white/5 hover:bg-white/10 hover:-translate-y-1'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedRoom === room._id ? 'bg-primary text-white' : 'bg-white/10 text-textMuted'}`}>
                      {room.sender[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white group-hover:text-primary transition-colors">{room.sender}</h3>
                      <p className="text-[9px] font-bold text-textMuted uppercase tracking-widest">{room._id.slice(0, 15)}...</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-black text-textMuted mt-1">
                    {new Date(room.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-textMuted line-clamp-1 italic mb-2">"{room.lastMessage}"</p>
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedRoom === room._id ? 'bg-primary animate-pulse' : 'bg-green-500'}`} />
                      <span className="text-[8px] font-black uppercase tracking-widest text-textMuted">Active Link</span>
                   </div>
                   {room.unreadCount > 0 && selectedRoom !== room._id && (
                      <span className="px-2 py-0.5 rounded-md bg-accent-pink text-[8px] font-black text-white uppercase tracking-widest animate-pulse">Action Required</span>
                   )}
                </div>
              </motion.button>
            ))
          )}
        </div>
      </aside>

      {/* Main: Chat View */}
      <main className="flex-1 flex flex-col gap-6">
        {selectedRoom ? (
          <div className="flex-1 flex flex-col glass-card border-white/5 bg-white/5 overflow-hidden">
            {/* Thread Header */}
            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-xl relative">
                     <User size={32} />
                     <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0a0a0a] rounded-full" />
                  </div>
                  <div>
                     <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
                        Client: <span className="text-primary">{rooms.find(r => r._id === selectedRoom)?.sender}</span>
                     </h2>
                     <p className="text-xs text-textMuted font-bold uppercase tracking-widest mt-2 flex items-center gap-3">
                        <Clock size={12} className="text-primary" /> Session active for 12 hours // Encrypted Stream
                     </p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button className="p-4 rounded-xl bg-white/5 border border-white/5 text-textMuted hover:text-white hover:bg-white/10 transition-all">
                     <CheckCircle2 size={20} />
                  </button>
                  <button className="p-4 rounded-xl bg-white/5 border border-white/5 text-textMuted hover:text-white hover:bg-white/10 transition-all">
                     <MoreVertical size={20} />
                  </button>
               </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef} 
              className="flex-1 p-10 overflow-y-auto flex flex-col gap-8 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.02),transparent_70%)] scrollbar-hide"
            >
               {messages.map((msg, i) => (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   key={msg._id || i}
                   className={`flex flex-col max-w-[70%] ${msg.isFromAdmin ? 'self-end' : 'self-start'}`}
                 >
                   <div className={`flex items-center gap-3 mb-2 ${msg.isFromAdmin ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${msg.isFromAdmin ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-white/10 border-white/10 text-white'}`}>
                         {msg.isFromAdmin ? <ShieldCheck size={16} /> : <User size={16} />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-textMuted">
                         {msg.isFromAdmin ? 'SYSTEM ARCHITECT' : 'CLIENT UPLINK'}
                      </span>
                   </div>
                   <div className={`p-6 rounded-[28px] text-base leading-relaxed shadow-2xl border ${
                     msg.isFromAdmin 
                       ? 'bg-primary text-white rounded-tr-none font-bold border-white/10' 
                       : 'bg-white/[0.05] border-white/10 text-white rounded-tl-none font-medium'
                   }`}>
                     {msg.message}
                   </div>
                   <span className={`text-[9px] mt-3 font-black uppercase tracking-widest text-white/20 ${msg.isFromAdmin ? 'self-end' : 'self-start'}`}>
                     {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 'TRANSMITTING...'}
                   </span>
                 </motion.div>
               ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-10 border-t border-white/5 bg-black/40 flex gap-6 items-center group">
               <div className="flex-1 relative">
                  <textarea 
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                       if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e as any);
                       }
                    }}
                    placeholder="Forge a tactical response to resolve the client's objective..."
                    className="w-full bg-white/[0.02] border border-white/10 rounded-3xl px-8 py-6 text-base focus:outline-none focus:border-primary/50 text-white font-medium resize-none shadow-inner transition-all focus:bg-white/[0.04]"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1 opacity-20 pointer-events-none group-focus-within:opacity-100 transition-opacity">
                     <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                     <span className="w-1 h-1 rounded-full bg-primary animate-pulse delay-75" />
                  </div>
               </div>
               <button
                 type="submit"
                 disabled={!newMessage.trim()}
                 className="w-20 h-20 rounded-[32px] bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 border border-white/10 disabled:grayscale disabled:opacity-30 group/send"
               >
                 <Send size={28} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center glass-card border-white/10 bg-white/5 opacity-40 gap-10 p-20">
             <div className="relative">
                <div className="w-40 h-40 rounded-[60px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-2xl scale-125 mb-4">
                  <LifeBuoy size={64} />
                </div>
                <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full animate-pulse-slow" />
             </div>
             <div className="space-y-4 max-w-md">
                <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic">Awaiting <span className="text-primary">Selection.</span></h3>
                <p className="text-sm text-textMuted font-bold uppercase tracking-[0.3em] leading-relaxed">Select a technician stream from the archive to begin the resolution protocol.</p>
             </div>
             <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSupport;
