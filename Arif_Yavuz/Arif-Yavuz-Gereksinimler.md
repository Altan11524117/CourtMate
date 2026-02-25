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

**İlanları Listeleme** (Arif YAVUZ)
* **API Metodu:** `GET /ads`
* **Açıklama:** Aktif ilanları listeler. Performans optimizasyonu için sayfalama (Pagination - limit/offset) kullanılarak veriler getirilir.