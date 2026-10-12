import { Fragment, type ReactNode } from 'react';

import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';

export interface Crumb {
  title: string;
  href?: string;
}

/** Breadcrumb and title band at the top of an inner page. */
export function PageTop({
  title,
  subtitle,
  crumbs = [],
  badge,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  /** Trail after “Ana Sayfa”; the last item is the current page when it has no href. */
  crumbs?: Crumb[];
  badge?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="page-top">
      <div className="container">
        <nav className="breadcrumb" aria-label="Sayfa yolu">
          <SmartLink href="/">Ana Sayfa</SmartLink>
          {crumbs.map(crumb => (
            <Fragment key={crumb.title}>
              <Icon name="caret-right" size={12} />
              {crumb.href ? <SmartLink href={crumb.href}>{crumb.title}</SmartLink> : <span>{crumb.title}</span>}
            </Fragment>
          ))}
        </nav>
        <div className="page-heading">
          <div>
            <h1>
              {title}
              {badge}
            </h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children && <div className="page-heading-actions">{children}</div>}
        </div>
      </div>
    </section>
  );
}
