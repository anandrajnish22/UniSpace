import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', disabled, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

    const sizes: Record<string, string> = {
      sm:  'px-3.5 py-1.5 text-xs gap-1.5',
      md:  'px-5 py-2.5 text-sm gap-2',
      lg:  'px-7 py-3.5 text-base gap-2.5',
    };

    const variants: Record<string, string> = {
      // Primary: red-orange gradient (ra.dev style)
      default:
        'text-white shadow-[0_0_20px_rgba(232,75,58,0.3)] hover:shadow-[0_0_30px_rgba(232,75,58,0.5)] hover:-translate-y-0.5 active:translate-y-0',

      // Secondary: dark surface
      secondary:
        'bg-surface-700 text-surface-50 border border-surface-600 hover:bg-surface-600 hover:border-surface-500',

      // Outline: transparent with red-orange border
      outline:
        'bg-transparent text-primary-400 border border-primary-500/30 hover:border-primary-500/60 hover:bg-primary-500/8 hover:text-primary-300',

      // Ghost: no border
      ghost:
        'bg-transparent text-surface-100 hover:bg-surface-700 hover:text-surface-50',

      // Danger
      danger:
        'bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:-translate-y-0.5',
    };

    // Gradient inline style for default variant only
    const gradientStyle = variant === 'default' ? {
      background: 'linear-gradient(135deg, #e84b3a, #f5a623)',
    } : {};

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(base, sizes[size], variants[variant], className)}
        style={gradientStyle}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
