import { notFound } from 'next/navigation';

import { RegistrationForm } from '@/components/registration/RegistrationForm';
import { Alert } from '@/components/ui/Alert';
import { PageTop } from '@/components/ui/PageTop';
import { SmartLink } from '@/components/ui/SmartLink';
import { StatusChip } from '@/components/ui/StatusChip';
import { findTournament, tournaments } from '@/data/tournaments';
import { formatDateRange, formatDateTime } from '@/lib/dates';
import { endDate, registrationState, startDate, tournamentPath } from '@/lib/tournaments';


export function generateStaticParams() {
  return tournaments.map(tournament => ({ slug: tournament.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const tournament = findTournament((await params).slug);
  return { title: tournament ? `Başvuru – ${tournament.title}` : 'Başvuru' };
}

export default async function RegistrationPage({ params }: { params: Promise<{ slug: string }> }) {
  const tournament = findTournament((await params).slug);
  if (!tournament) notFound();
  const state = registrationState(tournament);
  const path = tournamentPath(tournament);

  return (
    <>
      <PageTop
        title="Online Turnuva Başvuru Formu"
        subtitle={`${tournament.title} (${formatDateRange(startDate(tournament), endDate(tournament))}, ${tournament.province.name})`}
        crumbs={[{ title: 'Turnuvalar', href: '/turnuvalar' }, { title: tournament.title, href: path }, { title: 'Başvuru Formu' }]}
      >
        {state === 'open' && <StatusChip label={`Son başvuru: ${formatDateTime(tournament.registrationClosesAt)}`} tone="open" />}
      </PageTop>
      <section className="registration-page">
        <div className="container">
          {state === 'open' ? (
            <RegistrationForm tournament={tournament} />
          ) : (
            <div className="registration-layout">
              <Alert tone="warning" title={state === 'upcoming' ? 'Başvurular henüz açılmadı' : 'Başvurular kapandı'}>
                <p>
                  {state === 'upcoming'
                    ? `Bu turnuvanın başvuruları ${formatDateTime(tournament.registrationOpensAt)} tarihinde açılacaktır.`
                    : `Bu turnuvanın başvuru süresi ${formatDateTime(tournament.registrationClosesAt)} tarihinde sona erdi.`}
                </p>
                <p>
                  <SmartLink href={path}>Turnuva detayına dön</SmartLink>
                </p>
              </Alert>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
