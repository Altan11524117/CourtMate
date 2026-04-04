**Sınav Sorularını Getirme** (Altan AYDIN)
* **API Metodu:** `GET /exams/placement/questions`
* **Açıklama:** Seviye belirleme sorularını getirir. AI asistanı veya sistem havuzu tarafından kullanıcının seviyesini ölçmek için hazırlanan soruları istemciye iletir yada kedni sorular yarartir genel seviye dagilimini analiz ederek kullaniciyi belli bir seviyeye atar ai ana temasi genel kullanici havuzu  seviyesine dayali seviyelendirme yapip  kullanici eslesme oranini artirmak.

**Sınav Sonucunu Gönderme** (Altan AYDIN)
* **API Metodu:** `POST /exams/placement/submit`
* **Açıklama:** Sınav yanıtlarını gönderir ve seviyeyi belirler. Cevaplar analiz edilir, başarı puanı hesaplanır ve kullanıcının veritabanındaki "Seviye" bilgisi belli bir sureligine kalıcı olarak güncellenir. 


https://github.com/user-attachments/assets/17b99dad-9438-4454-9e2a-2b9eae40aad3


---

**İlan Arama ve Filtreleme** (Altan AYDIN)
* **API Metodu:** `GET /ads/search`
* **Açıklama:** İlanlar içinde detaylı arama ve filtreleme yapar. Kategori, konum, sıralama gibi URL query parametrelerine göre süzülmüş sonuçları döndürür.




https://github.com/user-attachments/assets/914420c9-71c5-4a04-a2aa-7143470b2b2c


**İlan Oluşturma** (Altan AYDIN)
* **API Metodu:** `POST /ads`
* **Açıklama:** Yeni bir ilan oluşturur. İstek yapan kullanıcının ID'si otomatik olarak ilanın ownerId (sahibi) alanına atanır.
  


https://github.com/user-attachments/assets/d6b5c156-4e5a-43f9-b581-167cc3113fc9


**İlan Detayı Görüntüleme** (Altan AYDIN)
* **API Metodu:** `GET /ads/{adId}`
* **Açıklama:** Belirli bir ilanın detaylarını getirir. İlanın içeriği, görselleri ve ilan sahibinin özet profil bilgileriyle birlikte okunma/görüntülenme sayısını artırarak getirir.

**İlan Güncelleme** (Altan AYDIN)
* **API Metodu:** `PATCH /ads/{adId}`
* **Açıklama:** Yayınlanmış ilanı günceller. Kullanıcının, gerçekten ilanın sahibi olup olmadığı kontrol edilir, değilse 403 Forbidden döndürülür.

**İlan Silme** (Altan AYDIN)
* **API Metodu:** `DELETE /ads/{adId}`
* **Açıklama:** İlanı sistemden kaldırır. İlan ve ilana bağlı başvurular kaskad (cascade) silme veya soft delete mantığıyla temizlenir.
  

https://github.com/user-attachments/assets/e692d844-dff7-4316-bd68-c40076981434



**İlana Başvurma** (Altan AYDIN)
* **API Metodu:** `POST /ads/{adId}/applications`
* **Açıklama:** İlana katılma isteği gönderir. Kullanıcının ilgilendiği ilana başvuru yapmasını sağlar. İş kuralı gereği kullanıcı kendi ilanına başvuramaz. Başvuru durumu başlangıçta "bekliyor" (pending) olarak atanır.

  

https://github.com/user-attachments/assets/85c30762-be6a-4a9d-bb66-0524061244a0



**Başvuruları Listeleme** (Altan AYDIN)
* **API Metodu:** `GET /ads/{adId}/applications`
* **Açıklama:** İlana gelen başvuru isteklerini listeler. Başvuran kişilerin özet profilleriyle beraber, ilan sahibine özel bir liste döndürülür.
  

**Başvuru Onaylama/Reddetme** (Altan AYDIN)
* **API Metodu:** `PATCH /ads/{adId}/applications/{applicationId}`
* **Açıklama:** Gelen başvuruyu ona




https://github.com/user-attachments/assets/83ab3541-5cb3-47bd-8083-9646e7232921




