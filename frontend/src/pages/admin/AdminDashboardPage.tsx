import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Users, Briefcase, ShoppingBag, Flag, Loader2 } from 'lucide-react';

interface Analytics {
  totalUsers: number;
  activeJobs: number;
  totalListings: number;
  activeReports: number;
}

export const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: analytics?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Jobs', value: analytics?.activeJobs || 0, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Marketplace Listings', value: analytics?.totalListings || 0, icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Pending Reports', value: analytics?.activeReports || 0, icon: Flag, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-surface-50">Admin Overview</h1>
        <p className="text-surface-400 mt-2">Platform analytics and system health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-surface-900 border border-surface-800 p-6 rounded-2xl flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-surface-400 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-surface-50">{stat.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
