// src/screens/CheckoutScreen.js
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getReservation } from "../api/reservations";
import { getEventDetails } from "../api/events";
import { checkout } from "../api/checkout";
import { useThemeSettings } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import BottomMenu from "../components/BottomMenu";

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
  const { t } = useLanguage();

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

  // 4) Abrir ubicación en Google Maps
  const abrirEnMapa = () => {
    const query = evento?.location || evento?.name;
    if (!query) {
      Alert.alert(
        t("checkout_alert_no_location_title"),
        t("checkout_alert_no_location_body")
      );
      return;
    }

    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        t("checkout_alert_openmaps_error_title"),
        t("checkout_alert_openmaps_error_body")
      );
    });
  };

  // 5) Confirmar compra
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
        t("checkout_alert_success_title"),
        t("checkout_alert_success_body")
      );
      navigation.navigate("Purchases");
    } catch (e) {
      console.error(e);
      Alert.alert(
        t("checkout_alert_error_title"),
        e.message || t("checkout_alert_error_body_default")
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
        edges={["top"]}
      >
        <View style={estilos.centro}>
          <ActivityIndicator size="large" color="#A855F7" />
          <Text
            style={[estilos.textoSecundario, { color: textoSecundario }]}
          >
            {t("checkout_loading")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[estilos.contenedor, { backgroundColor: fondo }]}
        edges={["top"]}
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
        edges={["top"]}
      >
        <View style={estilos.centro}>
          <Text style={[estilos.textoError, { color: "#FCA5A5" }]}>
            {t("checkout_not_found")}
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
      edges={["top"]}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={estilos.scrollContenido}>
          <Text style={[estilos.titulo, { color: textoPrincipal }]}>
            {t("checkout_title")}
          </Text>

          {/* Resumen de reserva */}
          <View
            style={[
              estilos.tarjeta,
              { backgroundColor: tarjeta, borderColor: borde },
            ]}
          >
            <Text style={[estilos.subtitulo, { color: textoPrincipal }]}>
              {t("checkout_summary_title")}
            </Text>

            <View style={estilos.fila}>
              <Text style={[estilos.etiqueta, { color: textoSecundario }]}>
                {t("checkout_status_label")}
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
                  {t("checkout_created_label")}
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
                  {t("checkout_valid_for_label")}
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
                {t("checkout_expired_text")}
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
                  {t("checkout_event_section_title")}
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
                    {fechaEvento}
                    {evento.location ? ` — ${evento.location}` : ""}
                  </Text>

                  {evento.location && (
                    <TouchableOpacity
                      style={estilos.botonMapa}
                      onPress={abrirEnMapa}
                    >
                      <Text style={estilos.textoBotonMapa}>
                        {t("checkout_map_button")}
                      </Text>
                    </TouchableOpacity>
                  )}
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
              {t("checkout_tickets_section_title")}
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
              <Text
                style={[
                  estilos.etiquetaTotal,
                  { color: textoSecundario },
                ]}
              >
                {t("checkout_total_label")}
              </Text>
              <Text
                style={[
                  estilos.valorTotal,
                  { color: textoPrincipal },
                ]}
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
              {t("checkout_buyer_title")}
            </Text>

            <Text style={[estilos.labelInput, { color: textoSecundario }]}>
              {t("checkout_buyer_name_label")}
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
              onChangeText={(txt) => actualizarComprador("nombre", txt)}
            />

            <Text style={[estilos.labelInput, { color: textoSecundario }]}>
              {t("checkout_buyer_email_label")}
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
              onChangeText={(txt) => actualizarComprador("correo", txt)}
            />

            <Text style={[estilos.nota, { color: textoSecundario }]}>
              {t("checkout_buyer_note")}
            </Text>
          </View>
        </ScrollView>

        {/* Botón + menú */}
        <View
          style={[
            estilos.footer,
            { backgroundColor: fondo, borderTopColor: borde },
          ]}
        >
          <TouchableOpacity
            style={[
              estilos.botonConfirmar,
              (!puedeConfirmar || expirada) &&
                estilos.botonDeshabilitado,
            ]}
            onPress={confirmarCompra}
            disabled={!puedeConfirmar || expirada}
          >
            <Text style={estilos.textoBoton}>
              {enviando
                ? t("checkout_button_confirming")
                : t("checkout_button_confirm")}
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
  scrollContenido: {
    padding: 16,
    paddingBottom: 120,
  },
  centro: {
    marginTop: 24,
    alignItems: "center",
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
  // Botón "Ver en el mapa"
  botonMapa: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#A855F7",
  },
  textoBotonMapa: {
    color: "#A855F7",
    fontSize: 13,
    fontWeight: "600",
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
    paddingBottom: Platform.OS === "android" ? 8 : 12,
    borderTopWidth: 1,
  },
  botonConfirmar: {
    backgroundColor: "#A855F7",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 4,
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
