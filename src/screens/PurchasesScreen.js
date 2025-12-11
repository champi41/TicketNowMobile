// src/screens/PurchasesScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPurchase } from "../api/purchases";
import { useThemeSettings } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import BottomMenu from "../components/BottomMenu";

function formatoCLP(n) {
  const num = Number(n || 0);
  try {
    return "$" + num.toLocaleString("es-CL") + " CLP";
  } catch {
    return "$" + num.toString() + " CLP";
  }
}

export default function PurchasesScreen() {
  const { isDark: esOscuro } = useThemeSettings();
  const { language, t } = useLanguage();

  const [ids, setIds] = useState([]);
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fondo = esOscuro ? "#020617" : "#F5F3FF";
  const tarjeta = esOscuro ? "#0F172A" : "#FFFFFF";
  const borde = esOscuro ? "#1F2937" : "#ebe5e9ff";
  const textoPrincipal = esOscuro ? "#F9FAFB" : "#111827";
  const textoSecundario = esOscuro ? "#9CA3AF" : "#4B5563";
  const morado = "#A855F7";
  const moradoSuave = "#E9D5FF";

  const cantidadCompras = compras.length;

  // Badge de cantidad según idioma
  const badgeTexto =
    language === "es"
      ? `${cantidadCompras} compra${
          cantidadCompras !== 1 ? "s" : ""
        }`
      : `${cantidadCompras} purchase${
          cantidadCompras !== 1 ? "s" : ""
        }`;

  // Cargar IDs guardados
  useEffect(() => {
    const cargarIds = async () => {
      try {
        const saved = await AsyncStorage.getItem("purchase_ids");
        const arr = saved ? JSON.parse(saved) : [];
        setIds(Array.isArray(arr) ? arr : []);
      } catch (e) {
        console.error("Error leyendo purchase_ids", e);
        setIds([]);
      }
    };
    cargarIds();
  }, []);

  // Cargar detalles de compras
  useEffect(() => {
    if (!ids.length) {
      setCompras([]);
      setCargando(false);
      return;
    }

    let cancelado = false;

    const cargarCompras = async () => {
      try {
        setCargando(true);
        const resultados = await Promise.all(
          ids.map(async (id) => {
            try {
              const p = await getPurchase(id);
              return p;
            } catch (e) {
              console.error("Error cargando compra", id, e);
              return null;
            }
          })
        );
        if (!cancelado) {
          setCompras(resultados.filter(Boolean));
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    cargarCompras();
    return () => {
      cancelado = true;
    };
  }, [ids]);

  return (
    <SafeAreaView
      style={[estilos.contenedor, { backgroundColor: fondo }]}
      edges={["top"]}
    >
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={estilos.scrollContenido}>
          {/* ENCABEZADO LINDO */}
          <View style={estilos.header}>
            <Text
              style={[estilos.headerTitulo, { color: textoPrincipal }]}
            >
              {t("purchases_title")}
            </Text>

            <Text
              style={[estilos.headerSubtitulo, { color: textoSecundario }]}
            >
              {t("purchases_subtitle")}
            </Text>

            {cantidadCompras > 0 && (
              <View
                style={[
                  estilos.badgeCantidad,
                  { backgroundColor: moradoSuave },
                ]}
              >
                <Text
                  style={[
                    estilos.badgeTexto,
                    { color: morado },
                  ]}
                >
                  {badgeTexto}
                </Text>
              </View>
            )}
          </View>

          {/* ESTADOS: cargando / vacío */}
          {cargando && (
            <View style={estilos.centro}>
              <ActivityIndicator size="large" color={morado} />
              <Text
                style={[
                  estilos.textoSecundario,
                  { color: textoSecundario, marginTop: 6 },
                ]}
              >
                {t("purchases_loading")}
              </Text>
            </View>
          )}

          {!cargando && !ids.length && (
            <View style={estilos.centro}>
              <Text
                style={[
                  estilos.textoSecundario,
                  { color: textoSecundario, textAlign: "center" },
                ]}
              >
                {t("purchases_empty")}
              </Text>
            </View>
          )}

          {/* LISTA DE COMPRAS */}
          {!cargando &&
            compras.map((p) => {
              const id = p._id || p.id || "—";

              // Evento asociado (si viene en la compra)
              const nombreEvento =
                p.event?.name || p.event_name || "Evento sin nombre";

              let fechaCompra = "";
              if (p.created_at) {
                try {
                  fechaCompra = new Date(p.created_at).toLocaleString(
                    "es-CL",
                    {
                      dateStyle: "short",
                      timeStyle: "short",
                    }
                  );
                } catch {
                  fechaCompra = p.created_at;
                }
              }

              const estado = p.status || "CONFIRMED";
              let etiquetaEstado = estado;
              if (estado === "PENDING") etiquetaEstado = "Pendiente";
              if (estado === "CONFIRMED") etiquetaEstado = "Confirmada";

              const total =
                p.total_price ??
                (Array.isArray(p.items)
                  ? p.items.reduce(
                      (acc, it) => acc + Number(it.subtotal || 0),
                      0
                    )
                  : 0);

              return (
                <View
                  key={id}
                  style={[
                    estilos.tarjeta,
                    {
                      backgroundColor: tarjeta,
                      borderColor: borde,
                      shadowColor: "#000000",
                    },
                  ]}
                >
                  {/* Encabezado de la tarjeta */}
                  <Text
                    style={[
                      estilos.subtitulo,
                      { color: textoPrincipal },
                    ]}
                  >
                    {t("purchases_card_prefix")} #{p.nro_compra || id}
                  </Text>

                  {fechaCompra ? (
                    <Text
                      style={[
                        estilos.fechaCompra,
                        { color: textoSecundario },
                      ]}
                    >
                      {fechaCompra}
                    </Text>
                  ) : null}

                  <View style={estilos.separador} />

                  {/* Datos principales */}
                  <Text
                    style={[
                      estilos.textoSecundario,
                      { color: textoSecundario },
                    ]}
                  >
                    {t("purchases_event_label")}{" "}
                    <Text
                      style={{
                        fontWeight: "600",
                        color: textoPrincipal,
                      }}
                    >
                      {nombreEvento}
                    </Text>
                  </Text>

                  <Text
                    style={[
                      estilos.textoSecundario,
                      { color: textoSecundario, marginTop: 2 },
                    ]}
                  >
                    {t("purchases_status_label")}{" "}
                    <Text
                      style={{
                        fontWeight: "600",
                        color: textoPrincipal,
                      }}
                    >
                      {etiquetaEstado}
                    </Text>
                  </Text>

                  <Text
                    style={[
                      estilos.textoTotal,
                      { color: textoPrincipal },
                    ]}
                  >
                    {t("purchases_total_label")} {formatoCLP(total)}
                  </Text>
                </View>
              );
            })}
        </ScrollView>
      </View>

      {/* Menú inferior */}
      <BottomMenu active="home" />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1 },

  scrollContenido: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },

  /* ENCABEZADO */
  header: {
    marginBottom: 14,
  },
  headerTitulo: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  headerSubtitulo: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 18,
  },
  badgeCantidad: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: "600",
  },

  /* ESTADOS */
  centro: {
    marginTop: 24,
    alignItems: "center",
  },
  textoSecundario: {
    fontSize: 14,
  },

  /* TARJETAS */
  tarjeta: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: "700",
  },
  fechaCompra: {
    marginTop: 2,
    fontSize: 12,
  },
  separador: {
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.35)",
    marginVertical: 8,
  },
  textoTotal: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "700",
  },
});
