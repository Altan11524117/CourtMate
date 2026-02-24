# 🚀 [Proje Adı] - Backend API RESTful Servisleri

Bu depo, kullanıcı kimlik doğrulama, AI destekli seviye belirleme sınavları ve kapsamlı bir ilan/başvuru yönetim sistemini barındıran backend API mimarisini içermektedir.

## 📌 Özellikler

| Kategori | Kapsam |
| :--- | :--- |
| **Kullanıcı Yönetimi** | Güvenli JWT/Session tabanlı kimlik doğrulama, profil ve hesap yönetimi. |
| **Seviye Sınavı** | AI entegrasyonlu, dinamik soru getirme ve sonuç analiz altyapısı. |
| **İlan Modülü** | İlan oluşturma, detaylı arama/filtreleme ve CRUD operasyonları. |
| **Başvuru Sistemi** | İlanlara katılım istekleri, onay/ret mekanizmaları ve durum takibi. |

---

## 🛠 API Dokümantasyonu

### 1. Kullanıcı ve Profil İşlemleri (Auth & Users)

#### `POST /auth/register`
Sisteme yeni kullanıcı kaydı oluşturur.
* **Yetki:** Public
* **Açıklama:** İstemciden zorunlu verileri alır ve şifreyi güvenlik standartlarına (örn: bcrypt) uygun şekilde hashleyerek veritabanına kaydeder.

#### `POST /auth/login`
Kullanıcı girişini ve kimlik doğrulamasını sağlar.
* **Yetki:** Public
* **Açıklama:** Doğrulama başarılı olursa, sonraki güvenli iletişimler için istemciye bir erişim token'ı döndürür.

#### `POST /auth/logout`
Aktif oturumu sonlandırır.
* **Yetki:** Bearer Token (Giriş Yapmış Kullanıcı)
* **Açıklama:** İstemci tarafındaki token silinir ve sunucu tarafında kara listeye alınarak tekrar kullanımı engellenir.

#### `POST /auth/reset-password`
Şifre sıfırlama sürecini başlatır.
* **Yetki:** Public
* **Açıklama:** Kullanıcının kayıtlı adresine süreli ve tek kullanımlık bir şifre sıfırlama bağlantısı gönderir.

#### `GET /users/{userId}/profile`
Kullanıcı profil bilgilerini getirir.
* **Yetki:** Bearer Token
* **Açıklama:** İstek yapan kişi kendi profilini görüntülüyorsa tüm detaylar, farklı bir kullanıcıyı görüntülüyorsa sadece herkese açık veriler (public) döndürülür.

#### `PATCH /users/{userId}/profile`
Kullanıcının profil bilgilerini günceller.
* **Yetki:** Bearer Token (Sadece Hesap Sahibi)
* **Açıklama:** Yetki kontrolü yapılır. Kullanıcı yalnızca kendi bilgilerini güncelleyebilir.

#### `DELETE /users/{userId}`
Kullanıcı hesabını sistemden kaldırır.
* **Yetki:** Bearer Token (Sadece Hesap Sahibi veya Admin)
* **Açıklama:** Veri bütünlüğünü korumak adına "Soft Delete" (veritabanında pasife alma) yöntemi uygulanır.

---

### 2. Seviye Sınavı (AI Destekli)

#### `GET /exams/placement/questions`
Seviye belirleme sorularını getirir.
* **Yetki:** Bearer Token
* **Açıklama:** AI asistanı veya sistem havuzu tarafından kullanıcının seviyesini ölçmek için hazırlanan soruları istemciye iletir.

#### `POST /exams/placement/submit`
Sınav yanıtlarını gönderir ve seviyeyi belirler.
* **Yetki:** Bearer Token
* **Açıklama:** Cevaplar analiz edilir, başarı puanı hesaplanır ve kullanıcının veritabanındaki "Seviye" bilgisi kalıcı olarak güncellenir.

---

### 3. İlan Yönetimi

#### `GET /ads`
Aktif ilanları listeler.
* **Yetki:** Public veya Bearer Token (Sistem tercihine göre)
* **Açıklama:** Performans optimizasyonu için sayfalama (Pagination - limit/offset) kullanılarak veriler getirilir.

#### `GET /ads/search`
İlanlar içinde detaylı arama ve filtreleme yapar.
* **Yetki:** Public veya Bearer Token
* **Açıklama:** Kategori, konum, sıralama gibi URL query parametrelerine göre süzülmüş sonuçları döndürür.

#### `POST /ads`
Yeni bir ilan oluşturur.
* **Yetki:** Bearer Token
* **Açıklama:** İstek yapan kullanıcının ID'si otomatik olarak ilanın `ownerId` (sahibi) alanına atanır.

#### `GET /ads/{adId}`
Belirli bir ilanın detaylarını getirir.
* **Yetki:** Public veya Bearer Token
* **Açıklama:** İlanın içeriği, görselleri ve ilan sahibinin özet profil bilgileriyle birlikte okunma/görüntülenme sayısını artırarak getirir.

#### `PATCH /ads/{adId}`
Yayınlanmış ilanı günceller.
* **Yetki:** Bearer Token (Sadece İlan Sahibi)
* **Açıklama:** Kullanıcının, gerçekten ilanın sahibi olup olmadığı kontrol edilir, değilse `403 Forbidden` döndürülür.

#### `DELETE /ads/{adId}`
İlanı sistemden kaldırır.
* **Yetki:** Bearer Token (Sadece İlan Sahibi veya Admin)
* **Açıklama:** İlan ve ilana bağlı başvurular kaskad (cascade) silme veya soft delete mantığıyla temizlenir.

---

### 4. İlan Başvuru ve İstek Süreçleri

#### `POST /ads/{adId}/applications`
İlana katılma isteği gönderir.
* **Yetki:** Bearer Token
* **Açıklama:** Kullanıcının ilgilendiği ilana başvuru yapmasını sağlar. İş kuralı gereği kullanıcı kendi ilanına başvuramaz. Başvuru durumu başlangıçta "bekliyor" (pending) olarak atanır.

#### `GET /ads/{adId}/applications`
İlana gelen başvuru isteklerini listeler.
* **Yetki:** Bearer Token (Sadece İlan Sahibi)
* **Açıklama:** Başvuran kişilerin özet profilleriyle beraber, ilan sahibine özel bir liste döndürülür.

#### `PATCH /ads/{adId}/applications/{applicationId}`
Gelen başvuruyu onaylar veya reddeder.
* **Yetki:** Bearer Token (Sadece İlan Sahibi)
* **Açıklama:** Başvurunun durumu `accepted` veya `rejected` olarak güncellenir. İşlem sonrası ilgili kullanıcıya bildirim/e-posta tetiklenebilir.
