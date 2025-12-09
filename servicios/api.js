// servicios/api.js (Versión requerida)

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getEvents(page = 1, limit = 20) {
    try {
        const res = await fetch(`${BASE_URL}/events?page=${page}&limit=${limit}`);
        
        if (!res.ok) {
            throw new Error(`Error al obtener eventos: Estado ${res.status}`);
        }

        const json = await res.json();

        
        return {
            data: json.data ?? [],          
            total: json.total ?? 0,
            limit: json.limit ?? 20
        };

    } catch (error) {
        console.error("API getEvents Error:", error);
        throw error;
    }
}