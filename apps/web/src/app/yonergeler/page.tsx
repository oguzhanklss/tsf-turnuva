import { Icon } from '@/components/ui/Icon';
import { PageTop } from '@/components/ui/PageTop';
import { SmartLink } from '@/components/ui/SmartLink';
import { StatusChip } from '@/components/ui/StatusChip';
import { tournaments } from '@/data/tournaments';
import { formatDate, formatDateRange } from '@/lib/dates';
import { endDate, registrationState, startDate, tournamentPath } from '@/lib/tournaments';

export const metadata = { title: 'Yönergeler' };

export default function RegulationsPage() {
  const items = [...tournaments].sort((a, b) => startDate(b).localeCompare(startDate(a)));
  return (
    <>
      <PageTop title="Turnuva Yönergeleri" subtitle="Her turnuvanın katılım şartları, kategorileri, programı ve ödüllerini içeren resmi yönergeler." crumbs={[{ title: 'Yönergeler' }]}>
        <SmartLink className="button secondary" href="https://www.tsf.org.tr/belgeler/kategori/3">
          <Icon name="arrow-square-out" size={18} />
          Federasyon talimatları
        </SmartLink>
      </PageTop>
      <section className="section">
        <div className="container regulation-grid">
          {items.map(tournament => {
            const draft = tournament.regulation.version === 'Taslak';
            const path = tournamentPath(tournament);
            return (
              <article className="regulation-row" key={tournament.slug}>
                <span className="file-icon">
                  <Icon name="file-text" size={22} />
                </span>
                <div>
                  <h3>
                    <SmartLink href={`${path}/yonerge`}>{tournament.title}</SmartLink>
                  </h3>
                  <span className="meta">
                    <StatusChip label={draft ? 'Taslak' : tournament.regulation.version} tone={draft ? 'soon' : 'blue'} />
                    <span>{formatDate(tournament.regulation.publishedAt)}</span>
                    <span>·</span>
                    <span>
                      {formatDateRange(startDate(tournament), endDate(tournament))}, {tournament.province.name}
                    </span>
                    <span>·</span>
                    <StatusChip state={registrationState(tournament)} dot={false} />
                  </span>
                </div>
                <div className="actions">
                  <SmartLink className="button secondary small" href={`${path}/yonerge`}>
                    İncele
                  </SmartLink>
                  {tournament.regulation.file && (
                    <SmartLink className="button primary small" href={tournament.regulation.file.url}>
                      <Icon name="download-simple" size={14} />
                      PDF
                    </SmartLink>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
