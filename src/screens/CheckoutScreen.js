// src/screens/CheckoutScreen.js
import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function CheckoutScreen() {
  const route = useRoute();
  const { eventId } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Checkout</Text>
        <Text style={styles.text}>
          Aquí irá el resumen de la reserva y los datos del comprador,
          similar a la versión web.
        </Text>
        <Text style={styles.text}>eventId: {eventId || "N/A"}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F3F4F6" },
  content: { flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  text: { fontSize: 14, color: "#374151", marginBottom: 8 },
});
