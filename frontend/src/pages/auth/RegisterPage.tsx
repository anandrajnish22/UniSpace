import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Building, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'COMPANY']),
  companyName: z.string().optional(),
}).refine((data) => {
  if (data.role === 'COMPANY' && !data.companyName) return false;
  return true;
}, {
  message: "Company name is required",
  path: ["companyName"]
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'STUDENT'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', data);
      
      if (response.data.success) {
        const { user, accessToken } = response.data.data;
        localStorage.setItem('unispace_token', accessToken);
        setUser(user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* ── Background Image ── */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/bg-abstract.png')" }} 
      />
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 z-0 bg-black/50 pointer-events-none mix-blend-multiply" />

      {/* ── Advanced Ambient Background ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        {/* Vibrant Glowing Orbs for Glassmorphism */}
        <div 
          className="absolute rounded-full mix-blend-screen"
          style={{ 
            width: '600px', height: '600px', 
            background: 'radial-gradient(circle, rgba(232,75,58,0.4) 0%, rgba(232,75,58,0) 70%)',
            top: '50%', left: '50%', transform: 'translate(-80%, -50%)',
            filter: 'blur(60px)',
            animation: 'floatBadge 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute rounded-full mix-blend-screen"
          style={{ 
            width: '500px', height: '500px', 
            background: 'radial-gradient(circle, rgba(245,166,35,0.3) 0%, rgba(245,166,35,0) 70%)',
            top: '50%', left: '50%', transform: 'translate(-20%, -30%)',
            filter: 'blur(60px)',
            animation: 'floatBadge 12s ease-in-out infinite reverse'
          }}
        />
        
        {/* subtle grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}></div>
      </div>

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-block group">
            <h1
              className="text-4xl font-bold text-gradient transition-transform duration-300 group-hover:scale-105"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              UniSpace
            </h1>
          </Link>
          <p className="mt-3 text-surface-100 text-sm tracking-wide">
            Create your account to get started.
          </p>
        </div>

        {/* Transparent Glass Card */}
        <div 
          className="p-8 sm:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden" 
          style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(24px) saturate(1.5)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          {error && (
            <div className="mb-6 p-4 bg-red-950/40 text-red-400 rounded-xl text-sm border border-red-500/20 flex items-start gap-3 backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className={`
                flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all backdrop-blur-sm
                ${selectedRole === 'STUDENT' 
                  ? 'border-primary-500 bg-primary-500/20 text-white shadow-glow-sm' 
                  : 'border-surface-600/50 bg-black/20 hover:border-surface-500 text-surface-100 hover:text-white'}
              `}>
                <input type="radio" value="STUDENT" {...register('role')} className="sr-only" />
                <User className={`w-6 h-6 mb-2 transition-colors ${selectedRole === 'STUDENT' ? 'text-primary-500' : 'text-surface-200 group-hover:text-surface-100'}`} />
                <span className="font-medium text-sm">Student</span>
              </label>

              <label className={`
                flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all backdrop-blur-sm
                ${selectedRole === 'COMPANY' 
                  ? 'border-primary-500 bg-primary-500/20 text-white shadow-glow-sm' 
                  : 'border-surface-600/50 bg-black/20 hover:border-surface-500 text-surface-100 hover:text-white'}
              `}>
                <input type="radio" value="COMPANY" {...register('role')} className="sr-only" />
                <Building className={`w-6 h-6 mb-2 transition-colors ${selectedRole === 'COMPANY' ? 'text-primary-500' : 'text-surface-200 group-hover:text-surface-100'}`} />
                <span className="font-medium text-sm">Company</span>
              </label>
            </div>

            <div className="space-y-5">
              <Input
                label="Full Name"
                placeholder={selectedRole === 'STUDENT' ? "Alex Johnson" : "Jane Doe"}
                leftIcon={<User className="w-5 h-5 text-surface-100" />}
                error={errors.name?.message}
                {...register('name')}
                className="bg-black/20 border-surface-700/50 focus:border-primary-500/50 transition-colors"
              />

              {selectedRole === 'COMPANY' && (
                <Input
                  label="Company Name"
                  placeholder="TechCorp Innovations"
                  leftIcon={<Building className="w-5 h-5 text-surface-100" />}
                  error={errors.companyName?.message}
                  {...register('companyName')}
                  className="bg-black/20 border-surface-700/50 focus:border-primary-500/50 transition-colors"
                />
              )}

              <Input
                label="Email"
                type="email"
                placeholder={selectedRole === 'STUDENT' ? "student@university.edu" : "hr@company.com"}
                leftIcon={<Mail className="w-5 h-5 text-surface-100" />}
                error={errors.email?.message}
                {...register('email')}
                className="bg-black/20 border-surface-700/50 focus:border-primary-500/50 transition-colors"
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                leftIcon={<Lock className="w-5 h-5 text-surface-100" />}
                error={errors.password?.message}
                {...register('password')}
                className="bg-black/20 border-surface-700/50 focus:border-primary-500/50 transition-colors"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-glow-sm hover:shadow-glow transition-all duration-300 mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-surface-100">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
