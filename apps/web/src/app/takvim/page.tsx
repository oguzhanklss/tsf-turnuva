import { CalendarView } from '@/components/tournaments/CalendarView';
import { Icon } from '@/components/ui/Icon';
import { PageTop } from '@/components/ui/PageTop';
import { SmartLink } from '@/components/ui/SmartLink';
import { tournaments } from '@/data/tournaments';

export const metadata = { title: 'Yarışma Takvimi' };

export default function CalendarPage() {
  return (
    <>
      <PageTop
        title="Yarışma Takvimi"
        subtitle="Başvurusu açık, yaklaşan ve tamamlanan tüm resmi turnuvaların yıllık takvimi."
        crumbs={[{ title: 'Takvim' }]}
      >
        <SmartLink className="button secondary" href="https://www.tsf.org.tr/takvim">
          <Icon name="arrow-square-out" size={18} />
          Federasyon etkinlik takvimi
        </SmartLink>
      </PageTop>
      <section className="section">
        <div className="container">
          <CalendarView tournaments={tournaments} />
        </div>
      </section>
    </>
  );
}
