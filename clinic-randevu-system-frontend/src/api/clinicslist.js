import { API_URL } from "./config";

export async function getClinics() {
    const res = await fetch(`${API_URL}/clinics/list/`);
    return res.json();
}