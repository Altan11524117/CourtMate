# 📌 API Gereksinimleri ve Görev Dağılımı

Bu doküman, sistemdeki API endpoint'lerini, açıklamalarını ve görev atamalarını içermektedir.

## 👤 1. Kullanıcı ve Profil İşlemleri (Auth & Users)

**Üye Olma** (İsim Soyisim)
* **API Metodu:** `POST /auth/register`
* **Açıklama:** Sisteme yeni kullanıcı kaydı oluşturur. İstemciden zorunlu verileri alır ve şifreyi güvenlik standartlarına (örn: bcrypt) uygun şekilde hashleyerek veritabanına kaydeder. Yetki: Public.

**Giriş Yapma** (İsim Soyisim)
* **API Metodu:** `POST /auth/login`
* **Açıklama:** Kullanıcı girişini ve kimlik doğrulamasını sağlar. Doğrulama başarılı olursa, sonraki güvenli iletişimler için istemciye bir erişim token'ı döndürür. Yetki: Public.

**Çıkış Yapma** (İsim Soyisim)
* **API Metodu:** `POST /auth/logout`
* **Açıklama:** Aktif oturumu sonlandırır. İstemci tarafındaki token silinir ve sunucu tarafında kara listeye alınarak tekrar kullanımı engellenir. Yetki: Bearer Token.

**Şifre Sıfırlama** (İsim Soyisim)
* **API Metodu:** `POST /auth/reset-password`
* **Açıklama:** Şifre sıfırlama sürecini başlatır. Kullanıcının kayıtlı adresine süreli ve tek kullanımlık bir şifre sıfırlama bağlantısı gönderir. Yetki: Public.

**Profil Görüntüleme** (İsim Soyisim)
* **API Metodu:** `GET /users/{userId}/profile`
* **Açıklama:** Kullanıcı profil bilgilerini getirir. İstek yapan kişi kendi profilini görüntülüyorsa tüm detaylar, farklı bir kullanıcıyı görüntülüyorsa sadece herkese açık veriler (public) döndürülür. Yetki: Bearer Token.

**Profil Güncelleme** (İsim Soyisim)
* **API Metodu:** `PATCH /users/{userId}/profile`
* **Açıklama:** Kullanıcının profil bilgilerini günceller. Yetki kontrolü yapılır. Kullanıcı yalnızca kendi bilgilerini güncelleyebilir. Yetki: Bearer Token.

**Hesap Silme** (İsim Soyisim)
* **API Metodu:** `DELETE /users/{userId}`
* **Açıklama:** Kullanıcı hesabını sistemden kaldırır. Veri bütünlüğünü korumak adına "Soft Delete" (veritabanında pasife alma) yöntemi uygulanır. Yetki: Bearer Token.

---

## 🧠 2. Seviye Sınavı (AI Destekli)

**Sınav Sorularını Getirme** (İsim Soyisim)
* **API Metodu:** `GET /exams/placement/questions`
* **Açıklama:** Seviye belirleme sorularını getirir. AI asistanı veya sistem havuzu tarafından kullanıcının seviyesini ölçmek için hazırlanan soruları istemciye iletir. Yetki: Bearer Token.

**Sınav Sonucunu Gönderme** (İsim Soyisim)
* **API Metodu:** `POST /exams/placement/submit`
* **Açıklama:** Sınav yanıtlarını gönderir ve seviyeyi belirler. Cevaplar analiz edilir, başarı puanı hesaplanır ve kullanıcının veritabanındaki "Seviye" bilgisi kalıcı olarak güncellenir. Yetki: Bearer Token.

---

## 📢 3. İlan Yönetimi

**İlanları Listeleme** (İsim Soyisim)
* **API Metodu:** `GET /ads`
* **Açıklama:** Aktif ilanları listeler. Performans optimizasyonu için sayfalama (Pagination - limit/offset) kullanılarak veriler getirilir. Yetki: Public / Bearer Token.

**İlan Arama ve Filtreleme** (İsim Soyisim)
* **API Metodu:** `GET /ads/search`
* **Açıklama:** İlanlar içinde detaylı arama ve filtreleme yapar. Kategori, konum, sıralama gibi URL query parametrelerine göre süzülmüş sonuçları döndürür. Yetki: Public / Bearer Token.

**İlan Oluşturma** (İsim Soyisim)
* **API Metodu:** `POST /ads`
* **Açıklama:** Yeni bir ilan oluşturur. İstek yapan kullanıcının ID'si otomatik olarak ilanın ownerId (sahibi) alanına atanır. Yetki: Bearer Token.

**İlan Detayı Görüntüleme** (İsim Soyisim)
* **API Metodu:** `GET /ads/{adId}`
* **Açıklama:** Belirli bir ilanın detaylarını getirir. İlanın içeriği, görselleri ve ilan sahibinin özet profil bilgileriyle birlikte okunma/görüntülenme sayısını artırarak getirir. Yetki: Public / Bearer Token.

**İlan Güncelleme** (İsim Soyisim)
* **API Metodu:** `PATCH /ads/{adId}`
* **Açıklama:** Yayınlanmış ilanı günceller. Kullanıcının, gerçekten ilanın sahibi olup olmadığı kontrol edilir, değilse 403 Forbidden döndürülür. Yetki: Bearer Token.

**İlan Silme** (İsim Soyisim)
* **API Metodu:** `DELETE /ads/{adId}`
* **Açıklama:** İlanı sistemden kaldırır. İlan ve ilana bağlı başvurular kaskad (cascade) silme veya soft delete mantığıyla temizlenir. Yetki: Bearer Token.

---

## 🤝 4. İlan Başvuru ve İstek Süreçleri

**İlana Başvurma** (İsim Soyisim)
* **API Metodu:** `POST /ads/{adId}/applications`
* **Açıklama:** İlana katılma isteği gönderir. Kullanıcının ilgilendiği ilana başvuru yapmasını sağlar. İş kuralı gereği kullanıcı kendi ilanına başvuramaz. Başvuru durumu başlangıçta "bekliyor" (pending) olarak atanır. Yetki: Bearer Token.

**Başvuruları Listeleme** (İsim Soyisim)
* **API Metodu:** `GET /ads/{adId}/applications`
* **Açıklama:** İlana gelen başvuru isteklerini listeler. Başvuran kişilerin özet profilleriyle beraber, ilan sahibine özel bir liste döndürülür. Yetki: Bearer Token.

**Başvuru Onaylama/Reddetme** (İsim Soyisim)
* **API Metodu:** `PATCH /ads/{adId}/applications/{applicationId}`
* **Açıklama:** Gelen başvuruyu onaylar veya reddeder. İlan sahibinin kararına göre başvurunun durumunu günceller. Yetki: Bearer Token.
* **Yetki:** Bearer Token (Sadece İlan Sahibi)
* **Açıklama:** Başvurunun durumu `accepted` veya `rejected` olarak güncellenir. İşlem sonrası ilgili kullanıcıya bildirim/e-posta tetiklenebilir.
