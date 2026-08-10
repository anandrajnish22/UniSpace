import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', data);
      
      if (response.data.success) {
        const { user, accessToken } = response.data.data;
        localStorage.setItem('unispace_token', accessToken);
        setUser(user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
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

      <div className="w-full max-w-md relative z-10">
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
          <p className="mt-3 text-surface-200 text-sm tracking-wide">
            Welcome back! Please enter your details.
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
            <div className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="student@university.edu"
                leftIcon={<Mail className="w-5 h-5 text-surface-100" />}
                error={errors.email?.message}
                {...register('email')}
                className="bg-black/20 border-surface-700/50 focus:border-primary-500/50 transition-colors"
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="w-5 h-5 text-surface-100" />}
                error={errors.password?.message}
                {...register('password')}
                className="bg-black/20 border-surface-700/50 focus:border-primary-500/50 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer appearance-none w-4 h-4 rounded border border-surface-600 bg-black/20 checked:bg-primary-500 checked:border-primary-500 transition-all cursor-pointer" />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 14" fill="none">
                    <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                  </svg>
                </div>
                <span className="text-surface-100 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-glow-sm hover:shadow-glow transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-surface-100">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
