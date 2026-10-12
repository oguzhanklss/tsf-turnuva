'use client';

import { useMemo, useState } from 'react';

import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { provinceLabel, provinces } from '@/config/provinces';
import { dateParts, formatDateRange, formatMonthYear, formatWeekday, todayIso } from '@/lib/dates';
import { endDate, registrationState, startDate, tournamentPath } from '@/lib/tournaments';
import type { Tournament } from '@/types/tournament';

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

/** Year calendar: a list grouped by month, or a month grid, with a province filter. */
export function CalendarView({ tournaments }: { tournaments: Tournament[] }) {
  const today = todayIso();
  const years = useMemo(
    () => [...new Set(tournaments.map(t => Number(startDate(t).slice(0, 4))))].sort(),
    [tournaments],
  );
  const [year, setYear] = useState(Number(today.slice(0, 4)));
  const [provinceCode, setProvinceCode] = useState('');
  const [view, setView] = useState<'list' | 'month'>('list');
  const [month, setMonth] = useState(Number(today.slice(5, 7)) - 1);

  const filtered = useMemo(
    () =>
      tournaments
        .filter(t => startDate(t).startsWith(String(year)) && (!provinceCode || t.province.code === provinceCode))
        .sort((a, b) => startDate(a).localeCompare(startDate(b))),
    [tournaments, year, provinceCode],
  );

  const byMonth = useMemo(() => {
    const groups = new Map<string, Tournament[]>();
    for (const tournament of filtered) {
      const key = startDate(tournament).slice(0, 7);
      groups.set(key, [...(groups.get(key) ?? []), tournament]);
    }
    return [...groups.entries()];
  }, [filtered]);

  // Month grid cells, Monday first, with the neighbouring months' days greyed out.
  const cells = useMemo(() => {
    const first = new Date(Date.UTC(year, month, 1));
    const offset = (first.getUTCDay() + 6) % 7;
    const start = new Date(Date.UTC(year, month, 1 - offset));
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + index);
      const iso = date.toISOString().slice(0, 10);
      return {
        iso,
        day: date.getUTCDate(),
        outside: date.getUTCMonth() !== month,
        events: filtered.filter(t => t.days.includes(iso)),
      };
    });
  }, [filtered, year, month]);

  const monthLabel = formatMonthYear(`${year}-${String(month + 1).padStart(2, '0')}-01`);

  return (
    <>
      <div className="calendar-controls">
        <div className="filter-groups">
          <div className="segmented" role="group" aria-label="Yıl">
            {years.map(value => (
              <button key={value} className={year === value ? 'active' : ''} aria-pressed={year === value} onClick={() => setYear(value)}>
                {value}
              </button>
            ))}
          </div>
          <label className="select-field">
            <Icon name="map-pin" size={18} />
            <span className="visually-hidden">İl</span>
            <select value={provinceCode} onChange={event => setProvinceCode(event.target.value)}>
              <option value="">Tüm İller</option>
              {provinces.map(province => (
                <option key={province.code} value={province.code}>
                  {provinceLabel(province)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="filter-tools">
          {view === 'month' && (
            <div className="month-nav">
              <button className="icon-button" aria-label="Önceki ay" onClick={() => setMonth(value => (value + 11) % 12)}>
                <Icon name="caret-left" size={16} />
              </button>
              <h2>{monthLabel}</h2>
              <button className="icon-button" aria-label="Sonraki ay" onClick={() => setMonth(value => (value + 1) % 12)}>
                <Icon name="caret-right" size={16} />
              </button>
            </div>
          )}
          <div className="segmented" role="group" aria-label="Görünüm">
            <button className={view === 'list' ? 'active' : ''} aria-pressed={view === 'list'} onClick={() => setView('list')}>
              <Icon name="list" size={14} />
              Liste
            </button>
            <button className={view === 'month' ? 'active' : ''} aria-pressed={view === 'month'} onClick={() => setView('month')}>
              <Icon name="calendar-blank" size={14} />
              Ay
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 && <EmptyState title="Bu yıl için turnuva bulunamadı" text="Farklı bir yıl veya il seçin." icon="calendar-blank" />}

      {view === 'list' &&
        byMonth.map(([key, items]) => (
          <section className="month-group" key={key}>
            <h2>
              {formatMonthYear(`${key}-01`)}
              <small>{items.length} turnuva</small>
            </h2>
            <div className="event-list">
              {items.map(tournament => {
                const state = registrationState(tournament);
                const parts = dateParts(startDate(tournament));
                return (
                  <article className="event-row" key={tournament.slug}>
                    <div className="date-cell">
                      <span className={`date-block ${state === 'completed' ? 'light' : ''}`}>
                        <b>{parts.day}</b>
                        <small>{parts.month}</small>
                      </span>
                      <small>
                        {formatDateRange(startDate(tournament), endDate(tournament))}
                        <br />
                        {formatWeekday(startDate(tournament))}
                      </small>
                    </div>
                    <div>
                      <h3>
                        <SmartLink href={tournamentPath(tournament)}>{tournament.title}</SmartLink>
                      </h3>
                      <span className="meta">
                        <Icon name="map-pin" size={14} />
                        {tournament.venue}
                      </span>
                    </div>
                    <div className="scope-cell">
                      <StatusChip label={tournament.scope === 'İl' ? 'İl Faaliyeti' : tournament.scope} tone="blue" />
                      <span className="muted">{tournament.province.name}</span>
                    </div>
                    <div className="state-cell">
                      <StatusChip state={state} />
                    </div>
                    <SmartLink className="button secondary" href={state === 'completed' ? `${tournamentPath(tournament)}/sonuclar` : tournamentPath(tournament)}>
                      {state === 'open' ? 'Başvur' : state === 'completed' ? 'Sonuçlar' : 'İncele'}
                    </SmartLink>
                  </article>
                );
              })}
            </div>
          </section>
        ))}

      {view === 'month' && (
        <div className="month-grid" role="grid" aria-label={monthLabel}>
          {WEEKDAYS.map(day => (
            <div className="weekday" key={day} role="columnheader">
              {day}
            </div>
          ))}
          {cells.map(cell => (
            <div className={`month-day ${cell.outside ? 'outside' : ''} ${cell.iso === today ? 'today' : ''}`} key={cell.iso} role="gridcell">
              <span className="day-number">{cell.day}</span>
              {cell.events.map(tournament => (
                <SmartLink key={tournament.slug} href={tournamentPath(tournament)} className={`state-${registrationState(tournament)}`}>
                  {tournament.title}
                </SmartLink>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
