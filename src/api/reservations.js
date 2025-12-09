
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createReservation({ event_id, items }) {
  try {
    const res = await fetch(`${BASE_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id, items }),
    });

    if (!res.ok) {
      throw new Error(`Error al crear la reserva. Estado: ${res.status}`);
    }

    return await res.json(); // debe traer { reservation_id, ... }
  } catch (error) {
    console.error("API createReservation Error:", error);
    throw error;
  }
}

export async function getReservation(reservation_id) {
  try {
    const res = await fetch(`${BASE_URL}/reservations/${reservation_id}`);

    if (!res.ok) {
      throw new Error(`Error al obtener reserva. Estado: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("API getReservation Error:", error);
    throw error;
  }
}
