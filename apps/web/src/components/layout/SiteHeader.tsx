'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Brand } from '@/components/layout/Brand';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { mainLinks } from '@/config/site';

/** Header with the flat main menu; the mobile menu closes on navigation and Escape. */
export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Closing on navigation is an adjustment during render, so the new page never paints with the menu open.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setMobileOpen(false);
  }

  const isActive = (url: string) => pathname === url || pathname.startsWith(`${url}/`);

  return (
    <header
      className="site-header"
      onKeyDown={event => {
        if (event.key === 'Escape') setMobileOpen(false);
      }}
    >
      <UtilityBar />
      <div className="nav-shell container">
        <Brand />
        <nav className="desktop-nav" aria-label="Ana menü">
          {mainLinks.map(link => (
            <SmartLink key={link.url} href={link.url} className={isActive(link.url) ? 'active' : ''}>
              {link.title}
            </SmartLink>
          ))}
        </nav>
        <div className="nav-actions">
          <SmartLink className="icon-button search-button" href="/turnuvalar" aria-label="Turnuva ara">
            <Icon name="magnifying-glass" size={24} />
          </SmartLink>
          <SmartLink className="button primary desktop-action" href="/turnuvalar?durum=acik">
            Başvuru Yap
          </SmartLink>
          <button
            className="icon-button mobile-menu-button"
            aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? 'x' : 'list'} size={28} />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobil menü">
          {mainLinks.map(link => (
            <SmartLink key={link.url} href={link.url} className={isActive(link.url) ? 'active' : ''}>
              {link.title}
            </SmartLink>
          ))}
          <SmartLink className="button primary" href="/turnuvalar?durum=acik">
            Başvuru Yap
          </SmartLink>
        </nav>
      )}
    </header>
  );
}
