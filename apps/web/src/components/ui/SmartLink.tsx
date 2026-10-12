import NextLink from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

import { isExternalUrl } from '@/lib/text';

type SmartLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
  children: ReactNode;
};

/** The one link component: local routes go through `next/link`, the rest open as plain anchors. */
export function SmartLink({ href, children, ...props }: SmartLinkProps) {
  if (href.startsWith('#')) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  if (isExternalUrl(href) || /\.[a-z0-9]{2,4}$/i.test(href)) {
    const opensTab = !/^(mailto|tel)/.test(href);
    return (
      <a href={href} {...(opensTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>
        {children}
      </a>
    );
  }
  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
}
