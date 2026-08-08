import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
}

export const Badge = ({ className, variant = 'default', children, ...props }: BadgeProps) => {
  const base = 'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors duration-200 leading-none tracking-wide';

  const variants: Record<string, string> = {
    // Default: subtle red-orange on dark bg
    default:
      'bg-primary-500/15 text-primary-400 border border-primary-500/25',

    // Secondary: muted surface
    secondary:
      'bg-surface-700 text-surface-100 border border-surface-600',

    // Outline only
    outline:
      'bg-transparent border border-surface-600 text-surface-100',

    success:
      'bg-success-500/15 text-success-400 border border-success-500/25',

    warning:
      'bg-amber-500/15 text-amber-400 border border-amber-500/25',

    danger:
      'bg-red-500/15 text-red-400 border border-red-500/25',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
