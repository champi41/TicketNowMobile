
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

const formatCLP = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "$0";
  try {
    return "$" + value.toLocaleString("es-CL") + " CLP";
  } catch {
    return "$" + value.toString() + " CLP";
  }
};

export default function EventDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { isDark } = useThemeSettings();
  const { eventId } = route.params || {};

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qtyByType, setQtyByType] = useState({});
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    if (!eventId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getEventDetails(eventId);
        setEvent(data);

        if (data?.tickets && Array.isArray(data.tickets)) {
          const init = {};
          data.tickets.forEach((t) => {
            init[t.type] = 0;
          });
          setQtyByType(init);
        } else {
          setQtyByType({});
        }
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los detalles del evento.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [eventId]);

  const totalCLP = useMemo(() => {
    if (!event?.tickets) return 0;
    return event.tickets.reduce((acc, t) => {
      const q = qtyByType[t.type] || 0;
      const price = t.price || 0;
      return acc + q * price;
    }, 0);
  }, [event, qtyByType]);

  const totalItems = useMemo(
    () =>
      Object.values(qtyByType).reduce(
        (acc, v) => acc + (typeof v === "number" ? v : 0),
        0
      ),
    [qtyByType]
  );

  const setQty = (type, next) => {
    if (!event?.tickets) return;
    const ticket = event.tickets.find((t) => t.type === type);
    const max = Math.min(110, ticket?.available ?? 0);

    const numericNext = Number.isFinite(next) ? next : 0;
    const val = Math.max(0, Math.min(max, numericNext));

    setQtyByType((prev) => ({ ...prev, [type]: val }));
  };

  const inc = (type) => setQty(type, (qtyByType[type] || 0) + 1);
  const dec = (type) => setQty(type, (qtyByType[type] || 0) - 1);

  const handleReserve = async () => {
    if (!event?._id || !event?.tickets?.length) return;

    const items = Object.entries(qtyByType)
      .filter(([, quantity]) => quantity > 0)
      .map(([type, quantity]) => ({ type, quantity }));

    if (items.length === 0) {
      alert("Selecciona al menos 1 entrada.");
      return;
    }

    try {
      setReserving(true);
      const res = await createReservation({
        event_id: event._id,
        items,
      });

      navigation.navigate("Checkout", {
        reservationId: res.reservation_id,
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo crear la reserva");
    } finally {
      setReserving(false);
    }
  };

  if (!eventId) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          isDark && { backgroundColor: "#020617" },
        ]}
      >
        <View style={styles.center}>
          <Text style={[styles.error, isDark && { color: "#FCA5A5" }]}>
            No se recibió el ID del evento.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          isDark && { backgroundColor: "#020617" },
        ]}
      >
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          isDark && { backgroundColor: "#020617" },
        ]}
      >
        <View style={styles.center}>
          <Text style={[styles.error, isDark && { color: "#FCA5A5" }]}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          isDark && { backgroundColor: "#020617" },
        ]}
      >
        <View style={styles.center}>
          <Text style={[styles.error, isDark && { color: "#FCA5A5" }]}>
            No se encontró el evento.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  let fechaLarga = "Fecha no disponible";
  if (event.date) {
    try {
      fechaLarga = new Date(event.date).toLocaleString("es-CL", {
        dateStyle: "full",
        timeStyle: "short",
      });
    } catch {
      fechaLarga = event.date;
    }
  }

  const tickets = Array.isArray(event.tickets) ? event.tickets : [];

  const bgColor = isDark ? "#020617" : "#F3F4F6";
  const textMain = isDark ? "#F9FAFB" : "#111827";
  const textSub = isDark ? "#9CA3AF" : "#4B5563";
  const cardBg = isDark ? "#0F172A" : "#FFFFFF";
  const borderColor = isDark ? "#1F2937" : "#E5E7EB";

  const imageUri =
    event.image ||
    "https://placehold.co/800x400/111827/eeeeee?text=Evento";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* IMAGEN PRINCIPAL */}
        <Image
          source={{ uri: imageUri }}
          style={styles.headerImage}
          resizeMode="cover"
        />

        {/* Información general */}
        <Text style={[styles.title, { color: textMain }]}>{event.name}</Text>
        <Text style={[styles.info, { color: textSub }]}>{fechaLarga}</Text>
        <Text style={[styles.info, { color: textSub }]}>{event.location}</Text>
        {event.category && (
          <Text style={[styles.info, { color: textSub }]}>
            Categoría: {event.category}
          </Text>
        )}

        {/* Descripción */}
        <Text style={[styles.sectionTitle, { color: textMain }]}>
          Descripción
        </Text>
        <Text style={[styles.paragraph, { color: textSub }]}>
          {event.description || "Este evento aún no tiene descripción."}
        </Text>

        {/* Entradas */}
        <Text style={[styles.sectionTitle, { color: textMain }]}>
          Selecciona tus entradas
        </Text>

        {tickets.length === 0 ? (
          <Text style={[styles.paragraph, { color: textSub }]}>
            Este evento no tiene tipos de entradas configurados.
          </Text>
        ) : (
          <View style={styles.ticketList}>
            {tickets.map((t) => {
              const q = qtyByType[t.type] || 0;
              const max = Math.min(110, t.available ?? 0);

              return (
                <View
                  key={t.type}
                  style={[
                    styles.ticketRow,
                    { backgroundColor: cardBg, borderColor },
                  ]}
                >
                  <View style={styles.ticketMeta}>
                    <Text style={[styles.ticketName, { color: textMain }]}>
                      {t.type}
                    </Text>
                    <Text style={[styles.ticketPrice, { color: "#2563EB" }]}>
                      {formatCLP(t.price || 0)}
                    </Text>
                    <Text style={[styles.ticketStock, { color: textSub }]}>
                      Disponibles: {t.available} (máx. {max})
                    </Text>
                  </View>

                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={[
                        styles.qtyButton,
                        { borderColor },
                        q <= 0 && styles.qtyButtonDisabled,
                      ]}
                      onPress={() => dec(t.type)}
                      disabled={q <= 0}
                    >
                      <Text
                        style={[
                          styles.qtyButtonText,
                          { color: textMain },
                        ]}
                      >
                        −
                      </Text>
                    </TouchableOpacity>

                    <Text style={[styles.qtyText, { color: textMain }]}>
                      {q}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.qtyButton,
                        { borderColor },
                        q >= max && styles.qtyButtonDisabled,
                      ]}
                      onPress={() => inc(t.type)}
                      disabled={q >= max}
                    >
                      <Text
                        style={[
                          styles.qtyButtonText,
                          { color: textMain },
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
            styles.totalsBox,
            { backgroundColor: cardBg, borderColor },
          ]}
        >
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: textSub }]}>
              Total entradas
            </Text>
            <Text style={[styles.totalValue, { color: textMain }]}>
              {totalItems}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: textSub }]}>
              Total a pagar
            </Text>
            <Text style={[styles.totalValue, { color: textMain }]}>
              {formatCLP(totalCLP)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer con Home + Settings + Reservar */}
      <View
        style={[
          styles.footer,
          { backgroundColor: isDark ? "#020617" : "#F9FAFB", borderColor },
        ]}
      >
        <View style={styles.bottomNavRow}>
          <TouchableOpacity
            style={[
              styles.navButton,
              { borderColor, backgroundColor: cardBg },
            ]}
            onPress={() => navigation.navigate("Home")}
          >
            <Text
              style={[
                styles.navButtonText,
                { color: textMain },
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navButton,
              { borderColor, backgroundColor: cardBg },
            ]}
            onPress={() => navigation.navigate("Settings")}
          >
            <Text
              style={[
                styles.navButtonText,
                { color: textMain },
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.buyButton,
            (totalItems === 0 || reserving) && styles.buyButtonDisabled,
          ]}
          onPress={handleReserve}
          disabled={totalItems === 0 || reserving}
        >
          <Text style={styles.buyButtonText}>
            {reserving ? "Reservando..." : "Reservar entradas"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    paddingBottom: 150,
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: "crimson", fontSize: 16, textAlign: "center", padding: 20 },
  headerImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: "#111827",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  info: { fontSize: 14, marginBottom: 4 },
  sectionTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
  },

  ticketList: {
    marginTop: 8,
    gap: 12,
  },
  ticketRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  ticketMeta: {
    flex: 1,
    paddingRight: 8,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: "600",
  },
  ticketPrice: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  ticketStock: {
    fontSize: 12,
    marginTop: 2,
  },
  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyButtonDisabled: {
    opacity: 0.4,
  },
  qtyButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  qtyText: {
    minWidth: 24,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },

  totalsBox: {
    marginTop: 24,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
  },

 footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === "android" ? 45 : 13,
    borderTopWidth: 1,
  },
  bottomNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  buyButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  buyButtonDisabled: {
    opacity: 0.6,
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
