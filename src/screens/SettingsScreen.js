
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { useThemeSettings } from "../context/ThemeContext";

export default function SettingsScreen() {
  const { isDark, setIsDark, language, setLanguage } = useThemeSettings();

  return (
    <SafeAreaView
      style={[
        styles.container,
        isDark && { backgroundColor: "#020617" }, // fondo oscuro
      ]}
    >
      <Text
        style={[
          styles.title,
          isDark && { color: "#F9FAFB" },
        ]}
      >
        Configuración
      </Text>

      {/* Modo oscuro */}
      <View style={styles.row}>
        <Text
          style={[
            styles.label,
            isDark && { color: "#E5E7EB" },
          ]}
        >
          Modo oscuro
        </Text>
        <Switch value={isDark} onValueChange={setIsDark} />
      </View>

      {/* Idioma */}
      <View style={styles.row}>
        <Text
          style={[
            styles.label,
            isDark && { color: "#E5E7EB" },
          ]}
        >
          Idioma
        </Text>
        <View style={styles.languageButtons}>
          <TouchableOpacity
            style={[
              styles.langButton,
              language === "es" && styles.langButtonActive,
            ]}
            onPress={() => setLanguage("es")}
          >
            <Text
              style={[
                styles.langButtonText,
                language === "es" && styles.langButtonTextActive,
              ]}
            >
              ES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.langButton,
              language === "en" && styles.langButtonActive,
            ]}
            onPress={() => setLanguage("en")}
          >
            <Text
              style={[
                styles.langButtonText,
                language === "en" && styles.langButtonTextActive,
              ]}
            >
              EN
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text
        style={[
          styles.info,
          isDark && { color: "#9CA3AF" },
        ]}
      >
        (Por ahora estos cambios son de demostración. Después se pueden conectar
        a un tema global y traducciones de toda la app.)
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#111827",
  },
  languageButtons: {
    flexDirection: "row",
    gap: 8,
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
  },
  langButtonActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  langButtonText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  langButtonTextActive: {
    color: "#FFFFFF",
  },
  info: {
    marginTop: 24,
    fontSize: 13,
    color: "#4B5563",
  },
});
