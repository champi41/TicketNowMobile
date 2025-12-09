
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,  
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getReservation } from "../api/reservations";
import { getEventDetails } from "../api/events";
import { checkout } from "../api/checkout";
import { useThemeSettings } from "../context/ThemeContext";

function formatoCLP(n) {
  const num = Number(n || 0);
  try {
    return "$" + num.toLocaleString("es-CL") + " CLP";
  } catch {
    return "$" + num.toString() + " CLP";
  }
}

export default function CheckoutScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { isDark: esOscuro } = useThemeSettings();

  const { reservationId } = route.params || {};

  const [reserva, setReserva] = useState(null);
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [comprador, setComprador] = useState({
    nombre: "",
    correo: "",
  });

  const [enviando, setEnviando] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(null);

  // Colores según tema
  const fondo = esOscuro ? "#020617" : "#F3F4F6";
  const textoPrincipal = esOscuro ? "#F9FAFB" : "#111827";
  const textoSecundario = esOscuro ? "#9CA3AF" : "#4B5563";
  const tarjeta = esOscuro ? "#0F172A" : "#FFFFFF";
  const borde = esOscuro ? "#1F2937" : "#E5E7EB";

  // 1) Cargar reserva y evento
  useEffect(() => {
    if (!reservationId) {
      setError("No se recibió el ID de la reserva.");
      setCargando(false);
      return;
    }

    const cargar = async () => {
      try {
        setCargando(true);
        setError("");

        const datosReserva = await getReservation(reservationId);
        setReserva(datosReserva);

        if (datosReserva?.event_id) {
          const datosEvento = await getEventDetails(datosReserva.event_id);
          setEvento(datosEvento);
        }
      } catch (e) {
        console.error(e);
        setError(e.message || "No se pudo cargar la reserva.");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [reservationId]);

  // 2) Contador de expiración
  useEffect(() => {
    if (!reserva?.expires_at) return;

    const actualizar = () => {
      const exp = new Date(reserva.expires_at).getTime();
      const diff = Math.floor((exp - Date.now()) / 1000);
      setSegundosRestantes(diff > 0 ? diff : 0);
    };

    actualizar();
    const id = setInterval(actualizar, 1000);
    return () => clearInterval(id);
  }, [reserva?.expires_at]);

  const expirada =
    segundosRestantes !== null && segundosRestantes <= 0;

  const minutos = Math.floor((segundosRestantes || 0) / 60);
  const segundos = (segundosRestantes || 0) % 60;

  // 3) Construir items para mostrar
  const itemsMostrar = useMemo(() => {
    const items = Array.isArray(reserva?.items) ? reserva.items : [];
    if (!items.length) return [];

    const mapaPrecio = new Map();
    (evento?.tickets || []).forEach((t) => {
      mapaPrecio.set(t.type, Number(t.price || 0));
    });

    return items.map((it) => {
      const cantidad = Number(it.quantity || 0);
      const unit =
        it.price != null
          ? Number(it.price)
          : it.unit_price != null
          ? Number(it.unit_price)
          : mapaPrecio.get(it.type) || 0;

      const subtotal =
        it.subtotal != null ? Number(it.subtotal) : unit * cantidad;

      return {
        tipo: it.type,
        cantidad,
        precioUnidad: unit,
        subtotal,
      };
    });
  }, [reserva, evento]);

  const totalMostrar = useMemo(() => {
    if (reserva?.total_price != null) {
      return Number(reserva.total_price);
    }
    return itemsMostrar.reduce(
      (acc, it) => acc + (it.subtotal || 0),
      0
    );
  }, [reserva, itemsMostrar]);

  const puedeConfirmar =
    !expirada &&
    !enviando &&
    comprador.nombre.trim().length > 1 &&
    comprador.correo.trim().length > 5;

  const actualizarComprador = (campo, valor) => {
    setComprador((prev) => ({ ...prev, [campo]: valor }));
  };

  // 4) Confirmar compra
  const confirmarCompra = async () => {
    if (!puedeConfirmar) return;
    if (!reserva) return;

    try {
      setEnviando(true);

      const datosBuyer = {
        name: comprador.nombre,
        email: comprador.correo,
      };

      const compra = await checkout({
        reservation_id: reserva._id || reservationId,
        buyer: datosBuyer,
      });

      // Guardar ID en historial local (AsyncStorage)
      try {
        const CLAVE = "purchase_ids";
        const previoJSON = await AsyncStorage.getItem(CLAVE);
        const previo = previoJSON ? JSON.parse(previoJSON) : [];
        const idCompra = compra._id || compra.id;
        if (idCompra && !previo.includes(idCompra)) {
          await AsyncStorage.setItem(
            CLAVE,
            JSON.stringify([...previo, idCompra])
          );
        }
      } catch (e) {
        console.error("No se pudo guardar historial local", e);
      }

      Alert.alert(
        "Compra confirmada",
        "Te enviaremos las entradas al correo ingresado."
      );
      navigation.navigate("Purchases");
    } catch (e) {
      console.error(e);
      Alert.alert(
        "Error",
        e.message || "No se pudo confirmar la compra."
      );
    } finally {
      setEnviando(false);
    }
  };

  // ---- RENDER ----
  if (cargando) {
    return (
      <SafeAreaView
        style={[estilos.contenedor, { backgroundColor: fondo }]}
      >
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color="#A855F7" />
          <Text
            style={[estilos.textoSecundario, { color: textoSecundario }]}
          >
            Cargando reserva…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[estilos.contenedor, { backgroundColor: fondo }]}
      >
        <View style={estilos.centro}>
          <Text style={[estilos.textoError, { color: "#FCA5A5" }]}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!reserva) {
    return (
      <SafeAreaView
        style={[estilos.contenedor, { backgroundColor: fondo }]}
      >
        <View style={estilos.centro}>
          <Text style={[estilos.textoError, { color: "#FCA5A5" }]}>
            Reserva no encontrada.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const estado = reserva.status || "PENDING";
  let etiquetaEstado = estado;
  if (estado === "PENDING") etiquetaEstado = "Pendiente";
  if (estado === "CONFIRMED") etiquetaEstado = "Confirmada";

  let fechaEvento = "";
  if (evento?.date) {
    try {
      fechaEvento = new Date(evento.date).toLocaleString("es-CL", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      fechaEvento = evento.date;
    }
  }

  return (
    <SafeAreaView
      style={[estilos.contenedor, { backgroundColor: fondo }]}
    >
      <ScrollView contentContainerStyle={estilos.scrollContenido}>
        <Text style={[estilos.titulo, { color: textoPrincipal }]}>
          Checkout
        </Text>

        {/* Resumen de reserva */}
        <View
          style={[
            estilos.tarjeta,
            { backgroundColor: tarjeta, borderColor: borde },
          ]}
        >
          <Text style={[estilos.subtitulo, { color: textoPrincipal }]}>
            Resumen de la reserva
          </Text>

          <View style={estilos.fila}>
            <Text style={[estilos.etiqueta, { color: textoSecundario }]}>
              Estado:
            </Text>
            <Text style={[estilos.valor, { color: textoPrincipal }]}>
              {etiquetaEstado}
            </Text>
          </View>

          {reserva.created_at && (
            <View style={estilos.fila}>
              <Text
                style={[estilos.etiqueta, { color: textoSecundario }]}
              >
                Creada:
              </Text>
              <Text style={[estilos.valor, { color: textoPrincipal }]}>
                {new Date(reserva.created_at).toLocaleString("es-CL", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </Text>
            </View>
          )}

          {segundosRestantes != null && !expirada && (
            <View style={estilos.fila}>
              <Text
                style={[estilos.etiqueta, { color: textoSecundario }]}
              >
                Reserva válida por:
              </Text>
              <Text
                style={[
                  estilos.valor,
                  estilos.contenedorCountdown,
                  { color: textoPrincipal },
                ]}
              >
                {minutos.toString().padStart(2, "0")}:
                {segundos.toString().padStart(2, "0")} min
              </Text>
            </View>
          )}

          {expirada && (
            <Text style={[estilos.textoError, { marginTop: 8 }]}>
              La reserva expiró. Vuelve al listado de eventos y genera
              una nueva.
            </Text>
          )}

          {/* Evento */}
          {evento && (
            <>
              <Text
                style={[
                  estilos.subtituloPequeño,
                  { color: textoPrincipal },
                ]}
              >
                Evento
              </Text>
              <View style={estilos.itemEvento}>
                <Text
                  style={[
                    estilos.nombreEvento,
                    { color: textoPrincipal },
                  ]}
                >
                  {evento.name}
                </Text>
                <Text
                  style={[
                    estilos.detalleEvento,
                    { color: textoSecundario },
                  ]}
                >
                  {fechaEvento} — {evento.location}
                </Text>
              </View>
            </>
          )}

          {/* Ítems */}
          <Text
            style={[
              estilos.subtituloPequeño,
              { color: textoPrincipal },
            ]}
          >
            Entradas
          </Text>
          {itemsMostrar.map((it) => (
            <View key={it.tipo} style={estilos.filaItem}>
              <View>
                <Text
                  style={[
                    estilos.tipoEntrada,
                    { color: textoPrincipal },
                  ]}
                >
                  {it.cantidad}× {it.tipo}
                </Text>
                <Text
                  style={[
                    estilos.detalleEvento,
                    { color: textoSecundario },
                  ]}
                >
                  {formatoCLP(it.precioUnidad)} c/u
                </Text>
              </View>
              <Text
                style={[
                  estilos.subtotal,
                  { color: textoPrincipal },
                ]}
              >
                {formatoCLP(it.subtotal)}
              </Text>
            </View>
          ))}

          {/* Total */}
          <View style={estilos.filaTotal}>
            <Text style={[estilos.etiquetaTotal, { color: textoSecundario }]}>
              Total a pagar
            </Text>
            <Text
              style={[estilos.valorTotal, { color: textoPrincipal }]}
            >
              {formatoCLP(totalMostrar)}
            </Text>
          </View>
        </View>

        {/* Datos del comprador */}
        <View
          style={[
            estilos.tarjeta,
            { backgroundColor: tarjeta, borderColor: borde },
          ]}
        >
          <Text style={[estilos.subtitulo, { color: textoPrincipal }]}>
            Datos del comprador
          </Text>

          <Text style={[estilos.labelInput, { color: textoSecundario }]}>
            Nombre y apellido
          </Text>
          <TextInput
            style={[
              estilos.input,
              {
                borderColor: borde,
                color: textoPrincipal,
              },
            ]}
            placeholder="Ej: Juan Pérez"
            placeholderTextColor={textoSecundario}
            value={comprador.nombre}
            onChangeText={(t) => actualizarComprador("nombre", t)}
          />

          <Text style={[estilos.labelInput, { color: textoSecundario }]}>
            Correo electrónico
          </Text>
          <TextInput
            style={[
              estilos.input,
              {
                borderColor: borde,
                color: textoPrincipal,
              },
            ]}
            placeholder="ejemplo@correo.cl"
            placeholderTextColor={textoSecundario}
            keyboardType="email-address"
            autoCapitalize="none"
            value={comprador.correo}
            onChangeText={(t) => actualizarComprador("correo", t)}
          />

          <Text style={[estilos.nota, { color: textoSecundario }]}>
            Usaremos este correo solo para enviarte el comprobante y las
            entradas. Revisa también tu carpeta de spam.
          </Text>
        </View>
      </ScrollView>

      {/* Botón de confirmar fijo abajo */}
      <View
        style={[
          estilos.footer,
          { backgroundColor: fondo, borderTopColor: borde },
        ]}
      >
        <TouchableOpacity
          style={[
            estilos.botonConfirmar,
            (!puedeConfirmar || expirada) && estilos.botonDeshabilitado,
          ]}
          onPress={confirmarCompra}
          disabled={!puedeConfirmar || expirada}
        >
          <Text style={estilos.textoBoton}>
            {enviando ? "Confirmando…" : "Confirmar compra"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1 },
  scrollContenido: {
    padding: 16,
    paddingBottom: 120,
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  tarjeta: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtituloPequeño: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  etiqueta: {
    fontSize: 14,
  },
  valor: {
    fontSize: 14,
    fontWeight: "500",
  },
  contenedorCountdown: {
    fontVariant: ["tabular-nums"],
  },
  textoError: {
    fontSize: 14,
    fontWeight: "500",
  },
  textoSecundario: {
    fontSize: 14,
  },
  itemEvento: {
    marginBottom: 8,
  },
  nombreEvento: {
    fontSize: 15,
    fontWeight: "600",
  },
  detalleEvento: {
    fontSize: 13,
  },
  filaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  tipoEntrada: {
    fontSize: 14,
    fontWeight: "500",
  },
  subtotal: {
    fontSize: 14,
    fontWeight: "600",
  },
  filaTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  etiquetaTotal: {
    fontSize: 15,
    fontWeight: "500",
  },
  valorTotal: {
    fontSize: 18,
    fontWeight: "700",
  },
  labelInput: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  nota: {
    fontSize: 12,
    marginTop: 8,
  },
    footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    
    paddingBottom: Platform.OS === "android" ? 28 : 12,
    borderTopWidth: 1,
  },

  botonConfirmar: {
    backgroundColor: "#A855F7",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
