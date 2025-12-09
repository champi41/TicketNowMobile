// src/screens/HomeScreen.js
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Paleta de colores similar a tu App actual
const COLORS = {
  background: "#E0E5EC",
  lightShadow: "#FFFFFF",
  darkShadow: "#A3B1C6",
  text: "#444444",
  placeholder: "#C1C9D6",
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = 260;

// Componente tarjeta neumórfica (mismo truco que tenías en App.js)
const NeumorphicCard = ({ children, width, height }) => {
  if (Platform.OS === "android") {
    return (
      <View style={[styles.androidContainer, { width, height }]}>
        <View style={styles.innerContent}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.iosContainer, { width, height }]}>
      <View style={[styles.iosShadowLight, { width, height }]} />
      <View style={[styles.iosShadowDark, { width, height }]} />
      <View
        style={[styles.innerContent, { backgroundColor: COLORS.background }]}
      >
        {children}
      </View>
    </View>
  );
};

// Datos de prueba (después los cambiaremos por la API real)
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Concierto de Rock",
    location: "Teatro Municipal",
    date: "2025-12-20",
  },
  {
    id: "2",
    title: "Festival de Jazz",
    location: "Parque Costanera",
    date: "2026-01-05",
  },
  {
    id: "3",
    title: "Teatro en la Calle",
    location: "Plaza Central",
    date: "2026-02-10",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");

  const eventosFiltrados = useMemo(() => {
    if (!query.trim()) return MOCK_EVENTS;
    const q = query.toLowerCase();
    return MOCK_EVENTS.filter((ev) => ev.title.toLowerCase().includes(q));
  }, [query]);

  const renderItem = ({ item }) => (
    <View style={{ marginBottom: 25, alignItems: "center" }}>
      <NeumorphicCard width={CARD_WIDTH} height={CARD_HEIGHT}>
        {/* “Imagen” de relleno */}
        <View style={styles.imagePlaceholder} />

        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>
            {item.location} • {item.date}
          </Text>

          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => navigation.navigate("EventDetail", { event: item })}
          >
            <Text style={styles.cardButtonText}>Ver detalle</Text>
          </TouchableOpacity>
        </View>
      </NeumorphicCard>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>TicketNow</Text>
        <Text style={styles.subtitle}>Eventos</Text>

        <TextInput
          style={styles.searchBar}
          placeholder="Buscar..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
        />

        <FlatList
          data={eventosFiltrados}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
    marginHorizontal: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 10,
    marginHorizontal: 20,
    opacity: 0.7,
  },
  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: "#BDC7D4",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 0,
    color: COLORS.text,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  innerContent: {
    flex: 1,
    borderRadius: 20,
    padding: 15,
    overflow: "hidden",
    backgroundColor: COLORS.background,
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    backgroundColor: COLORS.placeholder,
    height: "55%",
    borderRadius: 15,
    width: "100%",
    marginBottom: 10,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  cardButton: {
    marginTop: "auto",
    backgroundColor: "#2563EB", // azul tipo botón comprar
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  // iOS neumorfismo
  iosContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  iosShadowLight: {
    position: "absolute",
    top: -5,
    left: -5,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    shadowColor: COLORS.lightShadow,
    shadowOffset: { width: -6, height: -6 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  iosShadowDark: {
    position: "absolute",
    top: 5,
    left: 5,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    shadowColor: COLORS.darkShadow,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },

  // Android neumorfismo
  androidContainer: {
    backgroundColor: COLORS.background,
    elevation: 8,
    borderRadius: 20,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: "rgba(255,255,255, 0.5)",
    borderLeftColor: "rgba(255,255,255, 0.5)",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomColor: "rgba(163, 177, 198, 0.3)",
    borderRightColor: "rgba(163, 177, 198, 0.3)",
  },
});
