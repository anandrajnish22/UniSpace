import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Users, Loader2, ArrowLeft, Send, MessageSquare, ThumbsUp, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export const CommunityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [community, setCommunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);
  
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await api.get(`/communities/${id}`);
        const data = response.data.data.community;
        setCommunity(data);
        
        if (user && data.members) {
          const checkMember = data.members.some((m: any) => m.userId === user.id);
          setIsMember(checkMember);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load community details');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCommunity();
  }, [id, user]);

  const handleJoinToggle = async () => {
    setIsJoining(true);
    try {
      const response = await api.post(`/communities/${id}/join`);
      setIsMember(response.data.data.isMember);
      const updated = await api.get(`/communities/${id}`);
      setCommunity(updated.data.data.community);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to join/leave community');
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (error || !community) return <div className="text-center mt-20 text-danger-500">{error}</div>;

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <button onClick={() => navigate('/communities')} className="flex items-center text-surface-500 hover:text-surface-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Communities
        </button>

        {/* Community Banner Card */}
        <div className="glass rounded-3xl overflow-hidden shadow-elevated bg-white mb-8">
          <div className="h-48 md:h-64 bg-gradient-to-r from-primary-600 to-accent-600 relative">
            {community.bannerUrl && (
              <img src={community.bannerUrl} alt={community.name} className="w-full h-full object-cover" />
            )}
          </div>
          
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-12 mb-6 gap-4">
              <div className="flex items-end gap-6">
                <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden shrink-0">
                  {community.avatarUrl ? (
                    <img src={community.avatarUrl} alt={community.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-10 h-10 text-primary-500" />
                  )}
                </div>
                <div className="mb-1">
                  <h1 className="text-3xl font-display font-bold text-surface-900">{community.name}</h1>
                  <p className="text-sm text-surface-500 flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-surface-400" />
                    <span>{community._count?.members || 0} Members</span> • 
                    <span>{community._count?.posts || 0} Posts</span>
                  </p>
                </div>
              </div>

              <Button 
                onClick={handleJoinToggle} 
                disabled={isJoining}
                variant={isMember ? 'outline' : 'default'}
                className="w-full md:w-auto px-6 h-11"
              >
                {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : isMember ? 'Leave Community' : 'Join Community'}
              </Button>
            </div>

            <p className="text-surface-600 text-base max-w-3xl leading-relaxed">
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
              <div className="glass rounded-2xl p-6 bg-white border border-surface-200">
                <h3 className="text-sm font-semibold text-surface-900 mb-3 flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-primary-500" /> Start a discussion
                </h3>
                <form onSubmit={handleCreatePost} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Title (optional)"
                    className="w-full px-4 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                  <textarea
                    required
                    placeholder="Share something with the community..."
                    className="w-full px-4 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm resize-none h-24"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isPosting} size="sm">
                      {isPosting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-1.5" />}
                      Post
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Posts List */}
            {community.posts?.length === 0 ? (
              <div className="text-center py-12 glass rounded-2xl bg-white">
                <MessageSquare className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="text-surface-500 font-medium">No posts in this community yet.</p>
              </div>
            ) : (
              community.posts?.map((post: any) => (
                <div key={post.id} className="glass rounded-2xl p-6 bg-white border border-surface-200 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center overflow-hidden font-bold text-surface-600">
                      {post.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-surface-900">{post.author.name}</p>
                      <p className="text-xs text-surface-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {post.title && <h4 className="text-lg font-bold text-surface-900">{post.title}</h4>}
                  <p className="text-surface-700 text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>

                  <div className="flex items-center gap-4 pt-3 border-t border-surface-100 text-xs text-surface-500">
                    <button className="flex items-center gap-1 hover:text-primary-600 transition-colors">
                      <ThumbsUp className="w-4 h-4" /> {post._count?.likes || 0} Likes
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary-600 transition-colors">
                      <MessageSquare className="w-4 h-4" /> {post._count?.comments || 0} Comments
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Members Sidebar */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 bg-white border border-surface-200">
              <h3 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-500" /> Members ({community.members?.length || 0})
              </h3>
              
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {community.members?.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center text-xs font-bold text-surface-600">
                        {m.user.name.charAt(0)}
                      </div>
                      <span className="text-sm text-surface-800 font-medium">{m.user.name}</span>
                    </div>
                    {m.role === 'ADMIN' && (
                      <Badge variant="outline" className="text-[10px] bg-primary-50 text-primary-600 border-primary-200">
                        Admin
                      </Badge>
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
