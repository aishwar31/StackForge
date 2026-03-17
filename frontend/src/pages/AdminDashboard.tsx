import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Activity, FolderKanban, BookOpen, MessageSquare } from 'lucide-react';

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

  if (loading) {
    return <div className="animate-pulse flex gap-4"><div className="w-1/4 h-32 bg-border rounded-xl"></div></div>;
  }

  const stats = [
    { title: 'Total Visits', value: summary?.totalVisits || 0, icon: Activity, color: 'text-blue-500' },
    { title: 'Projects', value: summary?.totalProjects || 0, icon: FolderKanban, color: 'text-green-500' },
    { title: 'Published Blogs', value: summary?.totalBlogs || 0, icon: BookOpen, color: 'text-purple-500' },
    { title: 'Unread Messages', value: summary?.unreadMessages || 0, icon: MessageSquare, color: 'text-amber-500' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="card p-6 flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-textMuted">{stat.title}</span>
              <span className="text-3xl font-bold">{stat.value}</span>
            </div>
            <div className={`p-3 rounded-lg bg-background ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        <div className="card p-6 flex flex-col gap-4">
           <h2 className="text-xl font-semibold">Recent Visits</h2>
           <div className="flex flex-col gap-3">
              {summary?.recentVisits?.map((visit: any) => (
                <div key={visit._id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{visit.path}</span>
                    <span className="text-xs text-textMuted">{visit.device.substring(0, 30)}...</span>
                  </div>
                  <span className="text-xs text-textMuted text-right whitespace-nowrap">
                    {new Date(visit.visitedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {!summary?.recentVisits?.length && <p className="text-sm text-textMuted">No recent visits</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
