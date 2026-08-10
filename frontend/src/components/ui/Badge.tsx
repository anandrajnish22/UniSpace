import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'accent';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-700/50 text-surface-100 border border-surface-600',
  primary: 'bg-primary-500/15 text-primary-400 border border-primary-500/25',
  success: 'bg-success-500/15 text-success-400 border border-success-500/25',
  warning: 'bg-warning-500/15 text-warning-400 border border-warning-500/25',
  danger: 'bg-danger-500/15 text-danger-400 border border-danger-500/25',
  accent: 'bg-accent-500/15 text-accent-400 border border-accent-500/25',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-success-400',
            variant === 'warning' && 'bg-warning-400',
            variant === 'danger' && 'bg-danger-400',
            variant === 'primary' && 'bg-primary-400',
            variant === 'accent' && 'bg-accent-400',
            variant === 'default' && 'bg-surface-400'
          )}
        />
      )}
      {children}
    </span>
  );
}
