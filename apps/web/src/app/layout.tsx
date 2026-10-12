import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { site } from '@/config/site';
import { asset } from '@/lib/assets';
import '@/styles/main.scss';

export const metadata: Metadata = {
  title: { default: `Turnuva Başvuru | ${site.shortName}`, template: '%s | TSF Turnuva' },
  description: site.description,
  icons: { icon: asset(site.logo) },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
