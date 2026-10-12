import { EmptyState } from '@/components/ui/EmptyState';
import { PageTop } from '@/components/ui/PageTop';
import { SmartLink } from '@/components/ui/SmartLink';

export default function NotFound() {
  return (
    <>
      <PageTop title="Sayfa bulunamadı" crumbs={[{ title: 'Hata' }]} />
      <section className="section">
        <div className="container">
          <EmptyState title="Aradığınız sayfa yok" text="Adres değişmiş ya da turnuva yayından kalkmış olabilir." icon="info">
            <SmartLink className="button primary" href="/turnuvalar">
              Turnuvalara dön
            </SmartLink>
          </EmptyState>
        </div>
      </section>
    </>
  );
}
