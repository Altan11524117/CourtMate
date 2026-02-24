# Gereksinimleri 

##  1. Kullanıcı ve Profil İşlemleri (Auth & Users)

**Üye Olma** (Arif YAVUZ)
* **API Metodu:** `POST /auth/register`
* **Açıklama:** Sisteme yeni kullanıcı kaydı oluşturur. İstemciden zorunlu verileri alır ve şifreyi güvenlik standartlarına (örn: bcrypt) uygun şekilde hashleyerek veritabanına kaydeder. 

**Giriş Yapma** (Arif YAVUZ)
* **API Metodu:** `POST /auth/login`
* **Açıklama:** Kullanıcı girişini ve kimlik doğrulamasını sağlar. Doğrulama başarılı olursa, sonraki güvenli iletişimler için istemciye bir erişim token'ı döndürür.

**Çıkış Yapma** (Arif YAVUZ)
* **API Metodu:** `POST /auth/logout`
* **Açıklama:** Aktif oturumu sonlandırır. İstemci tarafındaki token silinir ve sunucu tarafında kara listeye alınarak tekrar kullanımı engellenir.

**Şifre Sıfırlama** (Arif YAVUZ)
* **API Metodu:** `POST /auth/reset-password`
* **Açıklama:** Şifre sıfırlama sürecini başlatır. Kullanıcının kayıtlı adresine süreli ve tek kullanımlık bir şifre sıfırlama bağlantısı gönderir.

**Profil Görüntüleme** (Arif YAVUZ)
* **API Metodu:** `GET /users/{userId}/profile`
* **Açıklama:** Kullanıcı profil bilgilerini getirir. İstek yapan kişi kendi profilini görüntülüyorsa tüm detaylar, farklı bir kullanıcıyı görüntülüyorsa sadece herkese açık veriler (public) döndürülür.

**Profil Güncelleme** (Arif YAVUZ)
* **API Metodu:** `PATCH /users/{userId}/profile`
* **Açıklama:** Kullanıcının profil bilgilerini günceller. Yetki kontrolü yapılır. Kullanıcı yalnızca kendi bilgilerini güncelleyebilir.

**Hesap Silme** (Arif YAVUZ)
* **API Metodu:** `DELETE /users/{userId}`
* **Açıklama:** Kullanıcı hesabını sistemden kaldırır. Veri bütünlüğünü korumak adına "Soft Delete" (veritabanında pasife alma) yöntemi uygulanır.

---

## 2. Seviye Sınavı (AI Destekli)

**Sınav Sorularını Getirme** (Altan AYDIN)
* **API Metodu:** `GET /exams/placement/questions`
* **Açıklama:** Seviye belirleme sorularını getirir. AI asistanı veya sistem havuzu tarafından kullanıcının seviyesini ölçmek için hazırlanan soruları istemciye iletir yada kedni sorular yarartir genel seviye dagilimini analiz ederek kullaniciyi belli bir seviyeye atar ai ana temasi genel kullanici havuzu  seviyesine dayali seviyelendirme yapip  kullanici eslesme oranini artirmak.

**Sınav Sonucunu Gönderme** (Altan AYDIN)
* **API Metodu:** `POST /exams/placement/submit`
* **Açıklama:** Sınav yanıtlarını gönderir ve seviyeyi belirler. Cevaplar analiz edilir, başarı puanı hesaplanır ve kullanıcının veritabanındaki "Seviye" bilgisi belli bir sureligine kalıcı olarak güncellenir. 

---

## 3. İlan Yönetimi

**İlanları Listeleme** (Arif YAVUZ)
* **API Metodu:** `GET /ads`
* **Açıklama:** Aktif ilanları listeler. Performans optimizasyonu için sayfalama (Pagination - limit/offset) kullanılarak veriler getirilir.

**İlan Arama ve Filtreleme** (Altan AYDIN)
* **API Metodu:** `GET /ads/search`
* **Açıklama:** İlanlar içinde detaylı arama ve filtreleme yapar. Kategori, konum, sıralama gibi URL query parametrelerine göre süzülmüş sonuçları döndürür.

**İlan Oluşturma** (Altan AYDIN)
* **API Metodu:** `POST /ads`
* **Açıklama:** Yeni bir ilan oluşturur. İstek yapan kullanıcının ID'si otomatik olarak ilanın ownerId (sahibi) alanına atanır.

**İlan Detayı Görüntüleme** (Altan AYDIN)
* **API Metodu:** `GET /ads/{adId}`
* **Açıklama:** Belirli bir ilanın detaylarını getirir. İlanın içeriği, görselleri ve ilan sahibinin özet profil bilgileriyle birlikte okunma/görüntülenme sayısını artırarak getirir.

**İlan Güncelleme** (Altan AYDIN)
* **API Metodu:** `PATCH /ads/{adId}`
* **Açıklama:** Yayınlanmış ilanı günceller. Kullanıcının, gerçekten ilanın sahibi olup olmadığı kontrol edilir, değilse 403 Forbidden döndürülür.

**İlan Silme** (Altan AYDIN)
* **API Metodu:** `DELETE /ads/{adId}`
* **Açıklama:** İlanı sistemden kaldırır. İlan ve ilana bağlı başvurular kaskad (cascade) silme veya soft delete mantığıyla temizlenir.

**İlana Başvurma** (Altan AYDIN)
* **API Metodu:** `POST /ads/{adId}/applications`
* **Açıklama:** İlana katılma isteği gönderir. Kullanıcının ilgilendiği ilana başvuru yapmasını sağlar. İş kuralı gereği kullanıcı kendi ilanına başvuramaz. Başvuru durumu başlangıçta "bekliyor" (pending) olarak atanır.

**Başvuruları Listeleme** (Altan AYDIN)
* **API Metodu:** `GET /ads/{adId}/applications`
* **Açıklama:** İlana gelen başvuru isteklerini listeler. Başvuran kişilerin özet profilleriyle beraber, ilan sahibine özel bir liste döndürülür.

**Başvuru Onaylama/Reddetme** (Altan AYDIN)
* **API Metodu:** `PATCH /ads/{adId}/applications/{applicationId}`
* **Açıklama:** Gelen başvuruyu onaylar veya reddeder. İlan sahibinin kararına göre başvurunun durumunu günceller.
