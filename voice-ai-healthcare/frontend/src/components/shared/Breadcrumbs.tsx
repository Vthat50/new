import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { colors, spacing, typography } from '../../lib/design-system';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

export default function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  const handleClick = (e: React.MouseEvent, href?: string) => {
    if (href && onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing[2],
        padding: `${spacing[2]} 0`,
        fontSize: typography.fontSize.sm,
      }}
    >
      {/* Home Icon */}
      <a
        href="/"
        onClick={(e) => handleClick(e, '/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          color: colors.neutral[600],
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}
        className="breadcrumb-link"
      >
        <Home style={{ width: '16px', height: '16px' }} />
      </a>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {/* Separator */}
            <ChevronRight
              style={{
                width: '14px',
                height: '14px',
                color: colors.neutral[400],
              }}
            />

            {/* Breadcrumb Item */}
            {isLast ? (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[1],
                  color: colors.neutral[900],
                  fontWeight: typography.fontWeight.medium,
                }}
                aria-current="page"
              >
                {item.icon}
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[1],
                  color: colors.neutral[600],
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                className="breadcrumb-link"
              >
                {item.icon}
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}

      <style>{`
        .breadcrumb-link:hover {
          color: ${colors.primary[600]};
        }
      `}</style>
    </nav>
  );
}
