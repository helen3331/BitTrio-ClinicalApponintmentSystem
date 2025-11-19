// import { API_URL } from "./config";

// export async function getAppointment() {
//     const res = await fetch(`${API_URL}/appointments/create/`);
//     return res.json();
// }

import { API_URL } from "./config";

export async function bookAppointment(doctorId, scheduleId) {
    // 1. Token'ı al (Kullanıcının kim olduğunu backend bilsin)
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Giriş yapmanız gerekiyor.");
    }

    // 2. POST isteği at
    const res = await fetch(`${API_URL}/appointments/create/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Backend user'ı buradan tanıyacak
        },
        // 3. Backend'in AppointmentCreateSerializer'ı bu verileri bekliyor:
        body: JSON.stringify({
            doctor: doctorId,
            schedule: scheduleId
        })
    });

    // 4. Eğer hata varsa (Örn: Slot doluysa)
    if (!res.ok) {
        // Backend'den gelen hata mesajını okumaya çalışalım
        const errorData = await res.json();
        // Genelde Django hataları dizi içinde döner, ilkini yakalayalım
        const errorMessage = errorData.detail || errorData.non_field_errors || "Randevu alınamadı.";
        throw new Error(errorMessage);
    }

    return res.json();
}