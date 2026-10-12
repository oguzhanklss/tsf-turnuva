import { TournamentCard } from '@/components/tournaments/TournamentCard';
import { UpcomingTable } from '@/components/tournaments/UpcomingTable';
import { Icon } from '@/components/ui/Icon';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SmartLink } from '@/components/ui/SmartLink';
import { provinces } from '@/config/provinces';
import { tournaments } from '@/data/tournaments';
import { formatDate, formatMonthYear, todayIso } from '@/lib/dates';
import { registrationState, startDate } from '@/lib/tournaments';


export default function HomePage() {
  const today = todayIso();
  const active = tournaments.filter(t => ['open', 'upcoming', 'closed'].includes(registrationState(t)));
  const open = active.filter(t => registrationState(t) === 'open');
  const upcoming = tournaments
    .filter(t => startDate(t) >= today)
    .sort((a, b) => startDate(a).localeCompare(startDate(b)))
    .slice(0, 5);
  const completed = tournaments.filter(t => registrationState(t) === 'completed');
  const applicants = tournaments.reduce((sum, t) => sum + t.registeredCount, 0);
  const activeProvinces = new Set(active.map(t => t.province.code)).size;
  const rangeLabel = upcoming.length
    ? `${formatMonthYear(startDate(upcoming[0]))} – ${formatMonthYear(startDate(upcoming[upcoming.length - 1]))}`
    : '';

  return (
    <>
      <section className="hero-band">
        <div className="container">
          <nav className="breadcrumb" aria-label="Sayfa yolu">
            <span>TSF Resmi Portalı</span>
            <Icon name="caret-right" size={12} />
            <span>Ana Sayfa</span>
          </nav>
          <div className="hero-row">
            <div>
              <h1>Turnuva Başvuruları ve Yarışma Takvimi</h1>
              <p>
                Türkiye Satranç Federasyonu resmi turnuvalarına tek noktadan online başvuru yapın, yönergeleri inceleyin ve sonuçları takip edin.
              </p>
            </div>
            <div className="hero-actions">
              <SmartLink className="button secondary" href="/turnuvalar">
                Tüm Turnuvaları Listele
              </SmartLink>
              <SmartLink className="button primary" href="/turnuvalar?durum=acik">
                Hızlı Başvuru
              </SmartLink>
            </div>
          </div>
          <div className="stat-strip">
            <div>
              <span className="stat-icon">
                <Icon name="calendar-blank" size={22} />
              </span>
              <div>
                <b>{open.length} Aktif</b>
                <small>Başvuruya açık turnuva</small>
              </div>
            </div>
            <div>
              <span className="stat-icon">
                <Icon name="users-three" size={22} />
              </span>
              <div>
                <b>{applicants.toLocaleString('tr-TR')}+</b>
                <small>Alınan başvuru</small>
              </div>
            </div>
            <div>
              <span className="stat-icon">
                <Icon name="buildings" size={22} />
              </span>
              <div>
                <b>
                  {activeProvinces} / {provinces.length} İl
                </b>
                <small>Aktif turnuva düzenleyen il</small>
              </div>
            </div>
            <div>
              <span className="stat-icon">
                <Icon name="trophy" size={22} />
              </span>
              <div>
                <b>{completed.length} Tamamlanan</b>
                <small>Sonuçları yayımlanan turnuva</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle title="Başvurusu Açık Turnuvalar" badge={`${open.length} aktif başvuru`} href="/turnuvalar?durum=acik" />
          <div className="card-grid">
            {active.slice(0, 6).map(tournament => (
              <TournamentCard key={tournament.slug} tournament={tournament} />
            ))}
          </div>
        </div>
      </section>

      <section className="section pale">
        <div className="container">
          <SectionTitle title="Yaklaşan Turnuvalar (Takvim Özeti)" badge={rangeLabel} href="/takvim" link="Yıllık takvimi aç" />
          <UpcomingTable tournaments={upcoming} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-grid">
            <div className="feature">
              <div className="feature-head">
                <span className="stat-icon">
                  <Icon name="calendar-blank" size={22} />
                </span>
                <div>
                  <span className="label">Federasyon resmi faaliyetleri</span>
                  <h3>2026 – 2027 Yarışma Takvimi</h3>
                </div>
              </div>
              <p>
                TSF Yönetim Kurulu tarafından onaylanan yıllık ulusal şampiyonalar, ligler, kulüp faaliyetleri ve il turnuvalarının güncel takvimini inceleyin.
              </p>
              <div className="feature-foot">
                <span className="meta">
                  <Icon name="clock" size={14} />
                  Son güncelleme: {formatDate(today)}
                </span>
                <SmartLink className="button secondary" href="/takvim">
                  Takvimi Görüntüle
                </SmartLink>
              </div>
            </div>
            <div className="feature">
              <div className="feature-head">
                <span className="stat-icon">
                  <Icon name="trophy" size={22} />
                </span>
                <div>
                  <span className="label">Sonuç arşivi</span>
                  <h3>Tamamlanan Turnuvalar ve Sonuçlar</h3>
                </div>
              </div>
              <p>Geçmiş turnuva sıralamaları, final tabloları ve chess-results bağlantılarıyla arşivlenmiş tüm resmi sonuçlara erişin.</p>
              <div className="feature-foot">
                <span className="meta">
                  <Icon name="file-text" size={14} />
                  {completed.length} turnuva arşivde
                </span>
                <SmartLink className="button primary" href="/sonuclar">
                  Sonuçları İncele
                </SmartLink>
              </div>
            </div>
          </div>
          <div className="home-notice" style={{ marginTop: 24 }}>
            <Icon name="info" size={18} />
            <span>
              Başvuru sırasında bir sorunla mı karşılaştınız? <a href="mailto:turnuva@tsf.org.tr">turnuva@tsf.org.tr</a> adresine yazabilir veya çağrı merkezini
              arayabilirsiniz.
            </span>
            <span className="links">
              <SmartLink href="https://www.tsf.org.tr/sss">Sıkça Sorulan Sorular</SmartLink>
              <SmartLink href="/yonergeler">Yönergeler</SmartLink>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
