// src/screens/PurchasesScreen.js
import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";

export default function PurchasesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mis compras</Text>
        <Text style={styles.text}>
          Aquí se mostrará el historial de compras usando AsyncStorage
          (equivalente a localStorage en la web).
        </Text>
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
