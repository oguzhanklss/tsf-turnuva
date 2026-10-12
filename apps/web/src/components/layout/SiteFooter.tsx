import { Fragment } from 'react';

import { Brand } from '@/components/layout/Brand';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { footerColumns, site, socialLinks } from '@/config/site';

/** Site footer: federation address, link columns and social accounts. */
export function SiteFooter() {
  return (
    <footer className="footer on-dark">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>
            {site.address.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
          <a href={site.phone.href}>Tel: {site.phone.label}</a>
          <div className="socials">
            {socialLinks.map(account => (
              <SmartLink key={account.title} href={account.url} aria-label={account.title}>
                <Icon name={account.icon} />
              </SmartLink>
            ))}
          </div>
        </div>
        {footerColumns.map(column => (
          <div key={column.title}>
            <h3>{column.title}</h3>
            {column.items.map(item => (
              <SmartLink key={item.title} href={item.url}>
                {item.title}
              </SmartLink>
            ))}
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <span>{site.copyright}</span>
        <span className="footer-legal">
          <SmartLink href={site.privacyUrl}>KVKK Aydınlatma Metni</SmartLink>
          <SmartLink href={site.privacyUrl}>Gizlilik Politikası</SmartLink>
          <span>{site.version}</span>
        </span>
      </div>
    </footer>
  );
}
