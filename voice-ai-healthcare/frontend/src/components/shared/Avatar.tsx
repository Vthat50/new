import React from 'react';
import { colors } from '../../lib/design-system';

interface AvatarProps {
  name: string;
  size?: number;
  fontSize?: string;
}

export default function Avatar({ name, size = 40, fontSize = '14px' }: AvatarProps) {
  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const getColorFromName = (name: string): string => {
    const colors = [
      '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
      '#06b6d4', '#6366f1', '#f97316', '#14b8a6', '#a855f7'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const initials = getInitials(name);
  const backgroundColor = getColorFromName(name);

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize,
        fontWeight: 600,
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
