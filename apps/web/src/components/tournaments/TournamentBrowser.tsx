'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { TournamentCard } from '@/components/tournaments/TournamentCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { provinceLabel, provinces } from '@/config/provinces';
import { registrationState, startDate } from '@/lib/tournaments';
import type { RegistrationState, Tournament, TournamentScope } from '@/types/tournament';

const SCOPES: Array<{ key: string; label: string; value?: TournamentScope }> = [
  { key: 'tumu', label: 'Tümü' },
  { key: 'ulusal', label: 'Ulusal', value: 'Ulusal' },
  { key: 'il', label: 'İl / Yerel', value: 'İl' },
  { key: 'uluslararasi', label: 'Uluslararası', value: 'Uluslararası' },
];

const STATES: Array<{ key: string; label: string; values?: RegistrationState[] }> = [
  { key: 'tumu', label: 'Tümü' },
  { key: 'acik', label: 'Başvuru Açık', values: ['open'] },
  { key: 'yakinda', label: 'Yakında', values: ['upcoming'] },
  { key: 'gecmis', label: 'Geçmiş', values: ['closed', 'completed'] },
];

const SORTS = [
  { key: 'kapanis', label: 'Başvuru Bitiş Tarihine Göre (En Yakın)' },
  { key: 'baslangic', label: 'Turnuva Başlangıç Tarihi' },
  { key: 'il', label: 'İl Adına Göre (A-Z)' },
  { key: 'doluluk', label: 'Kayıt Yoğunluğuna Göre' },
];

const collator = new Intl.Collator('tr');

/**
 * Listing with the filters in the URL (`?q=&il=&kapsam=&durum=&sira=`), so a
 * filtered view can be linked to and the back button restores it.
 */
export function TournamentBrowser({ tournaments }: { tournaments: Tournament[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const query = params.get('q') ?? '';
  const provinceCode = params.get('il') ?? '';
  const scopeKey = params.get('kapsam') ?? 'tumu';
  const stateKey = params.get('durum') ?? 'tumu';
  const sortKey = params.get('sira') ?? 'kapanis';

  const update = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value && value !== 'tumu') next.set(key, value);
      else next.delete(key);
    }
    const search = next.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const entry of STATES) {
      if (!entry.values) continue;
      result[entry.key] = tournaments.filter(t => entry.values!.includes(registrationState(t))).length;
    }
    return result;
  }, [tournaments]);

  const filtered = useMemo(() => {
    const scope = SCOPES.find(entry => entry.key === scopeKey)?.value;
    const states = STATES.find(entry => entry.key === stateKey)?.values;
    const needle = query.trim().toLocaleLowerCase('tr-TR');
    const list = tournaments.filter(tournament => {
      if (scope && tournament.scope !== scope) return false;
      if (states && !states.includes(registrationState(tournament))) return false;
      if (provinceCode && tournament.province.code !== provinceCode) return false;
      if (needle) {
        const haystack = `${tournament.title} ${tournament.venue} ${tournament.province.name} ${tournament.organizer}`.toLocaleLowerCase('tr-TR');
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
    const rank = (t: Tournament) => ({ open: 0, upcoming: 1, closed: 2, completed: 3 })[registrationState(t)];
    return list.sort((a, b) => {
      if (sortKey === 'il') return collator.compare(a.province.name, b.province.name);
      if (sortKey === 'baslangic') return startDate(a).localeCompare(startDate(b));
      if (sortKey === 'doluluk') {
        const share = (t: Tournament) => (t.capacity ? t.registeredCount / t.capacity : 0);
        return share(b) - share(a);
      }
      return rank(a) - rank(b) || a.registrationClosesAt.localeCompare(b.registrationClosesAt);
    });
  }, [tournaments, query, provinceCode, scopeKey, stateKey, sortKey]);

  const hasFilters = Boolean(query || provinceCode || scopeKey !== 'tumu' || stateKey !== 'tumu');
  const reset = () => router.replace(pathname, { scroll: false });

  return (
    <>
      <div className="filter-panel">
        <div className="filter-top">
          <label className="search-field">
            <Icon name="magnifying-glass" size={18} />
            <span className="visually-hidden">Turnuva ara</span>
            <input
              type="search"
              placeholder="Turnuva adı, salon veya anahtar kelime ara…"
              value={query}
              onChange={event => update({ q: event.target.value })}
            />
          </label>
          <label className="select-field">
            <Icon name="map-pin" size={18} />
            <span className="visually-hidden">İl</span>
            <select value={provinceCode} onChange={event => update({ il: event.target.value })}>
              <option value="">Tüm İller (81 İl)</option>
              {provinces.map(province => (
                <option key={province.code} value={province.code}>
                  {provinceLabel(province)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="filter-bottom">
          <div className="filter-groups">
            <div className="segmented" role="group" aria-label="Kapsam">
              <span className="label">Kapsam:</span>
              {SCOPES.map(entry => (
                <button
                  key={entry.key}
                  className={scopeKey === entry.key ? 'active' : ''}
                  aria-pressed={scopeKey === entry.key}
                  onClick={() => update({ kapsam: entry.key })}
                >
                  {entry.label}
                </button>
              ))}
            </div>
            <div className="segmented" role="group" aria-label="Durum">
              <span className="label">Durum:</span>
              {STATES.map(entry => (
                <button
                  key={entry.key}
                  className={stateKey === entry.key ? 'active' : ''}
                  aria-pressed={stateKey === entry.key}
                  onClick={() => update({ durum: entry.key })}
                >
                  {entry.label}
                  {entry.values && <small>{counts[entry.key]}</small>}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-tools">
            <div className="view-switch" role="group" aria-label="Görünüm">
              <button className={view === 'grid' ? 'active' : ''} aria-pressed={view === 'grid'} aria-label="Kart görünümü" onClick={() => setView('grid')}>
                <Icon name="squares-four" size={18} />
              </button>
              <button className={view === 'list' ? 'active' : ''} aria-pressed={view === 'list'} aria-label="Liste görünümü" onClick={() => setView('list')}>
                <Icon name="list" size={18} />
              </button>
            </div>
            <button className="button secondary small" onClick={reset} disabled={!hasFilters}>
              <Icon name="x" size={14} />
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      <div className="list-summary">
        <span>
          <i aria-hidden="true" />
          Toplam <b>{filtered.length}</b> turnuva listeleniyor
        </span>
        <label className="select-field">
          <span className="label">Sıralama:</span>
          <select value={sortKey} onChange={event => update({ sira: event.target.value })}>
            {SORTS.map(sort => (
              <option key={sort.key} value={sort.key}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState>
          <button className="button secondary" onClick={reset}>
            Filtreleri Sıfırla
          </button>
        </EmptyState>
      ) : (
        <div className={view === 'grid' ? 'card-grid' : 'tournament-list'}>
          {filtered.map(tournament => (
            <TournamentCard key={tournament.slug} tournament={tournament} compact={view === 'list'} />
          ))}
        </div>
      )}
    </>
  );
}
