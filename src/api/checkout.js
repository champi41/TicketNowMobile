
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Confirma una compra a partir de una reserva existente.
 *  - reservation_id: ID de la reserva creada previamente
 *  - buyer: { name, email }
 */
export async function checkout({ reservation_id, buyer }) {
  try {
    const res = await fetch(`${BASE_URL}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reservation_id, buyer }),
    });

    if (!res.ok) {
      throw new Error(
        `Error al confirmar la compra. Estado: ${res.status}`
      );
    }

    // Devuelve el objeto compra (purchase)
    return await res.json();
  } catch (error) {
    console.error("API checkout Error:", error);
    throw error;
  }
}
