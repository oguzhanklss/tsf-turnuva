import { Fragment } from 'react';

import { SmartLink } from '@/components/ui/SmartLink';
import { utilityLinks } from '@/config/site';

/** Thin dark bar above the header with the federation links. */
export function UtilityBar() {
  return (
    <div className="utility on-dark">
      <div className="container">
        <span className="utility-title">
          <i aria-hidden="true" />
          TÜRKİYE SATRANÇ FEDERASYONU RESMİ PORTALI
        </span>
        <span className="utility-links">
          {utilityLinks.map((link, index) => (
            <Fragment key={link.title}>
              {index > 0 && <span />}
              <SmartLink href={link.url}>{link.title}</SmartLink>
            </Fragment>
          ))}
        </span>
      </div>
    </div>
  );
}
