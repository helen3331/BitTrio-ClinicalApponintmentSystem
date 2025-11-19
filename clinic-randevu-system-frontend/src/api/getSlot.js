import { API_URL } from "./config";

export async function getSlot(doctor_id) {
    const res = await fetch(`${API_URL}/doctors/${doctor_id}/availability/`);
    return res.json();
}