import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Activity, FolderKanban, BookOpen, MessageSquare, Globe, Cpu, Clock, ExternalLink } from 'lucide-react';
import VisitorGraph from '../components/VisitorGraph';

interface SummaryData {
  totalVisits: number;
  totalProjects: number;
  totalBlogs: number;
  unreadMessages: number;
  recentVisits: any[];
}

const AdminDashboard = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/analytics/summary');
        setSummary(response.data.data);
      } catch (error) {
        console.error('Failed to fetch summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  // Generate mock chart data based on totalVisits for visual impact
  const chartData = [
    { date: 'Mon', visits: Math.floor((summary?.totalVisits || 100) * 0.1) },
    { date: 'Tue', visits: Math.floor((summary?.totalVisits || 100) * 0.15) },
    { date: 'Wed', visits: Math.floor((summary?.totalVisits || 100) * 0.12) },
    { date: 'Thu', visits: Math.floor((summary?.totalVisits || 100) * 0.2) },
    { date: 'Fri', visits: Math.floor((summary?.totalVisits || 100) * 0.18) },
    { date: 'Sat', visits: Math.floor((summary?.totalVisits || 100) * 0.1) },
    { date: 'Sun', visits: Math.floor((summary?.totalVisits || 100) * 0.15) },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-10 w-48 bg-border rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-border rounded-xl"></div>)}
        </div>
        <div className="h-[400px] bg-border rounded-2xl"></div>
      </div>
    );
  }

  const stats = [
    { title: 'Total Visits', value: summary?.totalVisits || 0, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Projects', value: summary?.totalProjects || 0, icon: FolderKanban, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Articles', value: summary?.totalBlogs || 0, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Inquiries', value: summary?.unreadMessages || 0, icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Command <span className="text-primary">Center.</span></h1>
        <p className="text-textMuted text-sm font-medium">Real-time platform intelligence and metrics overview.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="glass-card p-6 flex items-start justify-between border-white/5 bg-white/5 hover:bg-white/10 transition-all group">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-textMuted group-hover:text-primary transition-colors">{stat.title}</span>
              <span className="text-3xl font-bold tracking-tighter text-white">{stat.value}</span>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-lg shadow-black/20`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Graph Section */}
      <div className="glass-card p-8 border-white/5 bg-white/5">
        <div className="flex items-center justify-between mb-2">
           <div>
             <h2 className="text-lg font-bold text-white">Traffic Analysis</h2>
             <p className="text-xs text-textMuted">Weekly visitor growth and plateau metrics.</p>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-textMuted">Organic Visits</span>
              </div>
           </div>
        </div>
        <VisitorGraph data={chartData} />
      </div>

      {/* Recent Visits Redesign */}
      <div className="glass-card overflow-hidden border-white/5 bg-white/5">
         <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Audit Log</h2>
              <p className="text-xs text-textMuted">Information-dense visitor session tracking.</p>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-textMuted hover:text-white transition-colors">View All Logs</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/5">
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-textMuted">Destination</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-textMuted">System (OS/Device)</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-textMuted text-right">Timestamp</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {summary?.recentVisits?.map((visit: any) => (
                    <tr key={visit._id} className="hover:bg-white/5 transition-colors group">
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                             <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                <Globe size={14} />
                             </div>
                             <span className="text-sm font-bold text-white">{visit.path}</span>
                          </div>
                       </td>
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                             <Cpu size={14} className="text-textMuted" />
                             <span className="text-xs text-textMuted max-w-[300px] truncate">{visit.device}</span>
                          </div>
                       </td>
                       <td className="px-8 py-4 text-right">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                             <Clock size={12} className="text-textMuted" />
                             <span className="text-[10px] font-bold text-white uppercase">{new Date(visit.visitedAt).toLocaleDateString()}</span>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
            {!summary?.recentVisits?.length && (
              <div className="p-12 text-center flex flex-col items-center gap-3">
                <div className="p-4 rounded-full bg-white/5 text-textMuted">
                   <Activity size={32} />
                </div>
                <p className="text-sm font-medium text-textMuted">Intelligence database empty.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
