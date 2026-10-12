import { provinceByCode } from '@/config/provinces';
import type { Tournament } from '@/types/tournament';

/**
 * Sample tournaments until the database is in place. Dates are chosen around
 * the autumn of 2026 so every registration state appears in the listings.
 */

const province = (code: string) => {
  const found = provinceByCode(code);
  if (!found) throw new Error(`Bilinmeyen il kodu: ${code}`);
  return found;
};

const days = (from: string, count: number): string[] =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date(`${from}T12:00:00+03:00`);
    date.setDate(date.getDate() + index);
    return date.toISOString().slice(0, 10);
  });

const standardContacts = [
  {
    title: 'TSF Teknik ve Yarışmalar Kurulu',
    description: 'Kayıt kontrolü, kategori ve mevzuat soruları',
    phone: '0 (312) 309 75 28',
    email: 'turnuva@tsf.org.tr',
  },
];

const consentQuestion = {
  id: 'konaklama',
  label: 'Resmi turnuva otelinde konaklama talep ediyor musunuz?',
  type: 'boolean' as const,
  required: true,
  help: 'Konaklama detayları turnuva organizasyonu tarafından iletilecektir.',
};

const needsQuestion = {
  id: 'ozel-ihtiyac',
  label: 'Özel sağlık, fiziksel erişim veya beslenme ihtiyacı',
  type: 'textarea' as const,
  required: false,
  help: 'Tekerlekli sandalye erişimi, görme engelli sporcu takımı ihtiyacı veya refakat durumunu belirtiniz.',
};

export const tournaments: Tournament[] = [
  {
    slug: '2026-turkiye-kupasi',
    code: 'TSF-2026-TRK-01',
    title: '2026 Türkiye Kupası Satranç Şampiyonası',
    organizer: 'Türkiye Satranç Federasyonu & Ankara İl Temsilciliği',
    province: province('06'),
    scope: 'Ulusal',
    venue: 'Ankara Atatürk Satranç Merkezi, Anafartalar Cad.',
    district: 'Ulus',
    days: days('2026-11-14', 7),
    registrationOpensAt: '2026-10-01T09:00:00+03:00',
    registrationClosesAt: '2026-11-09T17:00:00+03:00',
    tempo: "90' + 30'' eklemeli",
    system: '9 Tur İsviçre Sistemi',
    eligibility:
      'Genel Kategori kapsamında olup FIDE/UKD puanlı veya puansız, lisanslı tüm Türk vatandaşı sporcular katılabilir.',
    chiefArbiter: 'IA / Uluslararası Hakem Kurulu Görevlendirmesi',
    capacity: 256,
    registeredCount: 184,
    tags: ['FIDE / UKD'],
    categories: [
      { id: 'acik', name: 'Açık Kategori', description: 'Genel klasman; tüm lisanslı sporculara açıktır.' },
      { id: 'kadinlar', name: 'Kadınlar Kategorisi', description: 'Kadın sporcular için genel sıralama ve özel kupa derecelendirmesi.' },
      { id: 'emektarlar', name: 'Emektarlar (50+)', description: '1976 ve öncesi doğumlu sporcular için kıdem grubu.' },
    ],
    extraQuestions: [consentQuestion, needsQuestion],
    regulation: {
      version: 'v1.2',
      publishedAt: '2026-09-28',
      summary:
        'Bu yönerge, 2026 Türkiye Kupası Satranç Şampiyonası genel esaslarını, kura çekimi kurallarını, itiraz süreçlerini ve dereceye giren sporculara verilecek kupa ve madalya dağılımını kapsar. Turnuvada FIDE Satranç Kuralları geçerlidir.',
      file: { url: '/belgeler/2026-turkiye-kupasi-yonergesi-v1.2.pdf', sizeLabel: '1,4 MB' },
      sections: [
        {
          title: 'Amaç ve Kapsam',
          paragraphs: [
            'Bu yönerge, Türkiye Satranç Federasyonu tarafından düzenlenen 2026 Türkiye Kupası Satranç Şampiyonası’nın düzenlenme esaslarını belirler.',
            'Şampiyona, Türkiye Satranç Federasyonu Yarışmalar Talimatı ve FIDE Satranç Kuralları çerçevesinde oynanır.',
          ],
        },
        {
          title: 'Katılım Koşulları',
          paragraphs: [
            '2026–2027 sezonu vizeli lisansa sahip tüm sporcular katılabilir. Kadınlar ve Emektarlar kategorileri genel sıralama içinde ayrıca derecelendirilir.',
            'Aynı tarih aralığında başka bir resmi turnuvaya kayıtlı sporcuların başvurusu sistem tarafından kabul edilmez.',
          ],
        },
        {
          title: 'Takvim ve Oyun Temposu',
          paragraphs: [
            'Turnuva 14–20 Kasım 2026 tarihlerinde 9 tur İsviçre sistemiyle oynanır. Oyun temposu 90 dakika + hamle başına 30 saniye eklemelidir.',
            'Hükmen yenilgi süresi tur başlangıcından itibaren 15 dakikadır.',
          ],
        },
        {
          title: 'Ödüller',
          paragraphs: [
            'Genel klasmanda ilk üç dereceye kupa ve madalya, kategori birincilerine madalya verilir. Ödül töreni son turun ardından yapılır.',
          ],
        },
        {
          title: 'Başvuru',
          paragraphs: [
            'Başvurular yalnızca turnuva.tsf.org.tr üzerinden alınır. Son başvuru tarihi 9 Kasım 2026 saat 17:00’dir.',
            'Başvuru sırasında beyan edilen bilgiler teknik toplantıda kimlik belgesiyle kontrol edilir.',
          ],
        },
      ],
    },
    schedule: [
      { date: '2026-11-14', time: '10:00 – 12:00', title: 'Teknik Toplantı & Kesin Kayıt', note: 'Sporcu yoklama ve itiraz kurulu seçimi' },
      { date: '2026-11-14', time: '14:00', title: 'Açılış Töreni & 1. Tur', note: 'Protokol konuşmaları ve sembolik açılış hamlesi' },
      { date: '2026-11-15', time: '10:00', title: '2. Tur', note: 'Eşlendirme ilan saati: 09:00' },
      { date: '2026-11-15', time: '16:30', title: '3. Tur', note: 'Çift tur günü' },
      { date: '2026-11-16', time: '14:00', title: '4. Tur' },
      { date: '2026-11-17', time: '14:00', title: '5. Tur', note: 'Turnuvanın ilk yarısı tamamlanır' },
      { date: '2026-11-18', time: '10:00 / 16:30', title: '6. ve 7. Tur', note: 'İkinci çift tur programı' },
      { date: '2026-11-19', time: '14:00', title: '8. Tur' },
      { date: '2026-11-20', time: '10:00 / 16:00', title: '9. Tur & Kapanış Töreni', note: 'Final turu ve kupa takdimi' },
    ],
    contacts: [
      {
        title: 'TSF Ankara İl Temsilciliği',
        description: 'Turnuva salonu koordinasyonu ve konaklama yönlendirmesi',
        phone: '0 (312) 309 75 28 (Dahili: 114)',
        email: 'ankara@tsf.org.tr',
      },
      ...standardContacts,
    ],
    participants: [
      { name: 'Ahmet Yılmaz', province: 'Ankara', category: 'Açık Kategori' },
      { name: 'Mehmet Kaya', province: 'İstanbul', category: 'Açık Kategori' },
      { name: 'Buse Çelik', province: 'İzmir', category: 'Kadınlar Kategorisi' },
      { name: 'Emre Demir', province: 'Bursa', category: 'Açık Kategori' },
      { name: 'Selin Öztürk', province: 'Antalya', category: 'Kadınlar Kategorisi' },
      { name: 'Hasan Arslan', province: 'Konya', category: 'Emektarlar (50+)' },
      { name: 'Zeynep Doğan', province: 'Eskişehir', category: 'Kadınlar Kategorisi' },
      { name: 'Can Aydın', province: 'Kocaeli', category: 'Açık Kategori' },
    ],
  },
  {
    slug: '2026-turkiye-gorme-engelliler-sampiyonasi',
    code: 'TSF-2026-GES-01',
    title: 'Türkiye Görme Engelliler Bireysel Satranç Şampiyonası',
    organizer: 'Türkiye Satranç Federasyonu & Antalya İl Temsilciliği',
    province: province('07'),
    scope: 'Ulusal',
    venue: 'Limak Limra Hotel & Resort',
    district: 'Kemer',
    days: days('2026-12-02', 5),
    registrationOpensAt: '2026-10-05T09:00:00+03:00',
    registrationClosesAt: '2026-11-20T17:00:00+03:00',
    tempo: "90' + 30'' eklemeli",
    system: '7 Tur İsviçre Sistemi',
    eligibility: 'Görme engelli sporcular için düzenlenir; refakatçi talebi başvuru sırasında bildirilir.',
    capacity: 120,
    registeredCount: 62,
    tags: ['FIDE'],
    categories: [
      { id: 'genel', name: 'Genel Kategori' },
      { id: 'kadinlar', name: 'Kadınlar Kategorisi' },
    ],
    extraQuestions: [
      {
        id: 'refakatci',
        label: 'Refakatçi ile katılacak mısınız?',
        type: 'boolean',
        required: true,
        help: 'Refakatçi konaklaması organizasyon tarafından ayrıca planlanır.',
      },
      {
        id: 'erisim',
        label: 'Erişilebilirlik ihtiyacınız',
        type: 'select',
        required: false,
        options: ['Braille satranç saati', 'Dokunsal satranç takımı', 'Sesli bildirim', 'Diğer'],
      },
      needsQuestion,
    ],
    regulation: {
      version: 'v1.0',
      publishedAt: '2026-10-05',
      summary:
        'Görme engelli sporcular için düzenlenen şampiyonanın katılım koşulları, özel oyun kuralları, refakatçi düzenlemesi ve ödüller bu yönergede yer alır.',
      file: { url: '/belgeler/2026-gorme-engelliler-yonergesi-v1.0.pdf', sizeLabel: '980 KB' },
      sections: [
        { title: 'Amaç', paragraphs: ['Görme engelli sporcuların ulusal düzeyde yarışmasını ve Türkiye şampiyonunun belirlenmesini amaçlar.'] },
        { title: 'Katılım Koşulları', paragraphs: ['Engelli sağlık kurulu raporunda görme engeli belirtilen, 2026–2027 sezonu vizeli lisanslı sporcular katılabilir.'] },
        { title: 'Oyun Kuralları', paragraphs: ['IBCA satranç kuralları uygulanır. Sporcular kendi dokunsal takımlarını kullanabilir.'] },
        { title: 'Başvuru', paragraphs: ['Son başvuru tarihi 20 Kasım 2026 saat 17:00’dir.'] },
      ],
    },
    schedule: [
      { date: '2026-12-02', time: '11:00', title: 'Teknik Toplantı' },
      { date: '2026-12-02', time: '15:00', title: '1. Tur' },
      { date: '2026-12-03', time: '10:00 / 16:00', title: '2. ve 3. Tur' },
      { date: '2026-12-04', time: '10:00 / 16:00', title: '4. ve 5. Tur' },
      { date: '2026-12-05', time: '10:00', title: '6. Tur' },
      { date: '2026-12-06', time: '10:00', title: '7. Tur & Ödül Töreni' },
    ],
    contacts: standardContacts,
    participants: [
      { name: 'Murat Şahin', province: 'Ankara', category: 'Genel Kategori' },
      { name: 'Elif Koç', province: 'İzmir', category: 'Kadınlar Kategorisi' },
      { name: 'Serkan Polat', province: 'Samsun', category: 'Genel Kategori' },
    ],
  },
  {
    slug: 'izmir-acik-2026',
    code: 'TSF-2026-IZM-04',
    title: 'İzmir Açık Uluslararası Satranç Turnuvası (Cumhuriyet Kupası)',
    organizer: 'İzmir İl Temsilciliği',
    province: province('35'),
    scope: 'Uluslararası',
    venue: 'Kültürpark Fuar Alanı 4 No’lu Hol',
    district: 'Konak',
    days: days('2026-11-28', 6),
    registrationOpensAt: '2026-09-15T09:00:00+03:00',
    registrationClosesAt: '2026-11-18T23:59:00+03:00',
    tempo: "90' + 30'' eklemeli",
    system: '9 Tur İsviçre Sistemi',
    capacity: 400,
    registeredCount: 310,
    tags: ['FIDE / UKD'],
    categories: [
      { id: 'a', name: 'A Grubu', description: '1800 ve üzeri ELO' },
      { id: 'b', name: 'B Grubu', description: '1800 altı ve puansız sporcular' },
    ],
    extraQuestions: [consentQuestion],
    regulation: {
      version: 'v2.0',
      publishedAt: '2026-09-10',
      summary: 'İzmir Açık, iki grup halinde oynanan uluslararası FIDE dereceli bir turnuvadır. Katılım koşulları ve ödül dağılımı yönergede belirtilmiştir.',
      file: { url: '/belgeler/izmir-acik-2026-yonergesi-v2.0.pdf', sizeLabel: '2,1 MB' },
      sections: [
        { title: 'Katılım', paragraphs: ['Turnuva tüm lisanslı sporculara ve FIDE kimliği bulunan yabancı sporculara açıktır.'] },
        { title: 'Gruplar', paragraphs: ['A Grubu 1800 ve üzeri ELO, B Grubu 1800 altı ve puansız sporcular içindir.'] },
      ],
    },
    schedule: [
      { date: '2026-11-28', time: '14:00', title: '1. Tur' },
      { date: '2026-11-29', time: '10:00 / 16:00', title: '2. ve 3. Tur' },
      { date: '2026-11-30', time: '14:00', title: '4. Tur' },
      { date: '2026-12-01', time: '14:00', title: '5. Tur' },
      { date: '2026-12-02', time: '10:00 / 16:00', title: '6. ve 7. Tur' },
      { date: '2026-12-03', time: '10:00 / 16:00', title: '8. ve 9. Tur, Ödül Töreni' },
    ],
    contacts: [{ title: 'İzmir İl Temsilciliği', description: 'Organizasyon ve salon', phone: '0 (232) 441 12 34', email: 'izmir@tsf.org.tr' }],
    participants: [
      { name: 'Deniz Aksoy', province: 'İzmir', category: 'A Grubu' },
      { name: 'Giorgi Beridze', province: 'Gürcistan', category: 'A Grubu' },
      { name: 'Ayşe Kurt', province: 'Manisa', category: 'B Grubu' },
    ],
  },
  {
    slug: 'istanbul-il-birinciligi-secme-3-grup',
    code: 'TSF-2026-IST-17',
    title: 'İstanbul İl Birinciliği Seçme Turnuvası 3. Grup',
    organizer: 'İstanbul İl Temsilciliği',
    province: province('34'),
    scope: 'İl',
    venue: 'Mustafa Saffet Kültür Merkezi',
    district: 'Ataşehir',
    days: days('2026-11-21', 3),
    registrationOpensAt: '2026-10-10T09:00:00+03:00',
    registrationClosesAt: '2026-11-15T17:00:00+03:00',
    tempo: "60' + 30'' eklemeli",
    system: '6 Tur İsviçre Sistemi',
    capacity: 128,
    registeredCount: 124,
    tags: ['UKD'],
    categories: [{ id: 'genel', name: 'Genel Kategori' }],
    extraQuestions: [],
    regulation: {
      version: 'v1.0',
      publishedAt: '2026-10-08',
      summary: 'İstanbul İl Birinciliği seçme turnuvalarının üçüncü grubudur; ilk 8 sporcu il finaline katılmaya hak kazanır.',
      sections: [
        { title: 'Katılım', paragraphs: ['İstanbul ilinde lisanslı sporcular katılabilir.'] },
        { title: 'Yükselme', paragraphs: ['Grup sıralamasında ilk 8 sporcu il finaline katılır.'] },
      ],
    },
    schedule: [
      { date: '2026-11-21', time: '10:00 / 15:00', title: '1. ve 2. Tur' },
      { date: '2026-11-22', time: '10:00 / 15:00', title: '3. ve 4. Tur' },
      { date: '2026-11-23', time: '10:00 / 15:00', title: '5. ve 6. Tur' },
    ],
    contacts: [{ title: 'İstanbul İl Temsilciliği', description: 'Organizasyon', phone: '0 (216) 555 00 34', email: 'istanbul@tsf.org.tr' }],
    participants: [{ name: 'Kerem Uslu', province: 'İstanbul', category: 'Genel Kategori' }],
  },
  {
    slug: '2027-turkiye-yildizlar-sampiyonasi',
    code: 'TSF-2027-YLD-01',
    title: '2027 Türkiye Yıldızlar Satranç Şampiyonası',
    organizer: 'Türkiye Satranç Federasyonu',
    province: province('07'),
    scope: 'Ulusal',
    venue: 'Kundu Kongre Merkezi',
    district: 'Aksu',
    days: days('2027-01-10', 7),
    registrationOpensAt: '2026-11-15T09:00:00+03:00',
    registrationClosesAt: '2027-01-03T17:00:00+03:00',
    tempo: "90' + 30'' eklemeli",
    system: '9 Tur İsviçre Sistemi',
    eligibility: '13–18 yaş kategorilerinde genel ve kızlar sıralaması yapılır.',
    registeredCount: 0,
    tags: ['FIDE / UKD'],
    categories: [
      { id: '14', name: '14 Yaş' },
      { id: '16', name: '16 Yaş' },
      { id: '18', name: '18 Yaş' },
    ],
    extraQuestions: [consentQuestion],
    regulation: {
      version: 'Taslak',
      publishedAt: '2026-10-11',
      summary: 'Taslak yönerge; kesin metin başvuru açılışıyla birlikte yayımlanır.',
      sections: [{ title: 'Katılım', paragraphs: ['2009–2013 doğumlu lisanslı sporcular katılabilir.'] }],
    },
    schedule: [],
    contacts: standardContacts,
    participants: [],
  },
  {
    slug: 'eskisehir-ogretmenler-gunu-hizli-2026',
    code: 'TSF-2026-ESK-06',
    title: 'Eskişehir Öğretmenler Günü Hızlı Satranç Turnuvası',
    organizer: 'Eskişehir İl Temsilciliği',
    province: province('26'),
    scope: 'İl',
    venue: 'Yenikent Kapalı Spor Salonu',
    days: days('2026-10-24', 2),
    registrationOpensAt: '2026-09-20T09:00:00+03:00',
    registrationClosesAt: '2026-10-09T17:00:00+03:00',
    tempo: "15' + 10'' eklemeli",
    system: '7 Tur İsviçre Sistemi',
    capacity: 96,
    registeredCount: 96,
    tags: ['Hızlı Satranç'],
    categories: [{ id: 'genel', name: 'Genel Kategori' }],
    extraQuestions: [],
    regulation: {
      version: 'v1.0',
      publishedAt: '2026-09-18',
      summary: 'Öğretmenler Günü anısına düzenlenen hızlı satranç turnuvası.',
      sections: [{ title: 'Katılım', paragraphs: ['Lisanslı tüm sporculara açıktır; kontenjan 96 kişidir.'] }],
    },
    schedule: [
      { date: '2026-10-24', time: '10:00', title: '1.–4. Tur' },
      { date: '2026-10-25', time: '10:00', title: '5.–7. Tur ve Ödül Töreni' },
    ],
    contacts: [{ title: 'Eskişehir İl Temsilciliği', description: 'Organizasyon', email: 'eskisehir@tsf.org.tr' }],
    participants: [{ name: 'Hüseyin Toprak', province: 'Eskişehir', category: 'Genel Kategori' }],
  },
  {
    slug: 'bursa-nilufer-sonbahar-hizli-2026',
    code: 'TSF-2026-BRS-09',
    title: 'Bursa Nilüfer Sonbahar Hızlı Satranç Turnuvası',
    organizer: 'Bursa İl Temsilciliği',
    province: province('16'),
    scope: 'İl',
    venue: 'Nilüfer Barış Spor Salonu',
    district: 'Nilüfer',
    days: days('2026-09-26', 2),
    registrationOpensAt: '2026-08-20T09:00:00+03:00',
    registrationClosesAt: '2026-09-20T17:00:00+03:00',
    tempo: "15' + 10'' eklemeli",
    system: '7 Tur İsviçre Sistemi',
    capacity: 160,
    registeredCount: 160,
    tags: ['Hızlı Satranç'],
    categories: [{ id: 'genel', name: 'Genel Kategori' }],
    extraQuestions: [],
    regulation: {
      version: 'v1.1',
      publishedAt: '2026-08-18',
      summary: 'Sonbahar hızlı satranç turnuvası yönergesi.',
      file: { url: '/belgeler/bursa-nilufer-sonbahar-2026-yonergesi.pdf', sizeLabel: '640 KB' },
      sections: [{ title: 'Katılım', paragraphs: ['Lisanslı tüm sporculara açıktır.'] }],
    },
    schedule: [],
    contacts: [{ title: 'Bursa İl Temsilciliği', description: 'Organizasyon', email: 'bursa@tsf.org.tr' }],
    participants: [],
    results: {
      externalUrl: 'https://chess-results.com/tnr000000.aspx',
      participantCount: 160,
      files: [
        { title: 'Final sıralaması', url: '/belgeler/bursa-nilufer-sonbahar-2026-final.pdf', sizeLabel: '210 KB' },
        { title: 'Tur eşlendirmeleri', url: '/belgeler/bursa-nilufer-sonbahar-2026-eslendirme.pdf', sizeLabel: '380 KB' },
      ],
      standings: [
        { rank: 1, name: 'Burak Yıldız', province: 'Bursa', points: 6.5 },
        { rank: 2, name: 'Cem Karaca', province: 'İstanbul', points: 6 },
        { rank: 3, name: 'Melis Acar', province: 'Bursa', points: 5.5 },
        { rank: 4, name: 'Onur Güneş', province: 'Balıkesir', points: 5.5 },
        { rank: 5, name: 'Yasemin Er', province: 'Bursa', points: 5 },
        { rank: 6, name: 'Tolga Sezer', province: 'Kocaeli', points: 5 },
        { rank: 7, name: 'Pelin Aslan', province: 'Bursa', points: 5 },
        { rank: 8, name: 'Kaan Bulut', province: 'Yalova', points: 4.5 },
      ],
    },
  },
  {
    slug: '2026-turkiye-emektarlar-sampiyonasi',
    code: 'TSF-2026-EMK-01',
    title: '2026 Türkiye Emektarlar Satranç Şampiyonası',
    organizer: 'Türkiye Satranç Federasyonu',
    province: province('48'),
    scope: 'Ulusal',
    venue: 'Marmaris Kongre Merkezi',
    district: 'Marmaris',
    days: days('2026-05-04', 6),
    registrationOpensAt: '2026-03-01T09:00:00+03:00',
    registrationClosesAt: '2026-04-24T17:00:00+03:00',
    tempo: "90' + 30'' eklemeli",
    system: '9 Tur İsviçre Sistemi',
    registeredCount: 142,
    tags: ['FIDE / UKD'],
    categories: [
      { id: '50', name: '50+' },
      { id: '65', name: '65+' },
    ],
    extraQuestions: [],
    regulation: {
      version: 'v1.0',
      publishedAt: '2026-02-25',
      summary: '50 yaş üstü sporcular için düzenlenen Türkiye şampiyonası yönergesi.',
      file: { url: '/belgeler/2026-emektarlar-yonergesi.pdf', sizeLabel: '1,1 MB' },
      sections: [{ title: 'Katılım', paragraphs: ['1976 ve öncesi doğumlu lisanslı sporcular katılabilir.'] }],
    },
    schedule: [],
    contacts: standardContacts,
    participants: [],
    results: {
      externalUrl: 'https://chess-results.com/tnr000001.aspx',
      participantCount: 142,
      files: [{ title: 'Final sıralaması', url: '/belgeler/2026-emektarlar-final.pdf', sizeLabel: '260 KB' }],
      standings: [
        { rank: 1, name: 'Nevzat Süer', province: 'İstanbul', points: 7.5 },
        { rank: 2, name: 'Ali Ulvi Şen', province: 'Ankara', points: 7 },
        { rank: 3, name: 'Hikmet Ercan', province: 'İzmir', points: 6.5 },
        { rank: 4, name: 'Suat Atalık', province: 'İstanbul', points: 6.5 },
        { rank: 5, name: 'Gülümser Yılmaz', province: 'Muğla', points: 6 },
      ],
    },
  },
];

export const findTournament = (slug: string) => tournaments.find(tournament => tournament.slug === slug);

/**
 * Entries already on file, keyed by the identity number, so the form can show
 * the date-conflict rule. The real check will run in the database.
 */
export interface ExistingEntry {
  tckn: string;
  code: string;
  tournamentTitle: string;
  days: string[];
}

export const existingEntries: ExistingEntry[] = [
  // Demo: this identity number already holds an entry whose days overlap the Türkiye Kupası and the İstanbul seçme.
  { tckn: '10000000146', code: 'TSF-2026-003119', tournamentTitle: 'Ankara İl Birinciliği Seçme Turnuvası', days: days('2026-11-19', 3) },
];
