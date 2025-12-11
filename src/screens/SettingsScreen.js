// src/screens/SettingsScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeSettings } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import BottomMenu from "../components/BottomMenu";

export default function SettingsScreen() {
  const { isDark: esOscuro, setIsDark: setEsOscuro } = useThemeSettings();
  const { language, setLanguage, t } = useLanguage();

  const fondo = esOscuro ? "#020617" : "#F5F3FF";
  const tarjeta = esOscuro ? "#0F172A" : "#FFFFFF";
  const borde = esOscuro ? "#1F2937" : "#E5E7EB";
  const textoPrincipal = esOscuro ? "#F9FAFB" : "#111827";
  const textoSecundario = esOscuro ? "#9CA3AF" : "#4B5563";
  const morado = "#A855F7";
  const moradoSuave = "#E9D5FF";

  return (
    <SafeAreaView
      style={[estilos.contenedor, { backgroundColor: fondo }]}
      edges={["top"]}
    >
      <View style={{ flex: 1 }}>
        {/* ENCABEZADO */}
        <View style={estilos.header}>
          <Text
            style={[estilos.headerTitulo, { color: textoPrincipal }]}
          >
            {t("settings_title")}
          </Text>
          <Text
            style={[estilos.headerSubtitulo, { color: textoSecundario }]}
          >
            {t("settings_subtitle")}
          </Text>
        </View>

        {/* TARJETA */}
        <View
          style={[
            estilos.tarjeta,
            {
              backgroundColor: tarjeta,
              borderColor: borde,
              shadowColor: "#000000",
            },
          ]}
        >
          {/* Apariencia */}
          <Text
            style={[
              estilos.tituloSeccion,
              { color: textoPrincipal },
            ]}
          >
            {t("settings_appearance")}
          </Text>

          <View style={estilos.fila}>
            <View style={{ flex: 1 }}>
              <Text
                style={[estilos.label, { color: textoPrincipal }]}
              >
                {t("settings_dark_mode")}
              </Text>
              <Text
                style={[
                  estilos.descripcion,
                  { color: textoSecundario },
                ]}
              >
                {t("settings_dark_mode_desc")}
              </Text>
            </View>

            <Switch
              value={esOscuro}
              onValueChange={(v) => setEsOscuro(v)}
              trackColor={{ false: "#E5E7EB", true: "#C4B5FD" }}
              thumbColor={esOscuro ? morado : "#FFFFFF"}
            />
          </View>

          <View style={estilos.separador} />

          {/* Idioma */}
          <Text
            style={[
              estilos.tituloSeccion,
              { color: textoPrincipal },
            ]}
          >
            {t("settings_language_section")}
          </Text>

          <View style={estilos.fila}>
            <View style={{ flex: 1 }}>
              <Text
                style={[estilos.label, { color: textoPrincipal }]}
              >
                {t("settings_language_label")}
              </Text>
              <Text
                style={[
                  estilos.descripcion,
                  { color: textoSecundario },
                ]}
              >
                {t("settings_language_desc")}
              </Text>
            </View>

            <View style={estilos.contenedorPillsIdioma}>
              <TouchableOpacity
                style={[
                  estilos.pillIdioma,
                  language === "es" && {
                    backgroundColor: moradoSuave,
                    borderColor: morado,
                  },
                ]}
                onPress={() => setLanguage("es")}
              >
                <Text
                  style={[
                    estilos.textoPill,
                    {
                      color:
                        language === "es"
                          ? morado
                          : textoSecundario,
                    },
                  ]}
                >
                  ES
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  estilos.pillIdioma,
                  language === "en" && {
                    backgroundColor: moradoSuave,
                    borderColor: morado,
                  },
                ]}
                onPress={() => setLanguage("en")}
              >
                <Text
                  style={[
                    estilos.textoPill,
                    {
                      color:
                        language === "en"
                          ? morado
                          : textoSecundario,
                    },
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitulo: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerSubtitulo: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 18,
  },
  tarjeta: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  tituloSeccion: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  descripcion: {
    fontSize: 13,
    marginTop: 2,
  },
  separador: {
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.30)",
    marginVertical: 4,
  },
  contenedorPillsIdioma: {
    flexDirection: "row",
    gap: 8,
  },
  pillIdioma: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "transparent",
    minWidth: 38,
    alignItems: "center",
  },
  textoPill: {
    fontSize: 12,
    fontWeight: "700",
  },
});
