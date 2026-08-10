import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Users, Search, Loader2, MessageSquare, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface CommunityItem {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  isPrivate: boolean;
  _count: { members: number; posts: number };
}

export const CommunitiesPage = () => {
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCommunities = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const response = await api.get(`/communities?${params.toString()}`);
      setCommunities(response.data.data.communities);
    } catch (error) {
      console.error('Failed to fetch communities', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCommunities();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">UniHub Communities</h1>
            <p className="mt-2 text-white/60">Join student clubs, tech chapters, and interest groups.</p>
          </div>
          <Button className="mt-4 md:mt-0">Create Community</Button>
        </div>

        {/* Search */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-sm mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="text" 
              placeholder="Search communities by name or topic..."
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all text-white placeholder:text-white/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Communities Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : communities.length === 0 ? (
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
            <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No communities found</h3>
            <p className="text-white/60 mt-1">Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link to={`/communities/${community.id}`} key={community.id} className="block group">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary-500/50 rounded-2xl overflow-hidden hover:shadow-elevated transition-all flex flex-col h-full">
                  
                  {/* Banner & Avatar */}
                  <div className="h-28 bg-gradient-to-r from-primary-600 to-accent-600 relative">
                    {community.bannerUrl && (
                      <img src={community.bannerUrl} alt={community.name} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute -bottom-6 left-6">
                      <div className="w-14 h-14 rounded-2xl bg-black/40 border-2 border-white/10 shadow-md flex items-center justify-center overflow-hidden">
                        {community.avatarUrl ? (
                          <img src={community.avatarUrl} alt={community.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-6 h-6 text-white/60" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 px-6 pb-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                        {community.name}
                      </h2>
                      {community.isPrivate ? (
                        <Badge variant="outline" className="text-white/60 border-white/10">Private</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-success-500/20 text-success-300 border border-success-500/30">Public</Badge>
                      )}
                    </div>

                    <p className="text-white/80 text-sm line-clamp-2 mb-6 leading-relaxed">
                      {community.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-white/40" />
                        <span className="font-semibold text-white">{community._count.members}</span> Members
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-white/40" />
                        <span className="font-semibold text-white">{community._count.posts}</span> Posts
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
