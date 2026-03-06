# Altan AYDIN'ın REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](https://example.com)

## 1. Sınav Sorularını Getirme
- **Endpoint:** `GET /exams/placement/questions`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Sınav soruları listesi

## 2. Sınav Sonucunu Gönderme
- **Endpoint:** `POST /exams/placement/submit`
- **Request Body:**
  ```json
  {
    "answers": [
      {
        "questionId": "q123",
        "answerText": "Forehand vuruşlarımda oldukça tutarlıyım."
      }
    ]
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Sınav başarıyla değerlendirildi ve seviye güncellendi

## 3. İlan Arama ve Filtreleme
- **Endpoint:** `GET /ads/search`
- **Query Parameters:**
  - `category` (string, optional) - İlan kategorisi (örn: Tekler, Çiftler)
  - `location` (string, optional) - Konum bilgisi
  - `sort` (string, optional) - Sıralama kriteri (newest, oldest, level_asc, level_desc)
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Filtrelenmiş ilan sonuçları

## 4. İlan Oluşturma
- **Endpoint:** `POST /ads`
- **Request Body:**
  ```json
  {
    "title": "Hafta sonu antrenman maçı",
    "category": "Tekler",
    "location": "Kort A, Merkez",
    "requiredLevel": "Orta-İleri (ITN 5)",
    "matchDate": "2023-11-20T10:00:00Z"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - İlan oluşturuldu

## 5. İlan Detayı Görüntüleme
- **Endpoint:** `GET /ads/{adId}`
- **Path Parameters:**
  - `adId` (string, required) - İlanın benzersiz ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - İlan detayları

## 6. İlan Güncelleme
- **Endpoint:** `PATCH /ads/{adId}`
- **Path Parameters:**
  - `adId` (string, required) - İlanın benzersiz ID'si
- **Request Body:**
  ```json
  {
    "title": "Güncellenmiş hafta sonu maçı",
    "category": "Tekler",
    "location": "Kort B, Merkez",
    "requiredLevel": "İleri",
    "matchDate": "2023-11-21T14:00:00Z"
  }
  ```
- **Authentication:** Bearer Token gerekli (Sadece ilanın sahibi yapabilir)
- **Response:** `200 OK` - İlan güncellendi

## 7. İlan Silme
- **Endpoint:** `DELETE /ads/{adId}`
- **Path Parameters:**
  - `adId` (string, required) - İlanın benzersiz ID'si
- **Authentication:** Bearer Token gerekli (Sadece ilanın sahibi silebilir)
- **Response:** `204 No Content` - İlan başarıyla silindi

## 8. İlana Başvurma
- **Endpoint:** `POST /ads/{adId}/applications`
- **Path Parameters:**
  - `adId` (string, required) - İlanın benzersiz ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - Başvuru başarıyla alındı

## 9. Başvuruları Listeleme
- **Endpoint:** `GET /ads/{adId}/applications`
- **Path Parameters:**
  - `adId` (string, required) - İlanın benzersiz ID'si
- **Authentication:** Bearer Token gerekli (Sadece ilanın sahibi görebilir)
- **Response:** `200 OK` - Başvurular listesi

## 10. Başvuru Onaylama/Reddetme
- **Endpoint:** `PATCH /ads/{adId}/applications/{applicationId}`
- **Path Parameters:**
  - `adId` (string, required) - İlanın benzersiz ID'si
  - `applicationId` (string, required) - Başvurunun benzersiz ID'si
- **Request Body:**
  ```json
  {
    "status": "approved" 
  }
  ```
- **Authentication:** Bearer Token gerekli (Sadece ilan sahibi işlem yapabilir)
- **Response:** `200 OK` - Başvuru durumu güncellendi
