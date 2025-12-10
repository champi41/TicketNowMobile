// src/screens/SettingsScreen.js
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Switch,
} from "react-native";
import { useThemeSettings } from "../context/ThemeContext";
import BottomMenu from "../components/BottomMenu";

export default function SettingsScreen() {
  const { isDark: esOscuro, setIsDark: setEsOscuro } = useThemeSettings();
  const [idioma, setIdioma] = useState("es"); // solo visual

  const fondo = esOscuro ? "#020617" : "#F3F4F6";
  const tarjeta = esOscuro ? "#0F172A" : "#FFFFFF";
  const borde = esOscuro ? "#1F2937" : "#E5E7EB";
  const textoPrincipal = esOscuro ? "#F9FAFB" : "#111827";
  const textoSecundario = esOscuro ? "#9CA3AF" : "#4B5563";

  return (
    <SafeAreaView
      style={[estilos.contenedor, { backgroundColor: fondo }]}
    >
      <View style={{ flex: 1 }}>
        <View
          style={[
            estilos.tarjeta,
            { backgroundColor: tarjeta, borderColor: borde },
          ]}
        >
          <Text style={[estilos.titulo, { color: textoPrincipal }]}>
            Ajustes
          </Text>

          {/* Modo oscuro */}
          <View style={estilos.fila}>
            <View>
              <Text
                style={[estilos.label, { color: textoPrincipal }]}
              >
                Modo oscuro
              </Text>
              <Text
                style={[estilos.descripcion, { color: textoSecundario }]}
              >
                Cambia entre modo claro y oscuro.
              </Text>
            </View>
            <Switch
              value={esOscuro}
              onValueChange={(v) => setEsOscuro(v)}
            />
          </View>

          {/* Idioma (demo) */}
          <View style={estilos.fila}>
            <View>
              <Text
                style={[estilos.label, { color: textoPrincipal }]}
              >
                Idioma de la app
              </Text>
              <Text
                style={[estilos.descripcion, { color: textoSecundario }]}
              >
                (Demostración) Español / Inglés.
              </Text>
            </View>
            <Text style={{ color: textoPrincipal, fontWeight: "600" }}>
              {idioma === "es" ? "Español" : "English"}
            </Text>
          </View>
        </View>
      </View>

      <BottomMenu active="settings" />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 16,
  },
  tarjeta: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  descripcion: {
    fontSize: 13,
  },
});
