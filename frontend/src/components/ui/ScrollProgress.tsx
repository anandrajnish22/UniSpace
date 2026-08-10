import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    // Call once to initialize
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      id="scroll-progress"
      className="fixed top-0 left-0 h-[2px] z-[9999] bg-gradient-to-r from-primary-500 to-accent-500 shadow-glow transition-[width] duration-100 ease-linear"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-label="Page scroll progress"
    />
  );
}
