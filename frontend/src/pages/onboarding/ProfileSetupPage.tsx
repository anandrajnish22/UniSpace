import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Camera } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SkillSelector } from '@/components/ui/SkillSelector';

const setupSchema = z.object({
  bio: z.string().max(500).optional(),
  university: z.string().min(2, 'University name is required'),
  department: z.string().min(2, 'Department is required'),
  graduationYear: z.coerce.number().min(2020).max(2035),
  githubUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type SetupForm = z.infer<typeof setupSchema>;

export const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SetupForm>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      university: '',
      department: '',
      graduationYear: new Date().getFullYear() + 4,
    }
  });

  const onSubmit = async (data: SetupForm) => {
    try {
      setError(null);
      const response = await api.put('/profiles/me', data);
      
      if (response.data.success) {
        // Update local user state
        setUser({ ...user!, university: data.university });
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-surface-900">Complete Your Profile</h1>
          <p className="mt-2 text-surface-500">Let others know more about you and your skills.</p>
        </div>

        <div className="glass rounded-2xl shadow-elevated p-8">
          {error && (
            <div className="mb-6 p-4 bg-danger-50 text-danger-600 rounded-lg text-sm border border-danger-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Avatar Upload (Mock for now) */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-surface-200 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
                  <Camera className="w-8 h-8 text-surface-400" />
                </div>
                <button type="button" className="absolute bottom-0 right-0 p-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors shadow-sm">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-surface-500 mt-2">Upload photo (Optional)</span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-surface-700 mb-1">Bio</label>
                <textarea
                  className="w-full px-4 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
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

              <Input
                label="LinkedIn URL"
                placeholder="https://linkedin.com/in/username"
                error={errors.linkedinUrl?.message}
                {...register('linkedinUrl')}
              />
            </div>

            <div className="pt-4 border-t border-surface-200">
              <label className="block text-sm font-medium text-surface-700 mb-4">Your Skills</label>
              <SkillSelector />
            </div>

            <div className="pt-6 flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
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
