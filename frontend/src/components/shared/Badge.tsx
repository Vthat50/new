import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    success: 'bg-success text-white',
    warning: 'bg-warning text-gray-900',
    danger: 'bg-danger text-white',
    info: 'bg-blue-500 text-white',
    default: 'bg-gray-200 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
