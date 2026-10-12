# tsf-turnuva — Turnuva Başvuru Portalı

Türkiye Satranç Federasyonu turnuvalarına online başvuru, yönerge, yarışma takvimi ve sonuç
sayfalarını sunan Next.js uygulaması. tsf-web ile aynı tasarım sistemini (SCSS token'ları, header,
footer, bileşenler) kullanır. Canlı adres: `turnuva.tsf.org.tr`.

## Durum

Prototip arayüz. Veri `apps/web/src/data/tournaments.ts` içindeki örnek kayıtlardan gelir; başvuru
formu tarayıcıda doğrulama yapar ve tarih çakışması kuralını örnek kayıtlara göre gösterir. Veritabanı,
başvuru kaydı ve `/panel` henüz yok.

## Yapı

```
apps/web                 Next.js 16 (App Router) portal
packages/tsconfig        ortak TypeScript ayarı
packages/eslint-config   ortak ESLint ayarı
```

```
apps/web/src
├── app/                 rotalar: /, /turnuvalar, /turnuvalar/[slug]{,/yonerge,/basvuru,/sonuclar}, /takvim, /sonuclar, /yonergeler
├── components/          layout (header, footer), ui (PageTop, StatusChip, Alert…), tournaments, registration
├── config/              site kimliği, menüler, 81 il
├── data/                örnek turnuvalar ve çakışma demosu için mevcut başvurular
├── lib/                 tarih, metin (TCKN doğrulama, ad maskeleme), turnuva durumu
├── styles/              main.scss → base, layout, components, pages, responsive
└── types/               Tournament modeli
```

## Komutlar

```sh
pnpm install
pnpm dev          # turbo ile apps/web geliştirme sunucusu (http://localhost:3000)
pnpm build
pnpm lint
pnpm typecheck
```

Yalnız web için: `pnpm --filter @tsf/web dev`.

## Demo yayını (GitHub Pages)

Uygulama statik HTML'e derlenir (`apps/web/out`). `.github/workflows/pages.yml` her `main` push'unda
derleyip GitHub Pages'e yükler; depoda bir kez Settings → Pages → Source: **GitHub Actions** seçilmelidir.
Adres `https://<kullanici>.github.io/<depo>/` olur; alt yol derlemede `NEXT_PUBLIC_BASE_PATH` ile verilir.

Elle derlemek için:

```sh
NEXT_PUBLIC_BASE_PATH=/tsf-turnuva pnpm --filter @tsf/web build   # kök alan adında değişken boş kalır
npx serve apps/web/out                                              # yerelde kontrol
```

Statik olduğu için "başvuru açık / kapandı" durumları derleme anına göre hesaplanır; demo verisi
Kasım–Aralık 2026 tarihlerinde olduğundan birkaç hafta geçerli kalır.

## Tasarım

Stitch'ten üretilen ekranlar `../stitch_tsf_tournament_registration_portal` altındadır; renk, font ve
bileşen kuralları `DESIGN.md` ile tsf-web token'larından birleştirildi. Durum renkleri: açık `#1E7E34`,
yakında `#B26B00`, kapalı `#6F7B8A`.

## Sıradaki adımlar

1. PostgreSQL + Drizzle: `packages/db`, `tournaments`, `tournament_days`, `persons`, `registrations`,
   `registration_days` (UNIQUE person_id + event_date) şeması.
2. Başvuru server action'ı: tek transaction, çakışma → 409.
3. `/panel`: tek şifreyle korunan turnuva, yönerge, sonuç ve başvuru listesi yönetimi.
