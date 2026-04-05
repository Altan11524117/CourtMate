**Üye Olma** (Arif YAVUZ)
* **API Metodu:** `POST /auth/register`
* **Açıklama:** Sisteme yeni kullanıcı kaydı oluşturur. İstemciden zorunlu verileri alır ve şifreyi güvenlik standartlarına (örn: bcrypt) uygun şekilde hashleyerek veritabanına kaydeder.

<video width="100%" controls>
  <source src="./Arif_Yavuz/kayit.mp4" type="video/mp4">
</video>

**Giriş Yapma** (Arif YAVUZ)
* **API Metodu:** `POST /auth/login`
* **Açıklama:** Kullanıcı girişini ve kimlik doğrulamasını sağlar. Doğrulama başarılı olursa, sonraki güvenli iletişimler için istemciye bir erişim token'ı döndürür.

<video src="/Arif_Yavuz/requirements_terminal_videos/giris.mp4" controls width="100%"></video>

**Çıkış Yapma** (Arif YAVUZ)
* **API Metodu:** `POST /auth/logout`
* **Açıklama:** Aktif oturumu sonlandırır. İstemci tarafındaki token silinir ve sunucu tarafında kara listeye alınarak tekrar kullanımı engellenir.

<video src="requirements_terminal_videos/cikis.mp4" controls width="100%"></video>

**Şifre Sıfırlama** (Arif YAVUZ)
* **API Metodu:** `POST /auth/reset-password`
* **Açıklama:** Şifre sıfırlama sürecini başlatır. Kullanıcının kayıtlı adresine süreli ve tek kullanımlık bir şifre sıfırlama bağlantısı gönderir.

<video src="requirements_terminal_videos/hesap_silme.mp4" controls width="100%"></video>

**Profil Görüntüleme** (Arif YAVUZ)
* **API Metodu:** `GET /users/{userId}/profile`
* **Açıklama:** Kullanıcı profil bilgilerini getirir. İstek yapan kişi kendi profilini görüntülüyorsa tüm detaylar, farklı bir kullanıcıyı görüntülüyorsa sadece herkese açık veriler (public) döndürülür.

<video src="requirements_terminal_videos/profil_goruntule_ve_degistir.mp4" controls width="100%"></video>

**Profil Güncelleme** (Arif YAVUZ)
* **API Metodu:** `PATCH /users/{userId}/profile`
* **Açıklama:** Kullanıcının profil bilgilerini günceller. Yetki kontrolü yapılır. Kullanıcı yalnızca kendi bilgilerini güncelleyebilir.

<video src="requirements_terminal_videos/profil_goruntule_ve_degistir.mp4" controls width="100%"></video>

**Hesap Silme** (Arif YAVUZ)
* **API Metodu:** `DELETE /users/{userId}`
* **Açıklama:** Kullanıcı hesabını sistemden kaldırır. Veri bütünlüğünü korumak adına "Soft Delete" (veritabanında pasife alma) yöntemi uygulanır.

<video src="requirements_terminal_videos/hesap_silme.mp4" controls width="100%"></video>
**İlanları Listeleme** (Arif YAVUZ)
* **API Metodu:** `GET /ads`
* **Açıklama:** Aktif ilanları listeler. Performans optimizasyonu için sayfalama (Pagination - limit/offset) kullanılarak veriler getirilir.
