import { API_URL } from "./config";

export async function getPolyclinicSymptoms(clinic_id) {
    const res = await fetch(`${API_URL}/clinics/${clinic_id}/symptoms/`);
    return res.json();
}