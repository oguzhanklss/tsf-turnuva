import type { Province } from '@/config/provinces';

export type TournamentScope = 'Ulusal' | 'İl' | 'Uluslararası';

/** Registration state, derived from the dates at render time. */
export type RegistrationState = 'open' | 'upcoming' | 'closed' | 'completed';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export type QuestionType = 'text' | 'textarea' | 'boolean' | 'select';

/** One of the tournament's extra questions; the answers are stored with the entry. */
export interface ExtraQuestion {
  id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  help?: string;
  options?: string[];
}

export interface RegulationSection {
  title: string;
  paragraphs: string[];
}

export interface Regulation {
  version: string;
  publishedAt: string;
  summary: string;
  file?: { url: string; sizeLabel: string };
  sections: RegulationSection[];
}

export interface ScheduleItem {
  date: string;
  time: string;
  title: string;
  note?: string;
}

export interface Contact {
  title: string;
  description: string;
  phone?: string;
  email?: string;
}

export interface Participant {
  name: string;
  province: string;
  category: string;
}

export interface Standing {
  rank: number;
  name: string;
  province: string;
  points: number;
}

export interface Results {
  externalUrl?: string;
  files: Array<{ title: string; url: string; sizeLabel: string }>;
  standings: Standing[];
  participantCount: number;
}

export interface Tournament {
  slug: string;
  code: string;
  title: string;
  organizer: string;
  province: Province;
  scope: TournamentScope;
  venue: string;
  district?: string;
  /** Competition days, ISO dates; the date-conflict rule is checked on these. */
  days: string[];
  /** Registration window, ISO date-times in Europe/Istanbul. */
  registrationOpensAt: string;
  registrationClosesAt: string;
  tempo?: string;
  system?: string;
  eligibility?: string;
  chiefArbiter?: string;
  capacity?: number;
  registeredCount: number;
  categories: Category[];
  extraQuestions: ExtraQuestion[];
  regulation: Regulation;
  schedule: ScheduleItem[];
  contacts: Contact[];
  participants: Participant[];
  results?: Results;
  tags?: string[];
}
