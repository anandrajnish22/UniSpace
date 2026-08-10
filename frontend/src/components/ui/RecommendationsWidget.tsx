import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Loader2, Briefcase, UserPlus, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface Recommendations {
  jobs: Array<{ id: string; title: string; company: { name: string; logo: string | null } }>;
  connections: Array<{ id: string; name: string; role: string; profile: { avatar: string | null; university: string | null } }>;
  events: Array<{ id: string; title: string; date: string; category: string }>;
}

export const RecommendationsWidget = () => {
  const [data, setData] = useState<Recommendations | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await api.get('/recommendations');
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      
      {/* Suggested Connections */}
      {data.connections.length > 0 && (
        <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-800 flex items-center justify-between">
            <h3 className="font-bold text-surface-50 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-400" />
              People You May Know
            </h3>
          </div>
          <div className="p-2">
            {data.connections.map(user => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-700 overflow-hidden">
                    {user.profile?.avatar ? (
                      <img src={user.profile.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-surface-400 bg-surface-800">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-50 group-hover:text-primary-400 transition-colors">{user.name}</p>
                    <p className="text-xs text-surface-400 line-clamp-1">{user.profile?.university || user.role}</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-surface-300 hover:text-white hover:bg-surface-600 transition-colors">
                  <UserPlus className="w-4 h-4" />
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Jobs */}
      {data.jobs.length > 0 && (
        <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-800 flex items-center justify-between">
            <h3 className="font-bold text-surface-50 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              Recommended Jobs
            </h3>
          </div>
          <div className="p-2">
            {data.jobs.map(job => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-700 flex items-center justify-center overflow-hidden shrink-0">
                  {job.company.logo ? (
                    <img src={job.company.logo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Briefcase className="w-5 h-5 text-surface-400" />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-surface-50 truncate group-hover:text-primary-400 transition-colors">{job.title}</p>
                  <p className="text-xs text-surface-400 truncate">{job.company.name}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-surface-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {data.events.length > 0 && (
        <div className="bg-surface-900 border border-surface-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-800 flex items-center justify-between">
            <h3 className="font-bold text-surface-50 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Upcoming Events
            </h3>
          </div>
          <div className="p-2">
            {data.events.map(event => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-700 flex flex-col items-center justify-center shrink-0 border border-surface-600">
                  <span className="text-[10px] font-bold text-red-400 uppercase">{format(new Date(event.date), 'MMM')}</span>
                  <span className="text-sm font-bold text-surface-50">{format(new Date(event.date), 'd')}</span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-surface-50 truncate group-hover:text-primary-400 transition-colors">{event.title}</p>
                  <p className="text-xs text-surface-400">{event.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
