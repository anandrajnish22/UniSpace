import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Search, X, User, Briefcase, Calendar, Users, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface SearchResults {
  users: Array<{ id: string; name: string; role: string; profile?: { avatar: string | null } }>;
  jobs: Array<{ id: string; title: string; type: string; company: { name: string; logo: string | null } }>;
  events: Array<{ id: string; title: string; date: string; category: string }>;
  communities: Array<{ id: string; name: string; avatarUrl: string | null }>;
}

export const GlobalSearch = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults(null);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults(null);
        return;
      }
      setIsLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.data);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const hasResults = results && (
    results.users.length > 0 || 
    results.jobs.length > 0 || 
    results.events.length > 0 || 
    results.communities.length > 0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-surface-900 border border-surface-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-surface-800 gap-3">
              <Search className="w-5 h-5 text-surface-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search users, jobs, events, communities..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-surface-50 placeholder-surface-500 focus:outline-none text-lg"
              />
              {isLoading && <Loader2 className="w-5 h-5 text-primary-500 animate-spin" />}
              <button 
                onClick={onClose}
                className="p-1 text-surface-400 hover:text-surface-50 hover:bg-surface-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Area */}
            <div className="flex-1 overflow-y-auto p-2">
              {!query.trim() ? (
                <div className="p-8 text-center text-surface-500">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p>Type to search across UniSpace</p>
                </div>
              ) : !isLoading && !hasResults ? (
                <div className="p-8 text-center text-surface-500">
                  <p>No results found for "{query}"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Users */}
                  {results?.users.length! > 0 && (
                    <div>
                      <h3 className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1">Users</h3>
                      {results?.users.map(user => (
                        <button
                          key={user.id}
                          onClick={() => handleNavigate(`/profile/${user.id}`)}
                          className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-surface-800 rounded-xl transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center shrink-0 overflow-hidden">
                            {user.profile?.avatar ? (
                              <img src={user.profile.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-4 h-4 text-surface-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-surface-50 group-hover:text-primary-400 transition-colors">{user.name}</p>
                            <p className="text-xs text-surface-400">{user.role}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Jobs */}
                  {results?.jobs.length! > 0 && (
                    <div>
                      <h3 className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1 mt-2">Jobs</h3>
                      {results?.jobs.map(job => (
                        <button
                          key={job.id}
                          onClick={() => handleNavigate(`/jobs/${job.id}`)}
                          className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-surface-800 rounded-xl transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center shrink-0">
                            <Briefcase className="w-4 h-4 text-surface-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-surface-50 group-hover:text-primary-400 transition-colors">{job.title}</p>
                            <p className="text-xs text-surface-400">{job.company.name} • {job.type}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Events */}
                  {results?.events.length! > 0 && (
                    <div>
                      <h3 className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1 mt-2">Events</h3>
                      {results?.events.map(event => (
                        <button
                          key={event.id}
                          onClick={() => handleNavigate(`/events/${event.id}`)}
                          className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-surface-800 rounded-xl transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-surface-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-surface-50 group-hover:text-primary-400 transition-colors">{event.title}</p>
                            <p className="text-xs text-surface-400">{format(new Date(event.date), 'MMM d')} • {event.category}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Communities */}
                  {results?.communities.length! > 0 && (
                    <div>
                      <h3 className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-surface-400 mb-1 mt-2">Communities</h3>
                      {results?.communities.map(community => (
                        <button
                          key={community.id}
                          onClick={() => handleNavigate(`/communities/${community.id}`)}
                          className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-surface-800 rounded-xl transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-surface-700 flex items-center justify-center shrink-0 overflow-hidden">
                            {community.avatarUrl ? (
                              <img src={community.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Users className="w-4 h-4 text-surface-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-surface-50 group-hover:text-primary-400 transition-colors">{community.name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-surface-800 bg-surface-900/50 text-xs text-surface-500 flex justify-between items-center hidden sm:flex">
              <span className="flex items-center gap-2">
                Use <kbd className="px-2 py-1 rounded bg-surface-800 font-mono text-[10px]">↑</kbd> <kbd className="px-2 py-1 rounded bg-surface-800 font-mono text-[10px]">↓</kbd> to navigate
              </span>
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 rounded bg-surface-800 font-mono text-[10px]">Esc</kbd> to close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
