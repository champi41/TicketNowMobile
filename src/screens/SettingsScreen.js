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
import { Ionicons } from "@expo/vector-icons";

import { useThemeSettings } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import BottomMenu from "../components/BottomMenu";

export default function SettingsScreen() {
  const { isDark: esOscuro, setIsDark } = useThemeSettings();
  const { language, changeLanguage, t, availableLanguages } = useLanguage();

  const fondo = esOscuro ? "#020617" : "#E5E7EB";
  const tarjeta = esOscuro ? "#020617" : "#FFFFFF";
  const borde = esOscuro ? "#710c6cff" : "#E5E7EB";
  const textoPrincipal = esOscuro ? "#F9FAFB" : "#111827";
  const textoSecundario = esOscuro ? "#9CA3AF" : "#4B5563";
  const morado = "#A855F7";

  return (
    <SafeAreaView
      style={[estilos.contenedor, { backgroundColor: fondo }]}
      edges={["top"]}
    >
      {/* Contenido con padding lateral */}
      <View style={estilos.contenido}>
        {/* ENCABEZADO GENERAL */}
        <View style={estilos.header}>
          <Text style={[estilos.headerTitulo, { color: textoPrincipal }]}>
            {t("settings_title")}
          </Text>
          <Text style={[estilos.headerSubtitulo, { color: textoSecundario }]}>
            {t("settings_subtitle")}
          </Text>
        </View>

        {/* TARJETA PRINCIPAL */}
        <View
          style={[
            estilos.tarjeta,
            {
              backgroundColor: tarjeta,
              borderColor: borde,
              shadowColor: "#000000ff",
            },
          ]}
        >
          {/* SECCIÓN APARIENCIA */}
          <View style={estilos.seccionEncabezado}>
            <View style={estilos.iconoFondo}>
              <Ionicons
                name={esOscuro ? "moon" : "sunny"}
                size={18}
                color={morado}
              />
            </View>
            <Text style={[estilos.seccionTitulo, { color: textoPrincipal }]}>
              {t("settings_Apariencia")}
            </Text>
          </View>

          <View style={estilos.fila}>
            <View style={{ flex: 1 }}>
              <Text style={[estilos.label, { color: textoPrincipal }]}>
                {t("settings_dark_mode_label")}
              </Text>
              <Text
                style={[estilos.descripcion, { color: textoSecundario }]}
              >
                {t("settings_dark_mode_desc")}
              </Text>
            </View>

            <Switch
              value={esOscuro}
              onValueChange={setIsDark}
              trackColor={{ false: "#D1D5DB", true: "#4C1D95" }}
              thumbColor={esOscuro ? "#F9FAFB" : "#FFFFFF"}
            />
          </View>

          <View style={estilos.divisor} />

          {/* SECCIÓN IDIOMA */}
          <View style={estilos.seccionEncabezado}>
            <View style={estilos.iconoFondo}>
              <Ionicons name="globe-outline" size={18} color={morado} />
            </View>
            <Text style={[estilos.seccionTitulo, { color: textoPrincipal }]}>
              {t("settings_language_label")}
            </Text>
          </View>

          <Text
            style={[
              estilos.descripcion,
              { color: textoSecundario, marginBottom: 10 },
            ]}
          >
            {t("settings_language_help")}
          </Text>

          <View style={estilos.contenedorIdiomas}>
            {availableLanguages.map((lang) => {
              const activo = language === lang.code;
              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    estilos.chipIdioma,
                    activo && {
                      borderColor: morado,
                      backgroundColor: esOscuro ? "#111827" : "#F5F3FF",
                    },
                  ]}
                  onPress={() => changeLanguage(lang.code)}
                >
                  <Text
                    style={{
                      color: activo ? morado : textoSecundario,
                      fontWeight: activo ? "700" : "500",
                      fontSize: 13,
                    }}
                  >
                    {lang.label}
                  </Text>
                  {activo && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={morado}
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Menú inferior a todo lo ancho */}
      <BottomMenu active="settings" />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
  contenido: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  /* HEADER */
  header: {
    marginBottom: 10,
    marginTop: 4,
  },
  headerTitulo: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  headerSubtitulo: {
    marginTop: 4,
    fontSize: 13,
  },

  /* TARJETA */
  tarjeta: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    
  },

  /* SECCIONES DENTRO DE LA TARJETA */
  seccionEncabezado: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 4,
  },
  iconoFondo: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "rgba(168, 85, 247, 0.14)",
  },
  seccionTitulo: {
    fontSize: 15,
    fontWeight: "700",
  },

  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
  },
  descripcion: {
    fontSize: 12,
    marginTop: 2,
  },
  divisor: {
    height: 1,
    backgroundColor: "rgba(8, 5, 5, 0.45)",
    marginVertical: 10,
  },

  /* IDIOMAS */
  contenedorIdiomas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  chipIdioma: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
});
