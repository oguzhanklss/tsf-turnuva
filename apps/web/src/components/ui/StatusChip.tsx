import type { RegistrationState } from '@/types/tournament';
import { STATE_LABELS } from '@/lib/tournaments';

const TONES: Record<RegistrationState, string> = {
  open: 'open',
  upcoming: 'soon',
  closed: 'closed',
  completed: 'closed',
};

/** Registration state badge; also usable with a custom label and tone. */
export function StatusChip({
  state,
  label,
  tone,
  dot = true,
}: {
  state?: RegistrationState;
  label?: string;
  tone?: 'open' | 'soon' | 'closed' | 'neutral' | 'blue' | 'navy' | 'red';
  dot?: boolean;
}) {
  const resolvedTone = tone ?? (state ? TONES[state] : 'neutral');
  const text = label ?? (state ? STATE_LABELS[state] : '');
  return (
    <span className={`chip chip-${resolvedTone}`}>
      {dot && state && <i aria-hidden="true" />}
      {text}
    </span>
  );
}
