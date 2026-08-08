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
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-surface-900">Profile Not Found</h2>
          <p className="text-surface-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="glass rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary-500 to-accent-500 opacity-20"></div>
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6 mt-8">
            <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
              <span className="text-4xl font-bold text-primary-500">{profile.name.charAt(0)}</span>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-display font-bold text-surface-900">{profile.name}</h1>
              
              {profile.profile?.university && (
                <div className="flex items-center justify-center md:justify-start text-surface-600 mt-2 gap-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>{profile.profile.university} • {profile.profile.department}</span>
                  {profile.profile.graduationYear && (
                    <Badge variant="outline">Class of {profile.profile.graduationYear}</Badge>
                  )}
                </div>
              )}

              {profile.profile?.bio && (
                <p className="text-surface-700 mt-4 max-w-2xl">{profile.profile.bio}</p>
              )}

              <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                {profile.profile?.githubUrl && (
                  <a href={profile.profile.githubUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-surface-900 transition-colors">
                    <Code2 className="w-5 h-5" />
                  </a>
                )}
                {profile.profile?.linkedinUrl && (
                  <a href={profile.profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-surface-900 transition-colors">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {profile.profile?.portfolioUrl && (
                  <a href={profile.profile.portfolioUrl} target="_blank" rel="noreferrer" className="text-surface-400 hover:text-surface-900 transition-colors">
                    <LinkIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="glass rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-500" />
              Skills & Expertise
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
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
