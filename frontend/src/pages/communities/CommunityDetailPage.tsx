import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Users, MessageSquare, ThumbsUp, Send, ArrowLeft, Loader2, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const CommunityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Post creation state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await api.get(`/communities/${id}`);
        setCommunity(response.data.data.community);
        setIsMember(response.data.data.isMember || false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load community details');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCommunity();
  }, [id]);

  const handleJoinToggle = async () => {
    setIsJoining(true);
    try {
      const response = await api.post(`/communities/${id}/join`);
      setIsMember(response.data.data.joined);
      const updated = await api.get(`/communities/${id}`);
      setCommunity(updated.data.data.community);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update membership');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPosting(true);
    try {
      await api.post(`/communities/${id}/posts`, {
        title: postTitle,
        content: postContent,
      });
      setPostTitle('');
      setPostContent('');
      const updated = await api.get(`/communities/${id}`);
      setCommunity(updated.data.data.community);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="text-center py-20 text-white">
        <p className="text-danger-400 text-lg mb-4">{error || 'Community not found'}</p>
        <Button onClick={() => navigate('/communities')} variant="outline">Back to Communities</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/communities')}
          className="flex items-center text-white/60 hover:text-white transition-colors mb-6 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Communities
        </button>

        {/* Community Banner Card */}
        <div className="bg-[#121217]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl mb-8">
          <div className="h-44 sm:h-56 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 relative overflow-hidden">
            {community.bannerUrl && (
              <img src={community.bannerUrl} alt={community.name} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-black/20" />
          </div>
          
          <div className="px-6 sm:px-8 pb-8">
            {/* Avatar & Action Row */}
            <div className="flex justify-between items-end -mt-12 sm:-mt-14 mb-4 relative z-20">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#18181f] border-4 border-[#121217] shadow-xl flex items-center justify-center overflow-hidden shrink-0">
                {community.avatarUrl ? (
                  <img src={community.avatarUrl} alt={community.name} className="w-full h-full object-cover" />
                ) : (
                  <Users className="w-10 h-10 text-primary-400" />
                )}
              </div>

              <Button 
                onClick={handleJoinToggle} 
                disabled={isJoining}
                className={`w-full md:w-auto px-6 h-11 shadow-glow ${
                  isMember ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' : ''
                }`}
              >
                {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : isMember ? 'Leave Community' : 'Join Community'}
              </Button>
            </div>

            {/* Title & Stats */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">{community.name}</h1>
              <p className="text-xs sm:text-sm text-white/50 flex items-center gap-2 mt-1">
                <Users className="w-4 h-4 text-primary-400" />
                <span>{community._count?.members || 0} Members</span> • 
                <span>{community._count?.posts || 0} Posts</span>
              </p>
            </div>

            <p className="text-white/80 text-sm sm:text-base max-w-3xl leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
              {community.description}
            </p>
          </div>
        </div>

        {/* Content Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Create Post Form */}
            {isMember && (
              <div className="bg-[#121217]/90 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-primary-400" /> Start a discussion
                </h3>
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Title (optional)"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-primary-500 text-sm outline-none"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                  <textarea
                    required
                    placeholder="Share something with the community..."
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-primary-500 text-sm resize-none h-24 outline-none"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isPosting} size="sm" className="shadow-glow">
                      {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
                      Post
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Posts List */}
            {community.posts?.length === 0 ? (
              <div className="text-center py-12 bg-[#121217]/60 border border-white/10 rounded-2xl">
                <MessageSquare className="w-10 h-10 text-white/30 mx-auto mb-3" />
                <p className="text-white/50 font-medium text-sm">No posts in this community yet.</p>
              </div>
            ) : (
              community.posts?.map((post: any) => (
                <div key={post.id} className="bg-[#121217]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#18181f] border border-white/20 flex items-center justify-center overflow-hidden font-bold text-primary-400">
                      {post.author?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{post.author?.name}</p>
                      <p className="text-xs text-white/40">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {post.title && <h4 className="text-base sm:text-lg font-bold text-white">{post.title}</h4>}
                  <p className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>

                  <div className="flex items-center gap-4 pt-3 border-t border-white/10 text-xs text-white/60">
                    <button className="flex items-center gap-1.5 hover:text-primary-400 transition-colors">
                      <ThumbsUp className="w-4 h-4" /> {post._count?.likes || 0} Likes
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-primary-400 transition-colors">
                      <MessageSquare className="w-4 h-4" /> {post._count?.comments || 0} Comments
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Members Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#121217]/90 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Users className="w-4 h-4 text-primary-400" /> Members ({community.members?.length || 0})
              </h3>
              
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {community.members?.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#18181f] border border-white/20 flex items-center justify-center text-xs font-bold text-primary-400">
                        {m.user?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm text-white/90 font-medium">{m.user?.name}</span>
                    </div>
                    {m.role === 'ADMIN' && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-primary-500/20 text-primary-400 border border-primary-500/30">
                        Admin
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
