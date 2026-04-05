**Üye Olma** (Arif YAVUZ)
* **API Metodu:** `POST /auth/register`
* **Açıklama:** Sisteme yeni kullanıcı kaydı oluşturur. İstemciden zorunlu verileri alır ve şifreyi güvenlik standartlarına (örn: bcrypt) uygun şekilde hashleyerek veritabanına kaydeder.

https://github.com/user-attachments/assets/91e1b601-1e2a-4d9a-955b-e71469414839

**Giriş Yapma** (Arif YAVUZ)
* **API Metodu:** `POST /auth/login`
* **Açıklama:** Kullanıcı girişini ve kimlik doğrulamasını sağlar. Doğrulama başarılı olursa, sonraki güvenli iletişimler için istemciye bir erişim token'ı döndürür.

https://github.com/user-attachments/assets/378270a9-4be9-4709-832a-0fd9365702d7

**Çıkış Yapma** (Arif YAVUZ)
* **API Metodu:** `POST /auth/logout`
* **Açıklama:** Aktif oturumu sonlandırır. İstemci tarafındaki token silinir ve sunucu tarafında kara listeye alınarak tekrar kullanımı engellenir.

https://github.com/user-attachments/assets/20141d64-8f11-430b-a852-085ec5acff83

**Şifre Sıfırlama** (Arif YAVUZ)
* **API Metodu:** `POST /auth/reset-password`
* **Açıklama:** Şifre sıfırlama sürecini başlatır. Kullanıcının kayıtlı adresine süreli ve tek kullanımlık bir şifre sıfırlama bağlantısı gönderir.

https://github.com/user-attachments/assets/e2edff4d-a4aa-4141-a300-10f49780b05b

**Profil Görüntüleme** (Arif YAVUZ)
* **API Metodu:** `GET /users/{userId}/profile`
* **Açıklama:** Kullanıcı profil bilgilerini getirir. İstek yapan kişi kendi profilini görüntülüyorsa tüm detaylar, farklı bir kullanıcıyı görüntülüyorsa sadece herkese açık veriler (public) döndürülür.

https://github.com/user-attachments/assets/4924fdf8-43c6-4558-a630-9d47361c7192

**Profil Güncelleme** (Arif YAVUZ)
* **API Metodu:** `PATCH /users/{userId}/profile`
* **Açıklama:** Kullanıcının profil bilgilerini günceller. Yetki kontrolü yapılır. Kullanıcı yalnızca kendi bilgilerini güncelleyebilir.

https://github.com/user-attachments/assets/db73b42b-ece9-48d4-80ac-6d2774850a47

**Hesap Silme** (Arif YAVUZ)
* **API Metodu:** `DELETE /users/{userId}`
* **Açıklama:** Kullanıcı hesabını sistemden kaldırır. Veri bütünlüğünü korumak adına "Soft Delete" (veritabanında pasife alma) yöntemi uygulanır.

https://github.com/user-attachments/assets/5ace1f39-1791-4e75-901c-101b6f252f7d

**İlanları Listeleme** (Arif YAVUZ)
* **API Metodu:** `GET /ads`
* **Açıklama:** Aktif ilanları listeler. Performans optimizasyonu için sayfalama (Pagination - limit/offset) kullanılarak veriler getirilir.

https://github.com/user-attachments/assets/28bb2958-8652-4dd8-99c9-93d2bdb638b2


