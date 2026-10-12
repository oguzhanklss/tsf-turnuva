import type { ReactNode } from 'react';

import { ArrowLink } from '@/components/ui/ArrowLink';

/** Section heading with the red rule, an optional count badge and a “see all” link. */
export function SectionTitle({
  title,
  badge,
  href,
  link = 'Tümünü gör',
  children,
}: {
  title: string;
  badge?: ReactNode;
  href?: string;
  link?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div className="section-heading-title">
        <h2>{title}</h2>
        {badge && <span className="count-badge">{badge}</span>}
      </div>
      {children}
      {href && <ArrowLink href={href}>{link}</ArrowLink>}
    </div>
  );
}
