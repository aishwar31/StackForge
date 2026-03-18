import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/contact');
      setMessages(response.data.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      await api.put(`/contact/${id}`, { isRead: !currentStatus });
      fetchMessages();
    } catch (error) {
       toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/contact/${id}`);
      toast.success('Message removed');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (loading) return <div className="animate-pulse flex flex-col gap-4 py-8"><div className="h-32 bg-border rounded-xl"></div></div>;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Inbound <span className="text-primary">Inquiries.</span></h1>
        <p className="text-textMuted text-sm font-medium">Review and manage communications from your portfolio visitors.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {messages.map((msg) => (
          <div key={msg._id} className={`glass-card p-6 border-l-4 transition-all ${msg.isRead ? 'border-border' : 'border-primary bg-primary/5'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${msg.isRead ? 'bg-border text-textMuted' : 'bg-primary/20 text-primary'}`}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-text">{msg.name}</h3>
                  <p className="text-xs text-textMuted">{msg.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <button 
                   onClick={() => handleToggleRead(msg._id, msg.isRead)}
                   className={`p-2 rounded-lg transition-colors ${msg.isRead ? 'text-textMuted hover:text-text' : 'text-primary hover:bg-primary/10'}`}
                   title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                 >
                   <CheckCircle size={20} />
                 </button>
                 <button 
                   onClick={() => handleDelete(msg._id)}
                   className="p-2 text-textMuted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                   title="Delete permanently"
                 >
                   <Trash2 size={20} />
                 </button>
              </div>
            </div>
            
            <div className="pl-14">
               <div className="mb-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-textMuted block mb-1">Subject</span>
                 <p className="font-bold text-text">{msg.subject}</p>
               </div>
               <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-textMuted block mb-1">Message</span>
                  <p className="text-sm text-text leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">{msg.message}</p>
               </div>
               <div className="mt-4 flex items-center gap-2 text-textMuted">
                 <Clock size={12} />
                 <span className="text-[10px] font-medium tracking-wide uppercase">Received {new Date(msg.createdAt).toLocaleString()}</span>
               </div>
            </div>
          </div>
        ))}
        {messages.length === 0 && (
           <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center text-textMuted">
                <Mail size={32} />
              </div>
              <p className="text-textMuted font-medium">Your inbox is quiet... for now.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
