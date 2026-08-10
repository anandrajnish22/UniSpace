import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'default';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'text-white shadow-[0_0_20px_rgba(232,75,58,0.3)] hover:shadow-[0_0_30px_rgba(232,75,58,0.5)] hover:-translate-y-0.5 active:translate-y-0',
  default:
    'text-white shadow-[0_0_20px_rgba(232,75,58,0.3)] hover:shadow-[0_0_30px_rgba(232,75,58,0.5)] hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-surface-700 text-surface-50 border border-surface-600 hover:bg-surface-600 hover:border-surface-500',
  outline:
    'border-2 border-primary-500/30 text-primary-400 hover:bg-primary-500/10 hover:border-primary-500/60',
  ghost:
    'text-surface-100 hover:bg-surface-700 hover:text-surface-50',
  danger:
    'bg-danger-600 text-white hover:bg-danger-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:-translate-y-0.5 active:translate-y-0',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3 text-base gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isGradient = variant === 'primary' || variant === 'default';
    const gradientStyle = isGradient ? {
      background: 'linear-gradient(135deg, #e84b3a, #f5a623)',
    } : {};

    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-xl',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer select-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        style={{ ...gradientStyle, ...(props.style || {}) }}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
