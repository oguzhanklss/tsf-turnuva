import { SmartLink } from '@/components/ui/SmartLink';
import { site } from '@/config/site';
import { asset } from '@/lib/assets';

/** Federation logo and the portal wordmark, linking home. */
export function Brand() {
  return (
    <SmartLink href="/" className="brand" aria-label={`${site.name} turnuva başvuru ana sayfa`}>
      <img src={asset(site.logo)} alt={`${site.name} logosu`} />
      <span>
        <strong>TÜRKİYE SATRANÇ FEDERASYONU</strong>
        <small>{site.portalName.toLocaleUpperCase('tr-TR')}</small>
      </span>
    </SmartLink>
  );
}
