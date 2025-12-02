import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";

// 1. DEFINIMOS LA PALETA DE COLORES Y MEDIDAS
// El fondo debe ser igual para todos los elementos para que funcione el efecto
const COLORS = {
  background: "#E0E5EC", // Gris azulado (base del neomorfismo)
  lightShadow: "#FFFFFF", // Luz
  darkShadow: "#A3B1C6", // Sombra
  text: "#444444",
  placeholder: "#C1C9D6",
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40; // Ancho de pantalla menos márgenes (20 de cada lado)
const CARD_HEIGHT = 300;

// 2. COMPONENTE REUTILIZABLE: TARJETA NEUMÓRFICA
// Este componente contiene la lógica del "truco" para iOS y Android
const TarjetaNeumorfica = ({ children, width, height }) => {
  // Opción A: Android (Usamos elevación y bordes trucados)
  if (Platform.OS === "android") {
    return (
      <View style={[styles.androidContainer, { width, height }]}>
        <View style={styles.innerContent}>{children}</View>
      </View>
    );
  }

  // Opción B: iOS (Usamos 3 capas con sombras reales)
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

// 3. APP PRINCIPAL (Tu estructura original)
export default function App() {
  const dataEventos = [
    { id: "1", titulo: "Concierto de Rock" },
    { id: "2", titulo: "Festival de Jazz" },
    { id: "3", titulo: "Teatro en la Calle" },
  ];

  const renderItem = ({ item }) => (
    // AQUÍ USAMOS NUESTRA NUEVA TARJETA EN LUGAR DE UN VIEW SIMPLE
    <View style={{ marginBottom:25, alignItems: "center" }}>
      <TarjetaNeumorfica width={CARD_WIDTH} height={CARD_HEIGHT}>
        {/* Contenido interno de la tarjeta */}
        <View style={styles.imagePlaceholder} />

        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{item.titulo}</Text>
        </View>
      </TarjetaNeumorfica>
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
        />

        <FlatList
          data={dataEventos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

// 4. ESTILOS FUSIONADOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // CAMBIO IMPORTANTE: Fondo gris azulado
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
    borderColor: "#BDC7D4", // Un borde que combine con el tema
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 0,
    color: COLORS.text,
  },

  // --- Estilos del Contenido Interno de la Tarjeta ---
  innerContent: {
    flex: 1,
    borderRadius: 20,
    padding: 15,
    overflow: "hidden", // Para que lo de adentro no se salga de las esquinas
    backgroundColor: COLORS.background,
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    backgroundColor: COLORS.placeholder,
    height: "65%",
    borderRadius: 15,
    width: "100%",
  },
  cardTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 20,
  },

  // --- LÓGICA NEUMORPH IOS ---
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

  // --- LÓGICA NEUMORPH ANDROID ---
  androidContainer: {
    backgroundColor: COLORS.background,
    elevation: 8,
    borderRadius: 20,
    // Bordes para simular luz y sombra
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
