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
export async function getEventDetails(eventId) {
    try {
        const res = await fetch(`${BASE_URL}/events/${eventId}`);
        
        if (!res.ok) {
            // Maneja el error si el evento no existe (404) o hay otro problema.
            throw new Error(`Error al obtener detalles del evento. Estado: ${res.status}`);
        }
        
        return await res.json();
    } catch (error) {
        console.error("API getEventDetails Error:", error);
        throw error;
    }
}