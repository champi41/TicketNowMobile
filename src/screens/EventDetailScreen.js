// src/screens/EventDetailScreen.js
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function EventDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { event } = route.params || {};

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.error}>No se encontró el evento.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.info}>{event.location}</Text>
        <Text style={styles.info}>{event.date}</Text>

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.paragraph}>
          Aquí irá la descripción real del evento desde la API (placeholder).
        </Text>

        <Text style={styles.sectionTitle}>Entradas</Text>
        <Text style={styles.paragraph}>
          Aquí irán los tipos de ticket, precios y selector de cantidades como
          en la versión web (por ahora solo texto de relleno).
        </Text>
      </ScrollView>

      {/* Botón tipo Mercado Libre: abajo, ancho completo */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={() =>
            navigation.navigate("Checkout", { eventId: event.id })
          }
        >
          <Text style={styles.buyButtonText}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  content: {
    padding: 20,
    paddingBottom: 100, // espacio para que no tape el scroll el botón
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "crimson",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111827",
  },
  info: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  buyButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
