import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import {
  Briefcase,
  ShoppingBag,
  Calendar,
  Users,
  BookOpen,
  Home,
  ArrowRight,
  TrendingUp,
  Zap,
  UserCircle,
} from 'lucide-react';

const featureCards = [
  {
    to: '/jobs',
    icon: Briefcase,
    label: 'UniJobs',
    desc: 'Find internships & full-time roles',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  {
    to: '/marketplace',
    icon: ShoppingBag,
    label: 'UniMarket',
    desc: 'Buy & sell with fellow students',
    color: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
  },
  {
    to: '/events',
    icon: Calendar,
    label: 'UniEvents',
    desc: 'Hackathons, workshops & more',
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
  },
  {
    to: '/communities',
    icon: Users,
    label: 'UniHub',
    desc: 'Join clubs & student groups',
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    text: 'text-green-700',
  },
  {
    to: '/study',
    icon: BookOpen,
    label: 'UniStudy',
    desc: 'Notes, papers & study groups',
    color: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
  },
  {
    to: '/roommates',
    icon: Home,
    label: 'UniFind',
    desc: 'Roommates, PGs & housing',
    color: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
    text: 'text-teal-700',
  },
];

interface DashboardStats {
  totalJobs: number;
  totalListings: number;
  totalEvents: number;
  totalCommunities: number;
}

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    totalListings: 0,
    totalEvents: 0,
    totalCommunities: 0,
  });
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, listingsRes, eventsRes, communitiesRes] = await Promise.all([
          api.get('/jobs'),
          api.get('/listings'),
          api.get('/events'),
          api.get('/communities'),
        ]);

        setStats({
          totalJobs: jobsRes.data.data.pagination.total,
          totalListings: listingsRes.data.data.pagination.total,
          totalEvents: eventsRes.data.data.pagination.total,
          totalCommunities: communitiesRes.data.data.pagination.total,
        });

        setRecentJobs(jobsRes.data.data.jobs.slice(0, 3));
        setRecentEvents(eventsRes.data.data.events.slice(0, 2));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-primary-600 via-primary-700 to-accent-700 rounded-3xl p-8 md:p-10 mb-8 overflow-hidden text-white shadow-2xl">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary-200 text-sm font-medium mb-2">
                <Zap className="w-4 h-4" />
                UniSpace Platform
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 leading-tight">
                {greeting}, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-primary-100 text-base max-w-lg leading-relaxed">
                Everything you need for your university life — jobs, marketplace, events, communities, and more.
              </p>
            </div>
            
            <Link
              to="/onboarding"
              className="shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold text-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <UserCircle className="w-5 h-5" />
              Complete Profile
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Open Jobs', value: stats.totalJobs, icon: Briefcase, to: '/jobs', color: 'text-blue-600 bg-blue-50' },
            { label: 'Marketplace Items', value: stats.totalListings, icon: ShoppingBag, to: '/marketplace', color: 'text-violet-600 bg-violet-50' },
            { label: 'Upcoming Events', value: stats.totalEvents, icon: Calendar, to: '/events', color: 'text-orange-600 bg-orange-50' },
            { label: 'Communities', value: stats.totalCommunities, icon: Users, to: '/communities', color: 'text-green-600 bg-green-50' },
          ].map(({ label, value, icon: Icon, to, color }) => (
            <Link key={to} to={to} className="group bg-white rounded-2xl p-5 border border-surface-200 hover:shadow-elevated hover:-translate-y-0.5 transition-all">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-surface-900 mb-1">{value}</p>
              <p className="text-xs text-surface-500 font-medium">{label}</p>
              <div className="flex items-center text-xs text-primary-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-surface-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" /> 
            Explore UniSpace
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureCards.map(({ to, icon: Icon, label, desc, color, bg, text }) => (
              <Link
                key={to}
                to={to}
                className="group bg-white border border-surface-200 rounded-2xl p-5 hover:shadow-elevated hover:-translate-y-0.5 transition-all flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-surface-900">{label}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Content */}
        {!isLoading && (recentJobs.length > 0 || recentEvents.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Jobs */}
            {recentJobs.length > 0 && (
              <div className="bg-white border border-surface-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-surface-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    Latest Jobs
                  </h3>
                  <Link to="/jobs" className="text-primary-600 text-xs font-medium hover:text-primary-700 flex items-center gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentJobs.map((job: any) => (
                    <Link key={job.id} to={`/jobs/${job.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-sm shrink-0">
                        {job.company?.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-surface-900 truncate group-hover:text-primary-600 transition-colors">{job.title}</p>
                        <p className="text-xs text-surface-500 truncate">{job.company?.name} • {job.type.replace('_', ' ')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {recentEvents.length > 0 && (
              <div className="bg-white border border-surface-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-surface-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    Upcoming Events
                  </h3>
                  <Link to="/events" className="text-primary-600 text-xs font-medium hover:text-primary-700 flex items-center gap-1">
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentEvents.map((event: any) => (
                    <Link key={event.id} to={`/events/${event.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex flex-col items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-orange-600">{new Date(event.date).toLocaleString('en', { month: 'short' }).toUpperCase()}</span>
                        <span className="text-lg font-bold text-orange-700 leading-none">{new Date(event.date).getDate()}</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-surface-900 truncate group-hover:text-primary-600 transition-colors">{event.title}</p>
                        <p className="text-xs text-surface-500 truncate">{event.venue} • {event._count?.registrations || 0} attending</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
