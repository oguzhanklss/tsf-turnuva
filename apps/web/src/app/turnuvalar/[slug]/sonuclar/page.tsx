import { notFound } from 'next/navigation';

import { Icon } from '@/components/ui/Icon';
import { PageTop } from '@/components/ui/PageTop';
import { SmartLink } from '@/components/ui/SmartLink';
import { StatusChip } from '@/components/ui/StatusChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { findTournament, tournaments } from '@/data/tournaments';
import { formatDateRange } from '@/lib/dates';
import { endDate, registrationState, startDate, tournamentPath } from '@/lib/tournaments';


export function generateStaticParams() {
  return tournaments.map(tournament => ({ slug: tournament.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const tournament = findTournament((await params).slug);
  return { title: tournament ? `Sonuçlar – ${tournament.title}` : 'Sonuçlar' };
}

export default async function TournamentResultsPage({ params }: { params: Promise<{ slug: string }> }) {
  const tournament = findTournament((await params).slug);
  if (!tournament) notFound();
  const path = tournamentPath(tournament);
  const { results } = tournament;
  const state = registrationState(tournament);

  return (
    <>
      <PageTop
        title="Turnuva Sonuçları"
        subtitle={`${tournament.title} · ${formatDateRange(startDate(tournament), endDate(tournament))} · ${tournament.province.name}`}
        crumbs={[{ title: 'Sonuçlar', href: '/sonuclar' }, { title: tournament.title, href: path }, { title: 'Sonuçlar' }]}
        badge={<StatusChip state={state} />}
      >
        {results?.externalUrl && (
          <SmartLink className="button secondary" href={results.externalUrl}>
            <Icon name="arrow-square-out" size={18} />
            chess-results.com’da görüntüle
          </SmartLink>
        )}
      </PageTop>

      <section className="section">
        <div className="container">
          {!results ? (
            <EmptyState title="Sonuçlar henüz yayımlanmadı" text="Turnuva tamamlandığında final sıralaması ve dosyalar bu sayfada yer alacaktır." icon="trophy">
              <SmartLink className="button secondary" href={path}>
                Turnuva detayına dön
              </SmartLink>
            </EmptyState>
          ) : (
            <div className="detail-layout" style={{ padding: 0 }}>
              <div className="detail-main">
                <div className="panel">
                  <div className="panel-head">
                    <h2>
                      <Icon name="trophy" size={20} />
                      Final Sıralaması
                    </h2>
                    <span className="label">{results.participantCount} katılımcı</span>
                  </div>
                  <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}>
                    <table className="data-table standings-top">
                      <thead>
                        <tr>
                          <th>Sıra</th>
                          <th>Ad Soyad</th>
                          <th>İl</th>
                          <th className="num">Puan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.standings.map(row => (
                          <tr key={row.rank}>
                            <td>{row.rank}</td>
                            <td>{row.name}</td>
                            <td>{row.province}</td>
                            <td className="num">{row.points.toLocaleString('tr-TR', { minimumFractionDigits: 1 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-note">
                    <Icon name="info" size={14} />
                    Tam sıralama ve tur sonuçları için chess-results bağlantısını veya final sıralaması dosyasını kullanın.
                  </div>
                </div>
              </div>
              <aside className="sidebar-sticky">
                <div className="side-panel">
                  <span className="label">Sonuç dosyaları</span>
                  <div className="file-list">
                    {results.files.map(file => (
                      <div className="file-row" key={file.url}>
                        <span className="file-icon">
                          <Icon name="file-text" size={20} />
                        </span>
                        <div className="file-copy">
                          <b>{file.title}</b>
                          <small>PDF · {file.sizeLabel}</small>
                        </div>
                        <div className="file-actions">
                          <SmartLink className="button secondary small" href={file.url}>
                            <Icon name="download-simple" size={14} />
                            İndir
                          </SmartLink>
                        </div>
                      </div>
                    ))}
                  </div>
                  {results.externalUrl && (
                    <SmartLink className="button primary block" href={results.externalUrl}>
                      <Icon name="arrow-square-out" size={16} />
                      chess-results.com
                    </SmartLink>
                  )}
                  <SmartLink className="button secondary block" href={path}>
                    Turnuva detayı
                  </SmartLink>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
