/** Date helpers; every display uses the federation's time zone. */

const ZONE = 'Europe/Istanbul';
const LOCALE = 'tr-TR';

const dayMonth = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long', timeZone: ZONE });
const dayMonthYear = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long', year: 'numeric', timeZone: ZONE });
const dayMonthShort = new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short', timeZone: ZONE });
const monthYear = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric', timeZone: ZONE });
const weekday = new Intl.DateTimeFormat(LOCALE, { weekday: 'long', timeZone: ZONE });
const dateTime = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: ZONE,
});

/** An ISO date (`2026-11-02`) as a Date at noon, so time-zone shifts never move the day. */
export const toDate = (iso: string) => new Date(iso.length === 10 ? `${iso}T12:00:00+03:00` : iso);

export const formatDate = (iso: string) => dayMonthYear.format(toDate(iso));
export const formatDateShort = (iso: string) => dayMonthShort.format(toDate(iso));
export const formatDayMonth = (iso: string) => dayMonth.format(toDate(iso));
export const formatMonthYear = (iso: string) => monthYear.format(toDate(iso));
export const formatWeekday = (iso: string) => weekday.format(toDate(iso));
export const formatDateTime = (iso: string) => dateTime.format(toDate(iso));

/** `24 – 30 Ocak 2026`, or `30 Ocak – 2 Şubat 2026` across months. */
export function formatDateRange(from: string, to: string): string {
  if (from === to) return formatDate(from);
  const a = toDate(from);
  const b = toDate(to);
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  if (sameMonth) return `${a.getDate()} – ${formatDate(to)}`;
  if (a.getFullYear() === b.getFullYear()) return `${formatDayMonth(from)} – ${formatDate(to)}`;
  return `${formatDate(from)} – ${formatDate(to)}`;
}

/** Day number and short month for the calendar date blocks. */
export function dateParts(iso: string): { day: string; month: string; weekday: string } {
  const date = toDate(iso);
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: new Intl.DateTimeFormat(LOCALE, { month: 'short', timeZone: ZONE }).format(date).replace('.', ''),
    weekday: new Intl.DateTimeFormat(LOCALE, { weekday: 'short', timeZone: ZONE }).format(date),
  };
}

/** Whole days from now until `iso`; negative when it has passed. */
export function daysUntil(iso: string, now = new Date()): number {
  return Math.ceil((toDate(iso).getTime() - now.getTime()) / 86_400_000);
}

export const todayIso = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: ZONE }).format(now);

export const currentYear = () => Number(todayIso().slice(0, 4));
