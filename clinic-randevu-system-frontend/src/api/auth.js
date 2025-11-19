import { API_URL } from "./config";
export async function login(email, password){
    const response = await fetch (`${API_URL}/accounts/login/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    });

    if(!response.ok){
        throw new Error("login başarısız");
    }

    return await response.json();
}