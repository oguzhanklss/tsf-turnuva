import { Suspense } from 'react';

import { TournamentBrowser } from '@/components/tournaments/TournamentBrowser';
import { Icon } from '@/components/ui/Icon';
import { PageTop } from '@/components/ui/PageTop';
import { SmartLink } from '@/components/ui/SmartLink';
import { tournaments } from '@/data/tournaments';

export const metadata = { title: 'Turnuvalar' };

export default function TournamentsPage() {
  return (
    <>
      <PageTop
        title="Turnuva Listesi ve Başvuru Rehberi"
        subtitle="Federasyon bünyesinde düzenlenen ulusal, bölgesel ve yerel satranç turnuvalarını filtreleyin ve başvurunuzu tamamlayın."
        crumbs={[{ title: 'Turnuvalar' }]}
      >
        <SmartLink className="button secondary" href="/takvim">
          <Icon name="calendar-blank" size={18} />
          Takvim
        </SmartLink>
      </PageTop>
      <section className="section">
        <div className="container">
          <Suspense>
            <TournamentBrowser tournaments={tournaments} />
          </Suspense>
          <div className="tile-grid" style={{ marginTop: 40 }}>
            <div className="tile">
              <Icon name="identification-card" size={22} />
              <div>
                <h3>Tek başvuru, tek tarih</h3>
                <p>Aynı tarihlerde yalnızca bir resmi turnuvaya başvurabilirsiniz; çakışan başvurular sistem tarafından engellenir.</p>
              </div>
            </div>
            <div className="tile">
              <Icon name="file-text" size={22} />
              <div>
                <h3>Yönergeleri inceleyin</h3>
                <p>Her turnuvanın katılım şartları, kategorileri ve eşlendirme kuralları resmi yönergesinde yer alır.</p>
              </div>
            </div>
            <div className="tile">
              <Icon name="megaphone" size={22} />
              <div>
                <h3>Teknik destek</h3>
                <p>
                  Başvuru süreciyle ilgili sorularınız için <a href="mailto:turnuva@tsf.org.tr">turnuva@tsf.org.tr</a> üzerinden destek alabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
