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
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-display font-bold text-gradient">UniSpace</h1>
          </Link>
          <p className="text-surface-500 mt-2">Create your account to get started.</p>
        </div>

        {/* Card */}
        <div className="glass p-8 rounded-2xl shadow-elevated">
          {error && (
            <div className="mb-6 p-4 bg-danger-50 text-danger-600 rounded-lg text-sm border border-danger-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className={`
                flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selectedRole === 'STUDENT' 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-surface-200 bg-white hover:border-primary-200 text-surface-600'}
              `}>
                <input type="radio" value="STUDENT" {...register('role')} className="sr-only" />
                <User className={`w-6 h-6 mb-2 ${selectedRole === 'STUDENT' ? 'text-primary-500' : 'text-surface-400'}`} />
                <span className="font-medium text-sm">Student</span>
              </label>

              <label className={`
                flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                ${selectedRole === 'COMPANY' 
                  ? 'border-primary-500 bg-primary-50 text-primary-700' 
                  : 'border-surface-200 bg-white hover:border-primary-200 text-surface-600'}
              `}>
                <input type="radio" value="COMPANY" {...register('role')} className="sr-only" />
                <Building className={`w-6 h-6 mb-2 ${selectedRole === 'COMPANY' ? 'text-primary-500' : 'text-surface-400'}`} />
                <span className="font-medium text-sm">Company</span>
              </label>
            </div>

            <Input
              label="Full Name"
              placeholder={selectedRole === 'STUDENT' ? "Alex Johnson" : "Jane Doe"}
              icon={<User className="w-5 h-5 text-surface-400" />}
              error={errors.name?.message}
              {...register('name')}
            />

            {selectedRole === 'COMPANY' && (
              <Input
                label="Company Name"
                placeholder="TechCorp Innovations"
                icon={<Building className="w-5 h-5 text-surface-400" />}
                error={errors.companyName?.message}
                {...register('companyName')}
              />
            )}

            <Input
              label="Email"
              type="email"
              placeholder={selectedRole === 'STUDENT' ? "student@university.edu" : "hr@company.com"}
              icon={<Mail className="w-5 h-5 text-surface-400" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              icon={<Lock className="w-5 h-5 text-surface-400" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-surface-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Sign in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
