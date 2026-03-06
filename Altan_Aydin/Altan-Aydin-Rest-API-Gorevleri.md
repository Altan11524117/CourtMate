🎾 CourtMate - Altan Aydın REST API Görevleri

REST API Adresi: https://api.courtmate.app/v1

API Test Videosu: Video Linki Buraya Eklenecek

Bu dokümanda, Seviye Sınavı (AI Destekli) ve İlan Yönetimi modülleri kapsamındaki REST API metotları listelenmektedir.

📑 İçindekiler

📌 Görev Özeti Tablosu

1. Seviye Sınavı (AI Destekli)

1.1. Sınav Sorularını Getirme

1.2. Sınav Sonucunu Gönderme

2. İlan Yönetimi ve Başvurular

2.1. İlan Arama ve Filtreleme

2.2. İlan Oluşturma

2.3. İlan Detayı Görüntüleme

2.4. İlan Güncelleme

2.5. İlan Silme

2.6. İlana Başvurma

2.7. Başvuruları Listeleme

2.8. Başvuru Onaylama/Reddetme

📌 Görev Özeti Tablosu

Modül

Metot

Endpoint

Kısa Açıklama

Auth

Sınav

🟢 GET

/exams/placement/questions

AI destekli seviye belirleme sorularını getirir.

🔒

Sınav

🔵 POST

/exams/placement/submit

Sınavı değerlendirir ve kullanıcının seviyesini günceller.

🔒

İlan

🟢 GET

/ads/search

Kategori, konum ve sıralamaya göre ilan arar/filtreler.

🔒

İlan

🔵 POST

/ads

Yeni bir tenis maçı ilanı oluşturur.

🔒

İlan

🟢 GET

/ads/{adId}

İlan detayını getirir, okunma (viewCount) sayısını artırır.

🔒

İlan

🟠 PATCH

/ads/{adId}

İlanı günceller (Sadece ilan sahibi).

🔒

İlan

🔴 DELETE

/ads/{adId}

İlanı siler (Sadece ilan sahibi).

🔒

Başvuru

🔵 POST

/ads/{adId}/applications

İlana katılma başvurusu yapar (Kendi ilanına yapamaz).

🔒

Başvuru

🟢 GET

/ads/{adId}/applications

İlana gelen başvuruları listeler (Sadece ilan sahibi).

🔒

Başvuru

🟠 PATCH

/ads/{adId}/applications/{applicationId}

Başvuruyu onaylar veya reddeder (Sadece ilan sahibi).

🔒

Not: 🔒 işareti, ilgili endpoint'in Bearer Token (JWT) gerektirdiğini belirtir.

1. Seviye Sınavı (AI Destekli)

1.1. Sınav Sorularını Getirme

AI asistanı veya sistem havuzu tarafından kullanıcının seviyesini ölçmek için hazırlanan soruları istemciye iletir. Genel kullanıcı havuzu seviyesine dayalı seviyelendirme yapıp kullanıcı eşleşme oranını artırmayı hedefler.

Metot: 🟢 GET

Endpoint: /exams/placement/questions

Auth: Bearer Token Gerekli

✅ Başarılı Yanıt (200 OK):

[
  {
    "id": "q1-uuid",
    "text": "Forehand vuruşlarında ne kadar tutarlısınız?",
    "options": ["Çok tutarlı", "Ara sıra hata yapıyorum", "Geliştirmem gerek"]
  }
]


1.2. Sınav Sonucunu Gönderme

Sınav yanıtlarını gönderir. Cevaplar analiz edilir, başarı puanı hesaplanır ve kullanıcının veritabanındaki "Seviye" bilgisi kalıcı olarak güncellenir.

Metot: 🔵 POST

Endpoint: /exams/placement/submit

Auth: Bearer Token Gerekli

📥 İstek Gövdesi (Request Body):

{
  "answers": [
    {
      "questionId": "q1-uuid",
      "answerText": "Çok tutarlı"
    }
  ]
}


✅ Başarılı Yanıt (200 OK):

{
  "assignedLevel": "Orta-İleri (ITN 5)",
  "score": 78
}


2. İlan Yönetimi ve Başvurular

2.1. İlan Arama ve Filtreleme

İlanlar içinde detaylı arama ve filtreleme yapar. URL query parametrelerine göre süzülmüş sonuçları döndürür.

Metot: 🟢 GET

Endpoint: /ads/search

Parametreler (Query): * category (string, opsiyonel)

location (string, opsiyonel)

sort (string, enum: newest, oldest, level_asc, level_desc)

Auth: Bearer Token Gerekli

✅ Başarılı Yanıt (200 OK): Filtrelenmiş ilan objeleri dizisi döner.

2.2. İlan Oluşturma

Yeni bir ilan oluşturur. İstek yapan kullanıcının ID'si otomatik olarak ilanın ownerId alanına atanır.

Metot: 🔵 POST

Endpoint: /ads

Auth: Bearer Token Gerekli

📥 İstek Gövdesi:

{
  "title": "Hafta sonu için tenis partneri aranıyor",
  "category": "Tekler",
  "location": "Süleyman Demirel Üniversitesi Kortları",
  "requiredLevel": "Orta Seviye (ITN 6-7)",
  "matchDate": "2026-03-15T14:00:00Z"
}


✅ Başarılı Yanıt (201 Created): Oluşturulan ilanın tüm detaylarını içeren obje döner.

2.3. İlan Detayı Görüntüleme

Belirli bir ilanın detaylarını getirir. İlanın içeriği, görselleri ve ilan sahibinin özet profil bilgileriyle birlikte okunma/görüntülenme sayısını artırarak getirir.

Metot: 🟢 GET

Endpoint: /ads/{adId}

Parametreler (Path): adId (string, zorunlu)

Auth: Bearer Token Gerekli

✅ Başarılı Yanıt (200 OK): İlan detay objesi (viewCount ve ownerProfileSummary dahil) döner.

2.4. İlan Güncelleme

Yayınlanmış ilanı günceller. Kullanıcının, gerçekten ilanın sahibi olup olmadığı kontrol edilir.

Metot: 🟠 PATCH

Endpoint: /ads/{adId}

Auth: Bearer Token Gerekli (Yalnızca ilan sahibi)

📥 İstek Gövdesi:

{
  "title": "Cuma akşamı için antrenman partneri (Güncellendi)",
  "location": "Isparta Merkez Kortları"
}


Yanıtlar:

✅ 200 OK: İlan güncellendi.

❌ 403 Forbidden: Sadece ilanın sahibi güncelleyebilir.

2.5. İlan Silme

İlanı sistemden kaldırır. İlan ve ilana bağlı başvurular kaskad (cascade) silme veya soft delete mantığıyla temizlenir.

Metot: 🔴 DELETE

Endpoint: /ads/{adId}

Auth: Bearer Token Gerekli (Yalnızca ilan sahibi)

Yanıtlar:

✅ 204 No Content: İlan başarıyla silindi.

❌ 403 Forbidden: Sadece ilanın sahibi silebilir.

2.6. İlana Başvurma

İlana katılma isteği gönderir. İş kuralı gereği kullanıcı kendi ilanına başvuramaz. Başvuru durumu başlangıçta "bekliyor" (pending) olarak atanır.

Metot: 🔵 POST

Endpoint: /ads/{adId}/applications

Auth: Bearer Token Gerekli

Yanıtlar:

✅ 201 Created: Başvuru başarıyla alındı.

❌ 400 Bad Request: Kullanıcı kendi ilanına başvuramaz.

2.7. Başvuruları Listeleme

İlana gelen başvuru isteklerini listeler. Başvuran kişilerin özet profilleriyle beraber, ilan sahibine özel bir liste döndürülür.

Metot: 🟢 GET

Endpoint: /ads/{adId}/applications

Auth: Bearer Token Gerekli (Yalnızca ilan sahibi)

Yanıtlar:

✅ 200 OK: Başvurular listesi (ApplicationList formatında) döner.

❌ 403 Forbidden: Sadece ilanın sahibi görebilir.

2.8. Başvuru Onaylama/Reddetme

Gelen başvuruyu onaylar veya reddeder. İlan sahibinin kararına göre başvurunun durumunu günceller.

Metot: 🟠 PATCH

Endpoint: /ads/{adId}/applications/{applicationId}

Auth: Bearer Token Gerekli (Yalnızca ilan sahibi)

📥 İstek Gövdesi:

{
  "status": "approved" 
}


(Not: status değeri sadece approved veya rejected olabilir)

Yanıtlar:

✅ 200 OK: Başvuru durumu güncellendi.

❌ 403 Forbidden: Sadece ilan sahibi işlem yapabilir.