// src/screens/HomeScreen.js
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { getEvents } from "../api/events";
import { useThemeSettings } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import BottomMenu from "../components/BottomMenu";

const { width } = Dimensions.get("window");
const ANCHO_TARJETA = width - 32; // margen horizontal de 16 a cada lado
const LIMITE_POR_PAGINA = 20;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isDark: esOscuro, setIsDark: setEsOscuro } = useThemeSettings();
  const { t } = useLanguage();

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [eventos, setEventos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalEventos, setTotalEventos] = useState(null);

  const [cargando, setCargando] = useState(false); // carga inicial / reset
  const [cargandoMas, setCargandoMas] = useState(false); // scroll infinito
  const [error, setError] = useState("");

  // Paleta de colores (claro / oscuro)
  const COLORES = {
    fondo: esOscuro ? "#020617" : "#F5F3FF",
    textoPrincipal: esOscuro ? "#F9FAFB" : "#1F2933",
    textoSecundario: esOscuro ? "#E5E7EB" : "#4B5563",
    morado: "#A855F7",
    moradoSuave: "#FFFFFFFF",
    bordeMorado: "#C4B5FD",
    fondoTarjeta: esOscuro ? "#020617" : "#FFFFFF",
    sombraTarjeta: "#000000",
  };

  // Función genérica para cargar eventos de una página
  const cargarEventos = async (paginaNueva, reset = false) => {
    try {
      if (reset) {
        setCargando(true);
        setError("");
      } else {
        setCargandoMas(true);
      }

      const resultado = await getEvents(paginaNueva, LIMITE_POR_PAGINA);
      const data = Array.isArray(resultado.data) ? resultado.data : [];

      // total que viene desde el backend (si existe)
      if (typeof resultado.total === "number") {
        setTotalEventos(resultado.total);
      }

      if (reset) {
        setEventos(data);
      } else {
        // concatenar sin duplicar por _id
        setEventos((prev) => {
          const idsPrev = new Set(prev.map((e) => e._id));
          const nuevos = data.filter((e) => !idsPrev.has(e._id));
          return [...prev, ...nuevos];
        });
      }

      setPagina(paginaNueva);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los eventos.");
    } finally {
      setCargando(false);
      setCargandoMas(false);
    }
  };

  // Cargar primera página desde la API
  useEffect(() => {
    cargarEventos(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtro por texto
  const eventosFiltrados = useMemo(() => {
    if (!textoBusqueda.trim()) return eventos;
    const q = textoBusqueda.toLowerCase();
    return eventos.filter((ev) =>
      (ev.name ?? "").toString().toLowerCase().includes(q)
    );
  }, [textoBusqueda, eventos]);

  // Tarjeta de cada evento
  const renderizarItem = ({ item }) => {
    let fechaFormateada = "Fecha no disponible";
    if (item.date) {
      try {
        fechaFormateada = new Date(item.date).toLocaleString("es-CL", {
          dateStyle: "short",
          timeStyle: "short",
        });
      } catch {
        fechaFormateada = item.date;
      }
    }

    const urlImagen =
      item.image ||
      "https://placehold.co/600x400/CCCCCC/777777?text=600+x+400";

    return (
      <View style={estilos.contenedorTarjeta}>
        <View
          style={[
            estilos.tarjeta,
            {
              backgroundColor: COLORES.fondoTarjeta,
              shadowColor: COLORES.sombraTarjeta,
              borderTopColor: COLORES.morado,
            },
            esOscuro && {
              borderColor: "#1F2937",
            },
          ]}
        >
          {/* Imagen del evento */}
          <Image
            source={{ uri: urlImagen }}
            resizeMode="cover"
            style={estilos.imagenTarjeta}
          />

          {/* Texto de la tarjeta */}
          <View style={estilos.cuerpoTarjeta}>
            <Text
              numberOfLines={1}
              style={[
                estilos.tituloTarjeta,
                { color: COLORES.textoPrincipal },
              ]}
            >
              {item.name}
            </Text>

            {!!item.category && (
              <Text style={[estilos.metaTarjeta, { color: COLORES.morado }]}>
                <Text style={estilos.metaEtiqueta}>Categoría: </Text>
                {item.category}
              </Text>
            )}

            {!!item.location && (
              <Text style={[estilos.metaTarjeta, { color: COLORES.morado }]}>
                <Text style={estilos.metaEtiqueta}>Lugar: </Text>
                {item.location}
              </Text>
            )}

            <Text style={[estilos.metaTarjeta, { color: COLORES.morado }]}>
              <Text style={estilos.metaEtiqueta}>Fecha: </Text>
              {fechaFormateada}
            </Text>

            {/* Botón para ver detalles del evento */}
            <TouchableOpacity
              style={estilos.botonDetalle}
              onPress={() =>
                navigation.navigate("EventDetail", {
                  eventId: item._id,
                })
              }
            >
              <Text style={estilos.textoBotonDetalle}>
                {t("home_view_details")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Scroll infinito: cargar más cuando llegamos al final
  const manejarFinScroll = () => {
    if (cargando || cargandoMas) return;
    if (textoBusqueda.trim()) return; // si está filtrando, no cargamos más

    // si tenemos total desde la API y ya alcanzamos la cantidad, no pedimos más
    if (totalEventos !== null && eventos.length >= totalEventos) return;

    const paginaSiguiente = pagina + 1;
    cargarEventos(paginaSiguiente, false);
  };

  // Footer mientras carga más
  const renderFooter = () => {
    if (!cargandoMas) return null;
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size="small" color={COLORES.morado} />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[estilos.contenedorPantalla, { backgroundColor: COLORES.fondo }]}
      edges={["top"]} // 👈 solo safe area arriba
    >
      {/* CONTENIDO PRINCIPAL */}
      <View style={{ flex: 1 }}>
        {/* ENCABEZADO */}
        <View style={estilos.encabezado}>
          {/* Fila superior: título + interruptor tema */}
          <View style={estilos.encabezadoFilaSuperior}>
            <Text
              style={[
                estilos.textoLogo,
                { color: COLORES.morado },
              ]}
            >
              TicketNow
            </Text>

            {/* Interruptor modo claro/oscuro */}
            <TouchableOpacity
              onPress={() => setEsOscuro(!esOscuro)}
              style={[
                estilos.interruptorTema,
                {
                  backgroundColor: esOscuro ? "#111827" : COLORES.moradoSuave,
                  borderColor: COLORES.bordeMorado,
                },
              ]}
            >
              <View
                style={[
                  estilos.perillaTema,
                  {
                    transform: [{ translateX: esOscuro ? 18 : 0 }],
                    backgroundColor: COLORES.morado,
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Botones: Eventos / Compras */}
          <View style={estilos.encabezadoFilaBotones}>
            <TouchableOpacity
              style={[
                estilos.botonSegmento,
                {
                  backgroundColor: COLORES.morado,
                  borderColor: COLORES.morado,
                },
              ]}
            >
              <Text style={estilos.textoBotonSegmentoActivo}>
                {t("home_events_button")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                estilos.botonSegmento,
                {
                  backgroundColor: "transparent",
                  borderColor: COLORES.bordeMorado,
                },
              ]}
              onPress={() => navigation.navigate("Purchases")}
            >
              <Text
                style={[
                  estilos.textoBotonSegmento,
                  { color: COLORES.morado },
                ]}
              >
                {t("home_purchases_button")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* BUSCADOR */}
        <View style={estilos.contenedorBuscador}>
          <TextInput
            style={[
              estilos.buscador,
              {
                backgroundColor: COLORES.moradoSuave,
                borderColor: COLORES.bordeMorado,
                color: COLORES.textoPrincipal,
              },
            ]}
            placeholder={t("home_search_placeholder")}
            placeholderTextColor="#000000AA"
            value={textoBusqueda}
            onChangeText={setTextoBusqueda}
          />
        </View>

        {/* CONTENIDO */}
        {cargando && eventos.length === 0 ? (
          <View style={{ marginTop: 40 }}>
            <ActivityIndicator size="large" color={COLORES.morado} />
          </View>
        ) : error && eventos.length === 0 ? (
          <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
            <Text style={{ color: "crimson" }}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={eventosFiltrados}
            renderItem={renderizarItem}
            keyExtractor={(item, index) =>
              item?._id ? String(item._id) : String(index)
            }
            contentContainerStyle={estilos.contenidoLista}
            showsVerticalScrollIndicator={false}
            onEndReached={manejarFinScroll}
            onEndReachedThreshold={0.4}
            ListFooterComponent={renderFooter}
          />
        )}
      </View>

      {/* MENÚ INFERIOR */}
      <BottomMenu active="home" />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedorPantalla: {
    flex: 1,
  },

  /* ENCABEZADO */
  encabezado: {
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  encabezadoFilaSuperior: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  textoLogo: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.5,
    
  },

 

  // Botones de segmento (Eventos / Compras)
  encabezadoFilaBotones: {
    flexDirection: "row",
    marginTop: 4,
    gap: 8,
  },
  botonSegmento: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  textoBotonSegmentoActivo: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  textoBotonSegmento: {
    fontSize: 14,
    fontWeight: "600",
  },

  /* BUSCADOR */
  contenedorBuscador: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
  },
  buscador: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    fontSize: 16,
  },

  /* LISTA Y TARJETAS */
  contenidoLista: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: Platform.OS === "android" ? 40 : 24,
  },
  contenedorTarjeta: {
    alignItems: "center",
    marginBottom: 16,
  },
  tarjeta: {
    width: ANCHO_TARJETA,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderTopWidth: 4,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  imagenTarjeta: {
    width: "100%",
    height: 140,
    backgroundColor: "#E5E7EB",
  },
  cuerpoTarjeta: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  tituloTarjeta: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  metaTarjeta: {
    fontSize: 13,
    marginBottom: 2,
  },
  metaEtiqueta: {
    fontWeight: "700",
  },

  // Botón "Ver detalles del evento"
  botonDetalle: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "#A855F7",
  },
  textoBotonDetalle: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
});
