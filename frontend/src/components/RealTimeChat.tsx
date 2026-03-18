import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, LifeBuoy, Lock, ShieldCheck, Zap } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';

const SOCKET_URL = (import.meta as any).env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:5001';

interface Message {
  _id?: string;
  sender: string;
  senderId?: string;
  message: string;
  isFromAdmin: boolean;
  type: 'social' | 'support';
  roomId?: string;
  createdAt?: string;
}

const RealTimeChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'social' | 'support'>('social');
  
  // Social State
  const [socialMessages, setSocialMessages] = useState<Message[]>([]);
  const [senderName, setSenderName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  
  // Support State
  const [supportMessages, setSupportMessages] = useState<Message[]>([]);
  const [supportInput, setSupportInput] = useState('');
  
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket link established.');
      // Auto-join support room if user exists
      if (user) {
        const roomId = `support_${user.id}`;
        socketRef.current?.emit('join_support', { roomId, userId: user.id });
      }
    });

    // Initial Fetch
    socketRef.current.emit('fetch_messages');

    // Social Listeners
    socketRef.current.on('receive_history', (history: Message[]) => {
      setSocialMessages(history);
    });
    socketRef.current.on('receive_message', (message: Message) => {
      setSocialMessages((prev) => {
        if (prev.some(m => m._id === message._id || (m.message === message.message && m.sender === message.sender))) {
           return prev.map(m => (m._id === message._id || (m.message === message.message && m.sender === message.sender)) ? message : m);
        }
        return [...prev, message];
      });
    });

    // Support Listeners
    socketRef.current.on('receive_support_history', (history: Message[]) => {
      setSupportMessages(history);
    });
    socketRef.current.on('receive_support_message', (message: Message) => {
      console.log('Support message received:', message);
      setSupportMessages((prev) => {
         if (prev.some(m => m._id === message._id || (m.message === message.message && m.sender === message.sender))) {
            return prev.map(m => (m._id === message._id || (m.message === message.message && m.sender === message.sender)) ? message : m);
         }
         return [...prev, message];
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]); // Re-connect if user changes

  useEffect(() => {
    if (activeTab === 'support' && user && socketRef.current?.connected) {
      const roomId = `support_${user.id}`;
      socketRef.current.emit('join_support', { roomId, userId: user.id });
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [socialMessages, supportMessages, isOpen, activeTab]);

  const handleSendSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    const tempId = Date.now().toString();
    const messageData: Message = {
      _id: tempId,
      sender: senderName || user?.name || 'Anonymous',
      message: newMessage,
      isFromAdmin: false,
      type: 'social',
      createdAt: new Date().toISOString()
    };

    // Optimistic Update
    setSocialMessages((prev) => [...prev, messageData]);

    socketRef.current.emit('send_message', {
      sender: messageData.sender,
      message: messageData.message,
      isFromAdmin: false,
    });

    setNewMessage('');
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportInput.trim() || !socketRef.current || !user) return;

    const roomId = `support_${user.id}`;
    const tempId = Date.now().toString();
    const messageData: Message = {
      _id: tempId,
      sender: user.name,
      senderId: user.id,
      message: supportInput,
      isFromAdmin: false,
      type: 'support',
      roomId,
      createdAt: new Date().toISOString()
    };

    // Optimistic Update
    setSupportMessages((prev) => [...prev, messageData]);

    socketRef.current.emit('send_support_message', {
      roomId,
      sender: user.name,
      senderId: user.id,
      message: supportInput,
      isFromAdmin: false,
    });

    setSupportInput('');
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (senderName.trim()) {
      setIsNameSet(true);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-[24px] bg-primary text-white shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] flex items-center justify-center relative overflow-hidden group border border-white/20"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (socialMessages.length > 0 || supportMessages.length > 0) && (
           <span className="absolute top-3 right-3 w-4 h-4 bg-accent-pink rounded-full border-2 border-white animate-pulse" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 40, scale: 0.95, x: 20 }}
            className="absolute bottom-20 right-0 w-[380px] sm:w-[450px] h-[600px] glass-card flex flex-col overflow-hidden border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
          >
            {/* Header / Tabs */}
            <div className="p-2 border-b border-white/5 bg-white/5 flex gap-2">
               <button 
                 onClick={() => setActiveTab('social')}
                 className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'social' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-textMuted hover:text-white hover:bg-white/5'}`}
               >
                 <MessageSquare size={14} /> Social Lounge
               </button>
               <button 
                 onClick={() => setActiveTab('support')}
                 className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'support' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-textMuted hover:text-white hover:bg-white/5'}`}
               >
                 <LifeBuoy size={14} /> Support Core
               </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
               {activeTab === 'social' ? (
                 /* SOCIAL CHAT */
                 !isNameSet && !user ? (
                    <div className="flex-1 p-10 flex flex-col items-center justify-center text-center gap-8">
                      <div className="w-20 h-20 rounded-[32px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                        <User size={40} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic">Lounge <span className="text-primary underline decoration-primary/30 decoration-4 underline-offset-8">Access.</span></h4>
                        <p className="text-xs text-textMuted font-bold uppercase tracking-widest leading-relaxed">Pick a nickname to join the real-time technical stream.</p>
                      </div>
                      <form onSubmit={handleNameSubmit} className="w-full flex flex-col gap-5">
                        <input
                          type="text"
                          required
                          placeholder="Transmission ID (Nickname)"
                          className="input-field text-center py-4 bg-white/5 rounded-2xl border-white/10"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                        />
                        <button type="submit" className="btn-primary w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/10">
                          Initialize Connection
                        </button>
                      </form>
                      <div className="w-full h-[1px] bg-white/5 my-2" />
                      <p className="text-[10px] text-textMuted font-medium uppercase tracking-[0.3em]">Or use your <span className="text-primary font-black">Admin ID</span> for more power.</p>
                    </div>
                 ) : (
                    <>
                      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 scrollbar-hide">
                         {socialMessages.map((msg, i) => (
                           <motion.div
                             initial={{ opacity: 0, scale: 0.9, y: 10 }}
                             animate={{ opacity: 1, scale: 1, y: 0 }}
                             key={msg._id || i}
                             className={`flex flex-col max-w-[85%] ${msg.isFromAdmin ? 'self-start' : 'self-end'}`}
                           >
                             <span className={`text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 ${msg.isFromAdmin ? 'text-primary' : 'text-textMuted self-end'}`}>
                               {msg.isFromAdmin && <ShieldCheck size={10} />}
                               {msg.isFromAdmin ? 'FORGE ARCHITECT' : (msg.sender === (user?.name || senderName) ? 'YOU' : msg.sender)}
                             </span>
                             <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-xl border ${
                               msg.isFromAdmin 
                                 ? 'bg-primary/10 border-primary/20 text-white rounded-tl-none font-medium' 
                                 : 'bg-white/10 border-white/10 text-text rounded-tr-none'
                             }`}>
                               {msg.message}
                             </div>
                             <span className={`text-[8px] mt-2 font-black uppercase tracking-widest text-white/20 ${msg.isFromAdmin ? 'self-start' : 'self-end'}`}>
                               {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TRANSMITTING...'}
                             </span>
                           </motion.div>
                         ))}
                      </div>
                      <form onSubmit={handleSendSocial} className="p-5 border-t border-white/5 bg-black/20 flex gap-4 items-center">
                         <div className="flex-1 relative">
                            <input
                              type="text"
                              placeholder="Inject thought into the stream..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-xs focus:outline-none focus:border-primary/40 text-text font-medium"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 opacity-20">
                               <div className="w-1 h-1 rounded-full bg-primary" />
                               <div className="w-1 h-1 rounded-full bg-primary" />
                            </div>
                         </div>
                         <button
                           type="submit"
                           disabled={!newMessage.trim()}
                           className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale"
                         >
                           <Send size={18} />
                         </button>
                      </form>
                    </>
                 )
               ) : (
                 /* SUPPORT CHAT */
                 !user ? (
                    <div className="flex-1 p-10 flex flex-col items-center justify-center text-center gap-8">
                       <div className="relative">
                          <div className="w-24 h-24 rounded-[40px] bg-accent-purple/10 flex items-center justify-center text-accent-purple border border-accent-purple/20 shadow-inner scale-110">
                            <Lock size={48} />
                          </div>
                          <div className="absolute -inset-4 bg-accent-purple/10 blur-3xl rounded-full animate-pulse" />
                       </div>
                       <div className="space-y-4 relative z-10">
                          <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-[0.9]">Transmission <span className="text-accent-purple">Locked.</span></h4>
                          <p className="text-sm text-textMuted font-bold uppercase tracking-widest leading-relaxed">Encrypted support buffers require an active member link to materialize.</p>
                       </div>
                       <div className="flex flex-col gap-4 w-full relative z-10">
                          <Link to="/login" className="btn-primary w-full py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 border border-primary/20">Establish Authentication</Link>
                          <Link to="/register" className="btn-secondary w-full py-5 rounded-3xl font-black uppercase tracking-widest text-xs border border-white/5 hover:bg-white/5">Initialize Identity</Link>
                       </div>
                       <p className="text-[10px] text-textMuted font-medium uppercase tracking-[0.3em] opacity-40 mt-4">Security Protocol SF-Support-01 Active</p>
                    </div>
                 ) : (
                    <>
                      <div className="p-4 bg-primary/5 border-b border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Private Uplink: {user.name}</span>
                         </div>
                         <span className="text-[8px] font-black uppercase tracking-widest text-textMuted bg-white/5 px-2 py-1 rounded border border-white/5">Encrypted V2.0</span>
                      </div>
                      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 scrollbar-hide bg-[radial-gradient(circle_at_bottom,rgba(var(--primary-rgb),0.03),transparent_70%)]">
                         {supportMessages.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 opacity-40 py-20">
                               <div className="p-5 rounded-full bg-white/5 border border-white/5">
                                  <Zap size={32} />
                                </div>
                                <div className="space-y-2">
                                   <p className="text-xs font-black uppercase tracking-[0.4em] text-white">Buffer Initialized</p>
                                   <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting technical transmission</p>
                                </div>
                            </div>
                         )}
                         {supportMessages.map((msg, i) => (
                           <motion.div
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             key={msg._id || i}
                             className={`flex flex-col max-w-[85%] ${msg.isFromAdmin ? 'self-start' : 'self-end'}`}
                           >
                             <span className={`text-[9px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 ${msg.isFromAdmin ? 'text-primary' : 'text-textMuted self-end'}`}>
                               {msg.isFromAdmin ? <ShieldCheck size={10} /> : <User size={10} />}
                               {msg.isFromAdmin ? 'SYSTEM ARCHITECT' : 'CLIENT UPLINK'}
                             </span>
                             <div className={`p-5 rounded-[24px] text-sm leading-relaxed shadow-2xl border ${
                               msg.isFromAdmin 
                                 ? 'bg-primary/20 border-primary/30 text-white rounded-tl-none font-bold' 
                                 : 'bg-white/[0.05] border-white/10 text-white rounded-tr-none font-medium'
                             }`}>
                               {msg.message}
                             </div>
                             <span className={`text-[8px] mt-2 font-black uppercase tracking-widest text-white/20 ${msg.isFromAdmin ? 'self-start' : 'self-end'}`}>
                               {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : 'PERSISTING...'}
                             </span>
                           </motion.div>
                         ))}
                      </div>
                      <form onSubmit={handleSendSupport} className="p-6 border-t border-white/5 bg-black/40 flex gap-4 items-center">
                         <div className="flex-1 relative">
                            <textarea
                              rows={1}
                              placeholder="Describe your technical difficulty..."
                              value={supportInput}
                              onChange={(e) => setSupportInput(e.target.value)}
                              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-xs focus:outline-none focus:border-primary/40 text-text font-medium resize-none min-h-[56px] max-h-[120px]"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendSupport(e as any);
                                }
                              }}
                            />
                         </div>
                         <button
                           type="submit"
                           disabled={!supportInput.trim()}
                           className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 border border-white/10 disabled:grayscale disabled:opacity-30"
                         >
                           <Send size={22} />
                         </button>
                      </form>
                    </>
                 )
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealTimeChat;
