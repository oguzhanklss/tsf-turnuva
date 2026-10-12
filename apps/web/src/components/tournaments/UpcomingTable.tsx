import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { StatusChip } from '@/components/ui/StatusChip';
import { dateParts, formatDateRange, formatWeekday } from '@/lib/dates';
import { endDate, registrationState, startDate, tournamentPath } from '@/lib/tournaments';
import type { Tournament } from '@/types/tournament';

/** Compact upcoming list with a date block per row, as on the home page. */
export function UpcomingTable({ tournaments }: { tournaments: Tournament[] }) {
  return (
    <div className="table-wrap upcoming-table">
      <table className="data-table">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Turnuva Adı / Organizasyon</th>
            <th>Kapsam & İl</th>
            <th>Durum</th>
            <th className="ta-center">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {tournaments.map(tournament => {
            const state = registrationState(tournament);
            const parts = dateParts(startDate(tournament));
            return (
              <tr key={tournament.slug}>
                <td>
                  <span className="date-cell">
                    <span className="date-block">
                      <b>{parts.day}</b>
                      <small>{parts.month}</small>
                    </span>
                    <span>
                      {formatDateRange(startDate(tournament), endDate(tournament))}
                      <br />
                      <span className="muted">{formatWeekday(startDate(tournament))}</span>
                    </span>
                  </span>
                </td>
                <td className="title-cell">
                  <SmartLink href={tournamentPath(tournament)}>{tournament.title}</SmartLink>
                  <span className="meta">
                    <Icon name="map-pin" size={14} />
                    {tournament.venue}
                  </span>
                </td>
                <td>
                  <StatusChip label={tournament.scope === 'İl' ? 'İl Faaliyeti' : `${tournament.scope} Şampiyona`} tone="blue" />
                  <br />
                  <span className="muted">{tournament.province.name}</span>
                </td>
                <td>
                  <StatusChip state={state} />
                </td>
                <td className="ta-center">
                  <SmartLink className="button secondary small" href={tournamentPath(tournament)}>
                    {state === 'open' ? 'Başvur' : 'İncele'}
                  </SmartLink>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
