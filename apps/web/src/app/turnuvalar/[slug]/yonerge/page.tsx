import { notFound } from 'next/navigation';

import { Icon } from '@/components/ui/Icon';
import { PageTop } from '@/components/ui/PageTop';
import { SmartLink } from '@/components/ui/SmartLink';
import { StatusChip } from '@/components/ui/StatusChip';
import { findTournament, tournaments } from '@/data/tournaments';
import { formatDate } from '@/lib/dates';
import { isOpen, tournamentPath } from '@/lib/tournaments';


export function generateStaticParams() {
  return tournaments.map(tournament => ({ slug: tournament.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const tournament = findTournament((await params).slug);
  return { title: tournament ? `Yönerge – ${tournament.title}` : 'Yönerge' };
}

export default async function RegulationPage({ params }: { params: Promise<{ slug: string }> }) {
  const tournament = findTournament((await params).slug);
  if (!tournament) notFound();
  const { regulation } = tournament;
  const path = tournamentPath(tournament);
  const draft = regulation.version === 'Taslak';

  return (
    <>
      <PageTop
        title="Turnuva Yönergesi"
        subtitle={tournament.title}
        crumbs={[{ title: 'Turnuvalar', href: '/turnuvalar' }, { title: tournament.title, href: path }, { title: 'Yönerge' }]}
        badge={<StatusChip label={draft ? 'Taslak' : `${regulation.version} onaylı`} tone={draft ? 'soon' : 'blue'} />}
      >
        {regulation.file && (
          <SmartLink className="button primary" href={regulation.file.url}>
            <Icon name="download-simple" size={18} />
            PDF olarak indir
          </SmartLink>
        )}
        {isOpen(tournament) && (
          <SmartLink className="button secondary" href={`${path}/basvuru`}>
            Başvuru Yap
          </SmartLink>
        )}
      </PageTop>

      <div className="container document-layout">
        <nav className="toc" aria-label="Yönerge bölümleri">
          <h3>İçindekiler</h3>
          {regulation.sections.map((section, index) => (
            <a key={section.title} href={`#bolum-${index + 1}`}>
              <b>{index + 1}.</b>
              {section.title}
            </a>
          ))}
        </nav>
        <article className="document">
          <div className="document-head">
            <div>
              <h2>{tournament.title} Yönergesi</h2>
              <div className="meta">
                Yönerge sürümü {regulation.version} · {formatDate(regulation.publishedAt)}
                {regulation.file ? ` · PDF ${regulation.file.sizeLabel}` : ''}
              </div>
            </div>
            <StatusChip label={tournament.code} tone="neutral" />
          </div>
          <p>{regulation.summary}</p>
          {regulation.sections.map((section, index) => (
            <section key={section.title}>
              <h3 id={`bolum-${index + 1}`}>
                <b>{index + 1}.</b>
                {section.title}
              </h3>
              {section.paragraphs.map(paragraph => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
          {draft && (
            <div className="alert alert-warning">
              <span className="alert-icon">
                <Icon name="clock" size={20} />
              </span>
              <div className="alert-body">
                <strong>Taslak yönerge</strong>
                <p>Kesin metin başvuru açılışıyla birlikte yayımlanacaktır; katılım koşulları değişebilir.</p>
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
}
