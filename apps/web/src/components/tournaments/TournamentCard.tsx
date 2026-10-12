import { CapacityBar } from '@/components/tournaments/CapacityBar';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { StatusChip } from '@/components/ui/StatusChip';
import { formatDateRange } from '@/lib/dates';
import { endDate, registrationState, startDate, stateNote, tournamentPath } from '@/lib/tournaments';
import type { Tournament } from '@/types/tournament';

/** One tournament in the grids and lists: status, title, place, dates and the actions. */
export function TournamentCard({ tournament, compact = false }: { tournament: Tournament; compact?: boolean }) {
  const state = registrationState(tournament);
  const path = tournamentPath(tournament);
  const urgent = state === 'open' && /^Son [1-7] gün$|Bugün/.test(stateNote(tournament));

  return (
    <article className={`tournament-card state-${state}`}>
      <div className="card-head">
        <div className="chips">
          <StatusChip state={state} />
          <StatusChip label={tournament.scope === 'İl' ? 'İl / Yerel' : tournament.scope} tone={tournament.scope === 'Uluslararası' ? 'navy' : 'blue'} />
          {!compact && tournament.tags?.map(tag => <StatusChip key={tag} label={tag} tone="neutral" />)}
        </div>
        <span className={`card-note ${urgent ? 'urgent' : ''}`}>
          <Icon name={state === 'open' ? 'clock' : 'calendar-blank'} size={14} />
          {stateNote(tournament)}
        </span>
      </div>
      <h3>
        <SmartLink href={path}>{tournament.title}</SmartLink>
      </h3>
      <div className="card-body">
        <span className="meta">
          <Icon name="map-pin" size={16} />
          {tournament.province.name}
          {tournament.district ? ` / ${tournament.district}` : ''}
        </span>
        <span className="meta">
          <Icon name="calendar-blank" size={16} />
          {formatDateRange(startDate(tournament), endDate(tournament))}
        </span>
        <span className="meta">
          <Icon name="buildings" size={16} />
          {tournament.venue}
        </span>
        {!compact && tournament.tempo && (
          <span className="meta">
            <Icon name="clock" size={16} />
            Tempo: {tournament.tempo}
            {tournament.system ? ` (${tournament.system})` : ''}
          </span>
        )}
        <CapacityBar tournament={tournament} />
      </div>
      <div className="card-actions">
        <SmartLink className="text-link" href={`${path}/yonerge`}>
          <Icon name="file-text" size={16} />
          {tournament.regulation.version === 'Taslak' ? 'Taslak Yönerge' : 'Yönerge'}
        </SmartLink>
        {state === 'open' && (
          <SmartLink className="button primary" href={path}>
            Detay & Başvuru
          </SmartLink>
        )}
        {state === 'upcoming' && (
          <SmartLink className="button secondary" href={path}>
            Detay
          </SmartLink>
        )}
        {state === 'closed' && (
          <SmartLink className="button secondary" href={path}>
            Katılımcı Listesi
          </SmartLink>
        )}
        {state === 'completed' && (
          <SmartLink className="button secondary" href={`${path}/sonuclar`}>
            Sonuçlar
          </SmartLink>
        )}
      </div>
    </article>
  );
}
