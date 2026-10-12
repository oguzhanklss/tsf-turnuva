import type { ReactNode } from 'react';

import { Icon } from '@/components/ui/Icon';

/** Shown when a filter or search returns nothing. */
export function EmptyState({
  title = 'Kriterlere uygun turnuva bulunamadı',
  text = 'Arama kelimenizi kontrol edin, filtre kriterlerinizi genişletin veya farklı bir il seçin.',
  icon = 'magnifying-glass',
  children,
}: {
  title?: string;
  text?: string;
  icon?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Icon name={icon} size={38} />
      <h3>{title}</h3>
      <p>{text}</p>
      {children}
    </div>
  );
}
