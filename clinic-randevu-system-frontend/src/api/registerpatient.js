import { API_URL } from "./config";

// Kullanıcının Tam İsim (isim) alanını backend'deki full_name alanına map'liyoruz.
export async function register_patient({ isim, username, email, password }) {
    
    const res = await fetch(`${API_URL}/accounts/register/patient/`, {
        method: "POST", // 💥 KRİTİK DÜZELTME: Mutlaka POST olmalı
        headers: {
            "Content-Type": "application/json",
        },
        // Backend'in PatientRegisterSerializer'ının beklediği alan adlarını kullanıyoruz.
        body: JSON.stringify({
            full_name: isim, // 👈 Senin 'isim' state'in, backend'in 'full_name' alanına gidiyor.
            username: username,
            email: email,
            password: password,
        })
    });

    // 4xx veya 5xx hatalarını (örneğin email/username zaten kayıtlı) yakalama
    if (!res.ok) {
        const errorData = await res.json();
        
        // Backend'den gelen spesifik hata mesajlarını okumaya çalış
        let errorMessage = "Kayıt sırasında bir hata oluştu.";
        if (errorData.email) {
            errorMessage = `Email: ${errorData.email[0]}`;
        } else if (errorData.username) {
            errorMessage = `Kullanıcı Adı: ${errorData.username[0]}`;
        } else if (errorData.password) {
            errorMessage = `Şifre: ${errorData.password[0]}`;
        } else if (errorData.detail) {
            errorMessage = errorData.detail;
        }
        
        throw new Error(errorMessage);
    }

    return res.json();
}