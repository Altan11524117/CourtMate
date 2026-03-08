# 🎾 CourtMate REST API Dokümantasyonu

**REST API Adresi:** `https://api.courtmate.app/v1`

Bu dokümanda CourtMate projesi kapsamındaki tüm REST API metotları ve geliştirici görev dağılımları listelenmektedir.

---

## 📑 İçindekiler

- [📌 Görev Özeti Tablosu](#-görev-özeti-tablosu)
- [1. Kimlik Doğrulama (Auth) - Arif YAVUZ](#1-kimlik-doğrulama-auth---arif-yavuz)
- [2. Kullanıcı Yönetimi (Users) - Arif YAVUZ](#2-kullanıcı-yönetimi-users---arif-yavuz)
- [3. Seviye Sınavı (AI Destekli) - Altan AYDIN](#3-seviye-sınavı-ai-destekli---altan-aydın)
- [4. İlan Yönetimi (Ads) - Altan AYDIN & Arif YAVUZ](#4-ilan-yönetimi-ads)
- [5. Başvurular (Applications) - Altan AYDIN](#5-başvurular-applications---altan-aydın)

---

## 📌 Görev Özeti Tablosu

| Modül | Sorumlu | Metot | Endpoint | Kısa Açıklama | Auth |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Auth | Arif Y. | 🔵 POST | `/auth/register` | Sisteme yeni kullanıcı kaydı oluşturur. | |
| Auth | Arif Y. | 🔵 POST | `/auth/login` | Kullanıcı girişi yapar ve JWT token döndürür. | |
| Auth | Arif Y. | 🔵 POST | `/auth/logout` | Aktif oturumu sonlandırır ve token'ı siler. | 🔒 |
| Auth | Arif Y. | 🔵 POST | `/auth/reset-password` | Şifre sıfırlama bağlantısı gönderir. | |
| Users | Arif Y. | 🟢 GET | `/users/{userId}/profile` | Kullanıcı profil bilgilerini getirir. | 🔒 |
| Users | Arif Y. | 🟠 PATCH | `/users/{userId}/profile` | Kullanıcının kendi profilini günceller. | 🔒 |
| Users | Arif Y. | 🔴 DELETE | `/users/{userId}` | Kullanıcı hesabını (Soft Delete) siler. | 🔒 |
| Exams | Altan A. | 🟢 GET | `/exams/placement/questions` | AI destekli seviye belirleme sorularını getirir. | 🔒 |
| Exams | Altan A. | 🔵 POST | `/exams/placement/submit` | Sınavı değerlendirir ve seviyeyi günceller. | 🔒 |
| Ads | Arif Y. | 🟢 GET | `/ads` | Aktif ilanları sayfalamalı listeler. | 🔒 |
| Ads | Altan A. | 🟢 GET | `/ads/search` | Kategori, konum ve sıralamaya göre ilan arar. | 🔒 |
| Ads | Altan A. | 🔵 POST | `/ads` | Yeni bir tenis maçı ilanı oluşturur. | 🔒 |
| Ads | Altan A. | 🟢 GET | `/ads/{adId}` | İlan detayını getirir, okunma sayısını artırır. | 🔒 |
| Ads | Altan A. | 🟠 PATCH | `/ads/{adId}` | İlanı günceller (Sadece ilan sahibi). | 🔒 |
| Ads | Altan A. | 🔴 DELETE | `/ads/{adId}` | İlanı siler (Sadece ilan sahibi). | 🔒 |
| Apps. | Altan A. | 🔵 POST | `/ads/{adId}/applications` | İlana katılma başvurusu yapar. | 🔒 |
| Apps. | Altan A. | 🟢 GET | `/ads/{adId}/applications` | İlana gelen başvuruları listeler. | 🔒 |
| Apps. | Altan A. | 🟠 PATCH | `/ads/{adId}/applications/{appId}`| Başvuruyu onaylar veya reddeder. | 🔒 |

*(Not: 🔒 işareti, ilgili endpoint'in Bearer Token - JWT gerektirdiğini belirtir.)*

---

## 1. Kimlik Doğrulama (Auth) - Arif YAVUZ

### 1.1. Üye Olma
* **Metot:** 🔵 `POST`
* **Endpoint:** `/auth/register`
* **Auth:** Gerekli Değil
* **Açıklama:** Sisteme yeni kullanıcı kaydı oluşturur. İstemciden zorunlu verileri alır ve şifreyi güvenlik standartlarına uygun şekilde hashleyerek veritabanına kaydeder.
* **Beklenen Yanıt:** `201 Created`

### 1.2. Giriş Yapma
* **Metot:** 🔵 `POST`
* **Endpoint:** `/auth/login`
* **Auth:** Gerekli Değil
* **Açıklama:** Kullanıcı girişini ve kimlik doğrulamasını sağlar. Doğrulama başarılı olursa erişim token'ı döndürür.
* **Beklenen Yanıt:** `200 OK` (Token ve expiresIn bilgisi ile)

### 1.3. Çıkış Yapma
* **Metot:** 🔵 `POST`
* **Endpoint:** `/auth/logout`
* **Auth:** Bearer Token Gerekli 🔒
* **Açıklama:** Aktif oturumu sonlandırır. Token kara listeye alınır.
* **Beklenen Yanıt:** `200 OK`

### 1.4. Şifre Sıfırlama
* **Metot:** 🔵 `POST`
* **Endpoint:** `/auth/reset-password`
* **Auth:** Gerekli Değil
* **Açıklama:** Kullanıcının kayıtlı adresine süreli ve tek kullanımlık bir şifre sıfırlama bağlantısı gönderir.
* **Beklenen Yanıt:** `200 OK`

---

## 2. Kullanıcı Yönetimi (Users) - Arif YAVUZ

### 2.1. Profil Görüntüleme
* **Metot:** 🟢 `GET`
* **Endpoint:** `/users/{userId}/profile`
* **Auth:** Bearer Token Gerekli 🔒
* **Açıklama:** Kullanıcı profil bilgilerini getirir. Kendi profilinde tüm detaylar, başkasının profilinde sadece public veriler döner.
* **Beklenen Yanıt:** `200 OK`

### 2.2. Profil Güncelleme
* **Metot:** 🟠 `PATCH`
* **Endpoint:** `/users/{userId}/profile`
* **Auth:** Bearer Token Gerekli 🔒 (Yalnızca hesap sahibi)
* **Açıklama:** Kullanıcının profil bilgilerini günceller.
* **Beklenen Yanıt:** `200 OK` veya `403 Forbidden`

### 2.3. Hesap Silme
* **Metot:** 🔴 `DELETE`
* **Endpoint:** `/users/{userId}`
* **Auth:** Bearer Token Gerekli 🔒 (Yalnızca hesap sahibi)
* **Açıklama:** Kullanıcı hesabını sistemden kaldırır (Soft Delete).
* **Beklenen Yanıt:** `204 No Content`

---

## 3. Seviye Sınavı (AI Destekli) - Altan AYDIN

### 3.1. Sınav Sorularını Getirme
* **Metot:** 🟢 `GET`
* **Endpoint:** `/exams/placement/questions`
* **Auth:** Bearer Token Gerekli 🔒
* **Açıklama:** AI asistanı veya sistem havuzu tarafından kullanıcının seviyesini ölçmek için hazırlanan soruları getirir.
* **Beklenen Yanıt:** `200 OK` (Soru dizisi)

### 3.2. Sınav Sonucunu Gönderme
* **Metot:** 🔵 `POST`
* **Endpoint:** `/exams/placement/submit`
* **Auth:** Bearer Token Gerekli 🔒
* **Açıklama:** Cevaplar analiz edilir, başarı puanı hesaplanır ve kullanıcının "Seviye" bilgisi kalıcı olarak güncellenir.
* **Beklenen Yanıt:** `200 OK` (Atanan seviye ve skor)

---

## 4. İlan Yönetimi (Ads)

### 4.1. İlanları Listeleme (Arif YAVUZ)
* **Metot:** 🟢 `GET`
* **Endpoint:** `/ads`
* **Auth:** Bearer Token Gerekli 🔒
* **Açıklama:** Aktif ilanları sayfalamalı (limit/offset) olarak listeler.
* **Beklenen Yanıt:** `200 OK`

### 4.2. İlan Arama ve Filtreleme (Altan AYDIN)
* **Metot:** 🟢 `GET`
* **Endpoint:** `/ads/search`
* **Auth:** Bearer Token Gerekli 🔒
* **Açıklama:** Kategori, konum ve sıralama (sort) query parametrelerine göre süzülmüş sonuçları döndürür.
* **Beklenen Yanıt:** `200 OK`

### 4.3. İlan Oluşturma (Altan AYDIN)
* **Metot:** 🔵 `POST`
* **Endpoint:** `/ads`
* **Auth:** Bearer Token Gerekli 🔒
* **Açıklama:** Yeni bir ilan oluşturur. İstek yapanın ID'si `ownerId` olarak atanır.
* **Beklenen Yanıt:** `201 Created`

### 4.4. İlan Detayı Görüntüleme (Altan AYDIN)
* **Metot:** 🟢 `GET`
* **Endpoint:** `/ads/{adId}`
* **Auth:** Bearer Token Gerekli 🔒
* **Açıklama:** İlan detaylarını ve sahibinin özet profilini getirir. Okunma sayısını artırır.
* **Beklenen Yanıt:** `200 OK`

### 4.5. İlan Güncelleme (Altan AYDIN)
* **Metot:** 🟠 `PATCH`
* **Endpoint:** `/ads/{adId}`
* **Auth:** Bearer Token Gerekli 🔒 (Yalnızca ilan sahibi)
* **Açıklama:** Yayınlanmış ilanı günceller.
* **Beklenen Yanıt:** `200 OK` veya `403 Forbidden`

### 4.6. İlan Silme (Altan AYDIN)
* **Metot:** 🔴 `DELETE`
* **Endpoint:** `/ads/{adId}`
* **Auth:** Bearer Token Gerekli 🔒 (Yalnızca ilan sahibi)
* **Açıklama:** İlanı ve kaskad/soft delete mantığıyla bağlı başvuruları siler.
* **Beklenen Yanıt:** `204 No Content` veya `403 Forbidden`

---

## 5. Başvurular (Applications) - Altan AYDIN

### 5.1. İlana Başvurma
* **Metot:** 🔵 `POST`
* **Endpoint:** `/ads/{adId}/applications`
* **Auth:** Bearer Token Gerekli 🔒
* **Açıklama:** İlana katılma isteği gönderir. Kullanıcı kendi ilanına başvuramaz. Başvuru durumu başlangıçta "pending" olur.
* **Beklenen Yanıt:** `201 Created` veya `400 Bad Request`

### 5.2. Başvuruları Listeleme
* **Metot:** 🟢 `GET`
* **Endpoint:** `/ads/{adId}/applications`
* **Auth:** Bearer Token Gerekli 🔒 (Yalnızca ilan sahibi)
* **Açıklama:** İlana gelen başvuru isteklerini, başvuran kişilerin özet profilleriyle listeler.
* **Beklenen Yanıt:** `200 OK` veya `403 Forbidden`

### 5.3. Başvuru Onaylama/Reddetme
* **Metot:** 🟠 `PATCH`
* **Endpoint:** `/ads/{adId}/applications/{applicationId}`
* **Auth:** Bearer Token Gerekli 🔒 (Yalnızca ilan sahibi)
* **Açıklama:** Gelen başvuruyu onaylar (approved) veya reddeder (rejected).
* **Beklenen Yanıt:** `200 OK` veya `403 Forbidden`
