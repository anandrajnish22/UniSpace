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
  Zap,
  UserCircle,
  TrendingUp,
} from 'lucide-react';

const featureCards = [
  { to: '/jobs',        icon: Briefcase,  label: 'UniJobs',   desc: 'Internships & full-time roles',    accent: '#e84b3a' },
  { to: '/marketplace', icon: ShoppingBag, label: 'UniMarket', desc: 'Buy & sell with fellow students',  accent: '#f5a623' },
  { to: '/events',      icon: Calendar,   label: 'UniEvents', desc: 'Hackathons, workshops & more',      accent: '#8b5cf6' },
  { to: '/communities', icon: Users,      label: 'UniHub',    desc: 'Join clubs & student groups',       accent: '#22c55e' },
  { to: '/study',       icon: BookOpen,   label: 'UniStudy',  desc: 'Notes, papers & study groups',      accent: '#38bdf8' },
  { to: '/roommates',   icon: Home,       label: 'UniFind',   desc: 'Roommates, PGs & housing',          accent: '#f472b6' },
];

interface DashboardStats {
  totalJobs: number;
  totalListings: number;
  totalEvents: number;
  totalCommunities: number;
}

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({ totalJobs: 0, totalListings: 0, totalEvents: 0, totalCommunities: 0 });
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

  const statCards = [
    { label: 'Open Jobs',        value: stats.totalJobs,        to: '/jobs',        accent: '#e84b3a', icon: Briefcase },
    { label: 'Market Listings',  value: stats.totalListings,    to: '/marketplace', accent: '#f5a623', icon: ShoppingBag },
    { label: 'Upcoming Events',  value: stats.totalEvents,      to: '/events',      accent: '#8b5cf6', icon: Calendar },
    { label: 'Communities',      value: stats.totalCommunities, to: '/communities', accent: '#22c55e', icon: Users },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ background: '#0a0a0a' }}>
      <div className="max-w-7xl mx-auto">

        {/* Welcome Banner */}
        <div
          className="relative rounded-2xl p-8 md:p-10 mb-8 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(232,75,58,0.15) 0%, rgba(245,166,35,0.08) 100%)',
            border: '1px solid rgba(232,75,58,0.25)',
          }}
        >
          {/* Ambient glow blobs */}
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(232,75,58,0.12)' }}
          />
          <div
            className="absolute -bottom-10 left-10 w-60 h-60 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(245,166,35,0.07)' }}
          />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4" style={{ color: '#e84b3a' }} />
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e84b3a' }}
                >
                  UniSpace Platform
                </span>
              </div>
              <h1
                className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
                style={{ fontFamily: "'Clash Display', sans-serif", color: '#f5f3ef' }}
              >
                {greeting}, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-base max-w-lg leading-relaxed" style={{ color: '#d4d0c8' }}>
                Everything you need for your university life — jobs, marketplace, events, communities, and more.
              </p>
            </div>

            <Link
              to="/onboarding"
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'rgba(232,75,58,0.12)',
                border: '1px solid rgba(232,75,58,0.3)',
                color: '#e84b3a',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(232,75,58,0.2)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 20px rgba(232,75,58,0.25)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(232,75,58,0.12)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '';
              }}
            >
              <UserCircle className="w-5 h-5" />
              Complete Profile
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, to, accent, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-2xl p-5 transition-all duration-200 hover:-translate-y-1"
              style={{
                background: '#111111',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = `${accent}40`;
                el.style.boxShadow = `0 0 20px ${accent}20`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(255,255,255,0.06)';
                el.style.boxShadow = '';
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}
              >
                <Icon className="w-5 h-5" style={{ color: accent }} />
              </div>
              <p className="text-2xl font-bold mb-1" style={{ color: '#f5f3ef', fontFamily: "'Clash Display', sans-serif" }}>{value}</p>
              <p className="text-xs font-medium" style={{ color: '#6b6b6b' }}>{label}</p>
              <div
                className="flex items-center text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: accent }}
              >
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e84b3a' }}
            >
              — Explore
            </span>
            <h2 className="text-lg font-bold" style={{ color: '#f5f3ef', fontFamily: "'Clash Display', sans-serif" }}>
              UniSpace Modules
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureCards.map(({ to, icon: Icon, label, desc, accent }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-center gap-4 p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: '#111111',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = `${accent}40`;
                  el.style.boxShadow = `0 0 25px ${accent}15`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = 'rgba(255,255,255,0.06)';
                  el.style.boxShadow = '';
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-110"
                  style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}
                >
                  <Icon className="w-5 h-5" style={{ color: accent }} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: '#f5f3ef', fontFamily: "'Clash Display', sans-serif" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b6b6b' }}>{desc}</p>
                </div>
                <ArrowRight
                  className="w-4 h-4 transition-all duration-200 group-hover:translate-x-1"
                  style={{ color: '#2a2a2a' }}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {!isLoading && (recentJobs.length > 0 || recentEvents.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Recent Jobs */}
            {recentJobs.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#f5f3ef', fontFamily: "'Clash Display', sans-serif" }}>
                    <Briefcase className="w-4 h-4" style={{ color: '#e84b3a' }} />
                    Latest Jobs
                  </h3>
                  <Link
                    to="/jobs"
                    className="text-xs font-medium flex items-center gap-1 transition-colors"
                    style={{ color: '#e84b3a' }}
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentJobs.map((job: any) => (
                    <Link
                      key={job.id}
                      to={`/jobs/${job.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group"
                      style={{ background: 'transparent' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,26,26,0.8)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                        style={{ background: 'rgba(232,75,58,0.12)', color: '#e84b3a', border: '1px solid rgba(232,75,58,0.2)' }}
                      >
                        {job.company?.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate transition-colors group-hover:text-primary-400" style={{ color: '#f5f3ef' }}>
                          {job.title}
                        </p>
                        <p className="text-xs truncate" style={{ color: '#6b6b6b' }}>
                          {job.company?.name} · {job.type?.replace('_', ' ')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {recentEvents.length > 0 && (
              <div
                className="rounded-2xl p-6"
                style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: '#f5f3ef', fontFamily: "'Clash Display', sans-serif" }}>
                    <Calendar className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    Upcoming Events
                  </h3>
                  <Link
                    to="/events"
                    className="text-xs font-medium flex items-center gap-1 transition-colors"
                    style={{ color: '#e84b3a' }}
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-2">
                  {recentEvents.map((event: any) => (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group"
                      style={{ background: 'transparent' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,26,26,0.8)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0"
                        style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                      >
                        <span className="text-[9px] font-bold uppercase" style={{ color: '#8b5cf6' }}>
                          {new Date(event.date).toLocaleString('en', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold leading-none" style={{ color: '#8b5cf6' }}>
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate group-hover:text-primary-400 transition-colors" style={{ color: '#f5f3ef' }}>
                          {event.title}
                        </p>
                        <p className="text-xs truncate" style={{ color: '#6b6b6b' }}>
                          {event.venue} · {event._count?.registrations || 0} attending
                        </p>
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
