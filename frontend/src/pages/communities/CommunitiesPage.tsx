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
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900">UniHub Communities</h1>
            <p className="mt-2 text-surface-500">Join student clubs, tech chapters, and interest groups.</p>
          </div>
          <Button className="mt-4 md:mt-0">Create Community</Button>
        </div>

        {/* Search */}
        <div className="glass p-4 rounded-xl shadow-sm mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input 
              type="text" 
              placeholder="Search communities by name or topic..."
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all"
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
          <div className="text-center py-20 glass rounded-xl">
            <Users className="w-12 h-12 text-surface-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-surface-900">No communities found</h3>
            <p className="text-surface-500 mt-1">Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Link to={`/communities/${community.id}`} key={community.id} className="block group">
                <div className="glass rounded-2xl overflow-hidden hover:shadow-elevated transition-all border border-transparent group-hover:border-primary-200 bg-white flex flex-col h-full">
                  
                  {/* Banner & Avatar */}
                  <div className="h-28 bg-gradient-to-r from-primary-600 to-accent-600 relative">
                    {community.bannerUrl && (
                      <img src={community.bannerUrl} alt={community.name} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute -bottom-6 left-6">
                      <div className="w-14 h-14 rounded-2xl bg-white border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                        {community.avatarUrl ? (
                          <img src={community.avatarUrl} alt={community.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-6 h-6 text-primary-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 px-6 pb-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-surface-900 group-hover:text-primary-600 transition-colors">
                        {community.name}
                      </h2>
                      {community.isPrivate ? (
                        <Badge variant="outline" className="text-surface-500">Private</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-success-50 text-success-700">Public</Badge>
                      )}
                    </div>

                    <p className="text-surface-600 text-sm line-clamp-2 mb-6 leading-relaxed">
                      {community.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-surface-100 flex items-center justify-between text-xs text-surface-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-surface-400" />
                        <span className="font-semibold text-surface-700">{community._count.members}</span> Members
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-surface-400" />
                        <span className="font-semibold text-surface-700">{community._count.posts}</span> Posts
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
