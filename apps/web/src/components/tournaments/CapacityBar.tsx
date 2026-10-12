import type { Tournament } from '@/types/tournament';
import { occupancy, registrationState } from '@/lib/tournaments';

/** Capacity used, or the applicant count when the tournament has no limit. */
export function CapacityBar({ tournament }: { tournament: Tournament }) {
  const share = occupancy(tournament);
  const state = registrationState(tournament);
  if (share === undefined) {
    return (
      <div className="capacity">
        <div className="capacity-row">
          <span className="label">Başvuru Durumu</span>
          <b>{state === 'upcoming' ? 'Ön kayıt kapalı' : `${tournament.registeredCount} kayıt`}</b>
        </div>
      </div>
    );
  }
  const percent = Math.round(share * 100);
  const tone = share >= 1 ? 'full' : share >= 0.9 ? 'high' : state === 'open' ? '' : 'muted';
  return (
    <div className="capacity">
      <div className="capacity-row">
        <span className="label">{state === 'completed' ? 'Katılım' : 'Kontenjan Durumu'}</span>
        <b>
          {tournament.registeredCount} / {tournament.capacity} {share >= 1 ? '(Dolu)' : `(%${percent})`}
        </b>
      </div>
      <div
        className={`capacity-bar ${tone}`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={tournament.capacity}
        aria-valuenow={tournament.registeredCount}
        aria-label="Kontenjan doluluk oranı"
      >
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
