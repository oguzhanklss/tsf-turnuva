import { Icon } from '@/components/ui/Icon';
import { PageTop } from '@/components/ui/PageTop';
import { SmartLink } from '@/components/ui/SmartLink';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { tournaments } from '@/data/tournaments';
import { formatDateRange } from '@/lib/dates';
import { endDate, registrationState, startDate, tournamentPath } from '@/lib/tournaments';

export const metadata = { title: 'Sonuçlar' };

export default function ResultsPage() {
  const completed = tournaments
    .filter(tournament => registrationState(tournament) === 'completed')
    .sort((a, b) => startDate(b).localeCompare(startDate(a)));
  const years = [...new Set(completed.map(t => startDate(t).slice(0, 4)))];

  return (
    <>
      <PageTop title="Sonuçlar ve Arşiv" subtitle="Tamamlanan turnuvaların final sıralamaları, sonuç dosyaları ve chess-results bağlantıları." crumbs={[{ title: 'Sonuçlar' }]} />
      <section className="section">
        <div className="container">
          {completed.length === 0 ? (
            <EmptyState title="Henüz tamamlanan turnuva yok" icon="trophy" />
          ) : (
            years.map(year => {
              const items = completed.filter(t => startDate(t).startsWith(year));
              return (
                <section className="month-group" key={year}>
                  <h2>
                    {year}
                    <small>{items.length} turnuva</small>
                  </h2>
                  <div className="table-wrap">
                    <table className="data-table results-table">
                      <thead>
                        <tr>
                          <th>Tarih</th>
                          <th>Turnuva</th>
                          <th>İl</th>
                          <th>Kapsam</th>
                          <th className="num">Katılımcı</th>
                          <th className="ta-center">Sonuçlar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map(tournament => (
                          <tr key={tournament.slug}>
                            <td className="nowrap">{formatDateRange(startDate(tournament), endDate(tournament))}</td>
                            <td className="title-cell">
                              <SmartLink href={tournamentPath(tournament)}>{tournament.title}</SmartLink>
                              <span className="meta">{tournament.venue}</span>
                            </td>
                            <td>{tournament.province.name}</td>
                            <td>
                              <StatusChip label={tournament.scope === 'İl' ? 'İl / Yerel' : tournament.scope} tone="blue" />
                            </td>
                            <td className="num">{tournament.results?.participantCount ?? tournament.registeredCount}</td>
                            <td className="ta-center">
                              <SmartLink className="button secondary small" href={`${tournamentPath(tournament)}/sonuclar`}>
                                <Icon name="trophy" size={14} />
                                {tournament.results ? 'Sonuçlar' : 'Bekleniyor'}
                              </SmartLink>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
