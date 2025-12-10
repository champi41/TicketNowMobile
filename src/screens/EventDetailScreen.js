// src/screens/EventDetailScreen.js
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getEventDetails } from "../api/events";
import { createReservation } from "../api/reservations";
import { useThemeSettings } from "../context/ThemeContext";
import BottomMenu from "../components/BottomMenu";

const formatoCLP = (valor) => {
  if (typeof valor !== "number" || Number.isNaN(valor)) return "$0";
  try {
    return "$" + valor.toLocaleString("es-CL") + " CLP";
  } catch {
    return "$" + valor.toString() + " CLP";
  }
};

export default function EventDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { isDark: esOscuro } = useThemeSettings();
  const { eventId } = route.params || {};

  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [cantidadesPorTipo, setCantidadesPorTipo] = useState({});
  const [reservando, setReservando] = useState(false);

  // 1) Cargar datos del evento
  useEffect(() => {
    if (!eventId) return;

    const cargarDetalles = async () => {
      try {
        setCargando(true);
        setError("");
        const data = await getEventDetails(eventId);
        setEvento(data);

        if (data?.tickets && Array.isArray(data.tickets)) {
          const inicial = {};
          data.tickets.forEach((t) => {
            inicial[t.type] = 0;
          });
          setCantidadesPorTipo(inicial);
        } else {
          setCantidadesPorTipo({});
        }
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los detalles del evento.");
      } finally {
        setCargando(false);
      }
    };

    cargarDetalles();
  }, [eventId]);

  // 2) Totales
  const totalCLP = useMemo(() => {
    if (!evento?.tickets) return 0;
    return evento.tickets.reduce((acc, t) => {
      const q = cantidadesPorTipo[t.type] || 0;
      const precio = t.price || 0;
      return acc + q * precio;
    }, 0);
  }, [evento, cantidadesPorTipo]);

  const totalEntradas = useMemo(
    () =>
      Object.values(cantidadesPorTipo).reduce(
        (acc, v) => acc + (typeof v === "number" ? v : 0),
        0
      ),
    [cantidadesPorTipo]
  );

  // 3) Helpers para cantidades
  const setCantidad = (tipo, siguiente) => {
    if (!evento?.tickets) return;
    const ticket = evento.tickets.find((t) => t.type === tipo);
    const max = Math.min(110, ticket?.available ?? 0);

    const num = Number.isFinite(siguiente) ? siguiente : 0;
    const val = Math.max(0, Math.min(max, num));

    setCantidadesPorTipo((prev) => ({ ...prev, [tipo]: val }));
  };

  const incrementar = (tipo) =>
    setCantidad(tipo, (cantidadesPorTipo[tipo] || 0) + 1);
  const decrementar = (tipo) =>
    setCantidad(tipo, (cantidadesPorTipo[tipo] || 0) - 1);

  // 4) Crear reserva y pasar a checkout
  const manejarReserva = async () => {
    if (!evento?._id || !evento?.tickets?.length) return;

    const items = Object.entries(cantidadesPorTipo)
      .filter(([, cantidad]) => cantidad > 0)
      .map(([type, quantity]) => ({ type, quantity }));

    if (items.length === 0) {
      alert("Selecciona al menos 1 entrada.");
      return;
    }

    try {
      setReservando(true);
      const res = await createReservation({
        event_id: evento._id,
        items,
      });

      navigation.navigate("Checkout", {
        reservationId: res.reservation_id,
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo crear la reserva");
    } finally {
      setReservando(false);
    }
  };

  // ---- Distintos estados ----
  const fondo = esOscuro ? "#020617" : "#F3F4F6";
  const textoPrincipal = esOscuro ? "#F9FAFB" : "#111827";
  const textoSecundario = esOscuro ? "#9CA3AF" : "#4B5563";
  const fondoTarjeta = esOscuro ? "#0F172A" : "#FFFFFF";
  const borde = esOscuro ? "#1F2937" : "#E5E7EB";

  if (!eventId) {
    return (
      <SafeAreaView style={[estilos.contenedor, { backgroundColor: fondo }]}>
        <View style={estilos.centro}>
          <Text style={[estilos.textoError, { color: "#FCA5A5" }]}>
            No se recibió el ID del evento.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (cargando) {
    return (
      <SafeAreaView style={[estilos.contenedor, { backgroundColor: fondo }]}>
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color="#A855F7" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[estilos.contenedor, { backgroundColor: fondo }]}>
        <View style={estilos.centro}>
          <Text style={[estilos.textoError, { color: "#FCA5A5" }]}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!evento) {
    return (
      <SafeAreaView style={[estilos.contenedor, { backgroundColor: fondo }]}>
        <View style={estilos.centro}>
          <Text style={[estilos.textoError, { color: "#FCA5A5" }]}>
            No se encontró el evento.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  let fechaLarga = "Fecha no disponible";
  if (evento.date) {
    try {
      fechaLarga = new Date(evento.date).toLocaleString("es-CL", {
        dateStyle: "full",
        timeStyle: "short",
      });
    } catch {
      fechaLarga = evento.date;
    }
  }

  const tickets = Array.isArray(evento.tickets) ? evento.tickets : [];
  const urlImagen =
    evento.image ||
    "https://placehold.co/800x400/111827/eeeeee?text=Evento";

  return (
    <SafeAreaView style={[estilos.contenedor, { backgroundColor: fondo }]}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={estilos.contenido}>
          {/* IMAGEN PRINCIPAL */}
          <Image
            source={{ uri: urlImagen }}
            style={estilos.imagenEncabezado}
            resizeMode="cover"
          />

          {/* Información general */}
          <Text style={[estilos.titulo, { color: textoPrincipal }]}>
            {evento.name}
          </Text>
          <Text style={[estilos.info, { color: textoSecundario }]}>
            {fechaLarga}
          </Text>
          <Text style={[estilos.info, { color: textoSecundario }]}>
            {evento.location}
          </Text>
          {evento.category && (
            <Text style={[estilos.info, { color: textoSecundario }]}>
              Categoría: {evento.category}
            </Text>
          )}

          {/* Descripción */}
          <Text style={[estilos.subtitulo, { color: textoPrincipal }]}>
            Descripción
          </Text>
          <Text style={[estilos.parrafo, { color: textoSecundario }]}>
            {evento.description || "Este evento aún no tiene descripción."}
          </Text>

          {/* Entradas */}
          <Text style={[estilos.subtitulo, { color: textoPrincipal }]}>
            Selecciona tus entradas
          </Text>

          {tickets.length === 0 ? (
            <Text style={[estilos.parrafo, { color: textoSecundario }]}>
              Este evento no tiene tipos de entradas configurados.
            </Text>
          ) : (
            <View style={estilos.listaTickets}>
              {tickets.map((t) => {
                const q = cantidadesPorTipo[t.type] || 0;
                const max = Math.min(110, t.available ?? 0);

                return (
                  <View
                    key={t.type}
                    style={[
                      estilos.filaTicket,
                      {
                        backgroundColor: fondoTarjeta,
                        borderColor: borde,
                      },
                    ]}
                  >
                    <View style={estilos.metaTicket}>
                      <Text
                        style={[
                          estilos.nombreTicket,
                          { color: textoPrincipal },
                        ]}
                      >
                        {t.type}
                      </Text>
                      <Text
                        style={[
                          estilos.precioTicket,
                          { color: "#A855F7" },
                        ]}
                      >
                        {formatoCLP(t.price || 0)}
                      </Text>
                      <Text
                        style={[
                          estilos.stockTicket,
                          { color: textoSecundario },
                        ]}
                      >
                        Disponibles: {t.available} (máx. {max})
                      </Text>
                    </View>

                    <View style={estilos.controlesCantidad}>
                      <TouchableOpacity
                        style={[
                          estilos.botonCantidad,
                          { borderColor: borde },
                          q <= 0 && estilos.botonCantidadDeshabilitado,
                        ]}
                        onPress={() => decrementar(t.type)}
                        disabled={q <= 0}
                      >
                        <Text
                          style={[
                            estilos.textoBotonCantidad,
                            { color: textoPrincipal },
                          ]}
                        >
                          −
                        </Text>
                      </TouchableOpacity>

                      <Text
                        style={[
                          estilos.textoCantidad,
                          { color: textoPrincipal },
                        ]}
                      >
                        {q}
                      </Text>

                      <TouchableOpacity
                        style={[
                          estilos.botonCantidad,
                          { borderColor: borde },
                          q >= max && estilos.botonCantidadDeshabilitado,
                        ]}
                        onPress={() => incrementar(t.type)}
                        disabled={q >= max}
                      >
                        <Text
                          style={[
                            estilos.textoBotonCantidad,
                            { color: textoPrincipal },
                          ]}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Totales */}
          <View
            style={[
              estilos.cajaTotales,
              { backgroundColor: fondoTarjeta, borderColor: borde },
            ]}
          >
            <View style={estilos.filaTotal}>
              <Text
                style={[estilos.etiquetaTotal, { color: textoSecundario }]}
              >
                Total entradas
              </Text>
              <Text
                style={[estilos.valorTotal, { color: textoPrincipal }]}
              >
                {totalEntradas}
              </Text>
            </View>
            <View style={estilos.filaTotal}>
              <Text
                style={[estilos.etiquetaTotal, { color: textoSecundario }]}
              >
                Total a pagar
              </Text>
              <Text
                style={[estilos.valorTotal, { color: textoPrincipal }]}
              >
                {formatoCLP(totalCLP)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer: botón + menú */}
        <View
          style={[
            estilos.footer,
            { backgroundColor: fondo, borderTopColor: borde },
          ]}
        >
          <TouchableOpacity
            style={[
              estilos.botonReservar,
              (totalEntradas === 0 || reservando) &&
                estilos.botonReservarDeshabilitado,
            ]}
            onPress={manejarReserva}
            disabled={totalEntradas === 0 || reservando}
          >
            <Text style={estilos.textoBotonReservar}>
              {reservando ? "Reservando..." : "Reservar entradas"}
            </Text>
          </TouchableOpacity>

          <BottomMenu active="home" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1 },
  contenido: {
    padding: 20,
    paddingBottom: 150,
  },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  textoError: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  imagenEncabezado: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "#111827",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  info: { fontSize: 14, marginBottom: 4 },
  subtitulo: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  parrafo: {
    fontSize: 14,
    lineHeight: 20,
  },

  listaTickets: {
    marginTop: 8,
    gap: 12,
  },
  filaTicket: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  metaTicket: {
    flex: 1,
    paddingRight: 8,
  },
  nombreTicket: {
    fontSize: 16,
    fontWeight: "600",
  },
  precioTicket: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  stockTicket: {
    fontSize: 12,
    marginTop: 2,
  },
  controlesCantidad: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  botonCantidad: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  botonCantidadDeshabilitado: {
    opacity: 0.4,
  },
  textoBotonCantidad: {
    fontSize: 18,
    fontWeight: "700",
  },
  textoCantidad: {
    minWidth: 24,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  cajaTotales: {
    marginTop: 24,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  filaTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  etiquetaTotal: {
    fontSize: 14,
  },
  valorTotal: {
    fontSize: 16,
    fontWeight: "600",
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === "android" ? 8 : 12,
    borderTopWidth: 1,
  },
  botonReservar: {
    backgroundColor: "#A855F7",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 4,
  },
  botonReservarDeshabilitado: {
    opacity: 0.6,
  },
  textoBotonReservar: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
