// src/components/ui/Button.tsx
'use client';
import clsx from 'clsx';

export default function Button({
  children,
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) {
  return (
    <button {...props} className={clsx(
      variant === 'ghost' ? 'btn-ghost' : 'btn-primary',
      className
    )}>
      {children}
    </button>
  );
}