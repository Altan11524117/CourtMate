# Arif Yılmaz'ın REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Üye Olma
- **Endpoint:** `POST /auth/register`
- **Request Body:**
  ```json
  {
    "firstName": "Arif",
    "lastName": "Yılmaz",
    "email": "arif@example.com",
    "password": "strongPassword123!"
  }
  ```
- **Authentication:** Gerekli değil
- **Response:** `201 Created` - Kullanıcı başarıyla kaydedildi

## 2. Giriş Yapma
- **Endpoint:** `POST /auth/login`
- **Request Body:**
  ```json
  {
    "email": "arif@example.com",
    "password": "strongPassword123!"
  }
  ```
- **Authentication:** Gerekli değil
- **Response:** `200 OK` - Başarılı giriş ve JWT token dönüşü

## 3. Çıkış Yapma
- **Endpoint:** `POST /auth/logout`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Oturum başarıyla sonlandırıldı ve token geçersiz kılındı

## 4. Şifre Sıfırlama
- **Endpoint:** `POST /auth/reset-password`
- **Request Body:**
  ```json
  {
    "email": "arif@example.com"
  }
  ```
- **Authentication:** Gerekli değil
- **Response:** `200 OK` - Şifre sıfırlama bağlantısı gönderildi

## 5. Profil Görüntüleme
- **Endpoint:** `GET /users/{userId}/profile`
- **Path Parameters:**
  - `userId` (string, required) - Kullanıcının benzersiz ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcı profil bilgileri

## 6. Profil Güncelleme
- **Endpoint:** `PATCH /users/{userId}/profile`
- **Path Parameters:**
  - `userId` (string, required) - Kullanıcının benzersiz ID'si
- **Request Body:**
  ```json
  {
    "firstName": "Arif",
    "bio": "Tenis oynamayı severim.",
    "level": "Orta"
  }
  ```
- **Authentication:** Bearer Token gerekli (Sadece profil sahibi yapabilir)
- **Response:** `200 OK` - Profil başarıyla güncellendi

## 7. Hesap Silme
- **Endpoint:** `DELETE /users/{userId}`
- **Path
