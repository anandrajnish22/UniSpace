import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  lines?: number;
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              'skeleton h-4',
              i === lines - 1 ? 'w-3/4' : 'w-full',
              className
            )}
            style={{ width: i === lines - 1 ? undefined : width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'skeleton',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-xl',
        variant === 'text' && 'h-4 rounded',
        className
      )}
      style={{ width, height }}
    />
  );
}

/** Pre-built skeleton for a card layout */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-surface-200/80 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-1/3 h-4" />
          <Skeleton className="w-1/4 h-3" />
        </div>
      </div>
      <Skeleton lines={3} />
      <div className="flex gap-2">
        <Skeleton className="w-16 h-6 rounded-full" />
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-14 h-6 rounded-full" />
      </div>
    </div>
  );
}
