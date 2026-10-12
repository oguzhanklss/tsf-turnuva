import { notFound } from 'next/navigation';

import { CapacityBar } from '@/components/tournaments/CapacityBar';
import { Icon } from '@/components/ui/Icon';
import { PageTop } from '@/components/ui/PageTop';
import { SmartLink } from '@/components/ui/SmartLink';
import { StatusChip } from '@/components/ui/StatusChip';
import { findTournament, tournaments } from '@/data/tournaments';
import { formatDate, formatDateRange, formatDateTime, formatDayMonth } from '@/lib/dates';
import { maskName } from '@/lib/text';
import { endDate, registrationState, startDate, stateNote, tournamentPath } from '@/lib/tournaments';


export function generateStaticParams() {
  return tournaments.map(tournament => ({ slug: tournament.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const tournament = findTournament((await params).slug);
  return { title: tournament?.title ?? 'Turnuva' };
}

export default async function TournamentPage({ params }: { params: Promise<{ slug: string }> }) {
  const tournament = findTournament((await params).slug);
  if (!tournament) notFound();

  const state = registrationState(tournament);
  const path = tournamentPath(tournament);
  const open = state === 'open';
  const participants = tournament.participants.slice(0, 8);

  return (
    <>
      <PageTop
        title={tournament.title}
        subtitle={`${tournament.organizer} tarafından düzenlenmektedir.`}
        crumbs={[{ title: 'Turnuvalar', href: '/turnuvalar' }, { title: tournament.title }]}
        badge={<StatusChip state={state} />}
      >
        {open ? (
          <SmartLink className="button primary" href={`${path}/basvuru`}>
            Başvuru Yap
          </SmartLink>
        ) : state === 'completed' ? (
          <SmartLink className="button primary" href={`${path}/sonuclar`}>
            Sonuçlar
          </SmartLink>
        ) : (
          <span className="button" aria-disabled="true">
            {state === 'upcoming' ? 'Başvuru Henüz Açılmadı' : 'Başvuru Kapalı'}
          </span>
        )}
      </PageTop>

      <div className="container detail-layout">
        <div className="detail-main">
          <div className="detail-cover">
            <div className="cover-copy">
              <StatusChip label={tournament.scope === 'İl' ? 'İl Faaliyeti' : `Resmi ${tournament.scope} Şampiyona`} />
              <b>
                {tournament.venue} · {tournament.district ? `${tournament.district} / ` : ''}
                {tournament.province.name}
              </b>
            </div>
            <div className="cover-tags">
              {tournament.tags?.map(tag => (
                <StatusChip key={tag} label={tag} />
              ))}
            </div>
          </div>

          <section className="panel">
            <div className="panel-head">
              <h2>
                <Icon name="info" size={20} />
                Genel Bilgiler
              </h2>
              <span className="label">Turnuva kodu: {tournament.code}</span>
            </div>
            <div className="panel-body kv-grid">
              <div className="kv">
                <span className="label">Tarih Aralığı</span>
                <b>
                  {formatDateRange(startDate(tournament), endDate(tournament))} ({tournament.days.length} gün)
                </b>
              </div>
              <div className="kv">
                <span className="label">Yer / Salon</span>
                <b>
                  {tournament.venue}, {tournament.district ? `${tournament.district} / ` : ''}
                  {tournament.province.name}
                </b>
              </div>
              <div className="kv">
                <span className="label">Organizatör</span>
                <b>{tournament.organizer}</b>
              </div>
              <div className="kv">
                <span className="label">Kapsam & Kategoriler</span>
                <b>
                  {tournament.scope} · {tournament.categories.map(category => category.name).join(', ')}
                </b>
              </div>
              <div className="kv full">
                <span className="label">Yarışma Günleri</span>
                <div className="chips">
                  {tournament.days.map(day => (
                    <span className="day-chip" key={day}>
                      {formatDayMonth(day)}
                    </span>
                  ))}
                </div>
              </div>
              {tournament.eligibility && (
                <div className="kv full">
                  <span className="label">Kategori & Katılım Şartı</span>
                  <p>{tournament.eligibility}</p>
                </div>
              )}
              {tournament.tempo && (
                <div className="kv">
                  <span className="label">Oyun Temposu & Sistem</span>
                  <b>
                    {tournament.tempo}
                    {tournament.system ? ` (${tournament.system})` : ''}
                  </b>
                </div>
              )}
              {tournament.chiefArbiter && (
                <div className="kv">
                  <span className="label">Başhakem & Gözlemci</span>
                  <b>{tournament.chiefArbiter}</b>
                </div>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h2>
                <Icon name="file-text" size={20} />
                Resmi Turnuva Yönergesi
              </h2>
              <StatusChip label={tournament.regulation.version === 'Taslak' ? 'Taslak' : `${tournament.regulation.version} onaylı`} tone={tournament.regulation.version === 'Taslak' ? 'soon' : 'blue'} />
            </div>
            <div className="panel-body regulation-excerpt">
              <p>{tournament.regulation.summary}</p>
              <div className="file-row">
                <span className="file-icon">
                  <Icon name="file-text" size={22} />
                </span>
                <div className="file-copy">
                  <b>{tournament.title} Yönergesi</b>
                  <small>
                    {tournament.regulation.file ? `PDF belgesi · ${tournament.regulation.file.sizeLabel} · ` : ''}
                    Yayınlanma: {formatDate(tournament.regulation.publishedAt)}
                  </small>
                </div>
                <div className="file-actions">
                  <SmartLink className="button secondary small" href={`${path}/yonerge`}>
                    <Icon name="arrow-right" size={14} />
                    İncele
                  </SmartLink>
                  {tournament.regulation.file && (
                    <SmartLink className="button primary small" href={tournament.regulation.file.url}>
                      <Icon name="download-simple" size={14} />
                      İndir
                    </SmartLink>
                  )}
                </div>
              </div>
              <div className="soft-note">
                <Icon name="info" size={14} />
                Geçerli yönerge sürümü {tournament.regulation.version}. Değişiklikler bu sayfadan ve TSF resmi sitesinden ilan edilir.
              </div>
            </div>
          </section>

          {tournament.schedule.length > 0 && (
            <section className="panel">
              <div className="panel-head">
                <h2>
                  <Icon name="calendar-blank" size={20} />
                  Turnuva Programı & Tur Takvimi
                </h2>
                <span className="label">{tournament.schedule.length} kalem</span>
              </div>
              <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}>
                <table className="data-table schedule-table">
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Saat</th>
                      <th>Faaliyet / Tur</th>
                      <th>Açıklama / Yer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournament.schedule.map((item, index) => (
                      <tr key={`${item.date}-${item.time}-${item.title}`} className={index === tournament.schedule.length - 1 ? 'final' : ''}>
                        <td>{formatDate(item.date)}</td>
                        <td className="time">{item.time}</td>
                        <td>{item.title}</td>
                        <td className="muted">{item.note ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-note">
                <Icon name="info" size={14} />
                Program, teknik toplantı kararlarıyla güncellenebilir. Hükmen yenilgi süresi tur başlangıcından itibaren 15 dakikadır.
              </div>
            </section>
          )}

          {tournament.contacts.length > 0 && (
            <section className="panel">
              <div className="panel-head">
                <h2>
                  <Icon name="phone" size={20} />
                  İletişim ve Organizasyon
                </h2>
              </div>
              <div className="panel-body contact-cards">
                {tournament.contacts.map(contact => (
                  <div className="contact-card" key={contact.title}>
                    <h4>{contact.title}</h4>
                    <p>{contact.description}</p>
                    {contact.phone && (
                      <span className="meta">
                        <Icon name="phone" size={14} />
                        {contact.phone}
                      </span>
                    )}
                    {contact.email && (
                      <a className="meta" href={`mailto:${contact.email}`}>
                        <Icon name="envelope-simple" size={14} />
                        {contact.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="sidebar-sticky">
          <div className="side-panel">
            <span className="label">
              Başvuru Durumu
              <StatusChip state={state} />
            </span>
            {open && (
              <div className="highlight">
                <b>{stateNote(tournament)}</b> · Son başvuru: {formatDateTime(tournament.registrationClosesAt)}
              </div>
            )}
            {state === 'upcoming' && (
              <div className="highlight">
                Başvurular <b>{formatDateTime(tournament.registrationOpensAt)}</b> tarihinde açılır.
              </div>
            )}
            {state === 'closed' && <div className="highlight">Başvurular {formatDateTime(tournament.registrationClosesAt)} tarihinde kapandı.</div>}
            <CapacityBar tournament={tournament} />
            {tournament.capacity && (
              <span className="stat-line">
                Kalan kontenjan <b>{Math.max(0, tournament.capacity - tournament.registeredCount)} kişi</b>
              </span>
            )}
            {open ? (
              <SmartLink className="button primary block" href={`${path}/basvuru`}>
                <Icon name="identification-card" size={18} />
                Online Başvuru Yap
              </SmartLink>
            ) : (
              <span className="button block" aria-disabled="true">
                {state === 'completed' ? 'Turnuva tamamlandı' : state === 'upcoming' ? 'Başvuru henüz açılmadı' : 'Başvuru kapalı'}
              </span>
            )}
            <SmartLink className="button secondary block" href={`${path}/yonerge`}>
              <Icon name="file-text" size={16} />
              Yönergeyi Görüntüle
            </SmartLink>
            <small>* Aynı tarihlerde başka bir resmi turnuvaya başvurusu bulunan sporcuların başvurusu sistem tarafından kabul edilmez.</small>
          </div>

          {participants.length > 0 && (
            <div className="panel">
              <div className="panel-head">
                <h3>
                  Kayıtlı Sporcular
                </h3>
                <span className="label">{tournament.registeredCount} başvuru</span>
              </div>
              <div className="table-wrap" style={{ border: 0, borderRadius: 0 }}>
                <table className="data-table participants-table">
                  <thead>
                    <tr>
                      <th>Sıra</th>
                      <th>Sporcu</th>
                      <th>İl</th>
                      <th>Kategori</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant, index) => (
                      <tr key={`${participant.name}-${index}`}>
                        <td className="num">{index + 1}</td>
                        <td className="mask">{maskName(participant.name)}</td>
                        <td>{participant.province}</td>
                        <td className="muted">{participant.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-note">
                <Icon name="info" size={14} />
                KVKK uyarınca sporcu isimleri maskelenmiştir. Kesin kayıt listesi teknik toplantı sonrası ilan edilir.
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
