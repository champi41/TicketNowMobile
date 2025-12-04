const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getEvents() {
  try {
    const res = await fetch(`${BASE_URL}/events`);

    if (!res.ok) {
      throw new Error("Error al obtener eventos");
    }

    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error("API getEvents Error:", error);
    throw error;
  }
}