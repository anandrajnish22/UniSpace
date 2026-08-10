import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { MapPin, Link as LinkIcon, Code2, Globe, Briefcase, GraduationCap, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface Skill {
  proficiency: string;
  skill: { name: string; category: string };
}

interface ProfileData {
  id: string;
  name: string;
  role: string;
  profile?: {
    bio: string;
    university: string;
    department: string;
    graduationYear: number;
    githubUrl: string;
    linkedinUrl: string;
    portfolioUrl: string;
  };
  skills: Skill[];
}

export const PublicProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profiles/${id}`);
        setProfile(response.data.data.user);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) fetchProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent text-white">
        <div className="text-center bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-md mx-auto">
          <h2 className="text-2xl font-bold font-display text-white">Profile Not Found</h2>
          <p className="text-white/60 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          {/* Banner Glow */}
          <div className="absolute top-0 left-0 w-full h-36 bg-gradient-to-r from-primary-500/30 via-accent-500/20 to-orange-500/30 border-b border-white/10"></div>
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 mt-10">
            <div className="w-32 h-32 rounded-full bg-slate-950 border-4 border-white/20 shadow-xl flex items-center justify-center overflow-hidden shrink-0 ring-4 ring-primary-500/30">
              <span className="text-5xl font-bold text-primary-400">{profile.name.charAt(0)}</span>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-display font-bold text-white tracking-wide">{profile.name}</h1>
              
              {profile.profile?.university && (
                <div className="flex flex-wrap items-center justify-center md:justify-start text-white/70 mt-2 gap-2 text-sm">
                  <GraduationCap className="w-5 h-5 text-primary-400" />
                  <span>{profile.profile.university} • {profile.profile.department}</span>
                  {profile.profile.graduationYear && (
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white/80">Class of {profile.profile.graduationYear}</Badge>
                  )}
                </div>
              )}

              {profile.profile?.bio && (
                <p className="text-white/80 mt-4 max-w-2xl leading-relaxed text-sm">{profile.profile.bio}</p>
              )}

              <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                {profile.profile?.githubUrl && (
                  <a href={profile.profile.githubUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-primary-500/50 transition-all">
                    <Code2 className="w-5 h-5" />
                  </a>
                )}
                {profile.profile?.linkedinUrl && (
                  <a href={profile.profile.linkedinUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-primary-500/50 transition-all">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {profile.profile?.portfolioUrl && (
                  <a href={profile.profile.portfolioUrl} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-primary-500/50 transition-all">
                    <LinkIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
              <Briefcase className="w-5 h-5 text-primary-400" />
              Skills & Expertise
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, index) => (
                <Badge key={index} variant="secondary" className="px-3.5 py-1.5 text-sm bg-primary-500/10 border border-primary-500/30 text-primary-300">
                  {s.skill.name}
                  <span className="ml-2 text-xs opacity-60">({s.proficiency.toLowerCase()})</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
