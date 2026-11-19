import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SkillSelector } from '@/components/ui/SkillSelector';

const profileSetupSchema = z.object({
  bio: z.string().max(500).optional(),
  university: z.string().min(2, 'University is required'),
  department: z.string().min(2, 'Department is required'),
  graduationYear: z.coerce.number().min(2020).max(2035).optional(),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ProfileSetupForm = z.infer<typeof profileSetupSchema>;

export const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileSetupForm>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      university: '',
      department: '',
    }
  });

  const onSubmit = async (data: ProfileSetupForm) => {
    try {
      setError(null);
      const response = await api.put('/profiles/me', data);
      
      if (response.data.success) {
        setUser({ ...user!, ...response.data.data.user });
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-white">Complete Your Profile</h1>
          <p className="mt-2 text-white/60">Let others know more about you and your skills.</p>
        </div>

        <div className="bg-[#121217]/90 border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 bg-danger-500/20 text-danger-400 rounded-xl text-sm border border-danger-500/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#18181f] border-2 border-white/20 shadow-md flex items-center justify-center overflow-hidden">
                  <Camera className="w-8 h-8 text-white/40" />
                </div>
                <button type="button" className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-glow">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-white/50 mt-2">Upload photo (Optional)</span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-white/70 mb-2">Bio</label>
                <textarea
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                  rows={3}
                  placeholder="Tell us about yourself..."
                  {...register('bio')}
                />
              </div>

              <Input
                label="University"
                placeholder="State University"
                error={errors.university?.message}
                {...register('university')}
              />

              <Input
                label="Department / Major"
                placeholder="Computer Science"
                error={errors.department?.message}
                {...register('department')}
              />

              <Input
                label="Graduation Year"
                type="number"
                error={errors.graduationYear?.message}
                {...register('graduationYear')}
              />

              <Input
                label="GitHub URL"
                placeholder="https://github.com/username"
                error={errors.githubUrl?.message}
                {...register('githubUrl')}
              />

              <div className="sm:col-span-2">
                <Input
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/in/username"
                  error={errors.linkedinUrl?.message}
                  {...register('linkedinUrl')}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <label className="block text-xs uppercase tracking-wider font-semibold text-white/70 mb-4">Your Skills</label>
              <SkillSelector />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="shadow-glow px-8">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save & Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
