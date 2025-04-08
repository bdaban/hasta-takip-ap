Hasta Takip Uygulaması
1. Hasta bilgileri giriş Hasta (Tablosu)
-ad,soyad,tc,telefon,adres,açıklama, teshisler tablosu ile ilişkili, ve başka girilmesi gereken bilgiler varsa kendin oluştur,radevular tablosu ilişkisi,muayene bilgi tablosu ile ilişkili,tetkik ve bulfgu tablosu ile ilişikli doktor tablosu ile ilişkili hangi doktor hangi ilaçı ve tedaviyi uygulamış 
2.Teshisler Tablosu
-Teshis adı /hastalık adı
3.Randevular tablosu
-Tarih ve saat seçerek hasta için randevu oluşturma
4.Muayene Bilgi ve bulgu tablosu
5. doktor tablosu
-ad soyadı dr sicil branş ve diğer eklenmesi gerekn alanlar
6.tetkik ve bulgular tablosu
kan testi bilgileri -rontgen bilgileri - idrar testi gayta testi ve geekn diğer alanlar neyse ekle

Örnek bunları verdim ama sen bunlara ekleme de yapabilirsin
pages/hastalar altında hiç bir seyi değiştirme 
# 🗂️ HASTA TAKİP UYGULAMASI – İŞ PLANI

## 🔧 Teknolojiler
- [x] Nuxt 3 (Vue 3 Composition API)
- [x] Tailwind CSS (UI & responsive tasarım)
- [x] Prisma ORM (veritabanı yönetimi)
- [x] MySQL (veya PostgreSQL)
- [x] Pinia (global state)
- [x] Nuxt Auth / Middleware (giriş & yetki)
- [x] Day.js veya date-fns (tarih yönetimi)
- [ ] PDF export veya tablo yazdırma (isteğe bağlı)

## 📁 1. Proje Kurulumu
- [x] Nuxt 3 projesini oluştur  
  `npx nuxi init hasta-takip-app`
- [x] Gerekli bağımlılıkları yükle  
  `npm install`
- [x] Tailwind CSS kurulumu  
  `npx tailwindcss init -p`
- [x] Tailwind'i Nuxt ile entegre et (`nuxt.config.ts`)
- [x] Fontlar, renkler ve base UI ayarları

## 🗃️ 2. Veritabanı ve Prisma
- [x] Prisma kurulumu  
  `npm install prisma --save-dev && npx prisma init`
- [x] .env dosyasına veritabanı bağlantı bilgisi
- [x] Aşağıdaki veri modellerini oluştur:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  role      String
  createdAt DateTime @default(now())
}

model Hasta {
  id         Int      @id @default(autoincrement())
  ad         String
  soyad      String
  tc         String   @unique
  telefon    String?
  adres      String?
  dogumTarihi DateTime
  cinsiyet   String
  notlar     String?
  createdAt  DateTime @default(now())
}

model Takip {
  id         Int      @id @default(autoincrement())
  hastaId    Int
  tarih      DateTime
  sikayet    String?
  tani       String?
  tedavi     String?
  doktorId   Int
  createdAt  DateTime @default(now())

  hasta      Hasta    @relation(fields: [hastaId], references: [id])
  doktor     User     @relation(fields: [doktorId], references: [id])
}
```

- [x] Veritabanı modelleri oluşturuldu ve schema.prisma dosyasına eklendi.
- [x] `npx prisma migrate dev --name init` (Migration başlatıldı)

## 🔐 3. Giriş & Kullanıcı Yönetimi
- [ ] Kullanıcı giriş sayfası (PIN veya şifre)
- [ ] Role bazlı yönlendirme (admin, doktor, sekreter)
- [ ] Middleware ile sayfa koruması (`defineNuxtRouteMiddleware`)
- [ ] Pinia ile oturum verisini saklama (token, user, role)

## 🧍 4. Hasta Yönetimi
- [x] Hasta listeleme sayfası
- [x] Yeni hasta ekleme formu
- [x] Hasta detay sayfası
- [x] Hasta arama (TC, ad-soyad ile)
- [x] Silme ve güncelleme
- [x] API entegrasyonu:
  - [x] GET /api/hastalar - Tüm hastaları listeleme
  - [x] GET /api/hastalar/[id] - Hasta detayı
  - [x] POST /api/hastalar/create - Yeni hasta ekleme
  - [x] PUT /api/hastalar/[id] - Hasta güncelleme
  - [x] DELETE /api/hastalar/[id] - Hasta silme
- [x] UI ve API entegrasyonu:
  - [x] Hasta listeleme sayfasında veritabanından hasta listeleme
  - [x] Hasta ekleme formunun API ile entegrasyonu
  - [x] Hasta detay sayfasına gerçek veri gösterimi
  - [x] Hasta düzenleme formunun API ile entegrasyonu
  - [x] Hasta silme işleminin API ile entegrasyonu

## 📄 5. Hasta Takip Sayfası
- [ ] Seçilen hastaya yeni takip ekleme
- [ ] Takip geçmişi görüntüleme (tarih sıralı)
- [ ] Şikayet – Tanı – Tedavi üçlüsüyle yapı
- [ ] Takip silme/güncelleme
- [ ] İlgili doktor bilgisi gösterimi

## 📈 6. Dashboard & Raporlama
- [x] Admin paneli: toplam hasta, toplam takip
- [ ] Doktora özel: takip istatistikleri
- [ ] Hasta filtreleme (bugün gelenler, kadın/erkek vb.)
- [ ] Tarih aralığına göre listeleme

## ⚙️ 7. Genel Özellikler
- [ ] Karanlık mod desteği (opsiyonel)
- [ ] Toast bildirimleri (form sonrası)
- [x] Responsive uyum (mobil + tablet)
- [x] Tema/renk uyarlamaları (Tailwind üzerinden)
- [x] Form doğrulama (`yup`, `vee-validate` vs.)

## 📤 8. Yayınlama & DevOps
- [ ] Production için build alma:  
  `npm run build`
- [ ] `.env.production` dosyası hazırlama
- [ ] Vercel / Netlify / VPS üzerine yükleme

## ✍️ 9. Ekstra Geliştirme Önerileri
- [ ] Hasta geçmişini PDF olarak dışa aktar
- [ ] Kullanıcı aksiyonlarını logla (audit trail)
- [ ] Doktor bazlı yetki kısıtlamaları
- [ ] Randevu takvimi entegrasyonu

> 💡 Proje ilerledikçe bu plan genişletilip "tamamlandı" olarak işaretlenebilir.

## 📋 Tamamlanan İşler - 04.04.2025

1. Proje temel yapısı oluşturuldu ve Nuxt 3 + Nuxt UI kuruldu.
2. Prisma veritabanı şeması oluşturuldu ve .env dosyası yapılandırıldı.
3. Veritabanı migration işlemleri başlatıldı:
   - Veritabanı bağlantısı kuruldu (MySQL - hasta_takip veritabanı)
   - Prisma şemasındaki modeller (User, Hasta, Takip, Randevu, Teshis, Tetkik) veritabanına aktarıldı.
4. Temel uygulama sayfaları oluşturuldu:
   - Ana sayfa (Dashboard)
   - Hasta listeleme sayfası
   - Hasta ekleme formu
   - Hasta detay sayfası
   - Hasta düzenleme formu
5. Responsive tasarım için Tailwind CSS entegrasyonu sağlandı.
6. Form doğrulama için Zod entegrasyonu yapıldı.
7. API Endpoint'leri oluşturuldu:
   - Hasta listeleme, detay görüntüleme, ekleme, güncelleme ve silme işlemleri için API rotaları tanımlandı.
   - Prisma client ile veritabanı işlemleri entegre edildi.
8. Hasta modülü API entegrasyonu tamamlandı:
   - Hasta listeleme, ekleme, detay görüntüleme, düzenleme ve silme işlemleri tamamen veritabanı ile çalışır hale getirildi.
   - Tarih formatlamaları ve form validasyonları eklendi.
   - Hata yönetimi ve yükleme durumları (loading states) eklenip kullanıcı deneyimi iyileştirildi.

## 📅 Sonraki Adımlar

1. Randevu yönetimi modülünü oluşturma:
   - Randevu listeleme sayfası
   - Randevu ekleme formu
   - Randevu detay ve düzenleme sayfaları
   - Takvim görünümü
2. Takip modülü sayfalarını ekleme:
   - Hasta takip kayıtları görüntüleme
   - Yeni takip kayıt formu
   - Takip detayları ve düzenleme
3. Kullanıcı giriş ve yetkilendirme sisteminin kurulması:
   - Login sayfası
   - Kullanıcı yönetimi
   - Rol tabanlı yetkilendirme
4. Toast bildirimlerinin eklenmesi
5. Dashboard istatistik gösterimlerinin tamamlanması

## Tamamlanan Görevler (4 Nisan 2025)

- [x] Proje yapısı oluşturuldu
- [x] Veritabanı şeması oluşturuldu
- [x] API endpoint'leri oluşturuldu
- [x] Hasta yönetimi modülü tamamlandı
  - [x] Hasta listesi sayfası
  - [x] Hasta detay sayfası
  - [x] Hasta ekleme sayfası
  - [x] Hasta düzenleme sayfası
  - [x] API entegrasyonu
- [x] Randevu yönetimi modülü tamamlandı
  - [x] Randevu listesi sayfası
  - [x] Randevu detay sayfası
  - [x] Randevu ekleme sayfası
  - [x] Randevu düzenleme sayfası
  - [x] API entegrasyonu
- [x] Takip yönetimi modülü tamamlandı
  - [x] Takip listesi sayfası
  - [x] Takip detay sayfası
  - [x] Takip ekleme sayfası
  - [x] Takip düzenleme sayfası
  - [x] API entegrasyonu

## Sonraki Adımlar

- [ ] Muayene yönetimi modülünün oluşturulması
  - [ ] Muayene listesi sayfası
  - [ ] Muayene detay sayfası
  - [ ] Muayene ekleme sayfası
  - [ ] Muayene düzenleme sayfası
  - [ ] API entegrasyonu
- [ ] Test sonuçları modülünün oluşturulması
  - [ ] Test sonuçları listesi sayfası
  - [ ] Test sonuçları detay sayfası
  - [ ] Test sonuçları ekleme sayfası
  - [ ] Test sonuçları düzenleme sayfası
  - [ ] API entegrasyonu

# Hasta Takip Uygulaması İş Planı

## Tamamlanan İşler

### Hastalar Sayfası
- ✅ Hastalar listesi oluşturuldu
- ✅ Hasta detay sayfası oluşturuldu
- ✅ Yeni hasta ekleme sayfası oluşturuldu
- ✅ Hasta düzenleme sayfası oluşturuldu
- ✅ Hasta silme işlemi eklendi
- ✅ Nuxt UI bileşenleri kaldırıldı ve Tailwind CSS ile yeniden tasarlandı

### Randevular Sayfası
- ✅ Randevular listesi oluşturuldu
- ✅ Randevu detay sayfası oluşturuldu
- ✅ Yeni randevu ekleme sayfası oluşturuldu
- ✅ Randevu düzenleme sayfası oluşturuldu
- ✅ Randevu silme işlemi eklendi
- ✅ Nuxt UI bileşenleri kaldırıldı ve Tailwind CSS ile yeniden tasarlandı
- ✅ Randevu tipi ve durumu için seçenekler eklendi
- ✅ Tarih formatı düzeltildi

### Doktorlar Sayfası
- ✅ Doktorlar listesi oluşturuldu
- ✅ Doktor detay sayfası oluşturuldu
- ✅ Yeni doktor ekleme sayfası oluşturuldu
- ✅ Doktor düzenleme sayfası oluşturuldu
- ✅ Doktor silme işlemi eklendi
- ✅ Nuxt UI bileşenleri kaldırıldı ve Tailwind CSS ile yeniden tasarlandı

## Yapılacak İşler

### Muayeneler Sayfası
- [ ] Muayeneler listesi oluşturulacak
- [ ] Muayene detay sayfası oluşturulacak
- [ ] Yeni muayene ekleme sayfası oluşturulacak
- [ ] Muayene düzenleme sayfası oluşturulacak
- [ ] Muayene silme işlemi eklenecek
- [ ] Tailwind CSS ile tasarlanacak

### Tetkikler Sayfası
- [ ] Tetkikler listesi oluşturulacak
- [ ] Tetkik detay sayfası oluşturulacak
- [ ] Yeni tetkik ekleme sayfası oluşturulacak
- [ ] Tetkik düzenleme sayfası oluşturulacak
- [ ] Tetkik silme işlemi eklenecek
- [ ] Tailwind CSS ile tasarlanacak

### Teşhisler Sayfası
- [ ] Teşhisler listesi oluşturulacak
- [ ] Teşhis detay sayfası oluşturulacak
- [ ] Yeni teşhis ekleme sayfası oluşturulacak
- [ ] Teşhis düzenleme sayfası oluşturulacak
- [ ] Teşhis silme işlemi eklenecek
- [ ] Tailwind CSS ile tasarlanacak

## Notlar
- Tüm sayfalar Tailwind CSS kullanılarak tasarlanacak
- Nuxt UI bileşenleri kullanılmayacak
- Tüm formlar ve tablolar responsive olacak
- Tüm sayfalar için loading ve error state'leri eklenecek
- Tüm CRUD işlemleri için API endpoint'leri oluşturulacak



