import type { ReactNode } from 'react';

import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { isExternalUrl } from '@/lib/text';

/** Text link with a trailing arrow that points out of the site when relevant. */
export function ArrowLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <SmartLink className={`arrow-link ${className}`} href={href}>
      {children}
      <Icon name={isExternalUrl(href) ? 'arrow-up-right' : 'arrow-right'} size={18} />
    </SmartLink>
  );
}
