// src/components/BottomMenu.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeSettings } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function BottomMenu({ active = "home" }) {
  const navigation = useNavigation();
  const { isDark: esOscuro } = useThemeSettings();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage(); // 👈 para traducir textos

  const fondo = esOscuro ? "#020617" : "#FFFFFF";
  const borde = esOscuro ? "#1F2937" : "#E5E7EB";
  const textoInactivo = esOscuro ? "#9CA3AF" : "#6B7280";
  const morado = "#A855F7";

  return (
    <View
      style={[
        estilos.contenedor,
        {
          backgroundColor: fondo,
          borderTopColor: borde,
          paddingBottom: insets.bottom + 6, // se mantiene tu ajuste
        },
      ]}
    >
      {/* BOTÓN INICIO */}
      <TouchableOpacity
        style={estilos.item}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons
          name="home"
          size={24}
          color={active === "home" ? morado : textoInactivo}
        />
        <Text
          style={[
            estilos.etiqueta,
            active === "home" && estilos.etiquetaActiva,
            { color: active === "home" ? morado : textoInactivo },
          ]}
        >
          {t("bottom_home")}
        </Text>
      </TouchableOpacity>

      {/* BOTÓN AJUSTES */}
      <TouchableOpacity
        style={estilos.item}
        onPress={() => navigation.navigate("Settings")}
      >
        <Ionicons
          name="settings"
          size={24}
          color={active === "settings" ? morado : textoInactivo}
        />
        <Text
          style={[
            estilos.etiqueta,
            active === "settings" && estilos.etiquetaActiva,
            { color: active === "settings" ? morado : textoInactivo },
          ]}
        >
          {t("bottom_settings")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 60,
    paddingTop: 6,
    borderTopWidth: 1,
  },
  item: {
    alignItems: "center",
  },
  etiqueta: {
    fontSize: 12,
    marginTop: 2,
  },
  etiquetaActiva: {
    fontWeight: "700",
  },
});
