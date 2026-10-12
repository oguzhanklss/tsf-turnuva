/** Portal identity, shared chrome content and contact details. */
export const site = {
  name: 'Türkiye Satranç Federasyonu',
  shortName: 'TSF',
  portalName: 'Turnuva Başvuru ve Bilgi Sistemi',
  description:
    'Türkiye Satranç Federasyonu turnuvalarına online başvuru, turnuva yönergeleri, yarışma takvimi ve sonuçlar.',
  themeColor: '#10263a',
  logo: '/assets/logo.png',
  address: ['Mürsel Uluç Mahallesi, 931. Cadde No:14', 'Çankaya / Ankara'],
  phone: { label: '+90 (312) 309 75 28', href: 'tel:+903123097528' },
  email: 'turnuva@tsf.org.tr',
  copyright: '© 2026 Türkiye Satranç Federasyonu – Tüm Hakları Saklıdır',
  privacyUrl: 'https://www.tsf.org.tr/federasyon/kisisel-verilerin-korunmasi-kanunu',
  mainSite: 'https://www.tsf.org.tr',
  version: 'turnuva.tsf.org.tr v0.1',
} as const;

export interface NavLink {
  title: string;
  url: string;
}

/** Thin dark bar above the header. */
export const utilityLinks: NavLink[] = [
  { title: 'tsf.org.tr', url: 'https://www.tsf.org.tr' },
  { title: 'Lisans İşlemleri', url: 'https://lisans.tsf.org.tr' },
  { title: 'İletişim', url: 'https://www.tsf.org.tr/iletisim' },
];

/** Main navigation: flat links, no dropdowns. */
export const mainLinks: NavLink[] = [
  { title: 'Turnuvalar', url: '/turnuvalar' },
  { title: 'Takvim', url: '/takvim' },
  { title: 'Sonuçlar', url: '/sonuclar' },
  { title: 'Yönergeler', url: '/yonergeler' },
];

export interface FooterColumn {
  title: string;
  items: NavLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Turnuvalar',
    items: [
      { title: 'Başvurusu Açık Turnuvalar', url: '/turnuvalar?durum=acik' },
      { title: 'Yaklaşan Turnuvalar', url: '/turnuvalar?durum=yakinda' },
      { title: 'Yarışma Takvimi', url: '/takvim' },
      { title: 'Sonuçlar ve Arşiv', url: '/sonuclar' },
    ],
  },
  {
    title: 'Federasyon',
    items: [
      { title: 'tsf.org.tr', url: 'https://www.tsf.org.tr' },
      { title: 'Mevzuat ve Talimatlar', url: 'https://www.tsf.org.tr/belgeler/kategori/3' },
      { title: 'İl Temsilcilikleri', url: 'https://www.tsf.org.tr/temsilcilikler' },
      { title: 'Etkinlik Takvimi', url: 'https://www.tsf.org.tr/takvim' },
    ],
  },
  {
    title: 'İletişim & Destek',
    items: [
      { title: 'turnuva@tsf.org.tr', url: 'mailto:turnuva@tsf.org.tr' },
      { title: 'Çağrı Merkezi: 0312 309 75 28', url: 'tel:+903123097528' },
      { title: 'Sıkça Sorulan Sorular', url: 'https://www.tsf.org.tr/sss' },
      { title: 'Destek Talebi', url: 'https://ticket.tsf.org.tr/destek/' },
    ],
  },
];

export const socialLinks = [
  { title: 'Facebook', icon: 'facebook-logo', url: 'https://www.facebook.com/tsf.org.tr' },
  { title: 'X', icon: 'x-logo', url: 'https://x.com/tsf_org_tr' },
  { title: 'Instagram', icon: 'instagram-logo', url: 'https://www.instagram.com/tsf.org.tr' },
  { title: 'YouTube', icon: 'youtube-logo', url: 'https://www.youtube.com/@tsf' },
];
