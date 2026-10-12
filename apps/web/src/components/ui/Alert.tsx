import type { ReactNode } from 'react';

import { Icon } from '@/components/ui/Icon';

/** Bordered notice; `tone` picks the colour, the left icon names the kind. */
export function Alert({
  tone = 'info',
  title,
  icon,
  children,
  role,
}: {
  tone?: 'info' | 'error' | 'warning' | 'success';
  title?: string;
  icon?: string;
  children: ReactNode;
  role?: 'alert' | 'status';
}) {
  const defaultIcon = { info: 'info', error: 'x', warning: 'clock', success: 'check' }[tone];
  return (
    <div className={`alert alert-${tone}`} role={role}>
      <span className="alert-icon">
        <Icon name={icon ?? defaultIcon} size={20} />
      </span>
      <div className="alert-body">
        {title && <strong>{title}</strong>}
        {children}
      </div>
    </div>
  );
}
