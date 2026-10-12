import type { RegistrationState, Tournament } from '@/types/tournament';
import { daysUntil, toDate, todayIso } from './dates';

/** The registration state of a tournament at `now`. */
export function registrationState(tournament: Tournament, now = new Date()): RegistrationState {
  const lastDay = tournament.days.at(-1) ?? tournament.days[0];
  if (lastDay < todayIso(now)) return 'completed';
  if (now < toDate(tournament.registrationOpensAt)) return 'upcoming';
  if (now <= toDate(tournament.registrationClosesAt)) return 'open';
  return 'closed';
}

export const STATE_LABELS: Record<RegistrationState, string> = {
  open: 'Başvuru Açık',
  upcoming: 'Yakında Açılacak',
  closed: 'Başvuru Kapandı',
  completed: 'Tamamlandı',
};

/** The short line next to the status chip: days left, opening date or a closing note. */
export function stateNote(tournament: Tournament, now = new Date()): string {
  const state = registrationState(tournament, now);
  if (state === 'open') {
    const left = daysUntil(tournament.registrationClosesAt, now);
    return left <= 0 ? 'Bugün son gün' : `Son ${left} gün`;
  }
  if (state === 'upcoming') return `${toDate(tournament.registrationOpensAt).getDate()} ${monthName(tournament.registrationOpensAt)} açılıyor`;
  if (state === 'closed') return 'Süre doldu';
  return 'Sonuçlar yayımlandı';
}

const monthName = (iso: string) =>
  new Intl.DateTimeFormat('tr-TR', { month: 'long', timeZone: 'Europe/Istanbul' }).format(toDate(iso));

export const startDate = (tournament: Tournament) => tournament.days[0];
export const endDate = (tournament: Tournament) => tournament.days.at(-1) ?? tournament.days[0];

export const isOpen = (tournament: Tournament, now = new Date()) => registrationState(tournament, now) === 'open';

/** Capacity used, as a share from 0 to 1; undefined when the tournament has no limit. */
export function occupancy(tournament: Tournament): number | undefined {
  if (!tournament.capacity) return undefined;
  return Math.min(1, tournament.registeredCount / tournament.capacity);
}

export const tournamentPath = (tournament: Pick<Tournament, 'slug'>) => `/turnuvalar/${tournament.slug}`;
