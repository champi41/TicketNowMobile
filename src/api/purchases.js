
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Obtiene los datos de una compra por su ID.
 */
export async function getPurchase(purchase_id) {
  try {
    const res = await fetch(`${BASE_URL}/purchases/${purchase_id}`);

    if (!res.ok) {
      throw new Error(
        `Error al obtener la compra. Estado: ${res.status}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("API getPurchase Error:", error);
    throw error;
  }
}
