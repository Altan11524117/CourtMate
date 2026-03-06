# 🎾 CourtMate - Altan Aydın REST API Görevleri

**REST API Adresi:**  
`https://api.courtmate.app/v1`

**API Test Videosu:**  
Video Linki Buraya Eklenecek

Bu dokümanda, **Seviye Sınavı (AI Destekli)** ve **İlan Yönetimi** modülleri kapsamındaki REST API metotları listelenmektedir.

---

# 📑 İçindekiler

- 📌 Görev Özeti Tablosu
- 1. Seviye Sınavı (AI Destekli)
  - 1.1 Sınav Sorularını Getirme
  - 1.2 Sınav Sonucunu Gönderme
- 2. İlan Yönetimi ve Başvurular
  - 2.1 İlan Arama ve Filtreleme
  - 2.2 İlan Oluşturma
  - 2.3 İlan Detayı Görüntüleme
  - 2.4 İlan Güncelleme
  - 2.5 İlan Silme
  - 2.6 İlana Başvurma
  - 2.7 Başvuruları Listeleme
  - 2.8 Başvuru Onaylama / Reddetme

---

# 📌 Görev Özeti Tablosu

| Modül | Metot | Endpoint | Açıklama | Auth |
|------|------|------|------|------|
| Sınav | 🟢 GET | `/exams/placement/questions` | AI destekli seviye belirleme sorularını getirir | 🔒 |
| Sınav | 🔵 POST | `/exams/placement/submit` | Sınavı değerlendirir ve kullanıcının seviyesini günceller | 🔒 |
| İlan | 🟢 GET | `/ads/search` | Kategori, konum ve sıralamaya göre ilan arar/filtreler | 🔒 |
| İlan | 🔵 POST | `/ads` | Yeni bir tenis maçı ilanı oluşturur | 🔒 |
| İlan | 🟢 GET | `/ads/{adId}` | İlan detayını getirir ve viewCount sayısını artırır | 🔒 |
| İlan | 🟠 PATCH | `/ads/{adId}` | İlanı günceller (Sadece ilan sahibi) | 🔒 |
| İlan | 🔴 DELETE | `/ads/{adId}` | İlanı siler (Sadece ilan sahibi) | 🔒 |
| Başvuru | 🔵 POST | `/ads/{adId}/applications` | İlana katılma başvurusu yapar | 🔒 |
| Başvuru | 🟢 GET | `/ads/{adId}/applications` | İlana gelen başvuruları listeler | 🔒 |
| Başvuru | 🟠 PATCH | `/ads/{adId}/applications/{applicationId}` | Başvuruyu onaylar veya reddeder | 🔒 |

**Not:** 🔒 işareti ilgili endpoint'in **Bearer Token (JWT)** gerektirdiğini belirtir.

---

# 1. Seviye Sınavı (AI Destekli)

## 1.1 Sınav Sorularını Getirme

AI asistanı veya sistem havuzu tarafından kullanıcının seviyesini ölçmek için hazırlanan soruları istemciye iletir.

**Metot**
