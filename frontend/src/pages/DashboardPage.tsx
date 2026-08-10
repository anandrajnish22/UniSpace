import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { RecommendationsWidget } from '@/components/ui/RecommendationsWidget';
import { 
  Briefcase, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  activeJobs: number;
  activeListings: number;
  upcomingEvents: number;
  joinedCommunities: number;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  createdAt: string;
}

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // In a real app, these would fetch actual data from backend
    // For now, using mock data for the structure
    setStats({
      activeJobs: 12,
      activeListings: 5,
      upcomingEvents: 3,
      joinedCommunities: 4,
    });

    setActivities([
      { id: '1', type: 'JOB', title: 'Applied to Software Engineer Intern at Google', createdAt: new Date().toISOString() },
      { id: '2', type: 'EVENT', title: 'Registered for HackWeb3 Hackathon', createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: '3', type: 'COMMUNITY', title: 'Joined React Developers group', createdAt: new Date(Date.now() - 172800000).toISOString() },
    ]);
  }, []);

  const statCards = [
    { label: 'Saved Jobs', value: stats?.activeJobs || 0, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'My Listings', value: stats?.activeListings || 0, icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Upcoming Events', value: stats?.upcomingEvents || 0, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'My Communities', value: stats?.joinedCommunities || 0, icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  const getIconForActivity = (type: string) => {
    switch (type) {
      case 'JOB': return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case 'EVENT': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'COMMUNITY': return <Users className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-surface-400" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-50">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-surface-400 mt-2">Here's what's happening in your campus today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-surface-900 border border-surface-800 p-6 rounded-2xl flex items-center gap-4 hover:border-surface-700 transition-colors">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-surface-50">{stat.value}</h3>
              <p className="text-sm font-medium text-surface-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-surface-50 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link to="/jobs" className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-800 hover:bg-surface-700 transition-colors text-center group">
                <Briefcase className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-surface-200">Find Job</span>
              </Link>
              <Link to="/marketplace" className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-800 hover:bg-surface-700 transition-colors text-center group">
                <ShoppingBag className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-surface-200">Sell Item</span>
              </Link>
              <Link to="/events" className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-800 hover:bg-surface-700 transition-colors text-center group">
                <Calendar className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-surface-200">Events</span>
              </Link>
              <Link to="/communities" className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-800 hover:bg-surface-700 transition-colors text-center group">
                <Users className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-surface-200">Connect</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-surface-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-surface-50">Recent Activity</h2>
              <button className="text-sm font-medium text-primary-500 hover:text-primary-400 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-surface-800">
              {activities.map((activity) => (
                <div key={activity.id} className="p-6 flex items-start gap-4 hover:bg-surface-800/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-surface-800 flex items-center justify-center shrink-0">
                    {getIconForActivity(activity.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-50">{activity.title}</p>
                    <p className="text-xs text-surface-400 mt-1">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <RecommendationsWidget />
        </div>

      </div>
    </div>
  );
};
