'use client';

import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/SmartLink';
import { StatusChip } from '@/components/ui/StatusChip';
import { provinces } from '@/config/provinces';
import { formatDate, formatDateRange, formatDateTime } from '@/lib/dates';
import { endDate, startDate, tournamentPath } from '@/lib/tournaments';
import type { Category, Tournament } from '@/types/tournament';
import type { FormValues } from './RegistrationForm';

/** Confirmation shown after a successful submission, with the entry number. */
export function RegistrationSuccess({
  tournament,
  values,
  category,
  code,
  submittedAt,
}: {
  tournament: Tournament;
  values: FormValues;
  category?: Category;
  code: string;
  submittedAt: string;
}) {
  const firstDay = startDate(tournament);
  const path = tournamentPath(tournament);
  const technicalMeeting = tournament.schedule[0];
  return (
    <div className="success-card" role="status" aria-live="polite">
      <div className="success-head">
        <div>
          <b>Türkiye Satranç Federasyonu</b>
          <small>Resmi Turnuva Başvuru Belgesi</small>
        </div>
        <small>{tournament.code}</small>
      </div>
      <div className="success-body">
        <span className="success-mark">
          <Icon name="check" size={34} />
        </span>
        <h1>Başvurunuz Alındı</h1>
        <p>
          <b>{tournament.title}</b> için başvurunuz kaydedilmiştir. Başvuru numaranızı saklayınız; turnuva günü kesin kayıtta bu numara sorulacaktır.
        </p>

        <div className="protocol">
          <span className="label">Başvuru Numarası</span>
          <div className="protocol-code">
            <b>{code}</b>
            <button className="button secondary small" type="button" onClick={() => navigator.clipboard?.writeText(code)}>
              <Icon name="list-checks" size={14} />
              Kopyala
            </button>
          </div>
          <div className="protocol-meta">
            <span>
              Kayıt tarihi: <b>{formatDateTime(submittedAt)}</b>
            </span>
            <span>
              Durum: <StatusChip label="Başvuru alındı" tone="open" />
            </span>
          </div>
        </div>

        <div className="summary-table" style={{ textAlign: 'left' }}>
          <div className="summary-row">
            <span className="label">Sporcu</span>
            <span className="value">
              <b>
                {values.firstName} {values.lastName}
              </b>
              <span className="mono">T.C. Kimlik: {values.tckn}</span>
            </span>
          </div>
          <div className="summary-row">
            <span className="label">İl / Kulüp</span>
            <span className="value">
              {provinces.find(entry => entry.code === values.provinceCode)?.name}
              {values.club ? ` · ${values.club}` : ''}
            </span>
          </div>
          <div className="summary-row">
            <span className="label">Kategori</span>
            <span className="value">
              <b>{category?.name ?? 'Genel'}</b>
            </span>
          </div>
          <div className="summary-row">
            <span className="label">İletişim</span>
            <span className="value">
              {values.phone} · {values.email}
            </span>
          </div>
          <div className="summary-row">
            <span className="label">Turnuva</span>
            <span className="value">
              {formatDateRange(firstDay, endDate(tournament))} · {tournament.venue}, {tournament.province.name}
            </span>
          </div>
        </div>

        <div className="reminders">
          <h3>Önemli hatırlatmalar ve sıradaki adımlar</h3>
          <ol>
            <li>
              <b>Kesin kayıt kontrolü:</b> {formatDate(firstDay)} günü {technicalMeeting ? `saat ${technicalMeeting.time}` : 'teknik toplantı saatinde'} yarışma salonunda kimlik belgenizle kayıt masasına başvurunuz.
            </li>
            <li>
              <b>E-posta teyidi:</b> Başvuru belgeniz {values.email} adresine gönderilecektir.
            </li>
            <li>
              <b>İptal ve düzeltme:</b> Başvuru son tarihi {formatDateTime(tournament.registrationClosesAt)} öncesine kadar turnuva@tsf.org.tr adresine başvuru numaranızla bildirerek iptal veya düzeltme talep edebilirsiniz.
            </li>
          </ol>
        </div>

        <div className="success-actions">
          <button className="button primary" type="button" onClick={() => window.print()}>
            <Icon name="download-simple" size={16} />
            Başvuru Belgesini Yazdır
          </button>
          <SmartLink className="button secondary" href={path}>
            <Icon name="caret-left" size={14} />
            Turnuva Detayına Dön
          </SmartLink>
          <SmartLink className="button secondary" href="/turnuvalar">
            <Icon name="list" size={16} />
            Tüm Turnuvalar
          </SmartLink>
        </div>
      </div>
    </div>
  );
}
