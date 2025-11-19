-- Veri tabanı ve tabloları oluşturma
DROP DATABASE IF EXISTS klinik_randevu_sistemi;
CREATE DATABASE klinik_randevu_sistemi;

USE klinik_randevu_sistemi;

-- TABLO 1: Users (Tüm kullanıcı rolleri)
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('Patient', 'Doctor', 'Administrator') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
    CONSTRAINT chk_email_role CHECK (
        (role = 'Doctor' AND email LIKE '%@doc.com') OR
        (role IN ('Patient', 'Administrator') AND email NOT LIKE '%@doc.com')
    )
);

-- TABLO 2: Polyclinics (Ana poliklinik branşları)
CREATE TABLE Polyclinics (
    polyclinic_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);

-- TABLO 3: Doctors (Doktor profilleri, Kullanıcılar ve Poliklinikler ile ilişkili)
CREATE TABLE Doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    polyclinic_id INT NOT NULL,
    title VARCHAR(100), -- e.g., "Prof. Dr."
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (polyclinic_id) REFERENCES Polyclinics(polyclinic_id)
);

-- TABLO 4: Schedules (Doktorların müsait zaman dilimleri) 
CREATE TABLE Schedules (
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id) ON DELETE CASCADE
);

-- TABLO 5: Appointments (Alınan randevular)
CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    schedule_id INT NOT NULL, -- Ayrılan zaman dilimi
    appointment_time DATETIME NOT NULL,
    status ENUM('Scheduled', 'Cancelled') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Users(user_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id),
    FOREIGN KEY (schedule_id) REFERENCES Schedules(schedule_id),
    UNIQUE(schedule_id) -- Bir zaman diliminin sadece bir kez rezerve edilmesi için
);

-- TABLO 6: Symptoms (Polikliniklere bağlı semptomlar) 
CREATE TABLE Symptoms (
    symptom_id INT PRIMARY KEY AUTO_INCREMENT,
    polyclinic_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    FOREIGN KEY (polyclinic_id) REFERENCES Polyclinics(polyclinic_id) ON DELETE cascade -- Eğer bir poliklinik silinirse, ilgili semptomlar da silinir.
);


-- Veri yükleme semptomlar ve polinikikler

-- Poliklinikleri Ekleme
INSERT INTO Polyclinics (name) VALUES
('Kardiyoloji'),
('Kulak Burun Boğaz (KBB)'),
('Göz Hastalıkları'),
('Genel Cerrahi'),
('Nöroloji'),
('Dahiliye (İç Hastalıkları)'),
('Ortopedi ve Travmatoloji'),
('Dermatoloji (Cildiye)'),
('Göğüs Hastalıkları'),
('Üroloji');

-- Semptomları Ekleme

-- 1. Kardiyoloji Semptomları
INSERT INTO Symptoms (polyclinic_id, description) VALUES
(1, 'Göğüs ağrısı veya sıkışma'),
(1, 'Nefes darlığı (özellikle eforla)'),
(1, 'Çarpıntı veya kalp atışlarında düzensizlik'),
(1, 'Baş dönmesi veya bayılma (senkop)'),
(1, 'Ayaklarda, bacaklarda veya karında şişlik (ödem)'),
(1, 'Çabuk yorulma veya halsizlik'), -- HATA BURADAYDI
(1, 'Boyun, çene, omuz veya kola yayılan ağrı'),
(1, 'Soğuk terleme'),
(1, 'Mide bulantısı'),
(1, 'Egzersiz sırasında çabuk tıkanma');

-- 2. Kulak Burun Boğaz (KBB) Semptomları
INSERT INTO Symptoms (polyclinic_id, description) VALUES
(2, 'İşitme kaybı veya işitmede azalma'),
(2, 'Kulak ağrısı veya kulak akıntısı'),
(2, 'Kulak çınlaması (Tinnitus)'),
(2, 'Baş dönmesi veya denge kaybı (Vertigo)'),
(2, 'Burun tıkanıklığı veya burun akıntısı'),
(2, 'Ses kısıklığı veya seste değişiklik'),
(2, 'Boğaz ağrısı'),
(2, 'Yutma güçlüğü (Disfaji)'),
(2, 'Horlama veya uyku apnesi'),
(2, 'Geniz akıntısı');

-- 3. Göz Hastalıkları Semptomları
INSERT INTO Symptoms (polyclinic_id, description) VALUES
(3, 'Bulanık görme veya görme kaybı'),
(3, 'Göz ağrısı'),
(3, 'Gözde kızarıklık veya kanlanma'),
(3, 'Gözde kaşıntı, yanma veya batma hissi'),
(3, 'Gözde yabancı cisim hissi'),
(3, 'Aşırı göz yaşarması veya kuruluk'),
(3, 'Göz kapağında şişlik veya düşüklük'),
(3, 'Gözde çapaklanma'),
(3, 'Işığa karşı hassimiyet (Fotofobi)'),
(3, 'Çift görme (Diplopi)');

-- 4. Genel Cerrahi Semptomları
INSERT INTO Symptoms (polyclinic_id, description) VALUES
(4, 'Karın ağrısı (özellikle ani ve şiddetli)'),
(4, 'Mide bulantısı veya kusma'),
(4, 'Karında veya kasıkta şişlik (Fıtık belirtisi)'),
(4, 'Memede ele gelen kitle, ağrı veya akıntı'),
(4, 'Dışkıda kan veya renk değişikliği'), -- HATA BURADAYDI
(4, 'Anüs bölgesinde ağrı, kaşıntı veya kanama (Hemoroid)'),
(4, 'Tiroid (boyun) bölgesinde şişlik'),
(4, 'Vücutta kitle veya beze'),
(4, 'Safra kesesi bölgesinde ağrı (genellikle yemek sonrası)'),
(4, 'Travma veya yaralanma sonrası oluşan deformite');

-- 5. Nöroloji Semptomları
INSERT INTO Symptoms (polyclinic_id, description) VALUES
(5, 'Şiddetli veya kronik baş ağrısı (Migren)'),
(5, 'Baş dönmesi (Vertigo)'),
(5, 'Kol veya bacaklarda uyuşma, karıncalanma'),
(5, 'Kas güçsüzlüğü veya felç'),
(5, 'Denge kaybı veya yürüme bozukluğu'),
(5, 'Hafıza kaybı veya unutkanlık'),
(5, 'Konuşma güçlüğü veya peltekleşme'),
(5, 'Ellerde titreme (Tremor)'),
(5, 'Bayılma veya nöbet geçirme'),
(5, 'Yüzde ağrı veya asimetri');

-- 6. Dahiliye (İç Hastalıkları) Semptomları
INSERT INTO Symptoms (polyclinic_id, description) VALUES
(6, 'Halsizlik, yorgunluk ve enerji düşüklüğü'),
(6, 'Mide ağrısı, yanması veya ekşimesi (Reflü)'),
(6, 'Karın ağrısı, şişkinlik veya hazımsızlık'),
(6, 'Aşırı susama veya sık idrara çıkma (Diyabet belirtisi)'),
(6, 'Açıklanamayan kilo kaybı veya alımı'),
(6, 'Yüksek tansiyon (Hipertansiyon)'),
(6, 'Sık tekrarlayan enfeksiyonlar'),
(6, 'İshal veya kabızlık'),
(6, 'Göğüs ağrısı (kardiyak dışı)'),
(6, 'Genel vücut ağrıları');

-- 7. Ortopedi ve Travmatoloji Semptomları
INSERT INTO Symptoms (polyclinic_id, description) VALUES
(7, 'Eklem ağrısı (diz, kalça, omuz, dirsek vb.)'),
(7, 'Bel veya boyun ağrısı'),
(7, 'Kas ağrısı veya kramplar'),
(7, 'Eklemde şişlik, kızarıklık veya morarma'),
(7, 'Hareket kısıtlılığı veya eklemde takılma'),
(7, 'Kemik kırığı veya çıkık şüphesi (Travma sonrası)'),
(7, 'Kol veya bacakta uyuşma (Sinir sıkışması)'),
(7, 'Yürüme güçlüğü veya aksama'),
(7, 'Eklemlerden ses gelmesi (Kireçlenme)'),
(7, 'Sırt eğriliği (Skolyoz)'); -- HATA BURADAYDI

-- 8. Dermatoloji (Cildiye) Semptomları
INSERT INTO Symptoms (polyclinic_id, description) VALUES
(8, 'Kaşıntı'),
(8, 'Kızarıklık veya deride döküntü'),
(8, 'Akne (Sivilce) veya siyah noktalar'),
(8, 'Ciltte kuruluk, pullanma veya çatlama (Egzama)'),
(8, 'Ciltte kabarcıklar veya su toplaması'),
(8, 'Benlerde (nevüs) renk, şekil veya boyut değişikliği'),
(8, 'Saç dökülmesi veya kepeklenme'),
(8, 'Tırnaklarda renk veya şekil bozukluğu'),
(8, 'Aşırı terleme'),
(8, 'Ciltte yanma veya batma hissi');

-- 9. Göğüs Hastalıkları Semptomları
INSERT INTO Symptoms (polyclinic_id, description) VALUES
(9, 'Nefes darlığı veya nefes almada zorluk'),
(9, 'Uzun süren (kronik) öksürük'),
(9, 'Balgam çıkarma (renkli veya kanlı)'),
(9, 'Hırıltılı veya hışıltılı solunum (Astım)'),
(9, 'Göğüs ağrısı (özellikle nefes alırken)'),
(9, 'Gece terlemesi'),
(9, 'Açıklanamayan kilo kaybı'),
(9, 'Sık tekrarlayan akciğer enfeksiyonları (Zatürre)'),
(9, 'Halsizlik ve çabuk yorulma'),
(9, 'Horlama ve uykuda nefes durması (Uyku Apnesi)');

-- 10. Üroloji Semptomları
INSERT INTO Symptoms (polyclinic_id, description) VALUES
(10, 'İdrar yaparken yanma veya ağrı'),
(10, 'Sık idrara çıkma'),
(10, 'Ani ve şiddetli idrar yapma isteği (sıkışma)'),
(10, 'İdrarda kan görülmesi (Hematüri)'),
(10, 'Gece sık idrara kalkma (Noktüri)'),
(10, 'İdrar akış hızında azalma veya kesik kesik idrar yapma'),
(10, 'İdrar kaçırma'),
(10, 'Böğür ağrısı (Böbrek taşı belirtisi)'),
(10, 'Testislerde ağrı veya şişlik'),
(10, 'Sertleşme sorunları');
