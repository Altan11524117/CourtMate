**Sınav Sorularını Getirme** (Altan AYDIN)
* **API Metodu:** `GET /exams/placement/questions`
* **Açıklama:** Seviye belirleme sorularını getirir. AI asistanı veya sistem havuzu tarafından kullanıcının seviyesini ölçmek için hazırlanan soruları istemciye iletir yada kedni sorular yarartir genel seviye dagilimini analiz ederek kullaniciyi belli bir seviyeye atar ai ana temasi genel kullanici havuzu  seviyesine dayali seviyelendirme yapip  kullanici eslesme oranini artirmak.

**Sınav Sonucunu Gönderme** (Altan AYDIN)
* **API Metodu:** `POST /exams/placement/submit`
* **Açıklama:** Sınav yanıtlarını gönderir ve seviyeyi belirler. Cevaplar analiz edilir, başarı puanı hesaplanır ve kullanıcının veritabanındaki "Seviye" bilgisi belli bir sureligine kalıcı olarak güncellenir. 

---

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
* **Açıklama:** Gelen başvuruyu ona